import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(req) {
  // Add detailed logging
  console.log('Incoming request headers:', req.headers);
  console.log('Expected token:', process.env.CRON_SECRET);
  
  const authHeader = req.headers.get('authorization');
  console.log('Auth header received:', authHeader);
  
  // Check if we're in production
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Log the full comparison
  console.log('Header comparison:', {
    received: authHeader,
    expected: `Bearer ${process.env.CRON_SECRET}`,
    matches: authHeader === `Bearer ${process.env.CRON_SECRET}`
  });

  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('Auth failed - returning 401');
    return Response.json({ 
      error: 'Unauthorized',
      authReceived: authHeader,
      expectedFormat: `Bearer ${process.env.CRON_SECRET}` 
    }, { status: 401 });
  }

  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    console.log('Checking for scheduled posts...');
    
    const { data: duePosts, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_time', new Date().toISOString())

    if (fetchError) throw fetchError;

    console.log(`Found ${duePosts?.length || 0} posts to process`);

    // Get the base URL from the request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.creatortask.com';

    for (const post of duePosts) {
      console.log('Processing post:', post.id);
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
            const response = await fetch(`${baseUrl}/api/post/twitter`, {
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
        console.error('Error processing post:', post.id, error);
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
      processed: duePosts?.length || 0
    })

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 })
  }
} 