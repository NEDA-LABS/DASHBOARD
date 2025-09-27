"use client";

import { ThemeProvider } from "next-themes";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Theme switcher in top-right corner */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeSwitcher />
        </div>
        
        {/* Auth content */}
        <div className="flex min-h-screen">
          {/* Left side - Branding/Info */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col justify-center px-12 text-white">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold mb-6">
                  Welcome to NedaPay
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Seamless cross-border payment infrastructure for the modern world. 
                  Connect, transact, and scale globally with our powerful APIs.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full" />
                    <span className="text-blue-100">Secure onramp & offramp solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-300 rounded-full" />
                    <span className="text-blue-100">Real-time transaction processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-300 rounded-full" />
                    <span className="text-blue-100">Developer-friendly APIs</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-lg" />
          </div>
          
          {/* Right side - Auth forms */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
