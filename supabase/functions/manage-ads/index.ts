import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdRequest {
  adminId: string
  action: 'create' | 'update' | 'delete' | 'schedule'
  adId?: string
  adData?: {
    videoUrl: string
    startDate: string
    endDate: string
  }
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

    const { adminId, action, adId, adData }: AdRequest = await req.json()

    if (!adminId || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify admin permissions
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('role')
      .eq('user_id', adminId)
      .single()

    if (adminError || !admin || !['super_admin', 'ad_manager'].includes(admin.role)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Ad manager access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let result = { success: false, message: '', data: null }

    switch (action) {
      case 'create':
        if (!adData) {
          return new Response(
            JSON.stringify({ error: 'Ad data required for create action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data: newAd, error: createError } = await supabase
          .from('ads')
          .insert({
            video_url: adData.videoUrl,
            start_date: adData.startDate,
            end_date: adData.endDate,
            impressions: 0,
            clicks: 0
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating ad:', createError)
          return new Response(
            JSON.stringify({ error: 'Failed to create ad' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        result = { success: true, message: 'Ad created successfully', data: newAd }
        break

      case 'update':
        if (!adId || !adData) {
          return new Response(
            JSON.stringify({ error: 'Ad ID and data required for update action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data: updatedAd, error: updateError } = await supabase
          .from('ads')
          .update({
            video_url: adData.videoUrl,
            start_date: adData.startDate,
            end_date: adData.endDate
          })
          .eq('id', adId)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating ad:', updateError)
          return new Response(
            JSON.stringify({ error: 'Failed to update ad' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        result = { success: true, message: 'Ad updated successfully', data: updatedAd }
        break

      case 'delete':
        if (!adId) {
          return new Response(
            JSON.stringify({ error: 'Ad ID required for delete action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { error: deleteError } = await supabase
          .from('ads')
          .delete()
          .eq('id', adId)

        if (deleteError) {
          console.error('Error deleting ad:', deleteError)
          return new Response(
            JSON.stringify({ error: 'Failed to delete ad' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        result = { success: true, message: 'Ad deleted successfully', data: null }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // Log the admin action
    await supabase
      .from('moderation_logs')
      .insert({
        admin_id: adminId,
        action: `ad_${action}`,
        target_id: adId || 'new',
        target_type: 'ad',
        notes: `${action} ad operation`
      })

    console.log(`Successfully completed ad ${action} by admin ${adminId}`)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in manage-ads function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})