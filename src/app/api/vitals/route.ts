import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest, hasRole } from "@/lib/auth";
import { vitalSignSchema } from "@/lib/validations";
import { calculateBMI } from "@/lib/utils";

// POST /api/vitals - Record vital signs
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "DOCTOR", "NURSE"];
    if (!hasRole(user.role, allowedRoles)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Validate input
    const validation = vitalSignSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Calculate BMI if weight and height provided
    let bmi: number | undefined;
    if (data.weight && data.height) {
      bmi = calculateBMI(data.weight, data.height);
    }

    // Create vital sign record
    const vitalSign = await prisma.vitalSign.create({
      data: {
        patientId: data.patientId,
        bloodPressureSystolic: data.bloodPressureSystolic,
        bloodPressureDiastolic: data.bloodPressureDiastolic,
        heartRate: data.heartRate,
        temperature: data.temperature,
        respiratoryRate: data.respiratoryRate,
        oxygenSaturation: data.oxygenSaturation,
        weight: data.weight,
        height: data.height,
        bmi: bmi,
        painLevel: data.painLevel,
        notes: data.notes,
        recordedBy: data.recordedBy || user.email,
      },
    });

    return NextResponse.json(
      { message: "Vital signs recorded successfully", vitalSign },
      { status: 201 }
    );
  } catch (error) {
    console.error("Record vitals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/vitals - Get vital signs for a patient
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json(
        { error: "Patient ID is required" },
        { status: 400 }
      );
    }

    const vitalSigns = await prisma.vitalSign.findMany({
      where: { patientId },
      orderBy: { recordedAt: "desc" },
      take: 50, // Last 50 readings
    });

    return NextResponse.json({ vitalSigns });
  } catch (error) {
    console.error("Get vitals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
