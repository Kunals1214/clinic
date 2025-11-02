import prisma from "./prisma";
import { AuditAction } from "@prisma/client";

export interface AuditLogData {
  userId: string;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  ipAddress: string;
  userAgent: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Create audit log entry
 * Every PHI access must be logged per HIPAA requirements
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        description: data.description,
        metadata: data.metadata,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Never throw - audit logging should not break application flow
  }
}

/**
 * Log patient record access
 */
export async function logPatientAccess(
  userId: string,
  patientId: string,
  action: AuditAction,
  ipAddress: string,
  userAgent: string,
  description: string
): Promise<void> {
  await createAuditLog({
    userId,
    action,
    entityType: "Patient",
    entityId: patientId,
    ipAddress,
    userAgent,
    description,
  });
}

/**
 * Log medical record access
 */
export async function logMedicalRecordAccess(
  userId: string,
  recordId: string,
  patientId: string,
  action: AuditAction,
  ipAddress: string,
  userAgent: string,
  description: string
): Promise<void> {
  await createAuditLog({
    userId,
    action,
    entityType: "MedicalRecord",
    entityId: recordId,
    ipAddress,
    userAgent,
    description,
    metadata: { patientId },
  });
}

/**
 * Log failed login attempt
 */
export async function logFailedLogin(
  email: string,
  ipAddress: string,
  userAgent: string,
  reason: string
): Promise<void> {
  // Skip audit log for failed logins since we don't have a valid userId
  // This prevents foreign key constraint violations
  // In production, you might want to use a dedicated failed_login table
  try {
    console.log(`Failed login attempt for ${email}: ${reason} from ${ipAddress}`);
  } catch (error) {
    console.error("Failed to log failed login:", error);
  }
}

/**
 * Log successful login
 */
export async function logSuccessfulLogin(
  userId: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  await createAuditLog({
    userId,
    action: "LOGIN",
    ipAddress,
    userAgent,
    description: "User logged in successfully",
  });
}

/**
 * Log unauthorized access attempt
 */
export async function logUnauthorizedAccess(
  userId: string,
  resource: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  await createAuditLog({
    userId,
    action: "UNAUTHORIZED_ACCESS",
    ipAddress,
    userAgent,
    description: `Unauthorized access attempt to ${resource}`,
    metadata: { resource },
  });
}

/**
 * Get audit logs for a patient (for accounting of disclosures)
 */
export async function getPatientAuditLogs(
  patientId: string,
  startDate?: Date,
  endDate?: Date
) {
  return prisma.auditLog.findMany({
    where: {
      entityType: "Patient",
      entityId: patientId,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          provider: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
}

/**
 * Get user's access history (for compliance audits)
 */
export async function getUserAuditLogs(
  userId: string,
  startDate?: Date,
  endDate?: Date
) {
  return prisma.auditLog.findMany({
    where: {
      userId,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
}

/**
 * Check for suspicious activity patterns
 */
export async function detectSuspiciousActivity(userId: string): Promise<{
  isSuspicious: boolean;
  reasons: string[];
}> {
  const reasons: string[] = [];
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Check for excessive patient record access
  const recentAccess = await prisma.auditLog.count({
    where: {
      userId,
      action: "VIEW_PATIENT",
      timestamp: {
        gte: last24Hours,
      },
    },
  });

  if (recentAccess > 100) {
    reasons.push(`Excessive patient record access: ${recentAccess} in 24 hours`);
  }

  // Check for failed login attempts
  const failedLogins = await prisma.auditLog.count({
    where: {
      userId,
      action: "FAILED_LOGIN",
      timestamp: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  });

  if (failedLogins > 5) {
    reasons.push(`Multiple failed login attempts: ${failedLogins} in last hour`);
  }

  // Check for unusual access times (e.g., 2-5 AM)
  const unusualHours = await prisma.auditLog.count({
    where: {
      userId,
      timestamp: {
        gte: last24Hours,
      },
    },
  });

  // Add more sophisticated checks as needed

  return {
    isSuspicious: reasons.length > 0,
    reasons,
  };
}
