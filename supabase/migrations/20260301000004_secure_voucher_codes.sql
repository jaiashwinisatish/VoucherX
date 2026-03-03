-- ============================================
-- Phase 1, Task 1.4: Secure Voucher Code Handling
-- Separate encrypted table for voucher codes
-- ============================================

-- Create separate encrypted table for voucher codes
CREATE TABLE IF NOT EXISTS voucher_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  voucher_id uuid REFERENCES vouchers(id) ON DELETE CASCADE NOT NULL,
  encrypted_code text NOT NULL,
  is_revealed boolean DEFAULT false,
  revealed_to uuid REFERENCES profiles(id),
  revealed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE voucher_codes ENABLE ROW LEVEL SECURITY;

-- RLS: Only buyer/seller can see revealed codes
CREATE POLICY "Only owner or buyer sees code"
  ON voucher_codes FOR SELECT
  TO authenticated
  USING (
    revealed_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM vouchers v
      WHERE v.id = voucher_id
        AND v.seller_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Only voucher sellers can insert codes for their vouchers
CREATE POLICY "Sellers can insert voucher codes"
  ON voucher_codes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vouchers v
      WHERE v.id = voucher_id
        AND v.seller_id = auth.uid()
    )
  );

-- Function to encrypt voucher codes
CREATE OR REPLACE FUNCTION encrypt_voucher_code(code text)
RETURNS text AS $$
BEGIN
  RETURN encode(
    pgp_sym_encrypt(code, COALESCE(current_setting('app.encryption_key', true), 'voucherx-default-dev-key-change-in-prod')),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrypt voucher codes
CREATE OR REPLACE FUNCTION decrypt_voucher_code(encrypted_code text)
RETURNS text AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_code, 'base64'),
    COALESCE(current_setting('app.encryption_key', true), 'voucherx-default-dev-key-change-in-prod')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reveal code after purchase
CREATE OR REPLACE FUNCTION reveal_voucher_code(
  p_voucher_id uuid,
  p_buyer_id uuid
)
RETURNS text AS $$
DECLARE
  v_encrypted_code text;
  v_decrypted_code text;
BEGIN
  -- Verify purchase completed
  IF NOT EXISTS (
    SELECT 1 FROM transactions
    WHERE voucher_id = p_voucher_id
      AND buyer_id = p_buyer_id
      AND status = 'completed'
  ) THEN
    RAISE EXCEPTION 'Purchase not completed';
  END IF;

  -- Get encrypted code
  SELECT encrypted_code INTO v_encrypted_code
  FROM voucher_codes
  WHERE voucher_id = p_voucher_id;

  IF v_encrypted_code IS NULL THEN
    RAISE EXCEPTION 'Voucher code not found';
  END IF;

  -- Decrypt
  v_decrypted_code := decrypt_voucher_code(v_encrypted_code);

  -- Mark as revealed
  UPDATE voucher_codes
  SET is_revealed = true,
      revealed_to = p_buyer_id,
      revealed_at = now()
  WHERE voucher_id = p_voucher_id;

  -- Add to user's wallet
  INSERT INTO user_vouchers (user_id, voucher_id, acquisition_type)
  VALUES (p_buyer_id, p_voucher_id, 'bought')
  ON CONFLICT DO NOTHING;

  RETURN v_decrypted_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_voucher_codes_voucher ON voucher_codes(voucher_id);
CREATE INDEX IF NOT EXISTS idx_voucher_codes_revealed_to ON voucher_codes(revealed_to);
