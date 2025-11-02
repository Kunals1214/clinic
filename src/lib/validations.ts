import { z } from "zod";

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  mfaToken: z.string().optional(),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number")
    .regex(/[^A-Za-z0-9]/, "Password must contain special character"),
  confirmPassword: z.string(),
  role: z.enum(["DOCTOR", "NURSE", "RECEPTIONIST", "LAB_TECHNICIAN", "PHARMACIST", "BILLING_STAFF"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Patient Schemas
export const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
  bloodGroup: z.enum([
    "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE",
    "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"
  ]).optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional(),
  
  // Contact
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhoneNumber: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  country: z.string().default("USA"),
  
  // Emergency Contact
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelation: z.string().min(1, "Relation is required"),
  
  // Insurance
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceGroupNumber: z.string().optional(),
  
  // Additional
  preferredLanguage: z.string().default("English"),
  ethnicity: z.string().optional(),
  occupation: z.string().optional(),
  ssn: z.string().optional(),
});

// Appointment Schemas
export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  providerId: z.string().min(1, "Provider is required"),
  appointmentDate: z.date({
    required_error: "Appointment date is required",
  }),
  appointmentTime: z.string().min(1, "Time is required"),
  duration: z.number().min(15, "Minimum 15 minutes").max(240, "Maximum 4 hours"),
  type: z.enum([
    "CONSULTATION", "FOLLOW_UP", "PROCEDURE", "TELEMEDICINE",
    "EMERGENCY", "VACCINATION", "CHECKUP", "LAB_TEST", "IMAGING"
  ]),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
  isTelemedicine: z.boolean().default(false),
});

// Medical Record Schemas
export const medicalRecordSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  providerId: z.string().min(1, "Provider ID is required"),
  appointmentId: z.string().optional(),
  visitDate: z.date({
    required_error: "Visit date is required",
  }),
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  clinicalNotes: z.string().optional(),
  primaryDiagnosis: z.string().optional(),
  secondaryDiagnoses: z.array(z.string()).optional(),
  icdCodes: z.array(z.string()).optional(),
  followUpDate: z.date().optional(),
  followUpNotes: z.string().optional(),
});

// Vital Signs Schema
export const vitalSignSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  bloodPressureSystolic: z.number().min(50).max(300).optional(),
  bloodPressureDiastolic: z.number().min(30).max(200).optional(),
  heartRate: z.number().min(30).max(250).optional(),
  temperature: z.number().min(90).max(115).optional(), // Fahrenheit
  respiratoryRate: z.number().min(8).max(60).optional(),
  oxygenSaturation: z.number().min(70).max(100).optional(),
  weight: z.number().min(1).max(1000).optional(), // pounds
  height: z.number().min(12).max(96).optional(), // inches
  painLevel: z.number().min(0).max(10).optional(),
  notes: z.string().optional(),
  recordedBy: z.string().optional(),
});

// Prescription Schema
export const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  providerId: z.string().min(1, "Provider ID is required"),
  medicationName: z.string().min(1, "Medication name is required"),
  genericName: z.string().optional(),
  strength: z.string().min(1, "Strength is required"),
  dosageForm: z.string().min(1, "Dosage form is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  refills: z.number().min(0).max(11),
  daysSupply: z.number().min(1),
  sig: z.string().min(1, "Instructions are required"),
  route: z.string().min(1, "Route is required"),
  frequency: z.string().min(1, "Frequency is required"),
  pharmacyName: z.string().optional(),
  pharmacyPhone: z.string().optional(),
  isControlled: z.boolean().default(false),
  deaSchedule: z.string().optional(),
  notes: z.string().optional(),
});

// Lab Order Schema
export const labOrderSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  providerId: z.string().min(1, "Provider ID is required"),
  testCodes: z.array(z.string()).min(1, "At least one test is required"),
  testNames: z.array(z.string()).min(1, "Test names are required"),
  priority: z.enum(["Routine", "Urgent", "STAT"]).default("Routine"),
  specimenType: z.string().optional(),
  notes: z.string().optional(),
});

// Billing Schema
export const billingSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  serviceDate: z.date({
    required_error: "Service date is required",
  }),
  cptCodes: z.array(z.string()).min(1, "At least one CPT code is required"),
  cptDescriptions: z.array(z.string()),
  icd10Codes: z.array(z.string()).optional(),
  subtotal: z.number().min(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  totalAmount: z.number().min(0),
  notes: z.string().optional(),
  dueDate: z.date().optional(),
});

// Provider Schema
export const providerSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  npiNumber: z.string().min(10, "NPI must be 10 digits"),
  deaNumber: z.string().optional(),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseState: z.string().min(2, "License state is required"),
  licenseExpiryDate: z.date({
    required_error: "License expiry date is required",
  }),
  specialty: z.enum([
    "GENERAL_PRACTICE", "INTERNAL_MEDICINE", "PEDIATRICS", "CARDIOLOGY",
    "DERMATOLOGY", "ORTHOPEDICS", "PSYCHIATRY", "NEUROLOGY", "ONCOLOGY",
    "RADIOLOGY", "PATHOLOGY", "EMERGENCY_MEDICINE", "SURGERY",
    "OBSTETRICS_GYNECOLOGY", "OPHTHALMOLOGY", "ENT", "ANESTHESIOLOGY",
    "PHYSICAL_THERAPY"
  ]),
  yearsOfExperience: z.number().min(0),
  phoneNumber: z.string().min(10),
  consultationFee: z.number().min(0),
  bio: z.string().optional(),
  acceptingNewPatients: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PatientInput = z.infer<typeof patientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type MedicalRecordInput = z.infer<typeof medicalRecordSchema>;
export type VitalSignInput = z.infer<typeof vitalSignSchema>;
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
export type LabOrderInput = z.infer<typeof labOrderSchema>;
export type BillingInput = z.infer<typeof billingSchema>;
export type ProviderInput = z.infer<typeof providerSchema>;
