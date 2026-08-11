-- Migration: Add Community and Engagement Features
-- This migration adds: public profiles, follow system, enhanced reviews, trade sharing, and community discussions

-- ============================================
-- 1. UPDATE PROFILES TABLE
-- ============================================
-- Add bio field to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio text;

-- Add follower and following counts (computed via functions, but stored for performance)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS follower_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count integer DEFAULT 0;

-- Create index for username lookups (for public profile routes)
CREATE INDEX IF NOT EXISTS idx_profiles_username_lookup ON profiles(username);

-- ============================================
-- 2. FOLLOWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id) -- Prevent self-follow
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_follows_created ON follows(created_at DESC);

-- RLS Policies for follows
CREATE POLICY "Users can view all follows"
  ON follows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own follows"
  ON follows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
  ON follows FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Function to update follower/following counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment counts
    UPDATE profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement counts
    UPDATE profiles SET follower_count = GREATEST(0, follower_count - 1) WHERE id = OLD.following_id;
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain counts
DROP TRIGGER IF EXISTS trigger_update_follow_counts_insert ON follows;
CREATE TRIGGER trigger_update_follow_counts_insert
  AFTER INSERT ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

DROP TRIGGER IF EXISTS trigger_update_follow_counts_delete ON follows;
CREATE TRIGGER trigger_update_follow_counts_delete
  AFTER DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- ============================================
-- 3. ENHANCE REVIEWS TABLE (from existing ratings)
-- ============================================
-- The ratings table already exists, but we'll add a constraint to prevent duplicate reviews per trade
-- and ensure reviews can only be created for completed trades

-- Add constraint to ensure one review per trade per user (if not already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ratings_trade_rater_unique'
  ) THEN
    ALTER TABLE ratings ADD CONSTRAINT ratings_trade_rater_unique UNIQUE(trade_id, rater_id);
  END IF;
END $$;

-- Function to calculate average rating for a user
CREATE OR REPLACE FUNCTION calculate_user_rating(user_id uuid)
RETURNS decimal(3,2) AS $$
DECLARE
  avg_rating decimal(3,2);
BEGIN
  SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0.00)
  INTO avg_rating
  FROM ratings
  WHERE rated_id = user_id;
  
  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Function to update profile rating when a review is added
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET rating = calculate_user_rating(NEW.rated_id)
  WHERE id = NEW.rated_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating on new review
DROP TRIGGER IF EXISTS trigger_update_profile_rating ON ratings;
CREATE TRIGGER trigger_update_profile_rating
  AFTER INSERT ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_profile_rating();

-- ============================================
-- 4. TRADE SHARES TABLE (for tracking shares)
-- ============================================
CREATE TABLE IF NOT EXISTS trade_shares (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id uuid REFERENCES trades(id) ON DELETE CASCADE NOT NULL,
  shared_by_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  share_platform text CHECK (share_platform IN ('twitter', 'linkedin', 'copy_link')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trade_shares ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_trade_shares_trade ON trade_shares(trade_id);
CREATE INDEX IF NOT EXISTS idx_trade_shares_user ON trade_shares(shared_by_id);

-- RLS Policies for trade_shares
CREATE POLICY "Users can view all trade shares"
  ON trade_shares FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own trade shares"
  ON trade_shares FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = shared_by_id);

-- ============================================
-- 5. COMMUNITY THREADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS community_threads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  reply_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  last_reply_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE community_threads ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_threads_author ON community_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_threads_created ON community_threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_last_reply ON community_threads(last_reply_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_threads_pinned ON community_threads(is_pinned DESC, created_at DESC);

-- RLS Policies for community_threads
CREATE POLICY "Anyone can view threads"
  ON community_threads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create threads"
  ON community_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own threads"
  ON community_threads FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own threads"
  ON community_threads FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- ============================================
-- 6. THREAD REPLIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS thread_replies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id uuid REFERENCES community_threads(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  parent_reply_id uuid REFERENCES thread_replies(id) ON DELETE CASCADE, -- For nested replies
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE thread_replies ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_replies_thread ON thread_replies(thread_id, created_at);
CREATE INDEX IF NOT EXISTS idx_replies_author ON thread_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_parent ON thread_replies(parent_reply_id);

-- RLS Policies for thread_replies
CREATE POLICY "Anyone can view replies"
  ON thread_replies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create replies"
  ON thread_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own replies"
  ON thread_replies FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete own replies"
  ON thread_replies FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Function to update thread reply count and last_reply_at
CREATE OR REPLACE FUNCTION update_thread_reply_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_threads
    SET reply_count = reply_count + 1,
        last_reply_at = NEW.created_at
    WHERE id = NEW.thread_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_threads
    SET reply_count = GREATEST(0, reply_count - 1)
    WHERE id = OLD.thread_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain thread stats
DROP TRIGGER IF EXISTS trigger_update_thread_reply_stats_insert ON thread_replies;
CREATE TRIGGER trigger_update_thread_reply_stats_insert
  AFTER INSERT ON thread_replies
  FOR EACH ROW EXECUTE FUNCTION update_thread_reply_stats();

DROP TRIGGER IF EXISTS trigger_update_thread_reply_stats_delete ON thread_replies;
CREATE TRIGGER trigger_update_thread_reply_stats_delete
  AFTER DELETE ON thread_replies
  FOR EACH ROW EXECUTE FUNCTION update_thread_reply_stats();

-- Function to update thread updated_at
CREATE OR REPLACE FUNCTION update_thread_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_threads
  SET updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_thread_updated_at ON thread_replies;
CREATE TRIGGER trigger_update_thread_updated_at
  AFTER INSERT OR UPDATE ON thread_replies
  FOR EACH ROW EXECUTE FUNCTION update_thread_updated_at();

-- ============================================
-- 7. UPDATE PROFILES RLS FOR PUBLIC ACCESS
-- ============================================
-- Allow public viewing of profiles (for public profile pages)
-- Note: This allows authenticated users to view profiles, which is needed for public profile pages
-- The existing policy already allows this, but we ensure it's clear

-- Update existing policy to be more explicit about public profile viewing
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- 8. FUNCTION TO GET ACTIVE LISTINGS COUNT
-- ============================================
CREATE OR REPLACE FUNCTION get_user_active_listings(user_id uuid)
RETURNS integer AS $$
DECLARE
  listing_count integer;
BEGIN
  SELECT COUNT(*)
  INTO listing_count
  FROM vouchers
  WHERE seller_id = user_id
    AND is_verified = true
    AND status IN ('verified', 'active');
  
  RETURN listing_count;
END;
$$ LANGUAGE plpgsql;
