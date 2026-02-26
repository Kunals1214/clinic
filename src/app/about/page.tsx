import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Award, Heart, Shield, Users } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We treat every patient with empathy, respect, and dignity.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to the highest standards of medical care.',
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Your safety and trust are our top priorities.',
    },
    {
      icon: Users,
      title: 'Patient-Centered',
      description: 'Every decision we make puts patients first.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-clinical-blue hover:underline mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About MediFlow Hospital</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Dedicated to providing exceptional healthcare services with compassion and excellence since 2000.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                To provide accessible, high-quality healthcare services that improve the health and well-being 
                of our community through compassionate care, medical excellence, and innovative treatment approaches.
              </p>
              <p className="text-lg text-gray-600">
                We strive to create a healing environment where patients feel safe, respected, and cared for 
                by our dedicated team of healthcare professionals.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-4">
                To be the leading healthcare provider recognized for clinical excellence, patient safety, 
                and innovation in medical care delivery.
              </p>
              <p className="text-lg text-gray-600">
                We envision a future where every patient receives personalized, world-class medical care 
                that addresses their unique health needs and promotes long-term wellness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-clinical-blue/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-clinical-blue" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Journey</h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 font-bold text-clinical-blue">2000</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Hospital Founded</h3>
                <p className="text-gray-600">MediFlow Hospital opened its doors with 50 beds and a vision to serve the community.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 font-bold text-clinical-blue">2010</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Major Expansion</h3>
                <p className="text-gray-600">Expanded to 200 beds with state-of-the-art cardiac and trauma centers.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 font-bold text-clinical-blue">2020</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Digital Transformation</h3>
                <p className="text-gray-600">Implemented advanced EHR system and telemedicine services.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 font-bold text-clinical-blue">2025</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Leading Healthcare Provider</h3>
                <p className="text-gray-600">Now serving 100,000+ patients annually with 50+ specialist doctors.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-clinical-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Healthcare Family</h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the MediFlow difference – where caring meets excellence
          </p>
          <Link href="/book-appointment">
            <Button size="lg" variant="secondary">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
