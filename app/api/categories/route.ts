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
  const supabase = await createClient()

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    return Response.json({ categories: categories || [] })
  } catch (error) {
    console.error('[categories] GET error:', error)
    return Response.json({ categories: [] })
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const body = await request.json()

  try {
    const { id, name, action } = body

    if (action === 'create') {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name })
        .select()

      if (error) throw error
      return Response.json(data[0])
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      return Response.json({ success: true })
    }

    if (action === 'update') {
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .select()

      if (error) throw error
      return Response.json(data[0])
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[categories] POST error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
