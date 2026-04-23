'use client'

import { useState, useEffect } from 'react'

interface PricingTier {
  id: string
  duration: string
  price: number
  popular?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    id: '1-month',
    duration: '1 Month',
    price: 250,
    popular: false,
  },
  {
    id: '3-months',
    duration: '3 Months',
    price: 600,
    popular: true,
  },
]

export function PS5Category() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [ps5Name, setPs5Name] = useState('PlayStation 5')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings')
        const data = await res.json()
        if (data.settings?.primary_ps5_name) {
          setPs5Name(data.settings.primary_ps5_name)
        }
      } catch (error) {
        console.error('[ps5-category] Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId)
  }

  const handlePurchase = () => {
    if (!selectedTier) {
      alert('Please select a subscription plan')
      return
    }
    const tier = pricingTiers.find((t) => t.id === selectedTier)
    if (tier) {
      alert(`Proceeding to purchase ${ps5Name} ${tier.duration} subscription for ${tier.price} EGP`)
      // TODO: Integrate with payment gateway
    }
  }

  return (
    <section className="py-16 bg-gradient-to-b from-blue-900 to-black">
      <div className="max-w-6xl mx-auto px-4">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg shadow-blue-600/30">
              <span className="text-2xl font-bold tracking-wide">PS5</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            {ps5Name}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience the next generation of gaming. Choose your plan and start playing today!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              onClick={() => handleSelectTier(tier.id)}
              className={`relative cursor-pointer rounded-2xl p-8 transition-all duration-300 ${
                selectedTier === tier.id
                  ? 'bg-blue-600 scale-105 shadow-2xl shadow-blue-600/30'
                  : 'bg-gray-800 hover:bg-gray-750 hover:scale-102'
              } ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Best Value
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {tier.duration}
                </h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-300 ml-2">EGP</span>
                </div>

                {/* Features */}
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-3 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Online Multiplayer
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-3 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Free Monthly Games
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-3 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Exclusive Discounts
                  </li>
                  <li className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-3 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Cloud Storage
                  </li>
                </ul>

                {/* Selection indicator */}
                <div
                  className={`w-6 h-6 mx-auto rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedTier === tier.id
                      ? 'border-white bg-white'
                      : 'border-gray-500'
                  }`}
                >
                  {selectedTier === tier.id && (
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Purchase Button */}
        <div className="text-center">
          <button
            onClick={handlePurchase}
            disabled={!selectedTier}
            className={`px-12 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              selectedTier
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-600/40'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Get {ps5Name} Now
          </button>
          <p className="text-gray-500 text-sm mt-4">
            Instant delivery via email after payment
          </p>
        </div>
      </div>
    </section>
  )
}
