-- Create enum types
CREATE TYPE public.story_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.user_role AS ENUM ('reader', 'writer', 'admin');
CREATE TYPE public.chapter_status AS ENUM ('draft', 'published');
CREATE TYPE public.report_status AS ENUM ('pending', 'reviewed', 'resolved');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'reader',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create stories table
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  cover_image_url TEXT,
  author_id UUID NOT NULL,
  status story_status DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  status chapter_status DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(story_id, chapter_number)
);

-- Create story_tags table
CREATE TABLE public.story_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(story_id, tag)
);

-- Create likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create library table (user's saved stories)
CREATE TABLE public.library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- Create reading_progress table
CREATE TABLE public.reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status report_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Create analytics table
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  user_id UUID,
  event_type TEXT NOT NULL, -- 'view', 'like', 'comment', 'share'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create earnings table
CREATE TABLE public.earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  writer_id UUID NOT NULL,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  source TEXT, -- 'ad_revenue', 'premium', 'tip'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allowing all for now since auth is not implemented)
-- Profiles
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON public.profiles FOR UPDATE USING (true);

-- Stories
CREATE POLICY "Anyone can view published stories" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert stories" ON public.stories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update stories" ON public.stories FOR UPDATE USING (true);

-- Chapters
CREATE POLICY "Anyone can view published chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Anyone can insert chapters" ON public.chapters FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update chapters" ON public.chapters FOR UPDATE USING (true);

-- Story tags
CREATE POLICY "Anyone can view story tags" ON public.story_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can insert story tags" ON public.story_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete story tags" ON public.story_tags FOR DELETE USING (true);

-- Likes
CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert likes" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete likes" ON public.likes FOR DELETE USING (true);

-- Comments
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update comments" ON public.comments FOR UPDATE USING (true);

-- Library
CREATE POLICY "Anyone can view library" ON public.library FOR SELECT USING (true);
CREATE POLICY "Anyone can insert library" ON public.library FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete library" ON public.library FOR DELETE USING (true);

-- Reading progress
CREATE POLICY "Anyone can view reading progress" ON public.reading_progress FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reading progress" ON public.reading_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reading progress" ON public.reading_progress FOR UPDATE USING (true);

-- Reports
CREATE POLICY "Anyone can view reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reports" ON public.reports FOR UPDATE USING (true);

-- Analytics
CREATE POLICY "Anyone can view analytics" ON public.analytics FOR SELECT USING (true);
CREATE POLICY "Anyone can insert analytics" ON public.analytics FOR INSERT WITH CHECK (true);

-- Earnings
CREATE POLICY "Anyone can view earnings" ON public.earnings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert earnings" ON public.earnings FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data
INSERT INTO public.profiles (user_id, username, display_name, bio, role) VALUES
('00000000-0000-0000-0000-000000000001', 'sarah_chen', 'Sarah Chen', 'Science fiction writer exploring the intersection of technology and humanity.', 'writer'),
('00000000-0000-0000-0000-000000000002', 'alex_reader', 'Alex Reader', 'Avid reader of fantasy and sci-fi novels.', 'reader'),
('00000000-0000-0000-0000-000000000003', 'admin_user', 'Admin User', 'Platform administrator', 'admin');

INSERT INTO public.stories (id, title, description, genre, author_id, status, view_count, like_count) VALUES
('00000000-0000-0000-0000-000000000101', 'The Digital Awakening', 'In a world where technology and consciousness merge, Maya discovers she can see the digital infrastructure of reality itself.', 'sci-fi', '00000000-0000-0000-0000-000000000001', 'published', 1500, 89),
('00000000-0000-0000-0000-000000000102', 'Whispers in the Code', 'A cyberpunk thriller about a hacker who discovers a conspiracy hidden in the world''s data streams.', 'thriller', '00000000-0000-0000-0000-000000000001', 'published', 2300, 156),
('00000000-0000-0000-0000-000000000103', 'The Last Library', 'In a post-apocalyptic world, the last librarian fights to preserve human knowledge.', 'dystopian', '00000000-0000-0000-0000-000000000001', 'draft', 0, 0);

INSERT INTO public.story_tags (story_id, tag) VALUES
('00000000-0000-0000-0000-000000000101', 'cyberpunk'),
('00000000-0000-0000-0000-000000000101', 'technology'),
('00000000-0000-0000-0000-000000000101', 'consciousness'),
('00000000-0000-0000-0000-000000000102', 'hacker'),
('00000000-0000-0000-0000-000000000102', 'conspiracy'),
('00000000-0000-0000-0000-000000000102', 'thriller');

INSERT INTO public.chapters (story_id, title, content, chapter_number, status, view_count) VALUES
('00000000-0000-0000-0000-000000000101', 'The First Glimpse', 'The city never slept, but tonight it seemed to pulse with an otherworldly energy. Neon lights flickered in patterns that Maya had never noticed before, creating a rhythm that matched her racing heartbeat. She paused at the intersection, watching the streams of data that now seemed visible in the air around her.', 1, 'published', 1200),
('00000000-0000-0000-0000-000000000101', 'Enhancement', 'The enhancement had worked, perhaps too well. What Dr. Chen had promised would be a simple cognitive boost had unleashed something far more complex. Maya could see the digital infrastructure of the city laid bare before her eyes - fiber optic cables pulsing with light beneath the streets, wireless signals dancing between buildings like aurora borealis.', 2, 'published', 980),
('00000000-0000-0000-0000-000000000101', 'The Message', 'Her phone buzzed with a message from an unknown number: "They know what you can see now. Run." Maya''s enhanced vision immediately traced the signal''s path, revealing it had bounced through seventeen different servers across three continents before reaching her device. Someone was being very careful to stay hidden.', 3, 'published', 856);