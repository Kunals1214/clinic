import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest, hasRole } from "@/lib/auth";
import { decrypt } from "@/lib/encryption";
import { logPatientAccess } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permissions
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"];
    if (!hasRole(user.role, allowedRoles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const patientId = params.id;

    // Get patient with related data
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        appointments: {
          take: 10,
          orderBy: { appointmentDate: "desc" },
          include: {
            provider: {
              select: {
                firstName: true,
                lastName: true,
                specialty: true,
              },
            },
          },
        },
        medicalRecords: {
          take: 10,
          orderBy: { visitDate: "desc" },
          include: {
            provider: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        allergies: {
          where: { isActive: true },
        },
        medications: {
          where: { isActive: true },
        },
        vitalSigns: {
          take: 10,
          orderBy: { recordedAt: "desc" },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Decrypt SSN if present
    if (patient.ssn) {
      try {
        patient.ssn = decrypt(patient.ssn);
      } catch (error) {
        console.error("SSN decryption error:", error);
        patient.ssn = "***ENCRYPTED***";
      }
    }

    // Log patient access
    await logPatientAccess(
      user.userId,
      patientId,
      "VIEW_PATIENT",
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
      `Viewed patient record: ${patient.firstName} ${patient.lastName}`
    );

    return NextResponse.json({ patient });
  } catch (error) {
    console.error("Get patient error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permissions
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"];
    if (!hasRole(user.role, allowedRoles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const patientId = params.id;
    const body = await request.json();

    // Update patient
    const patient = await prisma.patient.update({
      where: { id: patientId },
      data: body,
    });

    // Log patient update
    await logPatientAccess(
      user.userId,
      patientId,
      "EDIT_PATIENT",
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
      `Updated patient record: ${patient.firstName} ${patient.lastName}`
    );

    return NextResponse.json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
