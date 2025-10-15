"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User as UserIcon, 
  Building2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ProfileSettingsProps {
  user: User;
  profile: any | null;
}

export function ProfileSettings({ user, profile: initialProfile }: ProfileSettingsProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    company_name: profile?.company_name || "",
    website: profile?.website || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    country: profile?.country || "",
  });

  const supabase = createClient();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateProfile = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(formData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Verification</Badge>;
      case "rejected":
        return <Badge variant="destructive">Verification Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Verified</Badge>;
    }
  };

  const getBusinessTypeDisplay = (type?: string) => {
    return type === "sender" ? "Sender" : "Provider";
  };

  return (
    <div className="space-y-8">
      {/* Account Information */}
      <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
        <CardHeader className="pb-6 pt-8 px-8">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <UserIcon className="h-6 w-6" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Display Name</Label>
              <p className="text-base font-semibold">
                {user.user_metadata?.display_name || "Not set"}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <p className="text-base font-semibold">{user.email}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Business Type</Label>
              <p className="text-base font-semibold">
                {getBusinessTypeDisplay(profile?.business_type)}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Verification Status</Label>
              <div className="mt-2">
                {getStatusBadge(profile?.verification_status)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
        <CardHeader className="pb-6 pt-8 px-8">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <Building2 className="h-6 w-6" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="company_name" className="text-base font-semibold text-slate-700 dark:text-slate-300">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                placeholder="Enter your company name"
                className="h-14 px-5 text-base rounded-xl border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="website" className="text-base font-semibold text-slate-700 dark:text-slate-300">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://example.com"
                className="h-14 px-5 text-base rounded-xl border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-base font-semibold text-slate-700 dark:text-slate-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="h-14 px-5 text-base rounded-xl border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="country" className="text-base font-semibold text-slate-700 dark:text-slate-300">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
              >
                <SelectTrigger className="h-14 text-base rounded-xl border-2 border-slate-300 dark:border-slate-700">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="SG">Singapore</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="address" className="text-base font-semibold text-slate-700 dark:text-slate-300">Business Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter your business address"
              rows={4}
              className="px-5 py-4 text-base rounded-xl border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button 
              onClick={updateProfile} 
              disabled={isUpdating}
              className="h-14 px-8 text-base bg-[#6366F1] hover:bg-[#5558E3] text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card className="border-2 border-border/50 shadow-lg rounded-2xl">
        <CardHeader className="pb-6 pt-8 px-8">
          <CardTitle className="text-2xl font-bold">Account Verification</CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 border-2 border-border/50 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  profile?.verification_status === "verified" ? "bg-green-500" :
                  profile?.verification_status === "pending" ? "bg-yellow-500" :
                  "bg-gray-300"
                }`}></div>
                <div>
                  <p className="font-medium">Identity Verification</p>
                  <p className="text-sm text-muted-foreground">
                    Verify your identity to access all platform features
                  </p>
                </div>
              </div>
              {getStatusBadge(profile?.verification_status)}
            </div>

            {profile?.verification_status !== "verified" && (
              <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                <h4 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-3">Complete Your Verification</h4>
                <p className="text-base text-blue-700 dark:text-blue-300 mb-5">
                  To access all features and increase your transaction limits, please complete the verification process.
                </p>
                <Button className="h-12 px-6 text-base bg-[#6366F1] hover:bg-[#5558E3] text-white font-semibold rounded-xl shadow-lg">
                  Start Verification
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
