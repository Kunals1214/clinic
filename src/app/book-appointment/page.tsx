'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Stethoscope,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Provider = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
};

export default function BookAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [appointmentData, setAppointmentData] = useState({
    providerId: '',
    appointmentDate: '',
    appointmentTime: '',
    type: 'IN_PERSON',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers/public');
      if (res.ok) {
        const data = await res.json();
        setProviders(data);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  const handleNextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!patientData.firstName || !patientData.lastName || !patientData.email || 
          !patientData.phone || !patientData.dateOfBirth || !patientData.gender) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else if (step === 2) {
      if (!appointmentData.providerId || !appointmentData.appointmentDate || 
          !appointmentData.appointmentTime || !appointmentData.reason) {
        toast.error('Please fill in all appointment details');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: patientData,
          appointment: appointmentData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConfirmationNumber(data.confirmationNumber);
        setStep(4);
        toast.success('Appointment booked successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProvider = providers.find(p => p.id === appointmentData.providerId);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-clinical-blue" />
              <span className="text-2xl font-bold text-gray-900">MediFlow Hospital</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-clinical-blue font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-clinical-blue font-medium">
                About
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-clinical-blue font-medium">
                Services
              </Link>
              <Link href="/doctors" className="text-gray-700 hover:text-clinical-blue font-medium">
                Our Doctors
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-clinical-blue font-medium">
                Contact
              </Link>
            </div>
            <Link href="/login">
              <Button variant="outline">
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="h-16 w-16 text-clinical-blue mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Book Your <span className="text-clinical-blue">Appointment</span>
          </h1>
          <p className="text-xl text-gray-600">
            Schedule a visit with our expert medical professionals in just a few simple steps
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, title: 'Patient Info', icon: User },
              { num: 2, title: 'Select Doctor', icon: Stethoscope },
              { num: 3, title: 'Review', icon: Clock },
              { num: 4, title: 'Confirmation', icon: CheckCircle }
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step >= s.num ? 'bg-clinical-blue text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium mt-2">{s.title}</span>
                </div>
                {index < 3 && (
                  <div className={`w-24 h-1 mx-4 ${
                    step > s.num ? 'bg-clinical-blue' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Steps */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Patient Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Your Information</CardTitle>
                <CardDescription>Please provide your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={patientData.firstName}
                      onChange={(e) => setPatientData({ ...patientData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={patientData.lastName}
                      onChange={(e) => setPatientData({ ...patientData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientData.email}
                      onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={patientData.phone}
                      onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={patientData.dateOfBirth}
                      onChange={(e) => setPatientData({ ...patientData, dateOfBirth: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={patientData.gender} onValueChange={(value) => setPatientData({ ...patientData, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={patientData.address}
                    onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={patientData.city}
                      onChange={(e) => setPatientData({ ...patientData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={patientData.state}
                      onChange={(e) => setPatientData({ ...patientData, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={patientData.zipCode}
                      onChange={(e) => setPatientData({ ...patientData, zipCode: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleNextStep} className="bg-clinical-blue hover:bg-clinical-blue/90">
                    Next: Select Doctor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Appointment Details */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Appointment Details</CardTitle>
                <CardDescription>Choose your doctor and preferred time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Select Doctor *</Label>
                  <Select value={appointmentData.providerId} onValueChange={(value) => setAppointmentData({ ...appointmentData, providerId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          Dr. {provider.firstName} {provider.lastName} - {provider.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Appointment Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={appointmentData.appointmentDate}
                      onChange={(e) => setAppointmentData({ ...appointmentData, appointmentDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={appointmentData.appointmentTime}
                      onChange={(e) => setAppointmentData({ ...appointmentData, appointmentTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type *</Label>
                  <Select value={appointmentData.type} onValueChange={(value) => setAppointmentData({ ...appointmentData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PERSON">In-Person Visit</SelectItem>
                      <SelectItem value="TELEMEDICINE">Telemedicine</SelectItem>
                      <SelectItem value="PHONE">Phone Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit *</Label>
                  <Input
                    id="reason"
                    value={appointmentData.reason}
                    onChange={(e) => setAppointmentData({ ...appointmentData, reason: e.target.value })}
                    required
                    placeholder="e.g., Annual checkup, Follow-up visit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={appointmentData.notes}
                    onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                    rows={3}
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleNextStep} className="bg-clinical-blue hover:bg-clinical-blue/90">
                    Review Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Review Your Appointment</CardTitle>
                <CardDescription>Please confirm all details are correct</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Patient Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium">{patientData.firstName} {patientData.lastName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{patientData.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <p className="font-medium">{patientData.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date of Birth:</span>
                      <p className="font-medium">{new Date(patientData.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-3">Appointment Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Doctor:</span>
                      <p className="font-medium">
                        Dr. {selectedProvider?.firstName} {selectedProvider?.lastName}
                      </p>
                      <p className="text-gray-500">{selectedProvider?.specialty}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date & Time:</span>
                      <p className="font-medium">
                        {new Date(appointmentData.appointmentDate).toLocaleDateString()} at {appointmentData.appointmentTime}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium">{appointmentData.type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Reason:</span>
                      <p className="font-medium">{appointmentData.reason}</p>
                    </div>
                  </div>
                  {appointmentData.notes && (
                    <div className="mt-4">
                      <span className="text-gray-600">Notes:</span>
                      <p className="font-medium">{appointmentData.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-clinical-blue hover:bg-clinical-blue/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Appointment Confirmed!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Your appointment has been successfully scheduled
                </p>
                
                <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto mb-8">
                  <p className="text-sm text-gray-600 mb-2">Confirmation Number</p>
                  <p className="text-3xl font-bold text-clinical-blue mb-4">{confirmationNumber}</p>
                  <div className="text-left space-y-2 text-sm">
                    <p><strong>Doctor:</strong> Dr. {selectedProvider?.firstName} {selectedProvider?.lastName}</p>
                    <p><strong>Date:</strong> {new Date(appointmentData.appointmentDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appointmentData.appointmentTime}</p>
                  </div>
                </div>

                <div className="space-y-3 max-w-md mx-auto text-sm text-gray-600">
                  <p>✓ A confirmation email has been sent to {patientData.email}</p>
                  <p>✓ You will receive a reminder 24 hours before your appointment</p>
                  <p>✓ Please arrive 15 minutes early for check-in</p>
                </div>

                <div className="mt-8 space-x-4">
                  <Link href="/">
                    <Button variant="outline">
                      Back to Home
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => window.print()}
                    className="bg-clinical-blue hover:bg-clinical-blue/90"
                  >
                    Print Confirmation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Activity className="h-6 w-6 text-clinical-blue" />
              <span className="text-xl font-bold">MediFlow Hospital</span>
            </div>
            <p className="text-gray-400">
              &copy; 2025 MediFlow Hospital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
