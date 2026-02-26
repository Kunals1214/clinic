import Link from 'next/link';
import { Activity, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
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
          <p>&copy; {new Date().getFullYear()} MediFlow Hospital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
