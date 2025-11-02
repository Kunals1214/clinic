import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Heart, 
  Stethoscope, 
  Baby, 
  Brain,
  Bone,
  Eye,
  Pill,
  Syringe,
  Clock,
  Calendar,
  Phone
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Comprehensive heart care including diagnostics, treatment, and preventive cardiology services.',
      features: ['ECG & Echocardiography', 'Cardiac Catheterization', 'Heart Surgery', 'Pacemaker Implantation'],
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
      phone: '(555) 123-4567'
    },
    {
      icon: Brain,
      title: 'Neurology',
      description: 'Advanced neurological care for brain, spine, and nervous system conditions.',
      features: ['Stroke Treatment', 'Epilepsy Management', 'MRI & CT Scans', 'Neurosurgery'],
      hours: '24/7 Emergency Care',
      phone: '(555) 123-4568'
    },
    {
      icon: Bone,
      title: 'Orthopedics',
      description: 'Expert care for bone, joint, and musculoskeletal system disorders.',
      features: ['Joint Replacement', 'Sports Medicine', 'Fracture Care', 'Physical Therapy'],
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
      phone: '(555) 123-4569'
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      description: 'Specialized medical care for infants, children, and adolescents.',
      features: ['Well-Child Visits', 'Vaccinations', 'Pediatric Surgery', 'Development Screening'],
      hours: 'Mon-Sat: 8AM-8PM',
      phone: '(555) 123-4570'
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Primary care and preventive health services for adults of all ages.',
      features: ['Health Checkups', 'Chronic Disease Management', 'Preventive Care', 'Health Counseling'],
      hours: 'Mon-Fri: 7AM-7PM, Sat-Sun: 9AM-5PM',
      phone: '(555) 123-4571'
    },
    {
      icon: Eye,
      title: 'Ophthalmology',
      description: 'Complete eye care services from routine exams to advanced eye surgery.',
      features: ['Eye Exams', 'Cataract Surgery', 'LASIK', 'Retinal Care'],
      hours: 'Mon-Fri: 9AM-5PM',
      phone: '(555) 123-4572'
    },
    {
      icon: Pill,
      title: 'Pharmacy Services',
      description: '24/7 pharmacy with prescription fulfillment and medication counseling.',
      features: ['Prescription Drugs', 'OTC Medications', 'Medication Review', 'Home Delivery'],
      hours: '24/7',
      phone: '(555) 123-4573'
    },
    {
      icon: Syringe,
      title: 'Laboratory Services',
      description: 'State-of-the-art diagnostic laboratory with rapid turnaround times.',
      features: ['Blood Tests', 'Pathology', 'Microbiology', 'Genetic Testing'],
      hours: 'Mon-Sat: 7AM-7PM',
      phone: '(555) 123-4574'
    },
    {
      icon: Activity,
      title: 'Emergency Care',
      description: 'Round-the-clock emergency medical services with rapid response teams.',
      features: ['Trauma Care', 'Critical Care', 'Ambulance Service', 'Emergency Surgery'],
      hours: '24/7',
      phone: '911 or (555) 123-4500'
    },
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
              <Link href="/services" className="text-clinical-blue font-medium">
                Services
              </Link>
              <Link href="/doctors" className="text-gray-700 hover:text-clinical-blue font-medium">
                Our Doctors
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-clinical-blue font-medium">
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
            Our Medical <span className="text-clinical-blue">Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare solutions delivered by expert medical professionals 
            using state-of-the-art technology and compassionate care.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="bg-clinical-blue/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-clinical-blue" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Services Include:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="text-gray-600 text-sm flex items-center">
                            <span className="w-1.5 h-1.5 bg-clinical-blue rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-clinical-blue" />
                        {service.hours}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-clinical-blue" />
                        {service.phone}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-clinical-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Need Medical Assistance?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our expert medical team is ready to help you. Book an appointment or contact us for emergency care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-appointment">
              <Button size="lg" className="bg-white text-clinical-blue hover:bg-gray-100">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </Link>
          </div>
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
                <li className="text-gray-400">
                  info@mediflow.com
                </li>
                <li className="text-gray-400">
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
