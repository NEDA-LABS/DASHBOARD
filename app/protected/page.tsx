import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Dashboard } from "@/components/dashboard/dashboard";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  // Get user profile to determine business type
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // If no profile exists, create one from user metadata
  let businessType = 'sender'; // default
  if (!profile && user.user_metadata?.business_type) {
    businessType = user.user_metadata.business_type;
    
    // Create profile
    await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        business_type: businessType
      });
  } else if (profile) {
    businessType = profile.business_type;
  }

  return (
    <Dashboard 
      user={user} 
      profile={profile} 
      businessType={businessType as 'sender' | 'provider'} 
    />
  );
}
