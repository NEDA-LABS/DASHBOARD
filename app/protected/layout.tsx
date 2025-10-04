"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { RoleSelectionModal } from "@/components/role-selection-modal";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userScope, setUserScope] = useState<string>('');

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Protected Layout: Checking authentication...');
      console.log('🔍 Window location:', window.location.href);
      
      const authenticated = isAuthenticated();
      const user = getCurrentUser();
      
      console.log('🔍 Is authenticated:', authenticated);
      console.log('🔍 Current user:', user);
      console.log('🔍 localStorage.user:', localStorage.getItem('user') ? 'EXISTS' : 'NULL');
      console.log('🔍 sessionStorage.user:', sessionStorage.getItem('user') ? 'EXISTS' : 'NULL');
      
      if (!authenticated) {
        console.log('❌ Not authenticated, redirecting to login');
        console.log('❌ Redirect happening from:', window.location.pathname);
        router.push('/auth/login');
        return;
      }
      
      console.log('✅ User authenticated, showing protected content');
      setIsAuthed(true);
      setIsLoading(false);
      
      // Check if user has both roles and hasn't selected one yet
      if (user && user.scope === 'both') {
        const activeRole = localStorage.getItem('activeRole');
        if (!activeRole) {
          setUserScope(user.scope);
          setShowRoleModal(true);
        }
      }
    };

    // Add a small delay to ensure localStorage is ready after navigation
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthed) {
    return null;
  }
  return (
    <>
      <main className="min-h-screen flex flex-col">
        <DashboardNavbar />
        <div className="flex-1">
          {children}
        </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
          <p>
            Powered by{" "}
            <a
              href="https://nedapay.xyz"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              NedaPay Protocol
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </main>
      
      <RoleSelectionModal 
        open={showRoleModal} 
        onClose={() => setShowRoleModal(false)}
        userScope={userScope}
      />
    </>
  );
}
