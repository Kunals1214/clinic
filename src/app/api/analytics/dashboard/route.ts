import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));

    // Get total patients
    const totalPatients = await prisma.patient.count({
      where: { isActive: true },
    });

    // Get new patients this month
    const newPatientsThisMonth = await prisma.patient.count({
      where: {
        isActive: true,
        createdAt: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    });

    // Get appointments today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsToday = await prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          notIn: ["CANCELLED", "NO_SHOW"],
        },
      },
    });

    // Get total appointments this month
    const appointmentsThisMonth = await prisma.appointment.count({
      where: {
        appointmentDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    });

    // Get revenue this month
    const revenueThisMonth = await prisma.billing.aggregate({
      where: {
        serviceDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Get revenue last month
    const revenueLastMonth = await prisma.billing.aggregate({
      where: {
        serviceDate: {
          gte: startOfLastMonth,
          lt: startOfCurrentMonth,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Get pending prescriptions
    const pendingPrescriptions = await prisma.prescription.count({
      where: {
        status: "PENDING",
      },
    });

    // Get pending lab results
    const pendingLabOrders = await prisma.labOrder.count({
      where: {
        status: {
          in: ["ORDERED", "COLLECTED", "PROCESSING"],
        },
      },
    });

    // Get appointment distribution by status
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ["status"],
      where: {
        appointmentDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
      _count: true,
    });

    // Get top diagnoses this month
    const topDiagnoses = await prisma.medicalRecord.groupBy({
      by: ["primaryDiagnosis"],
      where: {
        visitDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
        primaryDiagnosis: {
          not: null,
        },
      },
      _count: true,
      orderBy: {
        _count: {
          primaryDiagnosis: "desc",
        },
      },
      take: 10,
    });

    // Get recent patients
    const recentPatients = await prisma.patient.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        mrn: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        phoneNumber: true,
        createdAt: true,
      },
    });

    // Get upcoming appointments
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: today,
        },
        status: {
          notIn: ["CANCELLED", "NO_SHOW", "COMPLETED"],
        },
      },
      take: 10,
      orderBy: [
        { appointmentDate: "asc" },
        { appointmentTime: "asc" },
      ],
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
          },
        },
      },
    });

    return NextResponse.json({
      summary: {
        totalPatients,
        newPatientsThisMonth,
        appointmentsToday,
        appointmentsThisMonth,
        revenueThisMonth: revenueThisMonth._sum.totalAmount || 0,
        revenueLastMonth: revenueLastMonth._sum.totalAmount || 0,
        pendingPrescriptions,
        pendingLabOrders,
      },
      charts: {
        appointmentsByStatus,
        topDiagnoses,
      },
      recentActivity: {
        recentPatients,
        upcomingAppointments,
      },
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
