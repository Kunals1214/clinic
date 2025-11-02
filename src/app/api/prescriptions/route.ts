import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest, hasRole } from "@/lib/auth";
import { prescriptionSchema } from "@/lib/validations";

// POST /api/prescriptions - Create prescription
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["SUPER_ADMIN", "DOCTOR"];
    if (!hasRole(user.role, allowedRoles)) {
      return NextResponse.json(
        { error: "Only doctors can prescribe medications" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = prescriptionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Generate RX number
    const rxNumber = `RX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calculate expiry date (1 year from now)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        patientId: data.patientId,
        providerId: data.providerId,
        rxNumber,
        medicationName: data.medicationName,
        genericName: data.genericName,
        strength: data.strength,
        dosageForm: data.dosageForm,
        quantity: data.quantity,
        refills: data.refills,
        daysSupply: data.daysSupply,
        sig: data.sig,
        route: data.route,
        frequency: data.frequency,
        pharmacyName: data.pharmacyName,
        pharmacyPhone: data.pharmacyPhone,
        isControlled: data.isControlled,
        deaSchedule: data.deaSchedule,
        notes: data.notes,
        expiryDate,
        status: "PENDING",
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
        provider: {
          select: {
            firstName: true,
            lastName: true,
            npiNumber: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Prescription created successfully", prescription },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create prescription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/prescriptions - Get prescriptions
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get("patientId");
    const status = searchParams.get("status");

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            mrn: true,
          },
        },
        provider: {
          select: {
            firstName: true,
            lastName: true,
            specialty: true,
          },
        },
      },
      orderBy: { prescribedDate: "desc" },
    });

    return NextResponse.json({ prescriptions });
  } catch (error) {
    console.error("Get prescriptions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
