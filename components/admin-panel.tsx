'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Offer {
  id: string
  title: string
  description: string
  price: string
  image_url: string
}

export function AdminPanel() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [offers, setOffers] = useState<Offer[]>([])
  const [timerHours, setTimerHours] = useState(24)
  const [loading, setLoading] = useState(false)
  const [ps5Name, setPs5Name] = useState('PlayStation 5')
  const [ps5Loading, setPs5Loading] = useState(false)

  // Form state for new offer
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
  })

  const [editingId, setEditingId] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      setAuthenticated(true)
      loadOffers()
      loadSiteSettings()
    } else {
      alert('Invalid password')
      setPassword('')
    }
  }

  const loadOffers = async () => {
    try {
      const res = await fetch('/api/offers')
      const data = await res.json()
      setOffers(data.offers || [])
    } catch (error) {
      console.error('[admin] Error loading offers:', error)
    }
  }

  const loadSiteSettings = async () => {
    try {
      const res = await fetch('/api/site-settings')
      const data = await res.json()
      if (data.settings?.primary_ps5_name) {
        setPs5Name(data.settings.primary_ps5_name)
      }
    } catch (error) {
      console.error('[admin] Error loading site settings:', error)
    }
  }

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const action = editingId ? 'update' : 'create'
      const body = editingId
        ? { ...formData, id: editingId, action }
        : { ...formData, action }

      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Failed to save offer')

      const newOffer = await res.json()

      if (editingId) {
        setOffers(offers.map((o) => (o.id === editingId ? newOffer : o)))
        setEditingId(null)
      } else {
        setOffers([...offers, newOffer])
      }

      setFormData({ title: '', description: '', price: '', image_url: '' })
    } catch (error) {
      console.error('[admin] Error saving offer:', error)
      alert('Failed to save offer')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ id, action: 'delete' }),
      })

      if (!res.ok) throw new Error('Failed to delete offer')

      setOffers(offers.filter((o) => o.id !== id))
    } catch (error) {
      console.error('[admin] Error deleting offer:', error)
      alert('Failed to delete offer')
    }
  }

  const handleEditOffer = (offer: Offer) => {
    setFormData({
      title: offer.title,
      description: offer.description,
      price: offer.price,
      image_url: offer.image_url,
    })
    setEditingId(offer.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdateTimer = async () => {
    try {
      const res = await fetch('/api/offer-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ hours: timerHours }),
      })

      if (!res.ok) throw new Error('Failed to update timer')

      alert('Timer updated successfully!')
      router.refresh()
    } catch (error) {
      console.error('[admin] Error updating timer:', error)
      alert('Failed to update timer')
    }
  }

  const handleUpdatePs5Name = async () => {
    setPs5Loading(true)
    try {
      const res = await fetch('/api/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ key: 'primary_ps5_name', value: ps5Name }),
      })

      if (!res.ok) throw new Error('Failed to update PS5 name')

      alert('PS5 name updated successfully!')
    } catch (error) {
      console.error('[admin] Error updating PS5 name:', error)
      alert('Failed to update PS5 name')
    } finally {
      setPs5Loading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600 mb-6">Enter admin password to access</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => {
              setAuthenticated(false)
              setPassword('')
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* PS5 Name Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">PS5 Section Settings</h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary PS5 Name
              </label>
              <input
                type="text"
                value={ps5Name}
                onChange={(e) => setPs5Name(e.target.value)}
                placeholder="e.g., PlayStation 5, PS5 Plus"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleUpdatePs5Name}
              disabled={ps5Loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
            >
              {ps5Loading ? 'Saving...' : 'Update Name'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This name will be displayed in the PS5 category section on the homepage
          </p>
        </div>

        {/* Timer Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Timer Settings</h2>
          <div className="flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Countdown Duration (hours)
              </label>
              <input
                type="number"
                value={timerHours}
                onChange={(e) => setTimerHours(Math.max(1, parseInt(e.target.value) || 24))}
                min="1"
                max="168"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
              />
            </div>
            <button
              onClick={handleUpdateTimer}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Update Timer
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Timer auto-resets every 24 hours at midnight UTC</p>
        </div>

        {/* Add/Edit Offer Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {editingId ? 'Edit Offer' : 'Add New Offer'}
          </h2>
          <form onSubmit={handleAddOffer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Premium Headphones"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., $99.99"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : editingId ? 'Update Offer' : 'Add Offer'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ title: '', description: '', price: '', image_url: '' })
                  }}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Offers List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today&apos;s Offers ({offers.length})</h2>

          {offers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No offers added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{offer.title}</td>
                      <td className="py-3 px-4 text-gray-900 font-semibold">{offer.price}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {offer.description}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditOffer(offer)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
