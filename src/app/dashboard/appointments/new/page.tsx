'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  providerId: z.string().min(1, 'Provider is required'),
  appointmentDate: z.string().min(1, 'Date is required'),
  appointmentTime: z.string().min(1, 'Time is required'),
  type: z.enum(['IN_PERSON', 'TELEMEDICINE', 'PHONE', 'HOME_VISIT']),
  reason: z.string().min(1, 'Reason for visit is required'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  mrn: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    fetchPatients();
    fetchProviders();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients?limit=100', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/providers', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          status: 'SCHEDULED',
          duration: 30, // Default 30 minutes
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create appointment');
      }

      toast({
        title: 'Success',
        description: 'Appointment created successfully',
      });

      router.push('/dashboard/appointments');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create appointment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Appointment</h1>
          <p className="text-gray-600 mt-1">Create a new appointment</p>
        </div>
        <Link href="/dashboard/appointments">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Appointments
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient *</Label>
                <select
                  id="patientId"
                  {...register('patientId')}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.mrn})
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="text-sm text-red-600">{errors.patientId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="providerId">Provider *</Label>
                <select
                  id="providerId"
                  {...register('providerId')}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select provider</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      Dr. {provider.firstName} {provider.lastName} - {provider.specialty}
                    </option>
                  ))}
                </select>
                {errors.providerId && (
                  <p className="text-sm text-red-600">{errors.providerId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Date *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  {...register('appointmentDate')}
                  disabled={isLoading}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.appointmentDate && (
                  <p className="text-sm text-red-600">{errors.appointmentDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Time *</Label>
                <Input
                  id="appointmentTime"
                  type="time"
                  {...register('appointmentTime')}
                  disabled={isLoading}
                />
                {errors.appointmentTime && (
                  <p className="text-sm text-red-600">{errors.appointmentTime.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type *</Label>
                <select
                  id="type"
                  {...register('type')}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select type</option>
                  <option value="IN_PERSON">In-Person</option>
                  <option value="TELEMEDICINE">Telemedicine</option>
                  <option value="PHONE">Phone</option>
                  <option value="HOME_VISIT">Home Visit</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Input
                  id="reason"
                  {...register('reason')}
                  disabled={isLoading}
                  placeholder="e.g., Annual checkup, Follow-up"
                />
                {errors.reason && (
                  <p className="text-sm text-red-600">{errors.reason.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  disabled={isLoading}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Additional notes or instructions..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/dashboard/appointments">
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Appointment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
