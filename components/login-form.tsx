"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { setCurrentUser } from '@/lib/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call server-side login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      console.log('Login response:', data);

      if (!data.success) {
        // Check if email needs verification
        if (data.needsVerification) {
          throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
        }
        throw new Error(data.error || 'Login failed');
      }

      // Store user info using auth utility
      setCurrentUser(data.user);
      
      toast.success('Login successful!');
      console.log('🚀 Redirecting user with scope:', data.user.scope);
      
      // Redirect immediately - don't set loading to false
      if (data.user.scope === 'admin') {
        router.push('/protected/admin');
      } else {
        router.push('/protected');
      }
      // Keep loading state true during redirect
      
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false); // Only stop loading on error
    }
  };

  return (
    <div className={cn("w-full max-w-lg", className)} {...props}>
      <div className="bg-white rounded-3xl shadow-xl p-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif', letterSpacing: '-0.01em' }}>
            Login
          </h2>
          <p className="text-slate-600 text-sm">
            Enter your email below to login to your account.{" "}
            <Link href="/auth/sign-up" className="text-blue-600 hover:text-blue-700 underline">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Provide your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 px-4 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-[#6366F1] hover:bg-[#5558E3] text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
