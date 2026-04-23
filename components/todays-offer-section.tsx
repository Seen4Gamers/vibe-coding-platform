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

  const handleTimerReset = useCallback(() => {
    // Refresh offers when timer resets
    fetchOffers()
  }, [fetchOffers])

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with glowing timer */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="text-center md:text-left">
              <div className="inline-block mb-2">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                  Limited Time
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Today&apos;s Offers
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Grab these deals before time runs out!
              </p>
            </div>
            
            {/* Glowing countdown timer */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                Offers reset in
              </span>
              <CountdownTimer 
                endTime={settings?.timer_end_time} 
                onReset={handleTimerReset}
              />
            </div>
          </div>
        </div>

        {/* Offers grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
            <p className="text-gray-500 mt-4">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🎁</div>
            <p className="text-gray-500 text-lg">No offers available at the moment</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
              >
                {offer.image_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        HOT DEAL
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{offer.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-3xl font-bold text-orange-600">{offer.price}</span>
                    <button className="px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm font-bold shadow-lg hover:shadow-orange-500/30">
                      View Deal
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
