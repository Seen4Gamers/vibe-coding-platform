import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Admin password - in production, use environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return false
  }
  return true
}

async function ensureTables(supabase: any) {
  try {
    // Check if tables exist, if not create them
    const { data: offers } = await supabase
      .from('daily_offers')
      .select('id')
      .limit(1)

    if (!offers) {
      // Tables don't exist, create them
      await supabase.rpc('create_offers_tables')
    }
  } catch (error) {
    console.error('[setup] Error checking tables:', error)
  }
}

export async function GET() {
  const supabase = createClient()
  
  try {
    await ensureTables(supabase)
    
    const { data: offers, error } = await supabase
      .from('daily_offers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const { data: settings } = await supabase
      .from('offer_settings')
      .select('*')
      .single()

    return Response.json({ offers, settings })
  } catch (error) {
    console.error('[offers] GET error:', error)
    return Response.json({ offers: [], settings: null })
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const body = await request.json()

  try {
    const { id, title, description, price, image_url, action } = body

    if (action === 'create') {
      const { data, error } = await supabase
        .from('daily_offers')
        .insert({
          title,
          description,
          price,
          image_url,
        })
        .select()

      if (error) throw error
      return Response.json(data[0])
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('daily_offers')
        .delete()
        .eq('id', id)

      if (error) throw error
      return Response.json({ success: true })
    }

    if (action === 'update') {
      const { data, error } = await supabase
        .from('daily_offers')
        .update({ title, description, price, image_url })
        .eq('id', id)
        .select()

      if (error) throw error
      return Response.json(data[0])
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[offers] POST error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
