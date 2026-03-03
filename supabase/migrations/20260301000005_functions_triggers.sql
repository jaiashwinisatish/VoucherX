-- ============================================
-- Phase 1, Task 1.5: Database Functions & Triggers
-- Auto-update timestamps, validation, notifications, challenge tracking
-- ============================================

-- ============================================
-- AUTO-UPDATE TIMESTAMP
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vouchers_updated_at ON vouchers;
CREATE TRIGGER update_vouchers_updated_at
  BEFORE UPDATE ON vouchers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VALIDATE VOUCHER PRICING
-- ============================================
CREATE OR REPLACE FUNCTION validate_voucher_pricing()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.selling_price >= NEW.original_value THEN
    RAISE EXCEPTION 'Selling price must be less than original value';
  END IF;
  IF NEW.selling_price <= 0 OR NEW.original_value <= 0 THEN
    RAISE EXCEPTION 'Prices must be positive';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_voucher_pricing_trigger ON vouchers;
CREATE TRIGGER validate_voucher_pricing_trigger
  BEFORE INSERT OR UPDATE ON vouchers
  FOR EACH ROW
  EXECUTE FUNCTION validate_voucher_pricing();

-- ============================================
-- AUTO-EXPIRE VOUCHERS (Run daily via cron)
-- ============================================
CREATE OR REPLACE FUNCTION expire_old_vouchers()
RETURNS void AS $$
BEGIN
  UPDATE vouchers
  SET status = 'expired'
  WHERE expiry_date < CURRENT_DATE
    AND status IN ('active', 'verified', 'pending_verification');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INCREMENT VIEW COUNT
-- ============================================
CREATE OR REPLACE FUNCTION increment_voucher_views(p_voucher_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE vouchers
  SET views = views + 1
  WHERE id = p_voucher_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UPDATE USER RATING AFTER NEW RATING
-- ============================================
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM ratings
    WHERE rated_id = NEW.rated_id
  )
  WHERE id = NEW.rated_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_rating_trigger ON ratings;
CREATE TRIGGER update_user_rating_trigger
  AFTER INSERT ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_rating();

-- ============================================
-- CREATE NOTIFICATION HELPER
-- ============================================
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_link text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (p_user_id, p_type, p_title, p_message, p_link);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTIFY ON NEW TRADE REQUEST
-- ============================================
CREATE OR REPLACE FUNCTION notify_trade_request()
RETURNS TRIGGER AS $$
DECLARE
  v_initiator_name text;
BEGIN
  SELECT full_name INTO v_initiator_name
  FROM profiles
  WHERE id = NEW.initiator_id;

  PERFORM create_notification(
    NEW.recipient_id,
    'trade_request',
    'New Trade Request',
    COALESCE(v_initiator_name, 'Someone') || ' wants to trade with you!',
    '/exchange'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_trade_request_trigger ON trades;
CREATE TRIGGER notify_trade_request_trigger
  AFTER INSERT ON trades
  FOR EACH ROW
  EXECUTE FUNCTION notify_trade_request();

-- ============================================
-- NOTIFY ON VOUCHER EXPIRING SOON
-- ============================================
CREATE OR REPLACE FUNCTION notify_expiring_vouchers()
RETURNS void AS $$
DECLARE
  v_record RECORD;
BEGIN
  FOR v_record IN
    SELECT DISTINCT uv.user_id, v.brand_name, v.expiry_date, v.id
    FROM user_vouchers uv
    JOIN vouchers v ON v.id = uv.voucher_id
    WHERE uv.is_redeemed = false
      AND v.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.user_id = uv.user_id
          AND n.link = '/wallet'
          AND n.created_at > CURRENT_DATE - INTERVAL '1 day'
      )
  LOOP
    PERFORM create_notification(
      v_record.user_id,
      'expiry_warning',
      'Voucher Expiring Soon',
      'Your ' || v_record.brand_name || ' voucher expires on ' || v_record.expiry_date::text,
      '/wallet'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VALIDATE TRANSACTION
-- ============================================
CREATE OR REPLACE FUNCTION validate_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Verify voucher is available
  IF NOT EXISTS (
    SELECT 1 FROM vouchers
    WHERE id = NEW.voucher_id
      AND status IN ('active', 'verified')
      AND is_verified = true
  ) THEN
    RAISE EXCEPTION 'Voucher not available for purchase';
  END IF;

  -- Prevent buying from yourself
  IF NEW.buyer_id = NEW.seller_id THEN
    RAISE EXCEPTION 'Cannot buy from yourself';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_transaction_trigger ON transactions;
CREATE TRIGGER validate_transaction_trigger
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION validate_transaction();

-- ============================================
-- MARK VOUCHER AS SOLD AFTER TRANSACTION COMPLETED
-- ============================================
CREATE OR REPLACE FUNCTION mark_voucher_sold()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE vouchers
    SET status = 'sold'
    WHERE id = NEW.voucher_id;

    -- Increment seller's total_trades
    UPDATE profiles
    SET total_trades = total_trades + 1
    WHERE id = NEW.seller_id;

    -- Increment buyer's total_trades
    UPDATE profiles
    SET total_trades = total_trades + 1
    WHERE id = NEW.buyer_id;

    -- Notify seller
    PERFORM create_notification(
      NEW.seller_id,
      'sale_completed',
      'Voucher Sold!',
      'Your voucher has been sold for $' || NEW.amount::text,
      '/wallet'
    );

    -- Notify buyer
    PERFORM create_notification(
      NEW.buyer_id,
      'purchase_completed',
      'Purchase Complete!',
      'Your voucher purchase is confirmed. Check your wallet!',
      '/wallet'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS mark_voucher_sold_trigger ON transactions;
CREATE TRIGGER mark_voucher_sold_trigger
  AFTER UPDATE ON transactions
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION mark_voucher_sold();

-- ============================================
-- UPDATE CHALLENGE PROGRESS
-- ============================================
CREATE OR REPLACE FUNCTION update_challenge_progress(
  p_user_id uuid,
  p_challenge_type text,
  p_increment integer DEFAULT 1
)
RETURNS void AS $$
BEGIN
  -- Update progress for matching active challenges
  UPDATE user_challenges
  SET progress = progress + p_increment,
      completed = (progress + p_increment >= (
        SELECT (requirement->>'count')::integer
        FROM challenges
        WHERE id = challenge_id
      )),
      completed_at = CASE
        WHEN (progress + p_increment >= (
          SELECT (requirement->>'count')::integer
          FROM challenges
          WHERE id = challenge_id
        )) THEN now()
        ELSE NULL
      END
  WHERE user_id = p_user_id
    AND challenge_id IN (
      SELECT id FROM challenges
      WHERE challenge_type = p_challenge_type
        AND is_active = true
    );

  -- Award coins if completed
  UPDATE profiles
  SET voucher_coins = voucher_coins + COALESCE((
    SELECT SUM(c.reward_coins)
    FROM user_challenges uc
    JOIN challenges c ON c.id = uc.challenge_id
    WHERE uc.user_id = p_user_id
      AND uc.completed = true
      AND uc.completed_at > now() - INTERVAL '1 minute'
  ), 0)
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRACK TRADE CHALLENGE PROGRESS
-- ============================================
CREATE OR REPLACE FUNCTION track_trade_challenge()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    PERFORM update_challenge_progress(NEW.initiator_id, 'trade', 1);
    PERFORM update_challenge_progress(NEW.recipient_id, 'trade', 1);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS track_trade_challenge_trigger ON trades;
CREATE TRIGGER track_trade_challenge_trigger
  AFTER UPDATE ON trades
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION track_trade_challenge();
