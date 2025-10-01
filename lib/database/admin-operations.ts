// Admin Database Operations for NEDA Integration Dashboard
// Comprehensive CRUD operations for admin functionality
// Uses service role key to bypass RLS policies

import { createAdminClient } from '@/lib/supabase/admin';
import type { 
  AdminDashboardStats,
  AdminFilters,
  PaginationParams,
  UserWithProfiles,
  ProviderProfile,
  SenderProfile,
  PaymentOrder,
  FiatCurrency,
  Token,
  AdminAction
} from '@/lib/types/admin';
import type { AuditLog } from '@/lib/types/database';

// Dashboard Statistics
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = createAdminClient();

  try {
    // Get user statistics with better error handling
    const { data: userStats, error: userError, count: userCount } = await supabase
      .from('user_profiles')
      .select('verification_status, business_type', { count: 'exact' });
    
    if (userError) {
      console.error('Error fetching user stats:', userError);
      console.error('Error details:', JSON.stringify(userError, null, 2));
    }
    
    console.log('User stats query result:', { 
      dataLength: userStats?.length, 
      count: userCount,
      error: userError 
    });

    // Get provider statistics
    const { data: providerStats, error: providerError } = await supabase
      .from('provider_profiles')
      .select('is_active, is_kyb_verified');
    
    if (providerError) {
      console.error('Error fetching provider stats:', providerError);
    }

    // Get sender statistics
    const { data: senderStats, error: senderError } = await supabase
      .from('sender_profiles')
      .select('is_active');
    
    if (senderError) {
      console.error('Error fetching sender stats:', senderError);
    }

    // Get payment order statistics
    const { data: orderStats, error: orderError } = await supabase
      .from('payment_orders')
      .select('status, amount_in_usd, created_at');
    
    if (orderError) {
      console.error('Error fetching order stats:', orderError);
    }

    // Get transaction statistics
    const { data: transactionStats, error: transactionError } = await supabase
      .from('transactions')
      .select('status, amount, created_at');
    
    if (transactionError) {
      console.error('Error fetching transaction stats:', transactionError);
    }

    // Get token and currency counts
    const { error: tokenError, count: tokenCount } = await supabase
      .from('tokens')
      .select('id', { count: 'exact' })
      .eq('is_enabled', true);
    
    if (tokenError) {
      console.error('Error fetching token count:', tokenError);
    }

    const { error: currencyError, count: currencyCount } = await supabase
      .from('fiat_currencies')
      .select('id', { count: 'exact' })
      .eq('is_enabled', true);
    
    if (currencyError) {
      console.error('Error fetching currency count:', currencyError);
    }

    // Calculate statistics
    const totalUsers = userStats?.length || 0;
    const verifiedUsers = userStats?.filter(u => u.verification_status === 'verified').length || 0;
    const pendingVerification = userStats?.filter(u => u.verification_status === 'pending').length || 0;
    
    const totalProviders = providerStats?.length || 0;
    const activeProviders = providerStats?.filter(p => p.is_active).length || 0;
    
    const totalSenders = senderStats?.length || 0;
    const activeSenders = senderStats?.filter(s => s.is_active).length || 0;
    
    const totalPaymentOrders = orderStats?.length || 0;
    const completedOrders = orderStats?.filter(o => o.status === 'completed').length || 0;
    const pendingOrders = orderStats?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0;
    const failedOrders = orderStats?.filter(o => o.status === 'failed' || o.status === 'cancelled').length || 0;
    
    const totalVolumeUsd = orderStats?.reduce((sum, o) => sum + (o.amount_in_usd || 0), 0) || 0;
    
    // Calculate monthly statistics
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlyOrders = orderStats?.filter(o => new Date(o.created_at) >= currentMonth) || [];
    const monthlyVolumeUsd = monthlyOrders.reduce((sum, o) => sum + (o.amount_in_usd || 0), 0);
    
    const totalTransactions = transactionStats?.length || 0;
    const monthlyTransactions = transactionStats?.filter(t => new Date(t.created_at) >= currentMonth).length || 0;

    const stats = {
      total_users: totalUsers,
      verified_users: verifiedUsers,
      pending_verification: pendingVerification,
      total_providers: totalProviders,
      active_providers: activeProviders,
      total_senders: totalSenders,
      active_senders: activeSenders,
      total_payment_orders: totalPaymentOrders,
      completed_orders: completedOrders,
      pending_orders: pendingOrders,
      failed_orders: failedOrders,
      total_volume_usd: totalVolumeUsd,
      monthly_volume_usd: monthlyVolumeUsd,
      total_transactions: totalTransactions,
      monthly_transactions: monthlyTransactions,
      active_tokens: tokenCount || 0,
      active_currencies: currencyCount || 0,
      webhook_success_rate: 0.95 // TODO: Calculate from webhook_retry_attempts
    };
    
    console.log('Final admin stats:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    throw error;
  }
}

