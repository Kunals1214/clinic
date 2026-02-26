import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Calendar, 
  Heart, 
  Stethoscope, 
  Users, 
  Award,
  Clock,
  Shield,
  ArrowRight,
  Activity
} from 'lucide-react';

export default function HomePage() {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Advanced heart care with state-of-the-art facilities and experienced cardiologists.',
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Comprehensive primary care for all your health needs.',
    },
    {
      icon: Users,
      title: 'Pediatrics',
      description: 'Specialized care for infants, children, and adolescents.',
    },
    {
      icon: Activity,
      title: 'Emergency Care',
      description: '24/7 emergency services with rapid response teams.',
    },
  ];

  const features = [
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock medical care',
    },
    {
      icon: Award,
      title: 'Expert Doctors',
      description: 'Board-certified specialists',
    },
    {
      icon: Shield,
      title: 'Advanced Technology',
      description: 'Latest medical equipment',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Your Health is Our
                <span className="text-clinical-blue"> Priority</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience world-class healthcare with compassionate care. 
                Our expert medical team is dedicated to your well-being 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book-appointment">
                  <Button size="lg" className="bg-clinical-blue hover:bg-clinical-blue/90 w-full sm:w-auto">
                    Book an Appointment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Our Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&h=400&fit=crop"
                  alt="Medical care"
                  className="rounded-lg w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-clinical-blue/10 p-3 rounded-lg">
                  <feature.icon className="h-6 w-6 text-clinical-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Services</h2>
            <p className="text-xl text-gray-600">
              Comprehensive healthcare solutions for you and your family
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-clinical-blue/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-clinical-blue" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg" variant="outline">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-clinical-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">25+</div>
              <div className="text-blue-100">Years of Excellence</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Expert Doctors</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Happy Patients</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Emergency Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book your appointment today and let our expert medical team take care of you
          </p>
          <Link href="/book-appointment">
            <Button size="lg" className="bg-clinical-blue hover:bg-clinical-blue/90">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Your Visit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
