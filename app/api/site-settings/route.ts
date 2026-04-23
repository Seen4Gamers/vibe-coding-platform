import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')

    if (error) throw error

    // Convert array to object for easier access
    const settings: Record<string, string> = {}
    data?.forEach((row) => {
      settings[row.setting_key] = row.setting_value
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('[api/site-settings] GET error:', error)
    return NextResponse.json({ settings: {} }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        {
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'setting_key' }
      )
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[api/site-settings] POST error:', error)
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
  }
}
