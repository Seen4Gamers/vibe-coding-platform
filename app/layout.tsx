import type { Metadata } from 'next'
import './globals.css'
import { AnalyticsTracker } from '@/components/analytics-tracker'

export const metadata: Metadata = {
  title: 'Vibe Coding Platform',
  description: 'Learn to code with real-time analytics and insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  )
}
