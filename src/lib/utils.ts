import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateAge(dateOfBirth: Date | string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function calculateBMI(weightInPounds: number, heightInInches: number): number {
  // BMI = (weight in pounds / (height in inches)²) × 703
  return (weightInPounds / (heightInInches * heightInInches)) * 703;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function generateMRN(): string {
  // Generate Medical Record Number: MRN-YYYYMMDD-XXXX
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MRN-${year}${month}${day}-${random}`;
}

export function generateInvoiceNumber(): string {
  // Generate Invoice Number: INV-YYYYMMDD-XXXX
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}${day}-${random}`;
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input.replace(/[<>'"]/g, "");
}

export function maskSSN(ssn: string): string {
  // Mask SSN: XXX-XX-1234
  if (ssn.length !== 9) return ssn;
  return `XXX-XX-${ssn.slice(-4)}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\d{10}$/;
  const cleaned = phone.replace(/\D/g, "");
  return phoneRegex.test(cleaned);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getBloodPressureStatus(systolic: number, diastolic: number): {
  status: string;
  color: string;
} {
  if (systolic < 120 && diastolic < 80) {
    return { status: "Normal", color: "text-green-600" };
  } else if (systolic < 130 && diastolic < 80) {
    return { status: "Elevated", color: "text-yellow-600" };
  } else if (systolic < 140 || diastolic < 90) {
    return { status: "High BP Stage 1", color: "text-orange-600" };
  } else if (systolic < 180 || diastolic < 120) {
    return { status: "High BP Stage 2", color: "text-red-600" };
  } else {
    return { status: "Hypertensive Crisis", color: "text-red-700 font-bold" };
  }
}

export function getBMICategory(bmi: number): {
  category: string;
  color: string;
} {
  if (bmi < 18.5) {
    return { category: "Underweight", color: "text-blue-600" };
  } else if (bmi < 25) {
    return { category: "Normal", color: "text-green-600" };
  } else if (bmi < 30) {
    return { category: "Overweight", color: "text-yellow-600" };
  } else if (bmi < 35) {
    return { category: "Obese Class I", color: "text-orange-600" };
  } else if (bmi < 40) {
    return { category: "Obese Class II", color: "text-red-600" };
  } else {
    return { category: "Obese Class III", color: "text-red-700" };
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
