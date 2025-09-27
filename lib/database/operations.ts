// Database Operations Utility
// Centralized database operations for the NEDA Integration Dashboard

import { createClient } from '@/lib/supabase/client';
import type { 
  Database, 
  UserProfile, 
  UserProfileInsert, 
  UserProfileUpdate,
  ApiKey,
  ApiKeyInsert,
  Transaction,
  TransactionInsert,
  AuditLog,
  AuditLogInsert,
  BusinessType,
  VerificationStatus,
  TransactionFilters,
  PaginatedResponse
} from '@/lib/types/database';

const supabase = createClient();

// User Profile Operations
export class UserProfileService {
  static async create(profile: UserProfileInsert) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getById(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }
    return data;
  }

  static async update(id: string, updates: UserProfileUpdate) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getByBusinessType(businessType: BusinessType) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('business_type', businessType);
    
    if (error) throw error;
    return data;
  }

  static async getByVerificationStatus(status: VerificationStatus) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('verification_status', status);
    
    if (error) throw error;
    return data;
  }
}

// API Key Operations
export class ApiKeyService {
  static async create(apiKey: ApiKeyInsert) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert(apiKey)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getByUserId(userId: string): Promise<ApiKey[]> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getByApiKey(apiKey: string): Promise<ApiKey | null> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  static async deactivate(id: string) {
    const { data, error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateLastUsed(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Transaction Operations
export class TransactionService {
  static async create(transaction: TransactionInsert) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  static async getByUserId(
    userId: string, 
    filters?: TransactionFilters,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Transaction>> {
    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (filters) {
      if (filters.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters.type?.length) {
        query = query.in('transaction_type', filters.type);
      }
      if (filters.currency?.length) {
        query = query.in('currency', filters.currency);
      }
      if (filters.crypto_currency?.length) {
        query = query.in('crypto_currency', filters.crypto_currency);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      if (filters.amount_min !== undefined) {
        query = query.gte('amount', filters.amount_min);
      }
      if (filters.amount_max !== undefined) {
        query = query.lte('amount', filters.amount_max);
      }
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit)
    };
  }

  static async updateStatus(id: string, status: string, completedAt?: string) {
    const updates: any = { status };
    if (completedAt) {
      updates.completed_at = completedAt;
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getStats(userId: string) {
    const { data, error } = await supabase
      .rpc('get_user_transaction_stats', { user_id: userId });
    
    if (error) throw error;
    return data;
  }
}

// Audit Log Operations
export class AuditLogService {
  static async create(auditLog: AuditLogInsert) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert(auditLog)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getByUserId(
    userId: string,
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<AuditLog>> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      data: data || [],
      count: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit)
    };
  }

  static async logAction(
    userId: string,
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ) {
    return this.create({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: details || {},
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }
}

// Utility functions
export class DatabaseUtils {
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;
    
    return UserProfileService.getById(user.id);
  }

  static async ensureUserProfile(userId: string, businessType: BusinessType) {
    const existingProfile = await UserProfileService.getById(userId);
    
    if (!existingProfile) {
      return UserProfileService.create({
        id: userId,
        business_type: businessType
      });
    }
    
    return existingProfile;
  }

  static generateApiKey(): string {
    const prefix = 'neda_';
    const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return prefix + randomPart;
  }

  static async hashApiSecret(secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async verifyApiSecret(secret: string, hash: string): Promise<boolean> {
    const secretHash = await this.hashApiSecret(secret);
    return secretHash === hash;
  }
}

// Export all services
export {
  UserProfileService,
  ApiKeyService,
  TransactionService,
  AuditLogService,
  DatabaseUtils
};
