-- Create slides table for chapter content breakdown
CREATE TABLE public.slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reads table for tracking reader progress
CREATE TABLE public.reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reader_id UUID NOT NULL,
  novel_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  slide_number INTEGER NOT NULL DEFAULT 1,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reader_id, novel_id, chapter_id)
);

-- Create ads table
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ad_logs table
CREATE TABLE public.ad_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reader_id UUID NOT NULL,
  ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
  slide_position INTEGER NOT NULL,
  watched BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create writer_profiles table
CREATE TABLE public.writer_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  pen_name TEXT,
  bio TEXT,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drafts table
CREATE TABLE public.drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  writer_id UUID NOT NULL,
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admins table
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'content_mod', -- super_admin, content_mod, ad_manager
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create moderation_logs table
CREATE TABLE public.moderation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.admins(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- approve, delete, suspend
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL, -- story, chapter, comment, user
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table (separate from story_tags)
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system_settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- comment, admin_update, featured_story
  message TEXT NOT NULL,
  seen BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update chapters table to add missing fields
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS slide_count INTEGER DEFAULT 0;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0;

-- Add missing status column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add indexes for performance
CREATE INDEX idx_slides_chapter_id ON public.slides(chapter_id);
CREATE INDEX idx_slides_order ON public.slides(chapter_id, order_number);
CREATE INDEX idx_reads_reader_novel ON public.reads(reader_id, novel_id);
CREATE INDEX idx_reads_progress ON public.reads(reader_id, completed);
CREATE INDEX idx_ad_logs_reader ON public.ad_logs(reader_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, seen);

-- Enable RLS on all new tables
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for slides
CREATE POLICY "Anyone can view slides for published chapters" ON public.slides
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chapters c 
      WHERE c.id = slides.chapter_id AND c.status = 'published'
    )
  );

CREATE POLICY "Writers can manage their own slides" ON public.slides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.chapters c 
      JOIN public.stories s ON s.id = c.story_id 
      WHERE c.id = slides.chapter_id AND s.author_id = auth.uid()
    )
  );

-- RLS Policies for reads
CREATE POLICY "Users can view their own reading progress" ON public.reads
  FOR SELECT USING (reader_id = auth.uid());

CREATE POLICY "Users can insert their own reading progress" ON public.reads
  FOR INSERT WITH CHECK (reader_id = auth.uid());

CREATE POLICY "Users can update their own reading progress" ON public.reads
  FOR UPDATE USING (reader_id = auth.uid());

-- RLS Policies for ads
CREATE POLICY "Anyone can view active ads" ON public.ads
  FOR SELECT USING (
    start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE
  );

-- RLS Policies for ad_logs
CREATE POLICY "Users can view their own ad logs" ON public.ad_logs
  FOR SELECT USING (reader_id = auth.uid());

CREATE POLICY "Users can create their own ad logs" ON public.ad_logs
  FOR INSERT WITH CHECK (reader_id = auth.uid());

-- RLS Policies for writer_profiles
CREATE POLICY "Anyone can view writer profiles" ON public.writer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Writers can manage their own profile" ON public.writer_profiles
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for drafts
CREATE POLICY "Writers can manage their own drafts" ON public.drafts
  FOR ALL USING (writer_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for categories and tags (public read)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT USING (true);

-- RLS Policies for system_settings (public read)
CREATE POLICY "Anyone can view system settings" ON public.system_settings
  FOR SELECT USING (true);

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, value, description) VALUES
  ('ads_frequency', '6', 'Number of slides between ads'),
  ('slide_word_limit', '400', 'Maximum words per slide'),
  ('theme_default', 'light', 'Default theme for new users');

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
  ('Romance', 'Love stories and romantic fiction'),
  ('Fantasy', 'Fantasy and magical stories'),
  ('Mystery', 'Mystery and thriller stories'),
  ('Sci-Fi', 'Science fiction stories'),
  ('Drama', 'Dramatic and emotional stories'),
  ('Comedy', 'Humorous and light-hearted stories'),
  ('Adventure', 'Action and adventure stories'),
  ('Horror', 'Horror and suspense stories');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('covers', 'covers', true),
  ('profiles', 'profiles', true),
  ('ads', 'ads', true);

-- Storage policies for covers
CREATE POLICY "Anyone can view covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload covers" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'covers' AND 
    auth.role() = 'authenticated'
  );

-- Storage policies for profiles
CREATE POLICY "Anyone can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload their own profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profiles' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for ads
CREATE POLICY "Anyone can view ads" ON storage.objects
  FOR SELECT USING (bucket_id = 'ads');

-- Create updated_at triggers for new tables
CREATE TRIGGER update_writer_profiles_updated_at
  BEFORE UPDATE ON public.writer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON public.drafts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();