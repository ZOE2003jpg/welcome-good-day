import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SplitRequest {
  chapterId: string
  text: string
  wordLimit?: number
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

    const { chapterId, text, wordLimit = 400 }: SplitRequest = await req.json()

    if (!chapterId || !text) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: chapterId, text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Splitting chapter ${chapterId} into slides with word limit ${wordLimit}`)

    // Split text into sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const slides = []
    let currentSlide = ''
    let slideOrder = 1

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (!trimmedSentence) continue

      const testSlide = currentSlide + (currentSlide ? '. ' : '') + trimmedSentence + '.'
      const wordCount = testSlide.split(/\s+/).length

      if (wordCount <= wordLimit) {
        currentSlide = testSlide
      } else {
        // Save current slide if it has content
        if (currentSlide) {
          slides.push({
            chapter_id: chapterId,
            order_number: slideOrder++,
            content: currentSlide
          })
        }
        // Start new slide with current sentence
        currentSlide = trimmedSentence + '.'
      }
    }

    // Add the last slide if it has content
    if (currentSlide) {
      slides.push({
        chapter_id: chapterId,
        order_number: slideOrder,
        content: currentSlide
      })
    }

    // Delete existing slides for this chapter
    await supabase
      .from('slides')
      .delete()
      .eq('chapter_id', chapterId)

    // Insert new slides
    const { error: insertError } = await supabase
      .from('slides')
      .insert(slides)

    if (insertError) {
      console.error('Error inserting slides:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create slides' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update chapter slide count
    const { error: updateError } = await supabase
      .from('chapters')
      .update({ 
        slide_count: slides.length,
        word_count: text.split(/\s+/).length
      })
      .eq('id', chapterId)

    if (updateError) {
      console.error('Error updating chapter:', updateError)
    }

    console.log(`Successfully created ${slides.length} slides for chapter ${chapterId}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        slideCount: slides.length,
        slides: slides 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in split-chapter function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})