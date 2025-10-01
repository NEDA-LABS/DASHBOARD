import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasValidAdminSession } from '@/lib/admin-auth';
import { AdminSidebar } from '@/components/admin/sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  // Check for admin password session
  const hasSession = await hasValidAdminSession(user.id);
  
  // If no session, the auth page will handle showing the password form
  // The auth page has its own layout that doesn't include the sidebar
  
  return (
    <>
      {hasSession ? (
        <div className="flex h-screen bg-background">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      ) : (
        // No sidebar for auth page
        <div className="min-h-screen bg-background">
          {children}
        </div>
      )}
    </>
  );
}
