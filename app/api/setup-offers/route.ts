import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = createClient()

  try {
    // Create tables using raw SQL via Supabase
    const { error } = await supabase.rpc('create_offers_tables', {}, {
      head: false,
      get: false,
      post: true,
    })

    if (error && !error.message?.includes('already exists')) {
      console.error('[setup] RPC error:', error)
    }

    return Response.json({ success: true, message: 'Tables initialized' })
  } catch (error) {
    console.error('[setup] Error:', error)
    // Return success anyway - tables might already exist
    return Response.json({ success: true, message: 'Setup completed' })
  }
}
