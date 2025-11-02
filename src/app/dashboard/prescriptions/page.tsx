'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pill, Clock, CheckCircle } from 'lucide-react';

interface Prescription {
  id: string;
  rxNumber: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: string;
  prescriptionDate: string;
  patient: {
    firstName: string;
    lastName: string;
    mrn: string;
  };
  provider: {
    firstName: string;
    lastName: string;
  };
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('/api/prescriptions');
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data.prescriptions || []);
      }
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    FILLED: 'bg-blue-100 text-blue-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinical-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-Prescribing</h1>
          <p className="text-gray-600 mt-1">Manage electronic prescriptions</p>
        </div>
        <Button className="bg-clinical-blue hover:bg-clinical-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.filter((p) => p.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current prescriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <Clock className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {prescriptions.filter((p) => p.status === 'PENDING').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Awaiting fulfillment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            <Pill className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptions.length}</div>
            <p className="text-xs text-gray-500 mt-1">All prescriptions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            statusColors[prescription.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {prescription.status}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {prescription.rxNumber}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {prescription.medicationName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {prescription.dosage} - {prescription.frequency} for {prescription.duration}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Patient:</span>{' '}
                          {prescription.patient.firstName} {prescription.patient.lastName}
                        </div>
                        <div>
                          <span className="font-medium">Prescribed by:</span> Dr.{' '}
                          {prescription.provider.firstName} {prescription.provider.lastName}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span>{' '}
                          {new Date(prescription.prescriptionDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {prescription.status === 'ACTIVE' && (
                        <Button variant="default" size="sm">
                          Refill
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No prescriptions yet. Create your first prescription to get started.</p>
              <Button className="bg-clinical-blue hover:bg-clinical-blue/90">
                <Plus className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
