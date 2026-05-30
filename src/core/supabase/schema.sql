-- ═══════════════════════════════════════════════════════════════════════════
-- TechHub — Supabase Schema Migration
-- Paste this entire file into: Supabase → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'executive', 'super_admin')),
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile row when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'member')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── MEMBERS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  role_title  TEXT,
  year        TEXT,
  category    TEXT[]      NOT NULL DEFAULT '{}',
  quote       TEXT,
  avatar_url  TEXT,
  skills      TEXT[]      NOT NULL DEFAULT '{}',
  github      TEXT,
  linkedin    TEXT,
  twitter     TEXT,
  projects    TEXT[]      NOT NULL DEFAULT '{}',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  visible     BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── EXECUTIVES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS executives (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  role_title  TEXT,
  category    TEXT[]      NOT NULL DEFAULT '{}',
  quote       TEXT,
  avatar_url  TEXT,
  skills      TEXT[]      NOT NULL DEFAULT '{}',
  projects    TEXT[]      NOT NULL DEFAULT '{}',
  github      TEXT,
  linkedin    TEXT,
  twitter     TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  visible     BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PROJECTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  description    TEXT,
  short_description TEXT,
  tech           TEXT[]      NOT NULL DEFAULT '{}',
  status         TEXT        NOT NULL DEFAULT 'In Development',
  category       TEXT,
  team_size      TEXT,
  launch_date    TEXT,
  github_url     TEXT,
  live_url       TEXT,
  image_url      TEXT,
  tiktok_url     TEXT,
  linkedin_url   TEXT,
  twitter_url    TEXT,
  in_development BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── updated_at trigger ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS members_updated_at    ON members;
DROP TRIGGER IF EXISTS executives_updated_at ON executives;
DROP TRIGGER IF EXISTS projects_updated_at   ON projects;

CREATE TRIGGER members_updated_at    BEFORE UPDATE ON members    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER executives_updated_at BEFORE UPDATE ON executives FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER projects_updated_at   BEFORE UPDATE ON projects   FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────
ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE executives ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects   ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user a super_admin?
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- PROFILES policies
DROP POLICY IF EXISTS "Own profile" ON profiles;
CREATE POLICY "Own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admin reads all profiles" ON profiles;
CREATE POLICY "Super admin reads all profiles" ON profiles FOR SELECT USING (is_super_admin());

-- MEMBERS policies
DROP POLICY IF EXISTS "Public visible members" ON members;
CREATE POLICY "Public visible members" ON members FOR SELECT USING (visible = true);

DROP POLICY IF EXISTS "Members read own" ON members;
CREATE POLICY "Members read own" ON members FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members insert own" ON members;
CREATE POLICY "Members insert own" ON members FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members update own" ON members;
CREATE POLICY "Members update own" ON members FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admin all members" ON members;
CREATE POLICY "Super admin all members" ON members USING (is_super_admin());

-- EXECUTIVES policies
DROP POLICY IF EXISTS "Public visible executives" ON executives;
CREATE POLICY "Public visible executives" ON executives FOR SELECT USING (visible = true);

DROP POLICY IF EXISTS "Executives read own" ON executives;
CREATE POLICY "Executives read own" ON executives FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Executives insert own" ON executives;
CREATE POLICY "Executives insert own" ON executives FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Executives update own" ON executives;
CREATE POLICY "Executives update own" ON executives FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admin all executives" ON executives;
CREATE POLICY "Super admin all executives" ON executives USING (is_super_admin());

-- PROJECTS policies
DROP POLICY IF EXISTS "Public all projects" ON projects;
CREATE POLICY "Public all projects" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Super admin all projects" ON projects;
CREATE POLICY "Super admin all projects" ON projects USING (is_super_admin());

-- ─── TABLE GRANTS ────────────────────────────────────────────────────────────
-- RLS policies control WHICH rows are visible; GRANTs control WHETHER a role
-- can touch the table at all. Both are required.

GRANT SELECT ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON members    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON executives TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO authenticated;

-- Public (unauthenticated) site reads
GRANT SELECT ON members    TO anon;
GRANT SELECT ON executives TO anon;
GRANT SELECT ON projects   TO anon;

-- ─── STORAGE RLS (run AFTER creating the 'avatars' bucket) ──────────────────

-- In Supabase → Storage → avatars → Policies, add:
--
-- INSERT: (auth.uid())::text = (storage.foldername(name))[1]
-- UPDATE: (auth.uid())::text = (storage.foldername(name))[1]
-- DELETE: (auth.uid())::text = (storage.foldername(name))[1]
-- SELECT: true  (public bucket)
--
-- This ensures users can only upload to avatars/<their-user-id>/...

-- ─── ASSIGN ROLES (run AFTER creating users in Auth) ────────────────────────
-- UPDATE profiles SET role = 'super_admin' WHERE email = 'admin@yourdomain.com';
-- UPDATE profiles SET role = 'executive'   WHERE email = 'exec@yourdomain.com';
-- Members default to 'member' automatically via the trigger.
