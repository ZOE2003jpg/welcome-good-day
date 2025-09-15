-- Create RPC functions for analytics and counters

-- Function to increment chapter view count
CREATE OR REPLACE FUNCTION increment_chapter_views(chapter_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.chapters 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = chapter_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment story view count
CREATE OR REPLACE FUNCTION increment_story_views(story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.stories 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment ad impressions
CREATE OR REPLACE FUNCTION increment_ad_impressions(ad_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.ads 
  SET impressions = COALESCE(impressions, 0) + 1 
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment ad clicks
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.ads 
  SET clicks = COALESCE(clicks, 0) + 1 
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get reading statistics for a story
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

-- Function to get trending stories (by recent activity)
CREATE OR REPLACE FUNCTION get_trending_stories(days_back INTEGER DEFAULT 7, story_limit INTEGER DEFAULT 10)
RETURNS TABLE(
  story_id UUID,
  title TEXT,
  author_name TEXT,
  recent_activity_score INTEGER,
  total_likes INTEGER,
  total_views INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id as story_id,
    s.title,
    COALESCE(p.display_name, p.username, 'Unknown') as author_name,
    (
      COALESCE(recent_reads.count, 0) * 3 +
      COALESCE(recent_likes.count, 0) * 5 +
      COALESCE(recent_comments.count, 0) * 2
    ) as recent_activity_score,
    COALESCE(s.like_count, 0) as total_likes,
    COALESCE(s.view_count, 0) as total_views
  FROM public.stories s
  LEFT JOIN public.profiles p ON p.user_id = s.author_id
  LEFT JOIN (
    SELECT novel_id, COUNT(*) as count
    FROM public.reads 
    WHERE created_at >= NOW() - INTERVAL '%s days'
    GROUP BY novel_id
  ) recent_reads ON recent_reads.novel_id = s.id
  LEFT JOIN (
    SELECT story_id, COUNT(*) as count
    FROM public.likes 
    WHERE created_at >= NOW() - INTERVAL '%s days'
    GROUP BY story_id
  ) recent_likes ON recent_likes.story_id = s.id
  LEFT JOIN (
    SELECT story_id, COUNT(*) as count
    FROM public.comments 
    WHERE created_at >= NOW() - INTERVAL '%s days'
    GROUP BY story_id
  ) recent_comments ON recent_comments.story_id = s.id
  WHERE s.status = 'published'
  ORDER BY recent_activity_score DESC, s.like_count DESC
  LIMIT story_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search stories with full-text search
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

-- Add missing status column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reads_novel_reader ON public.reads(novel_id, reader_id);
CREATE INDEX IF NOT EXISTS idx_stories_status_created ON public.stories(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_genre_status ON public.stories(genre, status);
CREATE INDEX IF NOT EXISTS idx_likes_story_created ON public.likes(story_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_story_created ON public.comments(story_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_fulltext ON public.stories USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));