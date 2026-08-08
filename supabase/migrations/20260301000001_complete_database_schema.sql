-- ============================================
-- VoucherX Complete Database Schema
-- Phase 1, Task 1.1: Execute all tables from DATABASE_QUERIES.md
-- Creates all 10 tables in dependency order with RLS policies and indexes
-- ============================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES TABLE (already exists via trigger, ensure schema)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  username text UNIQUE NOT NULL,
  avatar_url text,
  rating decimal(3,2) DEFAULT 0.00,
  total_trades integer DEFAULT 0,
  voucher_coins integer DEFAULT 100,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VOUCHERS TABLE (Marketplace Items)
-- ============================================
CREATE TABLE IF NOT EXISTS vouchers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  brand_name text NOT NULL,
  category text NOT NULL,
  original_value decimal(10,2) NOT NULL,
  selling_price decimal(10,2) NOT NULL,
  discount_percentage decimal(5,2) GENERATED ALWAYS AS (
    ROUND(((original_value - selling_price) / original_value * 100)::numeric, 2)
  ) STORED,
  voucher_code text NOT NULL,
  expiry_date date NOT NULL,
  status text DEFAULT 'pending_verification'
    CHECK (status IN ('pending_verification', 'verified', 'active', 'sold', 'expired')),
  is_verified boolean DEFAULT false,
  proof_url text,
  description text,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TRADES TABLE (User Exchanges)
-- ============================================
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  initiator_voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
  recipient_voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE,
  status text DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  match_score decimal(5,2),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TRANSACTIONS TABLE (Purchase History)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  commission decimal(10,2) GENERATED ALWAYS AS (
    ROUND((amount * 0.02)::numeric, 2)
  ) STORED,
  status text DEFAULT 'pending'
    CHECK (status IN ('pending', 'escrow', 'completed', 'refunded', 'disputed')),
  payment_method text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER_VOUCHERS TABLE (User Wallet)
-- ============================================
CREATE TABLE IF NOT EXISTS user_vouchers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
  acquisition_type text CHECK (acquisition_type IN ('bought', 'traded', 'received')),
  is_redeemed boolean DEFAULT false,
  redeemed_at timestamptz,
  acquired_at timestamptz DEFAULT now()
);

ALTER TABLE user_vouchers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RATINGS TABLE (User Reviews)
-- ============================================
CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id uuid REFERENCES trades(id) ON DELETE CASCADE,
  rater_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rated_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  review text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trade_id, rater_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CHALLENGES TABLE (Gamification)
-- ============================================
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL
    CHECK (challenge_type IN ('daily', 'weekly', 'monthly', 'milestone')),
  reward_coins integer NOT NULL,
  requirement jsonb NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  is_active boolean DEFAULT true
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER_CHALLENGES TABLE (Progress Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS user_challenges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

-- ============================================
-- WISHLISTS TABLE (already exists via migration, ensure schema)
-- ============================================
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  brand_name text NOT NULL,
  category text,
  max_price decimal(10,2),
  notify boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- ============================================
-- NOTIFICATIONS TABLE (User Alerts)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_vouchers_seller ON vouchers(seller_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_status ON vouchers(status);
CREATE INDEX IF NOT EXISTS idx_vouchers_category ON vouchers(category);
CREATE INDEX IF NOT EXISTS idx_vouchers_expiry ON vouchers(expiry_date);
CREATE INDEX IF NOT EXISTS idx_vouchers_is_verified ON vouchers(is_verified);
CREATE INDEX IF NOT EXISTS idx_trades_initiator ON trades(initiator_id);
CREATE INDEX IF NOT EXISTS idx_trades_recipient ON trades(recipient_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_user_vouchers_user ON user_vouchers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vouchers_redeemed ON user_vouchers(is_redeemed);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_completed ON user_challenges(completed);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_ratings_rated ON ratings(rated_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
