"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, 
  Code, 
  Zap,
  Globe,
  ArrowRight,
  Shield,
  Terminal
} from "lucide-react";

export function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const quickStartGuides = [
    {
      title: "Sender Quick Start",
      description: "Get started with onramp and offramp transactions",
      icon: ArrowRight,
      href: "#sender-guide",
      time: "5 min read"
    },
    {
      title: "Provider Quick Start", 
      description: "Set up liquidity provision and earn fees",
      icon: Zap,
      href: "#provider-guide",
      time: "10 min read"
    },
    {
      title: "API Authentication",
      description: "Learn how to authenticate with our API",
      icon: Shield,
      href: "#authentication",
      time: "3 min read"
    },
    {
      title: "Webhooks Setup",
      description: "Configure webhooks for real-time updates",
      icon: Globe,
      href: "#webhooks",
      time: "7 min read"
    }
  ];

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/v1/transactions/onramp",
      description: "Create an onramp transaction"
    },
    {
      method: "POST", 
      endpoint: "/api/v1/transactions/offramp",
      description: "Create an offramp transaction"
    },
    {
      method: "GET",
      endpoint: "/api/v1/transactions/{id}",
      description: "Get transaction details"
    },
    {
      method: "GET",
      endpoint: "/api/v1/rates",
      description: "Get current exchange rates"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">
          Everything you need to integrate with the NEDA platform.
        </p>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="api-reference">API Reference</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Start Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {quickStartGuides.map((guide) => (
                  <div key={guide.title} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <guide.icon className="h-5 w-5 text-blue-600 mt-1" />
                      <Badge variant="outline" className="text-xs">
                        {guide.time}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                NEDA is a cross-border payment infrastructure that enables seamless onramp and offramp 
                transactions between fiat and cryptocurrency. Our platform serves two main user types:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-green-600 mb-2">Senders</h3>
                  <p className="text-sm text-muted-foreground">
                    Merchants and businesses that need to provide onramp/offramp services to their customers. 
                    Integrate our API to enable cross-border payments in your application.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-blue-600 mb-2">Providers</h3>
                  <p className="text-sm text-muted-foreground">
                    Liquidity providers who fund transactions and earn fees. Set up nodes to provide 
                    liquidity across different currency pairs and regions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-reference" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiEndpoints.map((endpoint) => (
                  <div key={endpoint.endpoint} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={endpoint.method === "GET" ? "secondary" : "default"}
                        className={endpoint.method === "GET" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono">{endpoint.endpoint}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All API requests require authentication using API keys. Include your API key and secret in the request headers:
              </p>
              <div className="bg-gray-100 rounded-lg p-4">
                <pre className="text-sm">
{`curl -X POST https://api.neda.com/v1/transactions/onramp \\
  -H "X-API-Key: your_api_key" \\
  -H "X-API-Secret: your_api_secret" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100,
    "currency": "USD",
    "crypto_currency": "BTC"
  }'`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Integration Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Sender Integration Guide</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete guide for integrating onramp and offramp functionality into your application.
                  </p>
                  <Button variant="outline" size="sm">
                    Read Guide
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Provider Setup Guide</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn how to set up liquidity nodes and start earning fees on transactions.
                  </p>
                  <Button variant="outline" size="sm">
                    Read Guide
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Webhook Implementation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Set up webhooks to receive real-time transaction status updates.
                  </p>
                  <Button variant="outline" size="sm">
                    Read Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                SDKs & Libraries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">JavaScript/TypeScript</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Official SDK for Node.js and browser environments.
                  </p>
                  <div className="bg-gray-100 rounded p-2 mb-3">
                    <code className="text-sm">npm install @neda/sdk</code>
                  </div>
                  <Button variant="outline" size="sm">
                    View on GitHub
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Python</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Python SDK for server-side integrations.
                  </p>
                  <div className="bg-gray-100 rounded p-2 mb-3">
                    <code className="text-sm">pip install neda-python</code>
                  </div>
                  <Button variant="outline" size="sm">
                    View on GitHub
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Go</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Go SDK for high-performance applications.
                  </p>
                  <div className="bg-gray-100 rounded p-2 mb-3">
                    <code className="text-sm">go get github.com/neda/go-sdk</code>
                  </div>
                  <Button variant="outline" size="sm">
                    View on GitHub
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">PHP</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    PHP SDK for web applications.
                  </p>
                  <div className="bg-gray-100 rounded p-2 mb-3">
                    <code className="text-sm">composer require neda/php-sdk</code>
                  </div>
                  <Button variant="outline" size="sm">
                    View on GitHub
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
