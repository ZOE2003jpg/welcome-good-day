import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyticsRequest {
  writerId: string
  storyId?: string
  timeRange?: '7d' | '30d' | '90d' | 'all'
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const writerId = url.searchParams.get('writerId')
    const storyId = url.searchParams.get('storyId')
    const timeRange = url.searchParams.get('timeRange') || '30d'

    if (!writerId) {
      return new Response(
        JSON.stringify({ error: 'writerId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Getting analytics for writer ${writerId}, story: ${storyId}, timeRange: ${timeRange}`)

    // Calculate date filter
    let dateFilter = ''
    const now = new Date()
    switch (timeRange) {
      case '7d':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        break
      case '30d':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        break
      case '90d':
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
        break
      default:
        dateFilter = ''
    }

    // Get writer's stories
    let storiesQuery = supabase
      .from('stories')
      .select(`
        id,
        title,
        view_count,
        like_count,
        comment_count,
        created_at,
        status
      `)
      .eq('author_id', writerId)

    if (storyId) {
      storiesQuery = storiesQuery.eq('id', storyId)
    }

    const { data: stories, error: storiesError } = await storiesQuery

    if (storiesError) {
      console.error('Error fetching stories:', storiesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch stories' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const storyIds = stories?.map(s => s.id) || []

    // Get reading analytics
    let readsQuery = supabase
      .from('reads')
      .select('novel_id, completed, created_at')
      .in('novel_id', storyIds)

    if (dateFilter) {
      readsQuery = readsQuery.gte('created_at', dateFilter)
    }

    const { data: reads } = await readsQuery

    // Get comments analytics  
    let commentsQuery = supabase
      .from('comments')
      .select('story_id, created_at')
      .in('story_id', storyIds)

    if (dateFilter) {
      commentsQuery = commentsQuery.gte('created_at', dateFilter)
    }

    const { data: comments } = await commentsQuery

    // Get likes analytics
    let likesQuery = supabase
      .from('likes')
      .select('story_id, created_at')
      .in('story_id', storyIds)

    if (dateFilter) {
      likesQuery = likesQuery.gte('created_at', dateFilter)
    }

    const { data: likes } = await likesQuery

    // Calculate metrics per story
    const storyAnalytics = stories?.map(story => {
      const storyReads = reads?.filter(r => r.novel_id === story.id) || []
      const storyComments = comments?.filter(c => c.story_id === story.id) || []
      const storyLikes = likes?.filter(l => l.story_id === story.id) || []
      const completedReads = storyReads.filter(r => r.completed)

      return {
        ...story,
        analytics: {
          totalReads: storyReads.length,
          completedReads: completedReads.length,
          completionRate: storyReads.length > 0 ? (completedReads.length / storyReads.length) * 100 : 0,
          newComments: storyComments.length,
          newLikes: storyLikes.length,
          engagement: storyReads.length + storyComments.length + storyLikes.length
        }
      }
    })

    // Calculate overall metrics
    const totalReads = reads?.length || 0
    const totalComments = comments?.length || 0
    const totalLikes = likes?.length || 0
    const totalStories = stories?.length || 0
    const publishedStories = stories?.filter(s => s.status === 'published').length || 0

    const overallAnalytics = {
      totalStories,
      publishedStories,
      totalReads,
      totalComments,
      totalLikes,
      totalEngagement: totalReads + totalComments + totalLikes,
      averageEngagementPerStory: publishedStories > 0 ? (totalReads + totalComments + totalLikes) / publishedStories : 0
    }

    console.log(`Successfully calculated analytics for writer ${writerId}`)

    return new Response(
      JSON.stringify({ 
        overallAnalytics,
        storyAnalytics,
        timeRange
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in get-writer-analytics function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})