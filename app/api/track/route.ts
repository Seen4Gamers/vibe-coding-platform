import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { path, referrer, userAgent, deviceType, browser, os } = body

    const supabase = await createClient()
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : headersList.get('x-real-ip') || 'unknown'

    // Insert page view
    const { error } = await supabase.from('page_views').insert({
      path,
      referrer: referrer || null,
      user_agent: userAgent,
      ip_address: ipAddress,
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
