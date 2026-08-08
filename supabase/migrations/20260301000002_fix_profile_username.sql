-- ============================================
-- Phase 1, Task 1.2: Fix Profile Creation Schema
-- Add username format validation and auto-generation
-- ============================================

-- Add username format constraint (alphanumeric + underscore, 3-20 chars)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'username_format'
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,20}$');
  END IF;
END $$;

-- Add trigger to generate username from email if not provided
CREATE OR REPLACE FUNCTION generate_username()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.username IS NULL OR NEW.username = '' THEN
    NEW.username := split_part(NEW.email, '@', 1) || '_' || substr(md5(random()::text), 1, 4);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_username ON profiles;
CREATE TRIGGER ensure_username
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION generate_username();

-- Add unique case-insensitive index for usernames
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_lower ON profiles(LOWER(username));
