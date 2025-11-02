'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar } from 'lucide-react';

export default function RecordsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600 mt-1">Electronic Health Records (EHR)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Medical Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Select a patient to view their medical records</p>
            <Button variant="outline">Browse Patients</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
