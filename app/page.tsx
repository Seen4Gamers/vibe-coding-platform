import Link from 'next/link'
import { TodaysOfferSection } from '@/components/todays-offer-section'
import { NetflixCategory } from '@/components/netflix-category'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Vibe Coding Platform</h1>
          <div className="flex gap-4 items-center">
            <Link href="/admin" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:opacity-90 transition text-sm">
              Admin
            </Link>
            <Link href="/analytics" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
              View Analytics
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
            Welcome to Vibe
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your coding platform with real-time analytics. Track every visitor, understand your audience, and grow your community.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/analytics" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
              View Analytics Dashboard
            </Link>
            <Link href="/#features" className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition">
              Learn More
            </Link>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mb-20">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                📊
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Real-time Analytics</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Track every visitor in real-time. See exactly who is viewing your website, when, and from where.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                🎯
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Device Insights</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Understand your audience better. See device types, browsers, and operating systems.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-gray-700 text-white rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                ⚡
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Fast & Reliable</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Powered by Supabase for lightning-fast analytics. Always available, always accurate.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Preview */}
        <section className="bg-white dark:bg-gray-900 p-12 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Your Analytics Dashboard</h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Click the button above to see real-time visitor data and detailed breakdowns by device, browser, and more.
          </p>
          <div className="flex justify-center">
            <Link href="/analytics" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
              Open Dashboard
            </Link>
          </div>
        </section>
      </main>

      {/* Netflix Category Section */}
      <NetflixCategory />

      {/* Today's Offer Section - With 24-hour auto-reset timer */}
      <TodaysOfferSection />

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>Built with Next.js and Supabase | Analytics powered by Vibe</p>
        </div>
      </footer>
    </div>
  )
}
