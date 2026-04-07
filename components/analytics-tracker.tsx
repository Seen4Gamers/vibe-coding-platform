'use client'

import { useEffect } from 'react'

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

export function AnalyticsTracker() {
  useEffect(() => {
    const path = window.location.pathname
    const userAgent = navigator.userAgent
    const deviceType = getDeviceType(userAgent)
    const browser = getBrowser(userAgent)
    const os = getOS(userAgent)
    const referrer = document.referrer

    // Send tracking data to API
    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        userAgent,
        deviceType,
        browser,
        os,
        referrer,
      }),
    }).catch(err => console.error('[analytics] Failed to track:', err))
  }, [])

  return null
}
