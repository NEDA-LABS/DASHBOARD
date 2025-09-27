// Database Types for NEDA Integration Dashboard
// Generated from database schema - keep in sync with migrations

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: UserProfileInsert;
        Update: UserProfileUpdate;
      };
      api_keys: {
        Row: ApiKey;
        Insert: ApiKeyInsert;
        Update: ApiKeyUpdate;
      };
      transactions: {
        Row: Transaction;
        Insert: TransactionInsert;
        Update: TransactionUpdate;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: AuditLogInsert;
        Update: AuditLogUpdate;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      business_type: 'sender' | 'provider';
      verification_status: 'pending' | 'verified' | 'rejected';
      transaction_type: 'onramp' | 'offramp';
      transaction_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    };
  };
}

// User Profile Types
export interface UserProfile {
  id: string; // UUID, references auth.users.id
  business_type: 'sender' | 'provider';
  company_name?: string;
  website?: string;
  phone?: string;
  address?: string;
  country?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  api_key?: string;
  api_secret?: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface UserProfileInsert {
  id: string;
  business_type: 'sender' | 'provider';
  company_name?: string;
  website?: string;
  phone?: string;
  address?: string;
  country?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  api_key?: string;
  api_secret?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileUpdate {
  business_type?: 'sender' | 'provider';
  company_name?: string;
  website?: string;
  phone?: string;
  address?: string;
  country?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  api_key?: string;
  api_secret?: string;
  updated_at?: string;
}

// API Key Types
export interface ApiKey {
  id: string; // UUID
  user_id: string; // UUID, references user_profiles.id
  key_name: string;
  api_key: string;
  api_secret_hash: string;
  permissions: Record<string, any>; // JSONB
  is_active: boolean;
  last_used_at?: string; // ISO timestamp
  expires_at?: string; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface ApiKeyInsert {
  id?: string;
  user_id: string;
  key_name: string;
  api_key: string;
  api_secret_hash: string;
  permissions?: Record<string, any>;
  is_active?: boolean;
  last_used_at?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiKeyUpdate {
  key_name?: string;
  api_key?: string;
  api_secret_hash?: string;
  permissions?: Record<string, any>;
  is_active?: boolean;
  last_used_at?: string;
  expires_at?: string;
  updated_at?: string;
}

// Transaction Types
export interface Transaction {
  id: string; // UUID
  user_id: string; // UUID, references user_profiles.id
  transaction_type: 'onramp' | 'offramp';
  status: string; // e.g., 'pending', 'processing', 'completed', 'failed', 'cancelled'
  amount: number; // Decimal
  currency: string; // e.g., 'USD', 'EUR'
  crypto_currency: string; // e.g., 'BTC', 'ETH'
  crypto_amount?: number; // Decimal
  exchange_rate?: number; // Decimal
  fees: number; // Decimal
  external_transaction_id?: string;
  provider_name?: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  completed_at?: string; // ISO timestamp
}

export interface TransactionInsert {
  id?: string;
  user_id: string;
  transaction_type: 'onramp' | 'offramp';
  status?: string;
  amount: number;
  currency: string;
  crypto_currency: string;
  crypto_amount?: number;
  exchange_rate?: number;
  fees?: number;
  external_transaction_id?: string;
  provider_name?: string;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
}

export interface TransactionUpdate {
  transaction_type?: 'onramp' | 'offramp';
  status?: string;
  amount?: number;
  currency?: string;
  crypto_currency?: string;
  crypto_amount?: number;
  exchange_rate?: number;
  fees?: number;
  external_transaction_id?: string;
  provider_name?: string;
  updated_at?: string;
  completed_at?: string;
}

// Audit Log Types
export interface AuditLog {
  id: string; // UUID
  user_id?: string; // UUID, references user_profiles.id
  action: string;
  resource_type?: string;
  resource_id?: string;
  details: Record<string, any>; // JSONB
  ip_address?: string;
  user_agent?: string;
  created_at: string; // ISO timestamp
}

export interface AuditLogInsert {
  id?: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface AuditLogUpdate {
  action?: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

// Auth User Metadata Types (stored in auth.users.raw_user_meta_data)
export interface UserMetadata {
  display_name: string; // Full name (first + last)
  first_name: string;
  last_name: string;
  business_type: 'sender' | 'provider';
}

// Utility Types
export type BusinessType = 'sender' | 'provider';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type TransactionType = 'onramp' | 'offramp';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Dashboard Statistics Types
export interface DashboardStats {
  total_transactions: number;
  total_volume: number;
  pending_transactions: number;
  completed_transactions: number;
  failed_transactions: number;
  monthly_volume: number;
  monthly_transactions: number;
}

// API Key Permissions
export interface ApiKeyPermissions {
  transactions: {
    read: boolean;
    write: boolean;
  };
  profile: {
    read: boolean;
    write: boolean;
  };
  api_keys: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  webhooks: {
    read: boolean;
    write: boolean;
  };
}

// Transaction Filters
export interface TransactionFilters {
  status?: TransactionStatus[];
  type?: TransactionType[];
  currency?: string[];
  crypto_currency?: string[];
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
}

// Form Types for Sign Up
export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessType: BusinessType;
  consentChecked: boolean;
}

// Supabase Client Types
export type SupabaseClient = import('@supabase/supabase-js').SupabaseClient<Database>;

// Export the main Database type as default
export default Database;
