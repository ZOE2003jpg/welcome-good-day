import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Starting to delete all stories and related data...')

    // Delete in order to respect foreign key constraints
    // 1. Delete slides first
    const { error: slidesError } = await supabase
      .from('slides')
      .delete()
      .neq('id', 'impossible-id') // Delete all

    if (slidesError) {
      console.error('Error deleting slides:', slidesError)
    } else {
      console.log('All slides deleted successfully')
    }

    // 2. Delete chapters
    const { error: chaptersError } = await supabase
      .from('chapters')
      .delete()
      .neq('id', 'impossible-id') // Delete all

    if (chaptersError) {
      console.error('Error deleting chapters:', chaptersError)
    } else {
      console.log('All chapters deleted successfully')
    }

    // 3. Delete story tags
    const { error: tagsError } = await supabase
      .from('story_tags')
      .delete()
      .neq('story_id', 'impossible-id') // Delete all

    if (tagsError) {
      console.error('Error deleting story tags:', tagsError)
    } else {
      console.log('All story tags deleted successfully')
    }

    // 4. Delete reads
    const { error: readsError } = await supabase
      .from('reads')
      .delete()
      .neq('id', 'impossible-id') // Delete all

    if (readsError) {
      console.error('Error deleting reads:', readsError)
    } else {
      console.log('All reads deleted successfully')
    }

    // 5. Delete likes
    const { error: likesError } = await supabase
      .from('likes')
      .delete()
      .neq('id', 'impossible-id') // Delete all

    if (likesError) {
      console.error('Error deleting likes:', likesError)
    } else {
      console.log('All likes deleted successfully')
    }

    // 6. Delete comments
    const { error: commentsError } = await supabase
      .from('comments')
      .delete()
      .neq('id', 'impossible-id') // Delete all

    if (commentsError) {
      console.error('Error deleting comments:', commentsError)
    } else {
      console.log('All comments deleted successfully')
    }

    // 7. Delete library entries
    const { error: libraryError } = await supabase
      .from('library')
      .delete()
      .neq('id', 'impossible-id') // Delete all

    if (libraryError) {
      console.error('Error deleting library entries:', libraryError)
    } else {
      console.log('All library entries deleted successfully')
    }

    // 8. Finally delete stories
    const { error: storiesError } = await supabase
      .from('stories')
      .delete()
      .neq('id', 'impossible-id') // Delete all

    if (storiesError) {
      console.error('Error deleting stories:', storiesError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete stories', details: storiesError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('All stories and related data deleted successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'All stories and related data deleted successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in delete-all-stories function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})