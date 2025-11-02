'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, Pill, TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  newPatientsThisMonth: number;
  appointmentsToday: number;
  revenueThisMonth: number;
  pendingPrescriptions: number;
  appointmentsByStatus: Record<string, number>;
  recentPatients: any[];
  upcomingAppointments: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinical-blue"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      change: stats?.newPatientsThisMonth || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Today\'s Appointments',
      value: stats?.appointmentsToday || 0,
      change: 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Monthly Revenue',
      value: `$${(stats?.revenueThisMonth || 0).toLocaleString()}`,
      change: 0,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Prescriptions',
      value: stats?.pendingPrescriptions || 0,
      change: 0,
      icon: Pill,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your clinic overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change > 0 && (
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +{stat.change} this month
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Appointments Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.appointmentsByStatus ? (
                Object.entries(stats.appointmentsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {status.toLowerCase().replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No appointments data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentPatients && stats.recentPatients.length > 0 ? (
                stats.recentPatients.map((patient: any) => (
                  <div key={patient.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{patient.mrn}</p>
                    </div>
                    <span className="text-xs text-gray-600">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent patients</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
              stats.upcomingAppointments.map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.type} - {appointment.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">{appointment.appointmentTime}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No upcoming appointments</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
