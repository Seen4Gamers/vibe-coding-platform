import { createClient } from '@/lib/supabase/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return false
  }
  return true
}

export async function GET() {
  const supabase = createClient()

  try {
    const { data: settings, error } = await supabase
      .from('offer_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') throw error

    // If no settings exist, return default
    if (!settings) {
      return Response.json({
        id: 'default',
        timer_end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      })
    }

    return Response.json(settings)
  } catch (error) {
    console.error('[timer] GET error:', error)
    return Response.json(
      {
        id: 'default',
        timer_end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      },
      { status: 200 }
    )
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const body = await request.json()

  try {
    const { hours = 24 } = body

    // Calculate new end time
    const newEndTime = new Date(Date.now() + hours * 60 * 60 * 1000)

    // Try to update existing, if not exists create new
    const { data: existing } = await supabase
      .from('offer_settings')
      .select('id')
      .single()

    let result

    if (existing) {
      const { data, error } = await supabase
        .from('offer_settings')
        .update({ timer_end_time: newEndTime.toISOString() })
        .eq('id', existing.id)
        .select()

      if (error) throw error
      result = data[0]
    } else {
      const { data, error } = await supabase
        .from('offer_settings')
        .insert({ timer_end_time: newEndTime.toISOString() })
        .select()

      if (error) throw error
      result = data[0]
    }

    return Response.json(result)
  } catch (error) {
    console.error('[timer] POST error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
