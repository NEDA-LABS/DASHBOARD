"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { ApiKey } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
// Shared components (used by both senders and providers)
import { ApiKeyManager, ProfileSettings } from "./shared";

// Sender-specific components
import { SenderTradingConfigurations, SenderServerConfigurations } from "./sender";

// Provider-specific components
import { ProviderLiquidityConfigurations } from "./provider";
import { 
  User as UserIcon, 
  Key, 
  Bell, 
  Shield,
  TrendingUp,
  Server
} from "lucide-react";

interface SettingsPageProps {
  user: User;
  profile: any | null;
  apiKeys: ApiKey[];
}

export function SettingsPage({ user, profile, apiKeys }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [currentProfile, setCurrentProfile] = useState<"sender" | "provider">("sender");

  useEffect(() => {
    // Get current profile from localStorage or user metadata
    const savedProfile = localStorage.getItem("activeProfile") as "sender" | "provider";
    if (savedProfile) {
      setCurrentProfile(savedProfile);
    }
  }, []);

  useEffect(() => {
    // Handle tab switching when profile changes
    if (currentProfile === "provider") {
      // If provider is on sender-only tabs, redirect to profile
      if (activeTab === "server" || activeTab === "trading") {
        setActiveTab("profile");
      }
    } else if (currentProfile === "sender") {
      // If sender is on provider tab, redirect to trading
      if (activeTab === "provider") {
        setActiveTab("trading");
      }
    }
  }, [currentProfile, activeTab]);

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-6 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Manage your account settings and API configuration.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className={`grid w-full ${currentProfile === "sender" ? "grid-cols-3 md:grid-cols-6" : "grid-cols-3 md:grid-cols-5"}`}>
          <TabsTrigger value="profile" className="flex items-center gap-1 md:gap-2">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          {currentProfile === "sender" ? (
            <TabsTrigger value="trading" className="flex items-center gap-1 md:gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trading</span>
            </TabsTrigger>
          ) : (
            <TabsTrigger value="provider" className="flex items-center gap-1 md:gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Provider</span>
            </TabsTrigger>
          )}
          {currentProfile === "sender" && (
            <TabsTrigger value="server" className="flex items-center gap-1 md:gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">Server</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="api-keys" className="flex items-center gap-1 md:gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 md:gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 md:gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Shared Settings - Available to both senders and providers */}
        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings user={user} profile={profile} />
        </TabsContent>

        {/* Sender-Only Settings */}
        {currentProfile === "sender" && (
          <TabsContent value="trading" className="space-y-4">
            <SenderTradingConfigurations />
          </TabsContent>
        )}

        {currentProfile === "sender" && (
          <TabsContent value="server" className="space-y-4">
            <SenderServerConfigurations userId={user.id} />
          </TabsContent>
        )}

        {/* Provider-Only Settings */}
        {currentProfile === "provider" && (
          <TabsContent value="provider" className="space-y-4">
            <ProviderLiquidityConfigurations userId={user.id} />
          </TabsContent>
        )}

        {/* Shared Settings - Available to both senders and providers */}
        <TabsContent value="api-keys" className="space-y-4">
          <ApiKeyManager user={user} apiKeys={apiKeys} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Notification settings will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">
                      Change your account password
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Login History</p>
                    <p className="text-sm text-muted-foreground">
                      View recent login activity
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
