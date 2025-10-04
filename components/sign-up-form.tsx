"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessTypes, setBusinessTypes] = useState<("sender" | "provider")[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email address is required");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (businessTypes.length === 0) {
      setError("Please select at least one business type");
      setIsLoading(false);
      return;
    }

    if (!consentChecked) {
      setError("You must agree to the terms of use and privacy policy");
      setIsLoading(false);
      return;
    }

    try {
      console.log('=== Starting sign-up process ===');
      console.log('Form data:', { firstName, lastName, email, businessTypes });
      
      // Call server-side API to create user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          businessTypes
        }),
      });

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Get response text first to debug
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = 'Failed to create account';
        try {
          const errorData = JSON.parse(responseText);
          console.log('Parsed error data:', errorData);
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            console.error('Error details:', errorData.details);
          }
          if (errorData.stack) {
            console.error('Error stack:', errorData.stack);
          }
        } catch (parseError) {
          // If JSON parsing fails, use status text
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed success data:', data);
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError);
        console.error('Response text was:', responseText);
        throw new Error('Invalid response from server');
      }

      // Log verification link for development
      if (data.verificationLink) {
        console.log('Email verification link:', data.verificationLink);
      }
      
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      console.error('Sign-up error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while creating your account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/NEDApayLogo.png" 
              alt="NedaPay" 
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
            Join NedaPay
          </CardTitle>
          <CardDescription>Create your developer account and start building</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password (min. 8 characters)"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Business Type */}
              <div className="grid gap-3">
                <Label>Type of business (select one or both)</Label>
                <div className="space-y-3">
                  {/* Sender Option */}
                  <div 
                    className={cn(
                      "flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      businessTypes.includes("sender") ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                    onClick={() => {
                      const newChecked = !businessTypes.includes("sender");
                      if (newChecked) {
                        setBusinessTypes([...businessTypes, "sender"]);
                      } else {
                        setBusinessTypes(businessTypes.filter(type => type !== "sender"));
                      }
                    }}
                  >
                    <div className="mt-1">
                      <div className={cn(
                        "h-4 w-4 shrink-0 rounded-sm border border-primary shadow flex items-center justify-center",
                        businessTypes.includes("sender") ? "bg-primary text-primary-foreground" : "bg-background"
                      )}>
                        {businessTypes.includes("sender") && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white text-sm font-bold">S</span>
                        </div>
                        <span className="font-medium">Sender</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Enable your merchants and customers access fast, secure and reliable cross-border payments that fit into any use cases.
                      </p>
                    </div>
                  </div>

                  {/* Provider Option */}
                  <div 
                    className={cn(
                      "flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      businessTypes.includes("provider") ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                    onClick={() => {
                      const newChecked = !businessTypes.includes("provider");
                      if (newChecked) {
                        setBusinessTypes([...businessTypes, "provider"]);
                      } else {
                        setBusinessTypes(businessTypes.filter(type => type !== "provider"));
                      }
                    }}
                  >
                    <div className="mt-1">
                      <div className={cn(
                        "h-4 w-4 shrink-0 rounded-sm border border-primary shadow flex items-center justify-center",
                        businessTypes.includes("provider") ? "bg-primary text-primary-foreground" : "bg-background"
                      )}>
                        {businessTypes.includes("provider") && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white text-sm font-bold">P</span>
                        </div>
                        <span className="font-medium">Provider</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Set up a node, fund your position and earn on every transaction on a completely transparent, fair and market-neutral platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={consentChecked}
                  onCheckedChange={(checked) => setConsentChecked(checked === true)}
                  className="mt-1"
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed">
                  I certify that I am 18 years of age or older, I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Use
                  </Link>
                  , and I have read the{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </Label>
              </div>

              {/* CAPTCHA Placeholder */}
              <div className="flex items-center justify-center p-4 border border-gray-300 rounded bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Checkbox />
                  <span className="text-sm">Verify you are human</span>
                  <div className="ml-4 text-xs text-gray-500">reCAPTCHA</div>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600" 
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up for early access"}
              </Button>
            </div>
            
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
