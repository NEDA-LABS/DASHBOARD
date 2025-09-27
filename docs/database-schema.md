# Database Schema Documentation

## Overview
This document outlines the database schema for the NEDA Integration Dashboard, an onramp and offramp rails API dashboard for developers.

## Supabase Auth Schema

### auth.users (Built-in Supabase Table)
The main authentication table provided by Supabase Auth.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Primary key, user identifier | PRIMARY KEY, NOT NULL |
| aud | varchar | Audience claim | |
| role | varchar | User role | |
| email | varchar | User email address | UNIQUE, NOT NULL |
| encrypted_password | varchar | Encrypted password | |
| email_confirmed_at | timestamptz | Email confirmation timestamp | |
| invited_at | timestamptz | User invitation timestamp | |
| confirmation_token | varchar | Email confirmation token | |
| confirmation_sent_at | timestamptz | Confirmation email sent timestamp | |
| recovery_token | varchar | Password recovery token | |
| recovery_sent_at | timestamptz | Recovery email sent timestamp | |
| email_change_token_new | varchar | New email change token | |
| email_change | varchar | New email address during change | |
| email_change_sent_at | timestamptz | Email change notification sent timestamp | |
| last_sign_in_at | timestamptz | Last successful sign-in timestamp | |
| raw_app_meta_data | jsonb | Application metadata | |
| raw_user_meta_data | jsonb | User metadata (custom fields) | |
| is_super_admin | boolean | Super admin flag | |
| created_at | timestamptz | Account creation timestamp | NOT NULL |
| updated_at | timestamptz | Last update timestamp | NOT NULL |
| phone | text | Phone number | |
| phone_confirmed_at | timestamptz | Phone confirmation timestamp | |
| phone_change | text | New phone number during change | |
| phone_change_token | varchar | Phone change token | |
| phone_change_sent_at | timestamptz | Phone change notification sent timestamp | |
| confirmed_at | timestamptz | Account confirmation timestamp | |
| email_change_token_current | varchar | Current email change token | |
| email_change_confirm_status | smallint | Email change confirmation status | |
| banned_until | timestamptz | Account ban expiration | |
| reauthentication_token | varchar | Reauthentication token | |
| reauthentication_sent_at | timestamptz | Reauthentication sent timestamp | |
| is_sso_user | boolean | SSO user flag | NOT NULL, DEFAULT false |
| deleted_at | timestamptz | Soft delete timestamp | |
| is_anonymous | boolean | Anonymous user flag | NOT NULL, DEFAULT false |

### Custom User Metadata Fields
These fields are stored in the `raw_user_meta_data` jsonb column:

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| display_name | string | Full name (first + last) | Yes |
| first_name | string | User's first name | Yes |
| last_name | string | User's last name | Yes |
| business_type | string | Type of business: "sender" or "provider" | Yes |

## Custom Tables

### public.user_profiles
Extended user profile information beyond what's stored in auth.users.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Primary key, references auth.users.id | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE |
| business_type | varchar(20) | Type of business: 'sender' or 'provider' | NOT NULL, CHECK (business_type IN ('sender', 'provider')) |
| company_name | varchar(255) | Company/organization name | |
| website | varchar(255) | Company website URL | |
| phone | varchar(20) | Business phone number | |
| address | text | Business address | |
| country | varchar(100) | Country of operation | |
| verification_status | varchar(20) | Account verification status | DEFAULT 'pending', CHECK (verification_status IN ('pending', 'verified', 'rejected')) |
| api_key | varchar(255) | API key for dashboard access | UNIQUE |
| api_secret | varchar(255) | API secret (hashed) | |
| created_at | timestamptz | Profile creation timestamp | DEFAULT NOW() |
| updated_at | timestamptz | Last update timestamp | DEFAULT NOW() |

