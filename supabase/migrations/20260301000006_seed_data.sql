-- ============================================
-- Phase 1, Task 1.6: Seed Data for Development
-- Sample challenges and test vouchers
-- ============================================

-- ============================================
-- SEED SAMPLE CHALLENGES
-- ============================================
INSERT INTO challenges (title, description, challenge_type, reward_coins, requirement)
VALUES
  ('First Trade', 'Complete your first voucher trade', 'milestone', 25, '{"count": 1}'::jsonb),
  ('Trade Master', 'Complete 5 successful trades', 'milestone', 100, '{"count": 5}'::jsonb),
  ('Daily Trader', 'Make a trade today', 'daily', 15, '{"count": 1}'::jsonb),
  ('Weekly Hustler', 'Complete 3 trades this week', 'weekly', 50, '{"count": 3}'::jsonb),
  ('Seller Pro', 'Sell 10 vouchers', 'milestone', 150, '{"count": 10}'::jsonb),
  ('Early Bird', 'Make a purchase before 9 AM', 'daily', 20, '{"count": 1}'::jsonb)
ON CONFLICT DO NOTHING;
