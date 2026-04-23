import Link from 'next/link'
import { TodaysOfferSection } from '@/components/todays-offer-section'
import { NetflixCategory } from '@/components/netflix-category'
import { PS5Category } from '@/components/ps5-category'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Seen4Games</h1>
          <div className="flex gap-4 items-center">
            <Link href="/admin" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:opacity-90 transition text-sm">
              Admin
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
            Welcome to Seen4Games
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your ultimate destination for gaming subscriptions and streaming services. Get the best deals on Netflix, PS5, and more!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/#offers" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
              View Today&apos;s Offers
            </Link>
            <Link href="/#features" className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition">
              Browse Categories
            </Link>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mb-20">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Why Choose Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Instant Delivery</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Get your subscription codes delivered instantly to your email. No waiting, no hassle.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">100% Genuine</h4>
              <p className="text-gray-600 dark:text-gray-400">
                All our codes are authentic and sourced directly from official distributors.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 bg-gray-700 text-white rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Best Prices</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Competitive pricing on all subscriptions. Save money on your favorite services.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Today's Offer Section */}
      <div id="offers">
        <TodaysOfferSection />
      </div>

      {/* Netflix Category Section */}
      <NetflixCategory />

      {/* PS5 Category Section */}
      <PS5Category />

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>Seen4Games - Your Gaming & Streaming Subscription Store</p>
        </div>
      </footer>
    </div>
  )
}
