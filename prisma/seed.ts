import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/encryption";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create Super Admin
  const adminPassword = await hashPassword("Admin@12345678");
  const admin = await prisma.user.create({
    data: {
      email: "admin@mediflow.com",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
      isActive: true,
      mfaEnabled: false,
    },
  });
  console.log("✅ Created Super Admin user");

  // Create Doctor
  const doctorPassword = await hashPassword("Doctor@12345678");
  const doctorUser = await prisma.user.create({
    data: {
      email: "doctor@mediflow.com",
      passwordHash: doctorPassword,
      role: "DOCTOR",
      isActive: true,
      mfaEnabled: false,
    },
  });

  const doctor = await prisma.provider.create({
    data: {
      userId: doctorUser.id,
      firstName: "John",
      lastName: "Smith",
      npiNumber: "1234567890",
      deaNumber: "AS1234563",
      licenseNumber: "MD123456",
      licenseState: "CA",
      licenseExpiryDate: new Date("2026-12-31"),
      specialty: "INTERNAL_MEDICINE",
      subSpecialties: ["Cardiology"],
      qualifications: ["MD", "Board Certified Internal Medicine"],
      yearsOfExperience: 15,
      phoneNumber: "5551234567",
      bio: "Experienced internal medicine physician with cardiology specialization",
      acceptingNewPatients: true,
      consultationFee: 250.0,
    },
  });
  console.log("✅ Created Doctor (Dr. John Smith)");

  // Create Nurse
  const nursePassword = await hashPassword("Nurse@12345678");
  await prisma.user.create({
    data: {
      email: "nurse@mediflow.com",
      passwordHash: nursePassword,
      role: "NURSE",
      isActive: true,
      mfaEnabled: false,
    },
  });
  console.log("✅ Created Nurse user");

  // Create Receptionist
  const receptionistPassword = await hashPassword("Reception@12345678");
  await prisma.user.create({
    data: {
      email: "reception@mediflow.com",
      passwordHash: receptionistPassword,
      role: "RECEPTIONIST",
      isActive: true,
      mfaEnabled: false,
    },
  });
  console.log("✅ Created Receptionist user");

  // Create Sample Patients
  const patients = [];
  
  const patient1 = await prisma.patient.create({
    data: {
      mrn: "MRN-20250101-1001",
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: new Date("1985-03-15"),
      gender: "FEMALE",
      bloodGroup: "O_POSITIVE",
      maritalStatus: "MARRIED",
      email: "jane.doe@example.com",
      phoneNumber: "5559876543",
      address: "123 Main Street",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
      emergencyContactName: "John Doe",
      emergencyContactPhone: "5559876544",
      emergencyContactRelation: "Spouse",
      insuranceProvider: "Blue Cross Blue Shield",
      insurancePolicyNumber: "BCBS123456789",
      preferredLanguage: "English",
      tags: ["Regular Patient"],
    },
  });
  patients.push(patient1);
  console.log("✅ Created Patient: Jane Doe");

  const patient2 = await prisma.patient.create({
    data: {
      mrn: "MRN-20250101-1002",
      firstName: "Robert",
      lastName: "Johnson",
      dateOfBirth: new Date("1972-07-22"),
      gender: "MALE",
      bloodGroup: "A_POSITIVE",
      maritalStatus: "SINGLE",
      email: "robert.j@example.com",
      phoneNumber: "5551112222",
      address: "456 Oak Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA",
      emergencyContactName: "Mary Johnson",
      emergencyContactPhone: "5551112223",
      emergencyContactRelation: "Sister",
      insuranceProvider: "Aetna",
      insurancePolicyNumber: "AET987654321",
      preferredLanguage: "English",
      tags: ["Diabetic", "High Risk"],
    },
  });
  patients.push(patient2);
  console.log("✅ Created Patient: Robert Johnson");

  // Create Sample Appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      providerId: doctor.id,
      appointmentDate: tomorrow,
      appointmentTime: "09:00 AM",
      duration: 30,
      type: "CONSULTATION",
      status: "SCHEDULED",
      reason: "Annual checkup",
      notes: "Patient requested morning appointment",
    },
  });
  console.log("✅ Created Appointment for Jane Doe");

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      providerId: doctor.id,
      appointmentDate: nextWeek,
      appointmentTime: "02:00 PM",
      duration: 45,
      type: "FOLLOW_UP",
      status: "SCHEDULED",
      reason: "Diabetes management follow-up",
      notes: "Check blood sugar levels",
    },
  });
  console.log("✅ Created Appointment for Robert Johnson");

  // Create Sample Vital Signs
  await prisma.vitalSign.create({
    data: {
      patientId: patient1.id,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 72,
      temperature: 98.6,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      weight: 145,
      height: 65,
      bmi: 24.1,
      painLevel: 0,
      recordedBy: "nurse@mediflow.com",
    },
  });
  console.log("✅ Created Vital Signs for Jane Doe");

  // Create Sample Allergies
  await prisma.allergy.create({
    data: {
      patientId: patient1.id,
      allergen: "Penicillin",
      allergyType: "Drug",
      reaction: "Hives and difficulty breathing",
      severity: "Severe",
      onsetDate: new Date("2010-05-10"),
    },
  });
  console.log("✅ Created Allergy for Jane Doe");

  await prisma.allergy.create({
    data: {
      patientId: patient2.id,
      allergen: "Peanuts",
      allergyType: "Food",
      reaction: "Anaphylaxis",
      severity: "Severe",
      onsetDate: new Date("1995-08-15"),
    },
  });
  console.log("✅ Created Allergy for Robert Johnson");

  // Create Sample Medications
  await prisma.medication.create({
    data: {
      patientId: patient2.id,
      medicationName: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      route: "Oral",
      startDate: new Date("2023-01-01"),
      isActive: true,
      prescribedBy: doctor.id,
      notes: "Take with meals",
    },
  });
  console.log("✅ Created Medication for Robert Johnson");

  // Create System Config
  await prisma.systemConfig.createMany({
    data: [
      {
        key: "clinic_name",
        value: "MediFlow Clinic",
        description: "Name of the clinic",
      },
      {
        key: "clinic_address",
        value: "123 Healthcare Blvd, Medical City, CA 90001",
        description: "Clinic address",
      },
      {
        key: "clinic_phone",
        value: "555-MEDIFLOW",
        description: "Main clinic phone number",
      },
      {
        key: "appointment_duration_default",
        value: "30",
        description: "Default appointment duration in minutes",
      },
      {
        key: "enable_telemedicine",
        value: "true",
        description: "Enable telemedicine features",
      },
    ],
  });
  console.log("✅ Created System Configuration");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📋 Default Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Super Admin:");
  console.log("  Email: admin@mediflow.com");
  console.log("  Password: Admin@12345678");
  console.log("\nDoctor:");
  console.log("  Email: doctor@mediflow.com");
  console.log("  Password: Doctor@12345678");
  console.log("\nNurse:");
  console.log("  Email: nurse@mediflow.com");
  console.log("  Password: Nurse@12345678");
  console.log("\nReceptionist:");
  console.log("  Email: reception@mediflow.com");
  console.log("  Password: Reception@12345678");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n⚠️  IMPORTANT: Change these passwords in production!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
