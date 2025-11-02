import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patient, appointment } = body;

    // Validate required fields
    if (!patient.firstName || !patient.lastName || !patient.email || !patient.phone || 
        !patient.dateOfBirth || !patient.gender) {
      return NextResponse.json(
        { error: 'Missing required patient information' },
        { status: 400 }
      );
    }

    if (!appointment.providerId || !appointment.appointmentDate || 
        !appointment.appointmentTime || !appointment.reason) {
      return NextResponse.json(
        { error: 'Missing required appointment information' },
        { status: 400 }
      );
    }

    // Check if patient already exists by email or phone
    let existingPatient = await prisma.patient.findFirst({
      where: {
        OR: [
          { email: patient.email },
          { phoneNumber: patient.phone }
        ]
      }
    });

    let patientId: string;

    if (existingPatient) {
      // Update existing patient info
      const updatedPatient = await prisma.patient.update({
        where: { id: existingPatient.id },
        data: {
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phoneNumber: patient.phone,
          dateOfBirth: new Date(patient.dateOfBirth),
          gender: patient.gender,
          address: patient.address || existingPatient.address,
          city: patient.city || existingPatient.city,
          state: patient.state || existingPatient.state,
          zipCode: patient.zipCode || existingPatient.zipCode
        }
      });
      patientId = updatedPatient.id;
    } else {
      // Generate MRN for new patient
      const mrn = `MRN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      // Create new patient
      const newPatient = await prisma.patient.create({
        data: {
          mrn,
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: new Date(patient.dateOfBirth),
          gender: patient.gender,
          phoneNumber: patient.phone,
          email: patient.email,
          address: patient.address || '',
          city: patient.city || '',
          state: patient.state || '',
          zipCode: patient.zipCode || '',
          isActive: true
        }
      });
      patientId = newPatient.id;
    }

    // Parse date and time
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);

    // Create appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        patientId,
        providerId: appointment.providerId,
        appointmentDate: new Date(appointment.appointmentDate),
        appointmentTime: appointment.appointmentTime,
        duration: 30, // Default 30 minutes
        type: appointment.type || 'IN_PERSON',
        status: 'SCHEDULED',
        reason: appointment.reason,
        notes: appointment.notes || '',
        isTelemedicine: appointment.type === 'TELEMEDICINE',
        reminderSent: false
      },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        provider: {
          select: {
            firstName: true,
            lastName: true,
            specialty: true
          }
        }
      }
    });

    // Generate confirmation number
    const confirmationNumber = `APT-${Date.now().toString().slice(-8)}`;

    // In a real application, you would send confirmation email here
    // await sendAppointmentConfirmationEmail(newAppointment, confirmationNumber);

    return NextResponse.json({
      success: true,
      confirmationNumber,
      appointmentId: newAppointment.id,
      message: 'Appointment booked successfully'
    });

  } catch (error) {
    console.error('Error creating public appointment:', error);
    return NextResponse.json(
      { error: 'Failed to book appointment. Please try again.' },
      { status: 500 }
    );
  }
}
