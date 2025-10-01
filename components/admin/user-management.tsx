"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Search,
  UserCheck,
  Building2,
  Send,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import type { UserWithProfiles, AdminFilters } from '@/lib/types/admin';

interface UserManagementProps {
  initialUsers?: UserWithProfiles[];
  initialCount?: number;
}

export function UserManagement({ initialUsers = [] }: UserManagementProps) {
  const [users, setUsers] = useState<UserWithProfiles[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProfiles | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [grantType, setGrantType] = useState<'sender' | 'provider'>('sender');
  const [verificationReason, setVerificationReason] = useState('');
  const [filters, setFilters] = useState<AdminFilters>({});
  // TODO: Implement pagination
  // const [pagination, setPagination] = useState<PaginationParams>({
  //   page: 1,
  //   limit: 50,
  //   sort_by: 'created_at',
  //   sort_order: 'desc'
  // });

  // Mock data for development - replace with actual API calls
  useEffect(() => {
    if (initialUsers.length === 0) {
      // Load mock data
      const mockUsers: UserWithProfiles[] = [
        {
          id: '1',
          business_type: 'sender',
          company_name: 'Acme Corp',
          website: 'https://acme.com',
          phone: '+1234567890',
          address: '123 Main St, City, Country',
          country: 'US',
          verification_status: 'pending',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          sender_profile: undefined,
          provider_profile: undefined,
          api_keys: [],
          transactions: []
        },
        {
          id: '2',
          business_type: 'provider',
          company_name: 'Global Payments Ltd',
          website: 'https://globalpay.com',
          phone: '+1987654321',
          address: '456 Business Ave, Metro, Country',
          country: 'UK',
          verification_status: 'verified',
          created_at: '2024-01-10T08:30:00Z',
          updated_at: '2024-01-20T14:15:00Z',
          sender_profile: undefined,
          provider_profile: {
            id: 'provider_123',
            user_id: '2',
            trading_name: 'Global Payments',
            host_identifier: 'globalpay',
            provision_mode: 'auto',
            is_active: true,
            is_kyb_verified: true,
            visibility_mode: 'public',
            updated_at: '2024-01-20T14:15:00Z'
          },
          api_keys: [],
          transactions: []
        }
      ];
      setUsers(mockUsers);
    }
  }, [initialUsers]);

  const handleVerifyUser = async (status: 'verified' | 'rejected') => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await updateUserVerificationStatus(selectedUser.id, status, 'admin_id', verificationReason);
      
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, verification_status: status }
          : user
      ));
      
      toast.success(`User ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
      setShowVerifyDialog(false);
      setVerificationReason('');
      setSelectedUser(null);
    } catch {
      toast.error('Failed to update user verification status');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantProfile = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      if (grantType === 'sender') {
        // await grantSenderProfile(selectedUser.id, 'admin_id');
      } else {
        // await grantProviderProfile(selectedUser.id, 'admin_id');
      }
      
      toast.success(`${grantType} profile granted successfully`);
      setShowGrantDialog(false);
      setSelectedUser(null);
    } catch {
      toast.error(`Failed to grant ${grantType} profile`);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const getProfileBadges = (user: UserWithProfiles) => {
    const badges = [];
    if (user.sender_profile) {
      badges.push(
        <Badge key="sender" variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Send className="w-3 h-3 mr-1" />Sender
        </Badge>
      );
    }
    if (user.provider_profile) {
      badges.push(
        <Badge key="provider" variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Building2 className="w-3 h-3 mr-1" />Provider
        </Badge>
      );
    }
    return badges;
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Filters</CardTitle>
          <CardDescription>Search and filter user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by company name, email..."
                  className="pl-10"
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <Select
              value={filters.verification_status?.[0] || 'all'}
              onValueChange={(value) => 
                setFilters({ 
                  ...filters, 
                  verification_status: value === 'all' ? undefined : [value] 
                })
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Verification Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.business_type?.[0] || 'all'}
              onValueChange={(value) => 
                setFilters({ 
                  ...filters, 
                  business_type: value === 'all' ? undefined : [value] 
                })
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sender">Sender</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
          <CardDescription>Manage user accounts and verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Business Type</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Profiles</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.company_name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{user.website}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.business_type === 'sender' ? <Send className="w-3 h-3 mr-1" /> : <Building2 className="w-3 h-3 mr-1" />}
                      {user.business_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>{getVerificationStatusBadge(user.verification_status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {getProfileBadges(user)}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {user.verification_status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowVerifyDialog(true);
                          }}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowGrantDialog(true);
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify User</DialogTitle>
            <DialogDescription>
              Update the verification status for {selectedUser?.company_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for verification decision..."
                value={verificationReason}
                onChange={(e) => setVerificationReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleVerifyUser('rejected')}
              disabled={loading}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => handleVerifyUser('verified')}
              disabled={loading}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grant Profile Dialog */}
      <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Profile</DialogTitle>
            <DialogDescription>
              Grant a sender or provider profile to {selectedUser?.company_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Profile Type</Label>
              <Select value={grantType} onValueChange={(value: 'sender' | 'provider') => setGrantType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sender">Sender Profile</SelectItem>
                  <SelectItem value="provider">Provider Profile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGrantDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGrantProfile} disabled={loading}>
              Grant {grantType} Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
