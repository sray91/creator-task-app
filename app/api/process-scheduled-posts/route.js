import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(req) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Get all due scheduled posts
    const { data: duePosts, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_time', new Date().toISOString())

    if (fetchError) throw fetchError

    for (const post of duePosts) {
      try {
        // Get selected platforms
        const selectedAccounts = Object.entries(post.platforms)
          .filter(([_, isSelected]) => isSelected)
          .map(([accountId]) => accountId)

        // Get account details
        const { data: accounts } = await supabase
          .from('social_accounts')
          .select('*')
          .in('id', selectedAccounts)

        // Post to each platform
        for (const account of accounts) {
          if (account.platform === 'twitter') {
            const response = await fetch(`${req.headers.get('origin')}/api/post/twitter`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: post.content,
                accessToken: account.access_token,
                mediaFiles: post.media_files
              })
            })

            if (!response.ok) {
              throw new Error(`Failed to post to Twitter: ${response.statusText}`)
            }
          }
        }

        // Update post status to published
        await supabase
          .from('posts')
          .update({ status: 'published' })
          .eq('id', post.id)

      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error)
        // Mark post as failed
        await supabase
          .from('posts')
          .update({ 
            status: 'failed',
            error_message: error.message 
          })
          .eq('id', post.id)
      }
    }

    return Response.json({ 
      success: true, 
      processed: duePosts.length 
    })

  } catch (error) {
    console.error('Error processing scheduled posts:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
} 