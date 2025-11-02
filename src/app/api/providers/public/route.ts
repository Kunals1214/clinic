import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Fetch all active providers (no authentication required for public access)
    const providers = await prisma.provider.findMany({
      where: {
        isActive: true
      },
      include: {
        user: {
          select: {
            role: true
          }
        }
      },
      orderBy: {
        specialty: 'asc'
      }
    });

    const providersData = providers.map(provider => ({
      id: provider.id,
      firstName: provider.firstName,
      lastName: provider.lastName,
      specialty: provider.specialty,
      npiNumber: provider.npiNumber,
      phoneNumber: provider.phoneNumber
    }));

    return NextResponse.json(providersData);
  } catch (error) {
    console.error('Error fetching public providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
