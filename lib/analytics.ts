import { createClient } from "@/lib/supabase/client"

export async function trackPageView(path: string, referrer?: string) {
  try {
    const supabase = createClient()
    
    // Get user agent and parse device info
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const deviceType = getDeviceType(userAgent)
    const browser = getBrowser(userAgent)
    const os = getOS(userAgent)

    await supabase.from("page_views").insert({
      path,
      referrer: referrer || (typeof document !== 'undefined' ? document.referrer : null),
      user_agent: userAgent,
      device_type: deviceType,
      browser,
      os,
    })
  } catch (error) {
    console.error("[analytics] Failed to track page view:", error)
  }
}

function getDeviceType(userAgent: string): string {
  if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
    return /ipad/i.test(userAgent) ? 'tablet' : 'mobile'
  }
  return 'desktop'
}

function getBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent) && !/edge|chromium/i.test(userAgent)) return 'Chrome'
  if (/safari/i.test(userAgent) && !/chrome|android/i.test(userAgent)) return 'Safari'
  if (/firefox/i.test(userAgent)) return 'Firefox'
  if (/edge|edg/i.test(userAgent)) return 'Edge'
  return 'Other'
}

function getOS(userAgent: string): string {
  if (/windows/i.test(userAgent)) return 'Windows'
  if (/mac/i.test(userAgent)) return 'macOS'
  if (/linux/i.test(userAgent)) return 'Linux'
  if (/iphone|ipad|ios/i.test(userAgent)) return 'iOS'
  if (/android/i.test(userAgent)) return 'Android'
  return 'Other'
}
