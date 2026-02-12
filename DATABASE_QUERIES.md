# VoucherX Database Table Creation Queries

## Complete SQL for All Tables

### 1. PROFILES TABLE (User Accounts)
```sql
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

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

### 2. VOUCHERS TABLE (Marketplace Items)
```sql
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
  status text DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'active', 'sold', 'expired')),
  is_verified boolean DEFAULT false,
  proof_url text,
  description text,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified vouchers"
  ON vouchers FOR SELECT
  TO authenticated
  USING (is_verified = true OR seller_id = auth.uid());

CREATE POLICY "Users can insert own vouchers"
  ON vouchers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own vouchers"
  ON vouchers FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);
```

### 3. TRADES TABLE (User Exchanges)
```sql
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  initiator_voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
  recipient_voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  match_score decimal(5,2),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trades"
  ON trades FOR SELECT
  TO authenticated
  USING (auth.uid() = initiator_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create trades"
  ON trades FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = initiator_id);

CREATE POLICY "Users can update own trades"
  ON trades FOR UPDATE
  TO authenticated
  USING (auth.uid() = initiator_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = initiator_id OR auth.uid() = recipient_id);
```

### 4. TRANSACTIONS TABLE (Purchase History)
```sql
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  commission decimal(10,2) GENERATED ALWAYS AS (ROUND((amount * 0.02)::numeric, 2)) STORED,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'escrow', 'completed', 'refunded', 'disputed')),
  payment_method text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);
```

### 5. USER_VOUCHERS TABLE (User Wallet)
```sql
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

CREATE POLICY "Users can view own wallet"
  ON user_vouchers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wallet"
  ON user_vouchers FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 6. RATINGS TABLE (User Reviews)
```sql
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

CREATE POLICY "Anyone can view ratings"
  ON ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create ratings"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = rater_id);
```

### 7. CHALLENGES TABLE (Gamification)
```sql
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL CHECK (challenge_type IN ('daily', 'weekly', 'monthly', 'milestone')),
  reward_coins integer NOT NULL,
  requirement jsonb NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  is_active boolean DEFAULT true
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (is_active = true);
```

### 8. USER_CHALLENGES TABLE (Progress Tracking)
```sql
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

CREATE POLICY "Users can view own challenges"
  ON user_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own challenges"
  ON user_challenges FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 9. WISHLISTS TABLE (Desired Brands)
```sql
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

CREATE POLICY "Users can manage own wishlist"
  ON wishlists FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 10. NOTIFICATIONS TABLE (User Alerts)
```sql
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

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### INDEXES FOR PERFORMANCE
```sql
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
```

## All Tables Combined (Copy & Paste Ready)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE
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

CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- VOUCHERS TABLE
CREATE TABLE IF NOT EXISTS vouchers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  brand_name text NOT NULL,
  category text NOT NULL,
  original_value decimal(10,2) NOT NULL,
  selling_price decimal(10,2) NOT NULL,
  discount_percentage decimal(5,2) GENERATED ALWAYS AS (ROUND(((original_value - selling_price) / original_value * 100)::numeric, 2)) STORED,
  voucher_code text NOT NULL,
  expiry_date date NOT NULL,
  status text DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'active', 'sold', 'expired')),
  is_verified boolean DEFAULT false,
  proof_url text,
  description text,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified vouchers" ON vouchers FOR SELECT TO authenticated USING (is_verified = true OR seller_id = auth.uid());
CREATE POLICY "Users can insert own vouchers" ON vouchers FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own vouchers" ON vouchers FOR UPDATE TO authenticated USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);

-- TRADES TABLE
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  initiator_voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
  recipient_voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  match_score decimal(5,2),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trades" ON trades FOR SELECT TO authenticated USING (auth.uid() = initiator_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can create trades" ON trades FOR INSERT TO authenticated WITH CHECK (auth.uid() = initiator_id);
CREATE POLICY "Users can update own trades" ON trades FOR UPDATE TO authenticated USING (auth.uid() = initiator_id OR auth.uid() = recipient_id) WITH CHECK (auth.uid() = initiator_id OR auth.uid() = recipient_id);

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  commission decimal(10,2) GENERATED ALWAYS AS (ROUND((amount * 0.02)::numeric, 2)) STORED,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'escrow', 'completed', 'refunded', 'disputed')),
  payment_method text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can create transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- USER_VOUCHERS TABLE
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

CREATE POLICY "Users can view own wallet" ON user_vouchers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wallet" ON user_vouchers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RATINGS TABLE
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

CREATE POLICY "Anyone can view ratings" ON ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create ratings" ON ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = rater_id);

-- CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL CHECK (challenge_type IN ('daily', 'weekly', 'monthly', 'milestone')),
  reward_coins integer NOT NULL,
  requirement jsonb NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  is_active boolean DEFAULT true
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges" ON challenges FOR SELECT TO authenticated USING (is_active = true);

-- USER_CHALLENGES TABLE
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

CREATE POLICY "Users can view own challenges" ON user_challenges FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own challenges" ON user_challenges FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- WISHLISTS TABLE
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

CREATE POLICY "Users can manage own wishlist" ON wishlists FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- NOTIFICATIONS TABLE
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

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- INDEXES
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
```

## Database Triggers

### Auto-Create User Profiles on Signup

This trigger automatically creates a profile entry when a new user signs up through Supabase Auth.

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, avatar_url, voucher_coins)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(
      new.raw_user_meta_data->>'username',
      COALESCE(new.email, 'user_' || substr(new.id::text, 1, 8))
    ),
    new.raw_user_meta_data->>'avatar_url',
    100
  );
  RETURN new;
END;
$$;

-- Trigger to execute the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**Purpose**: Prevents foreign key constraint errors when users try to add vouchers.

**When to run**: Before allowing users to add vouchers. See `migrations/001_auto_create_profiles.sql` for the complete migration.

## How to Use These Queries

### In Supabase Dashboard:
1. Go to your Supabase project
2. Click **SQL Editor**
3. Click **New Query**
4. Copy the entire SQL from "All Tables Combined" section above
5. Click **Run**

All 10 tables will be created with RLS policies and indexes enabled.
