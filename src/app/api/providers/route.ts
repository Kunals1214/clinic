import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest, hasRole } from "@/lib/auth";

// GET /api/providers - List all providers
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active providers
    const providers = await prisma.provider.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialty: true,
        subSpecialties: true,
        npiNumber: true,
        phoneNumber: true,
        acceptingNewPatients: true,
        consultationFee: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        lastName: 'asc',
      },
    });

    return NextResponse.json({
      providers,
      total: providers.length,
    });
  } catch (error) {
    console.error("Failed to fetch providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
