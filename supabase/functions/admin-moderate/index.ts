import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ModerationRequest {
  adminId: string
  action: 'approve' | 'reject' | 'delete' | 'suspend'
  targetType: 'story' | 'chapter' | 'comment' | 'user'
  targetId: string
  reason?: string
  notes?: string
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

    const { adminId, action, targetType, targetId, reason, notes }: ModerationRequest = await req.json()

    if (!adminId || !action || !targetType || !targetId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Admin ${adminId} performing ${action} on ${targetType} ${targetId}`)

    // Verify admin permissions
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('role')
      .eq('user_id', adminId)
      .single()

    if (adminError || !admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let result = { success: false, message: '' }

    // Perform the moderation action
    switch (targetType) {
      case 'story':
        switch (action) {
          case 'approve':
            await supabase.from('stories').update({ status: 'published' }).eq('id', targetId)
            result = { success: true, message: 'Story approved and published' }
            break
          case 'reject':
            await supabase.from('stories').update({ status: 'rejected' }).eq('id', targetId)
            result = { success: true, message: 'Story rejected' }
            break
          case 'delete':
            await supabase.from('stories').delete().eq('id', targetId)
            result = { success: true, message: 'Story deleted' }
            break
        }
        break

      case 'chapter':
        switch (action) {
          case 'approve':
            await supabase.from('chapters').update({ status: 'published' }).eq('id', targetId)
            result = { success: true, message: 'Chapter approved and published' }
            break
          case 'reject':
            await supabase.from('chapters').update({ status: 'rejected' }).eq('id', targetId)
            result = { success: true, message: 'Chapter rejected' }
            break
          case 'delete':
            await supabase.from('chapters').delete().eq('id', targetId)
            result = { success: true, message: 'Chapter deleted' }
            break
        }
        break

      case 'comment':
        switch (action) {
          case 'delete':
            await supabase.from('comments').delete().eq('id', targetId)
            result = { success: true, message: 'Comment deleted' }
            break
        }
        break

      case 'user':
        switch (action) {
          case 'suspend':
            // Note: This would typically involve updating user status in profiles
            await supabase.from('profiles').update({ status: 'suspended' }).eq('user_id', targetId)
            result = { success: true, message: 'User suspended' }
            break
        }
        break
    }

    // Log the moderation action
    const { error: logError } = await supabase
      .from('moderation_logs')
      .insert({
        admin_id: adminId,
        action: action,
        target_id: targetId,
        target_type: targetType,
        notes: notes || reason || ''
      })

    if (logError) {
      console.error('Error logging moderation action:', logError)
    }

    // Send notification to target user (for story/chapter actions)
    if (targetType === 'story' || targetType === 'chapter') {
      const table = targetType === 'story' ? 'stories' : 'chapters'
      const { data: targetData } = await supabase
        .from(table)
        .select('author_id, title')
        .eq('id', targetId)
        .single()

      if (targetData) {
        await supabase
          .from('notifications')
          .insert({
            user_id: targetData.author_id,
            type: 'admin_update',
            message: `Your ${targetType} "${targetData.title}" has been ${action}ed by an admin${reason ? `: ${reason}` : ''}`,
            seen: false
          })
      }
    }

    console.log(`Successfully completed moderation action: ${action} on ${targetType} ${targetId}`)

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in admin-moderate function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})