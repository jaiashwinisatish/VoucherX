-- Trigger to automatically create a profile when a new user signs up
-- and assign 100 voucher coins

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, voucher_coins)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    -- Generate a unique username if not provided
    COALESCE(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 4)
    ),
    100 -- Assign 100 coins
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
