'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Calendar,
  Users,
  FileText,
  Pill,
  TestTube,
  DollarSign,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['ALL'] },
  { name: 'Patients', href: '/dashboard/patients', icon: Users, roles: ['ALL'] },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar, roles: ['ALL'] },
  { name: 'Medical Records', href: '/dashboard/records', icon: FileText, roles: ['DOCTOR', 'NURSE', 'ADMIN'] },
  { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: Pill, roles: ['DOCTOR', 'PHARMACIST', 'ADMIN'] },
  { name: 'Lab Orders', href: '/dashboard/lab', icon: TestTube, roles: ['DOCTOR', 'LAB_TECHNICIAN', 'ADMIN'] },
  { name: 'Billing', href: '/dashboard/billing', icon: DollarSign, roles: ['BILLING_STAFF', 'ADMIN'] },
  { name: 'Telemedicine', href: '/dashboard/telemedicine', icon: Video, roles: ['DOCTOR', 'NURSE', 'ADMIN'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['ADMIN', 'SUPER_ADMIN'] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = (roles: string[]) => {
    if (!currentUser) return false;
    if (roles.includes('ALL')) return true;
    return roles.includes(currentUser.role);
  };

  const filteredNavigation = navigation.filter((item) => hasAccess(item.roles));

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinical-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-clinical-blue" />
                <span className="text-xl font-bold text-gray-900">MediFlow</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="px-4 py-4 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-clinical-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-white">
        <div className="flex h-16 items-center px-6 border-b">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-clinical-blue" />
            <span className="text-xl font-bold text-gray-900">MediFlow</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-clinical-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Home className="h-4 w-4" />
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-gray-900">
                {filteredNavigation.find((item) => pathname.startsWith(item.href))?.name || 'Dashboard'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
                <span className="ml-2 text-xs text-gray-500">{currentUser?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
