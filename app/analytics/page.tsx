'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface PageView {
  id: string
  path: string
  referrer: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  created_at: string
}

export default function AnalyticsDashboard() {
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    unique: 0,
    today: 0,
    devices: {} as Record<string, number>,
    browsers: {} as Record<string, number>,
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      const views = data as PageView[]
      setPageViews(views)

      // Calculate stats
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      const uniquePaths = new Set(views.map(v => v.path)).size
      const todayCount = views.filter(v => new Date(v.created_at) >= today).length
      
      const devices: Record<string, number> = {}
      const browsers: Record<string, number> = {}
      
      views.forEach(view => {
        if (view.device_type) devices[view.device_type] = (devices[view.device_type] || 0) + 1
        if (view.browser) browsers[view.browser] = (browsers[view.browser] || 0) + 1
      })

      setStats({
        total: views.length,
        unique: uniquePaths,
        today: todayCount,
        devices,
        browsers,
      })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Vibe Analytics
          </Link>
          <Link href="/" className="text-foreground hover:text-primary">
            ← Back to Home
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Website Analytics</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Real-time visitor tracking and insights
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-primary text-primary-foreground rounded-lg p-6">
                <p className="text-sm opacity-90 mb-1">Total Views</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="bg-accent text-accent-foreground rounded-lg p-6">
                <p className="text-sm opacity-90 mb-1">Unique Pages</p>
                <p className="text-3xl font-bold">{stats.unique}</p>
              </div>
              <div className="bg-gray-700 text-white rounded-lg p-6">
                <p className="text-sm opacity-90 mb-1">Today</p>
                <p className="text-3xl font-bold">{stats.today}</p>
              </div>
              <div className="bg-gray-600 text-white rounded-lg p-6">
                <p className="text-sm opacity-90 mb-1">Devices</p>
                <p className="text-3xl font-bold">{Object.keys(stats.devices).length}</p>
              </div>
            </div>

            {/* Breakdown Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Device Breakdown */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-foreground">Device Breakdown</h2>
                <div className="space-y-3">
                  {Object.entries(stats.devices).map(([device, count]) => (
                    <div key={device}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-foreground capitalize">{device}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browser Breakdown */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-foreground">Browser Breakdown</h2>
                <div className="space-y-3">
                  {Object.entries(stats.browsers).map(([browser, count]) => (
                    <div key={browser}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{browser}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `(count / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Views Table */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-foreground">Recent Visitors</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Page</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Device</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Browser</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">OS</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {pageViews.map((view) => (
                      <tr key={view.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 text-sm text-foreground font-medium">{view.path}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">{view.device_type || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{view.browser || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{view.os || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(view.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
