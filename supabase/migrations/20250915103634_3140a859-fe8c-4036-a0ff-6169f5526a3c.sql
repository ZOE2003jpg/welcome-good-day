-- Fix missing RLS policies for admin tables
CREATE POLICY "Admins can view admin records" ON public.admins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() AND a.role = 'super_admin'
    )
  );

CREATE POLICY "Admins can view moderation logs" ON public.moderation_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid()
    )
  );

-- Add insert policy for moderation_logs
CREATE POLICY "Admins can create moderation logs" ON public.moderation_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid()
    )
  );

-- Add admin policies for ads management
CREATE POLICY "Admins can manage ads" ON public.ads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() AND a.role IN ('super_admin', 'ad_manager')
    )
  );

-- Storage policy for ads management
CREATE POLICY "Admins can manage ads storage" ON storage.objects
  FOR ALL USING (
    bucket_id = 'ads' AND
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() AND a.role IN ('super_admin', 'ad_manager')
    )
  );

-- Create RPC functions for analytics and counters
CREATE OR REPLACE FUNCTION increment_chapter_views(chapter_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.chapters 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = chapter_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_story_views(story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.stories 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_ad_impressions(ad_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.ads 
  SET impressions = COALESCE(impressions, 0) + 1 
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.ads 
  SET clicks = COALESCE(clicks, 0) + 1 
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get reading statistics for a story
CREATE OR REPLACE FUNCTION get_story_stats(story_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_readers', COUNT(DISTINCT r.reader_id),
    'total_reads', COUNT(r.id),
    'completed_reads', COUNT(r.id) FILTER (WHERE r.completed = true),
    'completion_rate', 
      CASE 
        WHEN COUNT(r.id) > 0 
        THEN ROUND((COUNT(r.id) FILTER (WHERE r.completed = true)::DECIMAL / COUNT(r.id)) * 100, 2)
        ELSE 0 
      END,
    'average_progress', 
      CASE 
        WHEN COUNT(r.id) > 0 
        THEN ROUND(AVG(r.slide_number), 2)
        ELSE 0 
      END
  ) INTO result
  FROM public.reads r
  WHERE r.novel_id = story_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to search stories
CREATE OR REPLACE FUNCTION search_stories(
  search_term TEXT,
  genre_filter TEXT DEFAULT NULL,
  story_limit INTEGER DEFAULT 20,
  story_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  story_id UUID,
  title TEXT,
  description TEXT,
  genre TEXT,
  author_name TEXT,
  like_count INTEGER,
  view_count INTEGER,
  created_at TIMESTAMPTZ,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as story_id,
    s.title,
    s.description,
    s.genre,
    COALESCE(p.display_name, p.username, 'Unknown') as author_name,
    COALESCE(s.like_count, 0) as like_count,
    COALESCE(s.view_count, 0) as view_count,
    s.created_at,
    ARRAY_AGG(st.tag) FILTER (WHERE st.tag IS NOT NULL) as tags
  FROM public.stories s
  LEFT JOIN public.profiles p ON p.user_id = s.author_id
  LEFT JOIN public.story_tags st ON st.story_id = s.id
  WHERE s.status = 'published'
    AND (
      search_term = '' 
      OR s.title ILIKE '%' || search_term || '%'
      OR s.description ILIKE '%' || search_term || '%'
      OR EXISTS (
        SELECT 1 FROM public.story_tags st2 
        WHERE st2.story_id = s.id 
        AND st2.tag ILIKE '%' || search_term || '%'
      )
    )
    AND (genre_filter IS NULL OR s.genre = genre_filter)
  GROUP BY s.id, s.title, s.description, s.genre, p.display_name, p.username, s.like_count, s.view_count, s.created_at
  ORDER BY s.like_count DESC, s.created_at DESC
  LIMIT story_limit OFFSET story_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create additional performance indexes
CREATE INDEX IF NOT EXISTS idx_reads_novel_reader ON public.reads(novel_id, reader_id);
CREATE INDEX IF NOT EXISTS idx_stories_status_created ON public.stories(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_genre_status ON public.stories(genre, status);
CREATE INDEX IF NOT EXISTS idx_likes_story_created ON public.likes(story_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_story_created ON public.comments(story_id, created_at DESC);