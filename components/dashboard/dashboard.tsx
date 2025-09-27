"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { UserProfile, BusinessType } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  Clock,
  Zap
} from "lucide-react";

interface DashboardProps {
  user: User;
  profile: UserProfile | null;
  businessType: BusinessType;
}

export function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const userName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';

  const stats = [
    {
      title: "Total Transactions",
      value: "0",
      subtitle: "All time",
      icon: Activity,
      color: "bg-blue-500"
    },
    {
      title: "Total Volume",
      value: "$0.00",
      subtitle: "All time",
      icon: DollarSign,
      color: "bg-purple-500"
    },
    {
      title: "Success Rate",
      value: "0%",
      subtitle: "Last 30 days",
      icon: TrendingUp,
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Hello, {userName}
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome to your dashboard
              </p>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => window.location.href = '/protected/settings'}
            >
              <Zap className="w-4 h-4 mr-2" />
              Manage API Keys
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Transaction History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Section */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                          <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Coming Soon Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">API Services</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    See all <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">API Services Coming Soon</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We&apos;re working hard to bring you powerful payment APIs. 
                    Stay tuned for onramp and offramp transaction capabilities.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Get Notified
                    </Button>
                    <Button variant="outline" className="border-border">
                      View Documentation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No Transactions Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Your transaction history will appear here once you start using our API services.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Documentation Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Explore our comprehensive API documentation and integration guides.
                  </p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