// User Management Operations
export async function getAllUsersWithProfiles(
  filters: AdminFilters = {},
  pagination: PaginationParams = { page: 1, limit: 50 }
): Promise<{ data: UserWithProfiles[]; count: number }> {
  const supabase = createAdminClient();

  try {
    let query = supabase
      .from('user_profiles')
      .select(`
        *,
        sender_profiles(*),
        provider_profiles(*),
        api_keys(*),
        transactions(*)
      `, { count: 'exact' });

    // Apply filters
    if (filters.verification_status?.length) {
      query = query.in('verification_status', filters.verification_status);
    }
    if (filters.business_type?.length) {
      query = query.in('business_type', filters.business_type);
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters.search) {
      query = query.or(`company_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    // Apply pagination and sorting
    const offset = (pagination.page - 1) * pagination.limit;
    query = query
      .range(offset, offset + pagination.limit - 1)
      .order(pagination.sort_by || 'created_at', { ascending: pagination.sort_order === 'asc' });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as UserWithProfiles[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching users with profiles:', error);
    throw error;
  }
}

export async function updateUserVerificationStatus(
  userId: string,
  status: 'pending' | 'verified' | 'rejected',
  adminId: string,
  reason?: string
): Promise<void> {
  const supabase = createAdminClient();

  try {
    // Update user verification status
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        verification_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Log the admin action
    await logAdminAction({
      type: status === 'verified' ? 'verify_user' : 'reject_user',
      user_id: userId,
      admin_id: adminId,
      reason,
      metadata: { new_status: status }
    });

  } catch (error) {
    console.error('Error updating user verification status:', error);
    throw error;
  }
}

// Sender Profile Management
export async function grantSenderProfile(
  userId: string,
  adminId: string,
  profileData: Partial<SenderProfile> = {}
): Promise<SenderProfile> {
  const supabase = createAdminClient();

  try {
    // Check if user already has a sender profile
    const { data: existingProfile } = await supabase
      .from('sender_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      throw new Error('User already has a sender profile');
    }

    // Create sender profile
    const { data, error } = await supabase
      .from('sender_profiles')
      .insert({
        user_id: userId,
        is_active: true,
        is_partner: false,
        domain_whitelist: [],
        updated_at: new Date().toISOString(),
        ...profileData
      })
      .select()
      .single();

    if (error) throw error;

    // Log the admin action
    await logAdminAction({
      type: 'grant_sender_profile',
      user_id: userId,
      admin_id: adminId,
      metadata: { profile_id: data.id }
    });

    return data as SenderProfile;
  } catch (error) {
    console.error('Error granting sender profile:', error);
    throw error;
  }
}

export async function revokeSenderProfile(
  userId: string,
  adminId: string,
  reason?: string
): Promise<void> {
  const supabase = createAdminClient();

  try {
    // Deactivate sender profile instead of deleting
    const { error } = await supabase
      .from('sender_profiles')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;

    // Log the admin action
    await logAdminAction({
      type: 'revoke_sender_profile',
      user_id: userId,
      admin_id: adminId,
      reason,
      metadata: { action: 'deactivated' }
    });

  } catch (error) {
    console.error('Error revoking sender profile:', error);
    throw error;
  }
}

// Provider Profile Management
export async function grantProviderProfile(
  userId: string,
  adminId: string,
  profileData: Partial<ProviderProfile> = {}
): Promise<ProviderProfile> {
  const supabase = createAdminClient();

  try {
    // Check if user already has a provider profile
    const { data: existingProfile } = await supabase
      .from('provider_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      throw new Error('User already has a provider profile');
    }

    // Generate unique provider ID
    const providerId = `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create provider profile
    const { data, error } = await supabase
      .from('provider_profiles')
      .insert({
        id: providerId,
        user_id: userId,
        is_active: true,
        is_kyb_verified: false,
        provision_mode: 'auto',
        visibility_mode: 'public',
        updated_at: new Date().toISOString(),
        ...profileData
      })
      .select()
      .single();

    if (error) throw error;

    // Log the admin action
    await logAdminAction({
      type: 'grant_provider_profile',
      user_id: userId,
      admin_id: adminId,
      metadata: { profile_id: data.id }
    });

    return data as ProviderProfile;
  } catch (error) {
    console.error('Error granting provider profile:', error);
    throw error;
  }
}

export async function revokeProviderProfile(
  userId: string,
  adminId: string,
  reason?: string
): Promise<void> {
  const supabase = createAdminClient();

  try {
    // Deactivate provider profile instead of deleting
    const { error } = await supabase
      .from('provider_profiles')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;

    // Log the admin action
    await logAdminAction({
      type: 'revoke_provider_profile',
      user_id: userId,
      admin_id: adminId,
      reason,
      metadata: { action: 'deactivated' }
    });

  } catch (error) {
    console.error('Error revoking provider profile:', error);
    throw error;
  }
}

// Payment Orders Management
export async function getPaymentOrders(
  filters: AdminFilters = {},
  pagination: PaginationParams = { page: 1, limit: 50 }
): Promise<{ data: PaymentOrder[]; count: number }> {
  const supabase = createAdminClient();

  try {
    let query = supabase
      .from('payment_orders')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.status?.length) {
      query = query.in('status', filters.status);
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    // Apply pagination and sorting
    const offset = (pagination.page - 1) * pagination.limit;
    query = query
      .range(offset, offset + pagination.limit - 1)
      .order(pagination.sort_by || 'created_at', { ascending: pagination.sort_order === 'asc' });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as PaymentOrder[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching payment orders:', error);
    throw error;
  }
}

// System Configuration Management
export async function getFiatCurrencies(): Promise<FiatCurrency[]> {
  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase
      .from('fiat_currencies')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as FiatCurrency[];
  } catch (error) {
    console.error('Error fetching fiat currencies:', error);
    throw error;
  }
}

export async function updateCurrencyStatus(
  currencyId: string,
  isEnabled: boolean,
  adminId: string
): Promise<void> {
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('fiat_currencies')
      .update({ 
        is_enabled: isEnabled,
        updated_at: new Date().toISOString()
      })
      .eq('id', currencyId);

    if (error) throw error;

    // Log the admin action
    await logAdminAction({
      type: isEnabled ? 'enable_currency' : 'disable_currency',
      user_id: currencyId,
      admin_id: adminId,
      metadata: { currency_id: currencyId, enabled: isEnabled }
    });

  } catch (error) {
    console.error('Error updating currency status:', error);
    throw error;
  }
}

export async function getTokens(): Promise<Token[]> {
  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .order('symbol');

    if (error) throw error;
    return data as Token[];
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
}

export async function updateTokenStatus(
  tokenId: string,
  isEnabled: boolean,
  adminId: string
): Promise<void> {
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('tokens')
      .update({ 
        is_enabled: isEnabled,
        updated_at: new Date().toISOString()
      })
      .eq('id', tokenId);

    if (error) throw error;

    // Log the admin action
    await logAdminAction({
      type: isEnabled ? 'enable_token' : 'disable_token',
      user_id: tokenId,
      admin_id: adminId,
      metadata: { token_id: tokenId, enabled: isEnabled }
    });

  } catch (error) {
    console.error('Error updating token status:', error);
    throw error;
  }
}

// Audit and Logging
export async function getAuditLogs(
  filters: AdminFilters = {},
  pagination: PaginationParams = { page: 1, limit: 50 }
): Promise<{ data: AuditLog[]; count: number }> {
  const supabase = createAdminClient();

  try {
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters.search) {
      query = query.or(`action.ilike.%${filters.search}%,resource_type.ilike.%${filters.search}%`);
    }

    // Apply pagination and sorting
    const offset = (pagination.page - 1) * pagination.limit;
    query = query
      .range(offset, offset + pagination.limit - 1)
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data as AuditLog[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
}

export async function logAdminAction(action: AdminAction): Promise<void> {
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: action.admin_id,
        action: action.type,
        resource_type: 'admin_action',
        resource_id: action.user_id,
        details: {
          action_type: action.type,
          target_user_id: action.user_id,
          reason: action.reason,
          ...action.metadata
        },
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging admin action:', error);
    throw error;
  }
}

// Export utility functions
export async function exportData(
  table: string,
  filters: AdminFilters = {}
): Promise<unknown[]> {
  const supabase = createAdminClient();

  try {
    let query = supabase.from(table).select('*');

    // Apply basic filters
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error exporting data from ${table}:`, error);
    throw error;
  }
}
