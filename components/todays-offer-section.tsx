'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const fetchOffers = async () => {
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
    }

    fetchOffers()
    const interval = setInterval(fetchOffers, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (!settings) return null

  return (
    <section className="py-12 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Today&apos;s Offer</h2>
              <p className="text-gray-600 mt-1">Limited time deals</p>
            </div>
            {settings && <CountdownTimer endTime={settings.timer_end_time} />}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No offers available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
              >
                {offer.image_url && (
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{offer.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">{offer.price}</span>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
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
