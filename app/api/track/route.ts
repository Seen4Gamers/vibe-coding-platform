import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { path, referrer, userAgent, deviceType, browser, os } = body

    const supabase = await createClient()

    // Insert page view - only use columns that exist in the schema
    const { error } = await supabase.from('page_views').insert({
      path,
      referrer: referrer || null,
      user_agent: userAgent,
      device_type: deviceType,
      browser,
      os,
    })

    if (error) {
      console.error('Insert error:', error)
      // Don't throw - just log. Table might not exist yet but we still want to track
      return NextResponse.json({ tracked: false, error: error.message })
    }

    return NextResponse.json({ tracked: true })
  } catch (error) {
    console.error('Tracking error:', error)
    return NextResponse.json({ tracked: false }, { status: 500 })
  }
}
