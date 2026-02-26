'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Activity, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/doctors', label: 'Our Doctors' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-clinical-blue" />
            <span className="text-2xl font-bold text-gray-900">MediFlow Hospital</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium ${
                  pathname === link.href
                    ? 'text-clinical-blue'
                    : 'text-gray-700 hover:text-clinical-blue'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/book-appointment">
              <Button className="bg-clinical-blue hover:bg-clinical-blue/90">
                Book Appointment
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Staff Login</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-clinical-blue focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md font-medium ${
                  pathname === link.href
                    ? 'bg-clinical-blue/10 text-clinical-blue'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-clinical-blue'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2 border-t">
              <Link href="/book-appointment" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-clinical-blue hover:bg-clinical-blue/90">
                  Book Appointment
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
