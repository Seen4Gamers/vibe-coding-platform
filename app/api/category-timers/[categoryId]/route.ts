import { createClient } from '@/lib/supabase/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return false
  }
  return true
}

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  const supabase = await createClient()
  const categoryId = params.categoryId

  try {
    const { data: timer, error } = await supabase
      .from('category_timers')
      .select('*')
      .eq('category_id', categoryId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    // If no timer exists, return default
    if (!timer) {
      return Response.json({
        id: `default-${categoryId}`,
        category_id: categoryId,
        timer_end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      })
    }

    return Response.json(timer)
  } catch (error) {
    console.error('[category-timer] GET error:', error)
    return Response.json(
      {
        id: `default-${categoryId}`,
        category_id: categoryId,
        timer_end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      },
      { status: 200 }
    )
  }
}

export async function POST(request: Request, { params }: { params: { categoryId: string } }) {
  if (!(await verifyAdmin(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const categoryId = params.categoryId
  const body = await request.json()

  try {
    const { hours = 24 } = body

    // Calculate new end time
    const newEndTime = new Date(Date.now() + hours * 60 * 60 * 1000)

    // Try to update existing, if not exists create new
    const { data: existing } = await supabase
      .from('category_timers')
      .select('id')
      .eq('category_id', categoryId)
      .single()

    let result

    if (existing) {
      const { data, error } = await supabase
        .from('category_timers')
        .update({ timer_end_time: newEndTime.toISOString() })
        .eq('category_id', categoryId)
        .select()

      if (error) throw error
      result = data[0]
    } else {
      const { data, error } = await supabase
        .from('category_timers')
        .insert({
          category_id: categoryId,
          timer_end_time: newEndTime.toISOString(),
        })
        .select()

      if (error) throw error
      result = data[0]
    }

    return Response.json(result)
  } catch (error) {
    console.error('[category-timer] POST error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
