'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Activity, 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['Main: (555) 123-4567', 'Emergency: 911', 'Appointments: (555) 123-4568']
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['General: info@mediflow.com', 'Appointments: appointments@mediflow.com', 'Billing: billing@mediflow.com']
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Medical Center Drive', 'Suite 100', 'New York, NY 10001']
    },
    {
      icon: Clock,
      title: 'Hours',
      details: ['Mon-Fri: 7:00 AM - 7:00 PM', 'Sat-Sun: 9:00 AM - 5:00 PM', 'Emergency: 24/7']
    }
  ];

  const departments = [
    { name: 'Emergency', phone: '(555) 123-4500', hours: '24/7' },
    { name: 'Cardiology', phone: '(555) 123-4567', hours: 'Mon-Fri: 8AM-6PM' },
    { name: 'Pediatrics', phone: '(555) 123-4570', hours: 'Mon-Sat: 8AM-8PM' },
    { name: 'Orthopedics', phone: '(555) 123-4569', hours: 'Mon-Fri: 8AM-6PM' },
    { name: 'General Medicine', phone: '(555) 123-4571', hours: 'Mon-Fri: 7AM-7PM' },
    { name: 'Neurology', phone: '(555) 123-4568', hours: '24/7' }
  ];

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
              <Link href="/contact" className="text-clinical-blue font-medium">
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/book-appointment">
                <Button className="bg-clinical-blue hover:bg-clinical-blue/90">
                  Book Appointment
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Get in <span className="text-clinical-blue">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help. Reach out to us for appointments, questions, or emergencies.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-clinical-blue/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <info.icon className="h-6 w-6 text-clinical-blue" />
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        placeholder="How can we help you?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-clinical-blue hover:bg-clinical-blue/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Department Contacts & Map */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Department Contacts</h2>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {departments.map((dept, index) => (
                        <div key={index} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                          <div>
                            <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                            <p className="text-sm text-gray-600">{dept.hours}</p>
                          </div>
                          <a 
                            href={`tel:${dept.phone}`}
                            className="text-clinical-blue hover:underline text-sm font-medium"
                          >
                            {dept.phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Location</h2>
                <Card className="overflow-hidden">
                  <div className="relative h-64 bg-gray-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976314309273!3d40.697663747874524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890123"
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-clinical-blue mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">MediFlow Hospital</p>
                        <p className="text-gray-600">123 Medical Center Drive, Suite 100</p>
                        <p className="text-gray-600">New York, NY 10001</p>
                        <Link href="https://maps.google.com" target="_blank" className="text-clinical-blue hover:underline text-sm mt-2 inline-block">
                          Get Directions →
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="py-12 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Emergency? Call 911</h2>
          <p className="text-xl mb-6">
            For life-threatening emergencies, call 911 or come directly to our Emergency Department
          </p>
          <p className="text-lg">
            Emergency Department Direct Line: <a href="tel:5551234500" className="underline font-semibold">(555) 123-4500</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-6 w-6 text-clinical-blue" />
                <span className="text-xl font-bold">MediFlow</span>
              </div>
              <p className="text-gray-400">
                Providing quality healthcare services with compassion and excellence.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link href="/doctors" className="text-gray-400 hover:text-white">Our Doctors</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Emergency Care</li>
                <li className="text-gray-400">Cardiology</li>
                <li className="text-gray-400">Pediatrics</li>
                <li className="text-gray-400">General Medicine</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  (555) 123-4567
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  info@mediflow.com
                </li>
                <li className="flex items-center text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  123 Medical Center Dr
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MediFlow Hospital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
