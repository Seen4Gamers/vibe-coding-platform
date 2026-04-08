'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Offer {
  id: string
  title: string
  description: string
  price: string
  image_url: string
  category_id: string | null
}

interface Category {
  id: string
  name: string
}

export function EnhancedAdminPanel() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [offers, setOffers] = useState<Offer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryTimers, setCategoryTimers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)

  // Category Management
  const [newCategoryName, setNewCategoryName] = useState('')

  // Form state for new offer
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
  })

  const [editingId, setEditingId] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      setAuthenticated(true)
      loadData()
    } else {
      alert('Invalid password')
      setPassword('')
    }
  }

  const loadData = async () => {
    try {
      // Load categories
      const categoriesRes = await fetch('/api/categories')
      const categoriesData = await categoriesRes.json()
      setCategories(categoriesData.categories || [])

      // Load offers
      const offersRes = await fetch('/api/offers')
      const offersData = await offersRes.json()
      setOffers(offersData.offers || [])

      // Load timers for each category
      if (categoriesData.categories && categoriesData.categories.length > 0) {
        const timers: Record<string, number> = {}
        for (const category of categoriesData.categories) {
          timers[category.id] = 24 // Default to 24 hours
        }
        setCategoryTimers(timers)
      }
    } catch (error) {
      console.error('[admin] Error loading data:', error)
    }
  }

  // Category Management
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ name: newCategoryName, action: 'create' }),
      })

      if (!res.ok) throw new Error('Failed to add category')

      const newCategory = await res.json()
      setCategories([...categories, newCategory])
      setCategoryTimers({ ...categoryTimers, [newCategory.id]: 24 })
      setNewCategoryName('')
    } catch (error) {
      console.error('[admin] Error adding category:', error)
      alert('Failed to add category')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category and all its offers?')) return

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ id, action: 'delete' }),
      })

      if (!res.ok) throw new Error('Failed to delete category')

      setCategories(categories.filter((c) => c.id !== id))
      const { [id]: _, ...rest } = categoryTimers
      setCategoryTimers(rest)
    } catch (error) {
      console.error('[admin] Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const handleUpdateCategoryTimer = async (categoryId: string, hours: number) => {
    try {
      const res = await fetch(`/api/category-timers/${categoryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ hours }),
      })

      if (!res.ok) throw new Error('Failed to update timer')

      setCategoryTimers({ ...categoryTimers, [categoryId]: hours })
      alert('Timer updated successfully!')
    } catch (error) {
      console.error('[admin] Error updating timer:', error)
      alert('Failed to update timer')
    }
  }

  // Offer Management
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

      setFormData({ title: '', description: '', price: '', image_url: '', category_id: '' })
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
      category_id: offer.category_id || '',
    })
    setEditingId(offer.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

        {/* Category Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Management</h2>

          {/* Add New Category */}
          <div className="mb-6">
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
              >
                Add Category
              </button>
            </form>
          </div>

          {/* Categories List */}
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No categories yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Timer (hours)
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">{category.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={categoryTimers[category.id] || 24}
                            onChange={(e) => {
                              setCategoryTimers({
                                ...categoryTimers,
                                [category.id]: parseInt(e.target.value) || 24,
                              })
                            }}
                            min="1"
                            max="168"
                            className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() =>
                              handleUpdateCategoryTimer(
                                category.id,
                                categoryTimers[category.id] || 24
                              )
                            }
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
                    setFormData({
                      title: '',
                      description: '',
                      price: '',
                      image_url: '',
                      category_id: '',
                    })
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Offers ({offers.length})</h2>

          {offers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No offers added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => {
                    const categoryName =
                      offer.category_id && categories.find((c) => c.id === offer.category_id)
                        ? categories.find((c) => c.id === offer.category_id)!.name
                        : 'Uncategorized'

                    return (
                      <tr key={offer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{offer.title}</td>
                        <td className="py-3 px-4 text-gray-900 font-semibold">{offer.price}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{categoryName}</td>
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
