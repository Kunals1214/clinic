import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Activity, 
  Calendar,
  Award,
  GraduationCap,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function DoctorsPage() {
  const doctors = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      qualification: 'MD, FACC',
      experience: '15+ years',
      description: 'Specializes in preventive cardiology, heart failure, and interventional procedures.',
      education: 'Harvard Medical School',
      languages: ['English', 'Spanish'],
      availability: 'Mon, Wed, Fri: 9AM-5PM',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop'
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      qualification: 'MD, PhD',
      experience: '20+ years',
      description: 'Expert in stroke treatment, epilepsy management, and neurodegenerative diseases.',
      education: 'Johns Hopkins University',
      languages: ['English', 'Mandarin'],
      availability: 'Tue, Thu: 10AM-6PM',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop'
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrician',
      qualification: 'MD, FAAP',
      experience: '12+ years',
      description: 'Passionate about child health, development, and family-centered care.',
      education: 'Stanford University',
      languages: ['English', 'Spanish', 'Portuguese'],
      availability: 'Mon-Fri: 8AM-4PM',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop'
    },
    {
      name: 'Dr. James Wilson',
      specialty: 'Orthopedic Surgeon',
      qualification: 'MD, FAAOS',
      experience: '18+ years',
      description: 'Specializes in joint replacement, sports injuries, and minimally invasive surgery.',
      education: 'Mayo Clinic',
      languages: ['English'],
      availability: 'Mon, Wed, Fri: 8AM-3PM',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop'
    },
    {
      name: 'Dr. Priya Patel',
      specialty: 'General Medicine',
      qualification: 'MD, FACP',
      experience: '10+ years',
      description: 'Focuses on preventive care, chronic disease management, and wellness.',
      education: 'Columbia University',
      languages: ['English', 'Hindi', 'Gujarati'],
      availability: 'Tue, Thu, Sat: 9AM-5PM',
      image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=300&h=300&fit=crop'
    },
    {
      name: 'Dr. Robert Anderson',
      specialty: 'Ophthalmologist',
      qualification: 'MD, FACS',
      experience: '16+ years',
      description: 'Expert in cataract surgery, LASIK, and retinal diseases.',
      education: 'University of Pennsylvania',
      languages: ['English', 'French'],
      availability: 'Mon-Fri: 9AM-5PM',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-clinical-blue">Expert Doctors</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our team of board-certified physicians brings world-class expertise and 
            compassionate care to every patient interaction.
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-indigo-100">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{doctor.name}</CardTitle>
                  <CardDescription className="text-clinical-blue font-semibold text-base">
                    {doctor.specialty}
                  </CardDescription>
                  <p className="text-sm text-gray-500">{doctor.qualification}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{doctor.description}</p>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center text-sm">
                      <GraduationCap className="h-4 w-4 mr-2 text-clinical-blue" />
                      <span className="text-gray-600">{doctor.education}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Award className="h-4 w-4 mr-2 text-clinical-blue" />
                      <span className="text-gray-600">{doctor.experience} Experience</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-clinical-blue flex-shrink-0" />
                      <span className="text-gray-600">{doctor.availability}</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <span className="text-gray-600 font-medium mr-2">Languages:</span>
                      <span className="text-gray-600">{doctor.languages.join(', ')}</span>
                    </div>
                  </div>

                  <Link href="/book-appointment">
                    <Button className="w-full bg-clinical-blue hover:bg-clinical-blue/90 mt-4">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book with {doctor.name.split(' ')[1]}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Doctors */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Medical Team?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-clinical-blue mb-4" />
                <CardTitle>Board Certified Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All our physicians are board-certified in their specialties with rigorous training 
                  from top medical institutions worldwide.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-clinical-blue mb-4" />
                <CardTitle>Continuous Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our doctors stay current with the latest medical advances through ongoing education, 
                  research, and participation in medical conferences.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Activity className="h-12 w-12 text-clinical-blue mb-4" />
                <CardTitle>Patient-Centered Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We prioritize compassionate, personalized care that treats the whole person, 
                  not just the condition, ensuring the best outcomes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-clinical-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Meet Your Doctor?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule an appointment with one of our expert physicians today and experience 
            world-class medical care.
          </p>
          <Link href="/book-appointment">
            <Button size="lg" className="bg-white text-clinical-blue hover:bg-gray-100">
              <Calendar className="mr-2 h-5 w-5" />
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
