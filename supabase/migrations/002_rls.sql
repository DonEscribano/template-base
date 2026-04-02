-- ============================================================
-- 002_rls.sql — Row Level Security policies
-- ============================================================

-- Enable RLS on every table
ALTER TABLE services                ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members            ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule                ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_exceptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_conversations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts                   ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper: admin check
-- ============================================================
-- auth.jwt()->'user_metadata'->>'role' = 'admin'

-- ============================================================
-- PUBLIC READ policies (anon + authenticated)
-- ============================================================

CREATE POLICY "public_read_active_services"
  ON services FOR SELECT
  USING (active = true);

CREATE POLICY "public_read_active_team_members"
  ON team_members FOR SELECT
  USING (active = true);

CREATE POLICY "public_read_schedule"
  ON schedule FOR SELECT
  USING (true);

CREATE POLICY "public_read_schedule_exceptions"
  ON schedule_exceptions FOR SELECT
  USING (true);

CREATE POLICY "public_read_published_reviews"
  ON reviews FOR SELECT
  USING (published = true);

CREATE POLICY "public_read_published_posts"
  ON posts FOR SELECT
  USING (published = true);

-- ============================================================
-- ADMIN full CRUD policies (all operations)
-- ============================================================

-- Services
CREATE POLICY "admin_all_services"
  ON services FOR ALL
  USING (auth.jwt()->'user_metadata'->>'role' = 'admin')
  WITH CHECK (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- Team members
CREATE POLICY "admin_all_team_members"
  ON team_members FOR ALL
  USING (auth.jwt()->'user_metadata'->>'role' = 'admin')
  WITH CHECK (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- Schedule
CREATE POLICY "admin_all_schedule"
  ON schedule FOR ALL
  USING (auth.jwt()->'user_metadata'->>'role' = 'admin')
  WITH CHECK (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- Schedule exceptions
CREATE POLICY "admin_all_schedule_exceptions"
  ON schedule_exceptions FOR ALL
  USING (auth.jwt()->'user_metadata'->>'role' = 'admin')
  WITH CHECK (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- Customers
CREATE POLICY "admin_all_customers"
  ON customers FOR ALL
  USING (auth.jwt()->'user_metadata'->>'role' = 'admin')
  WITH CHECK (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- Reservations
CREATE POLICY "admin_all_reservations"
  ON reservations FOR ALL
  USING (auth.jwt()->'user_metadata'->>'role' = 'admin')
  WITH CHECK (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- Reviews
CREATE POLICY "admin_all_reviews"
  ON reviews FOR ALL
  USING (auth.jwt()->'user_metadata'->>'role' = 'admin')
  WITH CHECK (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- WhatsApp conversations
CREATE POLICY "admin_all_whatsapp_conversations"
  ON whatsapp_conversations FOR ALL
  USING (auth.jwt()->'user_metadata'->>'role' = 'admin')
  WITH CHECK (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- Posts
CREATE POLICY "admin_all_posts"
  ON posts FOR ALL
  USING (auth.jwt()->'user_metadata'->>'role' = 'admin')
  WITH CHECK (auth.jwt()->'user_metadata'->>'role' = 'admin');

-- ============================================================
-- ANONYMOUS INSERT policies (public booking flow)
-- ============================================================

CREATE POLICY "anon_insert_reservations"
  ON reservations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "anon_insert_customers"
  ON customers FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- SERVICE ROLE write on whatsapp_conversations
-- (service_role bypasses RLS by default, but explicit policy
--  for clarity when using regular clients with service key)
-- ============================================================

CREATE POLICY "service_role_all_whatsapp_conversations"
  ON whatsapp_conversations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
