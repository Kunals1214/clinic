'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Activity } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  mfaCode: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [requiresMFA, setRequiresMFA] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include', // Important for cookies
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.requiresMfa) {
          setRequiresMFA(true);
          toast({
            title: 'MFA Required',
            description: 'Please enter your 6-digit MFA code',
          });
        } else {
          toast({
            title: 'Login Failed',
            description: result.error || result.details || 'Invalid credentials',
            variant: 'destructive',
          });
        }
        return;
      }

      // Show success message
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${result.user?.firstName || 'User'}!`,
      });

      // Small delay to ensure cookie is set and toast is visible
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh(); // Force refresh to update authentication state
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-clinical-blue p-3 rounded-full">
              <Activity className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome to MediFlow</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your clinic management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@mediflow.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {requiresMFA && (
              <div className="space-y-2">
                <Label htmlFor="mfaCode">MFA Code</Label>
                <Input
                  id="mfaCode"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  {...register('mfaCode')}
                  disabled={isLoading}
                />
                {errors.mfaCode && (
                  <p className="text-sm text-red-600">{errors.mfaCode.message}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm space-y-2">
            <div>
              <Link href="/forgot-password" className="text-clinical-blue hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div>
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/register" className="text-clinical-blue hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-600 text-center">
            Demo Credentials:<br />
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              admin@mediflow.com / Admin@12345678
            </code>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Protected by HIPAA-compliant security measures
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
