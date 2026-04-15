'use client'

import { useEffect, useState, useCallback } from 'react'
import { CountdownTimer } from './countdown-timer'

interface Offer {
  id: string
  title: string
  description: string
  price: string
  image_url: string
  created_at: string
}

interface Settings {
  timer_end_time: string
}

export function TodaysOfferSection() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch('/api/offers')
      const data = await res.json()
      setOffers(data.offers || [])
      setSettings(data.settings || null)
    } catch (error) {
      console.error('[todays-offer] Error fetching:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
    const interval = setInterval(fetchOffers, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [fetchOffers])

  const handleTimerExpire = useCallback(async () => {
    // Auto-reset the timer to 24 hours when it expires
    try {
      await fetch('/api/offer-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hours: 24, autoReset: true }),
      })
      // Refresh to get the new timer
      setTimeout(() => {
        fetchOffers()
      }, 1000)
    } catch (error) {
      console.error('[todays-offer] Error auto-resetting timer:', error)
    }
  }, [fetchOffers])

  // Calculate default end time if no settings (24 hours from now)
  const getEndTime = () => {
    if (settings?.timer_end_time) {
      return settings.timer_end_time
    }
    return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Timer */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Limited Time
                </span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide animate-pulse">
                  Hot Deals
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Today&apos;s Offers</h2>
              <p className="text-gray-600 mt-2">Grab these deals before time runs out! Resets every 24 hours.</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ends in</span>
              <CountdownTimer endTime={getEndTime()} onExpire={handleTimerExpire} />
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers available</h3>
            <p className="text-gray-500">Check back later or add offers from the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group hover:-translate-y-1"
              >
                {offer.image_url ? (
                  <div className="relative overflow-hidden">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        DEAL
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-52 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <span className="text-6xl">🎁</span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-orange-600">{offer.price}</span>
                      <span className="text-gray-400 text-sm ml-1">EGP</span>
                    </div>
                    <button className="px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm font-semibold shadow-lg shadow-orange-200 hover:shadow-orange-300">
                      Get Deal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
