import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest, hasRole } from "@/lib/auth";
import { appointmentSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

// GET /api/appointments - List appointments
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const providerId = searchParams.get("providerId");
    const patientId = searchParams.get("patientId");
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    const where: any = {};

    if (providerId) where.providerId = providerId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.appointmentDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            mrn: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            dateOfBirth: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
      },
      orderBy: [
        { appointmentDate: "asc" },
        { appointmentTime: "asc" },
      ],
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create appointment
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"];
    if (!hasRole(user.role, allowedRoles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Validate input
    const validation = appointmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check for scheduling conflicts
    const conflict = await prisma.appointment.findFirst({
      where: {
        providerId: data.providerId,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        status: {
          notIn: ["CANCELLED", "NO_SHOW"],
        },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Time slot already booked" },
        { status: 409 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        providerId: data.providerId,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        duration: data.duration,
        type: data.type,
        reason: data.reason,
        notes: data.notes,
        isTelemedicine: data.isTelemedicine,
        status: "SCHEDULED",
      },
      include: {
        patient: true,
        provider: true,
      },
    });

    // Log appointment creation
    await createAuditLog({
      userId: user.userId,
      action: "CREATE_PATIENT", // Using CREATE_PATIENT as proxy for CREATE_APPOINTMENT
      entityType: "Appointment",
      entityId: appointment.id,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      description: `Appointment created for ${appointment.patient.firstName} ${appointment.patient.lastName}`,
      metadata: { appointmentDate: appointment.appointmentDate },
    });

    return NextResponse.json(
      { message: "Appointment created successfully", appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create appointment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
