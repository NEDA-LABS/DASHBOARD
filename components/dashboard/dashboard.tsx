"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { UserProfile, BusinessType } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign,
  TrendingUp,
  Users,
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

export function Dashboard({ user, profile, businessType }: DashboardProps) {
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Hello, {userName}
              </h1>
              <p className="text-slate-600 mt-1">
                Hello, {userName}
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
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Transaction History
            </TabsTrigger>
            <TabsTrigger 
              value="docs"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Docs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Section */}
            <div>
              <h2 className="text-lg font-medium text-slate-900 mb-4">Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-white border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                          <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                          <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
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
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">API Services</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    See all <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">API Services Coming Soon</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    We're working hard to bring you powerful payment APIs. 
                    Stay tuned for onramp and offramp transaction capabilities.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Get Notified
                    </Button>
                    <Button variant="outline" className="border-slate-300">
                      View Documentation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Transactions Yet</h3>
                  <p className="text-slate-600 mb-6">
                    Your transaction history will appear here once you start using our API services.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Documentation Available</h3>
                  <p className="text-slate-600 mb-6">
                    Explore our comprehensive API documentation and integration guides.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
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
