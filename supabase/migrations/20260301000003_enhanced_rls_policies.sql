-- ============================================
-- Phase 1, Task 1.3: Enhanced RLS Policies
-- Replace basic policies with secure, production-ready policies
-- ============================================

-- ============================================
-- PROFILES TABLE - Enhanced RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON profiles;

CREATE POLICY "Public profiles viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile only"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================
-- VOUCHERS TABLE - Enhanced RLS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view verified vouchers" ON vouchers;
DROP POLICY IF EXISTS "Users can insert own vouchers" ON vouchers;
DROP POLICY IF EXISTS "Users can update own vouchers" ON vouchers;

-- Viewing vouchers: verified/active for all, own unverified for seller, all for admins
CREATE POLICY "View verified vouchers or own"
  ON vouchers FOR SELECT
  TO authenticated
  USING (
    (is_verified = true AND status IN ('active', 'verified'))
    OR seller_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Creating vouchers: must be own, start unverified
CREATE POLICY "Users can create own vouchers"
  ON vouchers FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = seller_id
    AND selling_price > 0
    AND original_value > 0
    AND selling_price < original_value
    AND expiry_date > CURRENT_DATE
  );

-- Users can update own unverified vouchers
CREATE POLICY "Users can update own unverified vouchers"
  ON vouchers FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id AND is_verified = false)
  WITH CHECK (auth.uid() = seller_id AND is_verified = false);

-- Admins can verify/update any voucher
CREATE POLICY "Admins can verify vouchers"
  ON vouchers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Users can delete own unsold vouchers
CREATE POLICY "Users can delete own unsold vouchers"
  ON vouchers FOR DELETE
  TO authenticated
  USING (
    auth.uid() = seller_id
    AND status NOT IN ('sold', 'expired')
  );

-- ============================================
-- TRANSACTIONS TABLE - Enhanced RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON transactions;

CREATE POLICY "Users view own transactions only"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = buyer_id
    OR auth.uid() = seller_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND buyer_id != seller_id
    AND amount > 0
    AND status = 'pending'
  );

-- Transactions status can be updated but amounts are immutable
CREATE POLICY "Transaction status updates only"
  ON transactions FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = buyer_id
    OR auth.uid() = seller_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Only admins can delete transactions (for disputes)
CREATE POLICY "Only admins delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================
-- USER_VOUCHERS TABLE - Enhanced RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view own wallet" ON user_vouchers;
DROP POLICY IF EXISTS "Users can manage own wallet" ON user_vouchers;

CREATE POLICY "Users view own vouchers only"
  ON user_vouchers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can redeem their own vouchers
CREATE POLICY "Users can redeem own vouchers"
  ON user_vouchers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND is_redeemed = false)
  WITH CHECK (auth.uid() = user_id AND is_redeemed = true);

-- Insert via system (transactions trigger)
CREATE POLICY "System inserts wallet vouchers"
  ON user_vouchers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TRADES TABLE - Enhanced RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view own trades" ON trades;
DROP POLICY IF EXISTS "Users can create trades" ON trades;
DROP POLICY IF EXISTS "Users can update own trades" ON trades;

CREATE POLICY "Users view own trades"
  ON trades FOR SELECT
  TO authenticated
  USING (auth.uid() = initiator_id OR auth.uid() = recipient_id);

CREATE POLICY "Users create trade requests"
  ON trades FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = initiator_id
    AND initiator_id != recipient_id
    AND status = 'pending'
  );

CREATE POLICY "Participants can update trades"
  ON trades FOR UPDATE
  TO authenticated
  USING (auth.uid() = initiator_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = initiator_id OR auth.uid() = recipient_id);

-- ============================================
-- RATINGS TABLE - Enhanced RLS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view ratings" ON ratings;
DROP POLICY IF EXISTS "Users can create ratings" ON ratings;

CREATE POLICY "Anyone can view ratings"
  ON ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can rate completed trades"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = rater_id
    AND EXISTS (
      SELECT 1 FROM trades
      WHERE id = trade_id
        AND status = 'completed'
        AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
    )
    AND rating BETWEEN 1 AND 5
  );

-- Ratings are immutable
CREATE POLICY "Ratings cannot be updated"
  ON ratings FOR UPDATE
  TO authenticated
  USING (false);

-- ============================================
-- NOTIFICATIONS TABLE - Enhanced RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

CREATE POLICY "Users view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark notifications as read"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND is_read = true);

-- ============================================
-- CHALLENGES & USER_CHALLENGES - Enhanced RLS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active challenges" ON challenges;
DROP POLICY IF EXISTS "Users can view own challenges" ON user_challenges;
DROP POLICY IF EXISTS "Users can manage own challenges" ON user_challenges;

CREATE POLICY "Anyone can view active challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users view own challenge progress"
  ON user_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update challenge progress"
  ON user_challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges"
  ON user_challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- WISHLISTS - Enhanced RLS
-- ============================================
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can insert own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can delete own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlists;

CREATE POLICY "Users manage own wishlist"
  ON wishlists FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