### public.api_keys
API key management for developers.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Primary key | PRIMARY KEY, DEFAULT gen_random_uuid() |
| user_id | uuid | References user_profiles.id | NOT NULL, REFERENCES user_profiles(id) ON DELETE CASCADE |
| key_name | varchar(100) | Descriptive name for the API key | NOT NULL |
| api_key | varchar(255) | The actual API key | UNIQUE, NOT NULL |
| api_secret_hash | varchar(255) | Hashed API secret | NOT NULL |
| permissions | jsonb | API permissions and scopes | DEFAULT '{}' |
| is_active | boolean | Whether the key is active | DEFAULT true |
| last_used_at | timestamptz | Last usage timestamp | |
| expires_at | timestamptz | Key expiration timestamp | |
| created_at | timestamptz | Key creation timestamp | DEFAULT NOW() |
| updated_at | timestamptz | Last update timestamp | DEFAULT NOW() |

### public.transactions
Transaction records for onramp/offramp operations.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Primary key | PRIMARY KEY, DEFAULT gen_random_uuid() |
| user_id | uuid | References user_profiles.id | NOT NULL, REFERENCES user_profiles(id) |
| transaction_type | varchar(20) | 'onramp' or 'offramp' | NOT NULL, CHECK (transaction_type IN ('onramp', 'offramp')) |
| status | varchar(20) | Transaction status | NOT NULL, DEFAULT 'pending' |
| amount | decimal(20,8) | Transaction amount | NOT NULL, CHECK (amount > 0) |
| currency | varchar(10) | Currency code (USD, EUR, etc.) | NOT NULL |
| crypto_currency | varchar(20) | Cryptocurrency code (BTC, ETH, etc.) | NOT NULL |
| crypto_amount | decimal(20,8) | Cryptocurrency amount | |
| exchange_rate | decimal(20,8) | Exchange rate at time of transaction | |
| fees | decimal(20,8) | Transaction fees | DEFAULT 0 |
| external_transaction_id | varchar(255) | External provider transaction ID | |
| provider_name | varchar(100) | Payment provider name | |
| created_at | timestamptz | Transaction creation timestamp | DEFAULT NOW() |
| updated_at | timestamptz | Last update timestamp | DEFAULT NOW() |
| completed_at | timestamptz | Transaction completion timestamp | |

### public.audit_logs
Audit trail for important system events.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Primary key | PRIMARY KEY, DEFAULT gen_random_uuid() |
| user_id | uuid | References user_profiles.id | REFERENCES user_profiles(id) |
| action | varchar(100) | Action performed | NOT NULL |
| resource_type | varchar(50) | Type of resource affected | |
| resource_id | varchar(255) | ID of the affected resource | |
| details | jsonb | Additional details about the action | DEFAULT '{}' |
| ip_address | inet | IP address of the user | |
| user_agent | text | User agent string | |
| created_at | timestamptz | Log entry timestamp | DEFAULT NOW() |

## Indexes

### Performance Indexes
```sql
-- User profiles
CREATE INDEX idx_user_profiles_business_type ON public.user_profiles(business_type);
CREATE INDEX idx_user_profiles_verification_status ON public.user_profiles(verification_status);
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);

-- API keys
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_is_active ON public.api_keys(is_active);
CREATE INDEX idx_api_keys_expires_at ON public.api_keys(expires_at);

-- Transactions
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_transactions_currency ON public.transactions(currency);

-- Audit logs
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
```

## Row Level Security (RLS) Policies

### user_profiles
- Users can only view and update their own profile
- Admins can view all profiles

### api_keys
- Users can only manage their own API keys
- Admins can view all API keys

### transactions
- Users can only view their own transactions
- Admins can view all transactions

### audit_logs
- Users can only view their own audit logs
- Admins can view all audit logs

## Triggers

### Updated At Triggers
Automatically update the `updated_at` timestamp when records are modified:

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at column
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Data Migration Notes

1. The `business_type` field will be populated from the sign-up form
2. The `display_name` in auth.users metadata will be set to `first_name + " " + last_name`
3. Existing users (if any) will need to have their business_type set manually or through a migration script
4. API keys should be generated automatically upon profile creation for verified users

## Security Considerations

1. All API secrets should be hashed using bcrypt or similar
2. API keys should be generated using cryptographically secure random generators
3. Sensitive data should be encrypted at rest
4. All database connections should use SSL/TLS
5. Regular security audits should be performed on the audit_logs table
