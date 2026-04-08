'use client'

import { useEffect, useState } from 'react'
import { CountdownTimer } from './countdown-timer'

interface Offer {
  id: string
  title: string
  description: string
  price: string
  image_url: string
  category_id: string | null
  created_at: string
}

interface Category {
  id: string
  name: string
}

interface CategoryTimer {
  id: string
  category_id: string
  timer_end_time: string
}

export function CategorizedTodaysOfferSection() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryTimers, setCategoryTimers] = useState<Record<string, CategoryTimer>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch('/api/categories')
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])

        // Fetch all offers
        const offersRes = await fetch('/api/offers')
        const offersData = await offersRes.json()
        setOffers(offersData.offers || [])

        // Fetch timers for each category
        if (categoriesData.categories && categoriesData.categories.length > 0) {
          const timers: Record<string, CategoryTimer> = {}
          for (const category of categoriesData.categories) {
            try {
              const timerRes = await fetch(`/api/category-timers/${category.id}`)
              const timerData = await timerRes.json()
              timers[category.id] = timerData
            } catch (error) {
              console.error(`Error fetching timer for category ${category.id}:`, error)
            }
          }
          setCategoryTimers(timers)
        }
      } catch (error) {
        console.error('[categorized-offers] Error fetching:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading offers...</p>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0 && offers.length === 0) {
    return null
  }

  // Group offers by category
  const offersByCategory: Record<string, Offer[]> = {}
  const uncategorizedOffers: Offer[] = []

  offers.forEach((offer) => {
    if (offer.category_id) {
      if (!offersByCategory[offer.category_id]) {
        offersByCategory[offer.category_id] = []
      }
      offersByCategory[offer.category_id].push(offer)
    } else {
      uncategorizedOffers.push(offer)
    }
  })

  return (
    <section className="py-12 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Today&apos;s Offers</h2>
          <p className="text-gray-600 mb-8">Limited time deals across categories</p>

          {/* Category Sections with Individual Timers */}
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryOffers = offersByCategory[category.id] || []
              if (categoryOffers.length === 0) return null

              const timer = categoryTimers[category.id]

              return (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">Category deals</p>
                    </div>
                    {timer && <CountdownTimer endTime={timer.timer_end_time} />}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryOffers.map((offer) => (
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
                          <h4 className="text-lg font-semibold text-gray-900">{offer.title}</h4>
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
                </div>
              )
            })}

            {/* Uncategorized Offers */}
            {uncategorizedOffers.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">More Deals</h3>
                  <p className="text-gray-600 text-sm mt-1">Special offers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uncategorizedOffers.map((offer) => (
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
                        <h4 className="text-lg font-semibold text-gray-900">{offer.title}</h4>
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
              </div>
            )}
          </div>

          {/* Show message if no offers at all */}
          {offers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No offers available at the moment</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
