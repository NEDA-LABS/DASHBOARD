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
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden border-r border-slate-700/50 dark:border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10" />
            <div className="relative z-10 flex flex-col justify-center px-12 text-white">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Welcome to NedaPay
                </h1>
                <p className="text-xl text-slate-300 dark:text-slate-400 mb-8">
                  Seamless cross-border payment infrastructure for the modern world. 
                  Connect, transact, and scale globally with our powerful APIs.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-slate-300 dark:text-slate-400">Secure onramp & offramp solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <span className="text-slate-300 dark:text-slate-400">Real-time transaction processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-slate-300 dark:text-slate-400">Developer-friendly APIs</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
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
