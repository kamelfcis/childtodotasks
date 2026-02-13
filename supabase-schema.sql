-- ============================================
-- HAPPY TASKS - Supabase SQL Schema
-- ============================================

-- 1) CHILDREN table
CREATE TABLE children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2) DEFAULT TASKS table
CREATE TABLE default_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 5,
  icon TEXT DEFAULT '⭐',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3) CHILD TASKS table (daily task completion)
CREATE TABLE child_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES default_tasks(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  is_done BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(child_id, task_id, date)
);

-- 4) GIFTS table
CREATE TABLE gifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  required_points INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5) CHILD REWARDS table
CREATE TABLE child_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  gift_id UUID REFERENCES gifts(id) ON DELETE CASCADE NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SEED DEFAULT TASKS
-- ============================================
INSERT INTO default_tasks (title, points, icon) VALUES
  ('Brush Teeth 🪥', 5, '🪥'),
  ('Study 30 Minutes 📚', 10, '📚'),
  ('Pray 🤲', 5, '🤲'),
  ('Clean Room 🧹', 10, '🧹'),
  ('Drink Water 💧', 3, '💧'),
  ('Read a Book 📖', 10, '📖'),
  ('Exercise 🏃', 8, '🏃'),
  ('Help Parents 🤝', 10, '🤝'),
  ('Sleep Early 😴', 5, '😴'),
  ('Eat Healthy 🥗', 5, '🥗');

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE default_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_rewards ENABLE ROW LEVEL SECURITY;

-- CHILDREN: parent can CRUD only their children
CREATE POLICY "Parents can view their children"
  ON children FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their children"
  ON children FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their children"
  ON children FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete their children"
  ON children FOR DELETE
  USING (auth.uid() = parent_id);

-- DEFAULT TASKS: anyone authenticated can read
CREATE POLICY "Authenticated users can view default tasks"
  ON default_tasks FOR SELECT
  USING (auth.role() = 'authenticated');

-- CHILD TASKS: parent can manage tasks for their children
CREATE POLICY "Parents can view child tasks"
  ON child_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = child_tasks.child_id
        AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child tasks"
  ON child_tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = child_tasks.child_id
        AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can update child tasks"
  ON child_tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = child_tasks.child_id
        AND children.parent_id = auth.uid()
    )
  );

-- GIFTS: parent can CRUD only their gifts
CREATE POLICY "Parents can view their gifts"
  ON gifts FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert gifts"
  ON gifts FOR INSERT
  WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update gifts"
  ON gifts FOR UPDATE
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete gifts"
  ON gifts FOR DELETE
  USING (auth.uid() = parent_id);

-- CHILD REWARDS: parent can manage rewards for their children
CREATE POLICY "Parents can view child rewards"
  ON child_rewards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = child_rewards.child_id
        AND children.parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can insert child rewards"
  ON child_rewards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM children
      WHERE children.id = child_rewards.child_id
        AND children.parent_id = auth.uid()
    )
  );

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run in Supabase Dashboard > Storage:
-- 1. Create bucket: children-avatars (public)
-- 2. Add policy: Allow authenticated users to upload
-- 3. Add policy: Allow public read access

-- Storage policies (run in SQL editor):
INSERT INTO storage.buckets (id, name, public)
VALUES ('children-avatars', 'children-avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'children-avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'children-avatars'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'children-avatars'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'children-avatars'
    AND auth.role() = 'authenticated'
  );

