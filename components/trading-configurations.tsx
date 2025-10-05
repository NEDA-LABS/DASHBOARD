"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getCurrentUser } from '@/lib/auth';

interface Token {
  id: number;
  symbol: string;
  contract_address: string;
  decimals: number;
  networks: {
    name: string;
  };
  sender_order_tokens: Array<{
    id: number;
    fee_percent: number;
    fee_address: string;
    refund_address: string;
  }>;
}

interface TokenConfig {
  feePercent: number;
  feeAddress: string;
  refundAddress: string;
}

export function TradingConfigurations() {
  const user = getCurrentUser();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [config, setConfig] = useState<TokenConfig>({
    feePercent: 0,
    feeAddress: '',
    refundAddress: ''
  });

  const effectiveUserId = user?.id;

  const fetchTradingConfigurations = async () => {
    try {
      // First ensure sender profile exists
      const profileResponse = await fetch(`/api/sender-profile?userId=${effectiveUserId}`);
      if (!profileResponse.ok) {
        toast.error('Failed to initialize sender profile');
        return;
      }

      // Then fetch trading configurations
      const response = await fetch(`/api/trading-configurations?userId=${user?.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setTokens(data.tokens || []);
        if (data.tokens && data.tokens.length > 0) {
          setSelectedToken(data.tokens[0]);
          if (data.tokens[0].config) {
            setConfig(data.tokens[0].config);
          }
        }
      } else {
        toast.error(data.error || 'Failed to fetch trading configurations');
      }
    } catch (_error) {
      toast.error('Failed to fetch trading configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveUserId) {
      fetchTradingConfigurations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveUserId]);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    const existingConfig = token.sender_order_tokens[0];
    
    if (existingConfig) {
      setConfig({
        feePercent: existingConfig.fee_percent,
        feeAddress: existingConfig.fee_address,
        refundAddress: existingConfig.refund_address
      });
    } else {
      setConfig({
        feePercent: 0,
        feeAddress: '',
        refundAddress: ''
      });
    }
  };

  const handleSaveConfiguration = async () => {
    if (!selectedToken || !user) return;

    if (!config.feeAddress || !config.refundAddress) {
      toast.error('Fee address and refund address are required');
      return;
    }

    if (config.feePercent < 0 || config.feePercent > 100) {
      toast.error('Fee percent must be between 0 and 100');
      return;
    }

    setSaving(selectedToken.id);

    try {
      const response = await fetch('/api/trading-configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          tokenId: selectedToken.id,
          feePercent: config.feePercent,
          feeAddress: config.feeAddress,
          refundAddress: config.refundAddress
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Trading configuration saved successfully');
        await fetchTradingConfigurations(); // Refresh the data
      } else {
        toast.error(data.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteConfiguration = async (token: Token) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/trading-configurations?userId=${user.id}&tokenId=${token.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Configuration deleted successfully');
        await fetchTradingConfigurations(); // Refresh the data
        if (selectedToken?.id === token.id) {
          setSelectedToken(null);
        }
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete configuration');
      }
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast.error('Failed to delete configuration');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl font-bold md:text-2xl">Trading Configurations</h2>
        <p className="text-sm text-muted-foreground md:text-base">
          Configure your trade settings, fees, and refund addresses. These settings are applied on your transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Token List */}
        <Card>
          <CardHeader>
            <CardTitle>Available Tokens</CardTitle>
            <CardDescription>
              Select a token to configure its trading settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tokens.map((token) => {
                const hasConfig = token.sender_order_tokens.length > 0;
                const isSelected = selectedToken?.id === token.id;
                
                return (
                  <div
                    key={token.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{token.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            Base (Chain ID: 8453)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {hasConfig && (
                          <Badge variant="secondary" className="text-xs">
                            Configured
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {token.symbol}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedToken ? `${selectedToken.symbol} Configuration` : 'Select a Token'}
            </CardTitle>
            <CardDescription>
              {selectedToken 
                ? 'Configure addresses for fee collection and refunds.'
                : 'Choose a token from the list to configure its settings.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedToken ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feePercent">Fee Percent</Label>
                  <Input
                    id="feePercent"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={config.feePercent}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      feePercent: parseFloat(e.target.value) || 0 
                    }))}
                    placeholder="0.5"
                  />
                  <p className="text-xs text-muted-foreground">
                    Percentage fee to charge (0-100%)
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Wallet Addresses</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure addresses for fee collection and refunds.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="feeAddress">Fee Address</Label>
                    <Input
                      id="feeAddress"
                      value={config.feeAddress}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        feeAddress: e.target.value 
                      }))}
                      placeholder="0x037Eb04A5DDDF4F84F4De50419D4b8Fa3794459"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refundAddress">Refund Address</Label>
                    <Input
                      id="refundAddress"
                      value={config.refundAddress}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        refundAddress: e.target.value 
                      }))}
                      placeholder="0x037Eb04A5DDDF4F84F4De50419D4b8Fa3794459"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:space-x-2">
                  <Button 
                    onClick={handleSaveConfiguration}
                    disabled={saving === selectedToken.id}
                    className="w-full flex-1 sm:w-auto"
                  >
                    {saving === selectedToken.id ? 'Saving...' : 'Update'}
                  </Button>
                  
                  {selectedToken.sender_order_tokens.length > 0 && (
                    <Button 
                      variant="outline"
                      onClick={() => handleDeleteConfiguration(selectedToken)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select a token from the list to configure its trading settings
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
