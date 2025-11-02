import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Middleware for audit logging
prisma.$use(async (params, next) => {
  const result = await next(params);

  // Log all operations on PHI tables
  const phiTables = [
    "Patient",
    "MedicalRecord",
    "VitalSign",
    "Allergy",
    "Medication",
    "LabOrder",
    "LabResult",
    "Prescription",
    "Document",
  ];

  if (
    phiTables.includes(params.model || "") &&
    ["create", "update", "delete"].includes(params.action)
  ) {
    // Audit log will be created via API middleware
    console.log(`[AUDIT] ${params.action} on ${params.model}`);
  }

  return result;
});

export default prisma;
