import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useChildren } from '../hooks/useChildren'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiTrash2, FiArrowRight, FiImage, FiUser, FiStar } from 'react-icons/fi'
import FloatingShapes from '../components/FloatingShapes'
import Navbar from '../components/Navbar'
import PointsBadge from '../components/PointsBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import { playPop } from '../sounds/useSounds'

export default function Dashboard() {
  const { user } = useAuth()
  const { children, loading, addChild, deleteChild } = useChildren()
  const [showAddForm, setShowAddForm] = useState(false)
  const [childName, setChildName] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [adding, setAdding] = useState(false)
  const fileInputRef = useRef(null)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAddChild = async (e) => {
    e.preventDefault()
    if (!childName.trim()) return
    setAdding(true)
    await addChild(childName.trim(), avatarFile)
    playPop()
    setChildName('')
    setAvatarFile(null)
    setAvatarPreview(null)
    setShowAddForm(false)
    setAdding(false)
  }

  const handleDeleteChild = async (childId) => {
    if (window.confirm('Are you sure you want to remove this child?')) {
      await deleteChild(childId)
    }
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <FloatingShapes />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-text-primary">
            Parent Dashboard <span className="text-3xl">👨‍👩‍👧‍👦</span>
          </h1>
          <p className="text-text-secondary mt-2 font-semibold">
            Manage your children and watch them grow! 🌱
          </p>
        </motion.div>

        {/* Add Child Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-6 flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold text-lg shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all"
        >
          <FiPlus className="text-xl" />
          Add New Child ✨
        </motion.button>

        {/* Add Child Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: [0.45, 0, 0.55, 1] }}
              onSubmit={handleAddChild}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-100 overflow-hidden shadow-lg shadow-purple-50"
            >
              <h3 className="text-xl font-bold text-text-primary mb-4">New Child 👶</h3>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Avatar upload */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-2xl bg-purple-50 border-2 border-dashed border-purple-300 flex items-center justify-center cursor-pointer hover:border-neon-pink/50 transition-all overflow-hidden"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FiImage className="text-2xl text-purple-300 mx-auto" />
                        <span className="text-xs text-purple-300 mt-1">Photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {/* Name input */}
                <div className="flex-1 flex flex-col gap-3">
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Child's name..."
                    required
                    className="w-full px-4 py-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-pink-200 transition-all font-semibold text-lg"
                  />

                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      disabled={adding}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-neon-green to-neon-blue text-white font-bold shadow-lg shadow-green-200 disabled:opacity-50"
                    >
                      {adding ? 'Adding...' : 'Add Child 🎉'}
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowAddForm(false)
                        setChildName('')
                        setAvatarFile(null)
                        setAvatarPreview(null)
                      }}
                      className="px-6 py-3 rounded-2xl bg-gray-100 border border-gray-200 text-text-secondary font-bold"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Children List */}
        {loading ? (
          <LoadingSpinner />
        ) : children.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] }}
            >
              👶
            </motion.div>
            <h3 className="text-2xl font-bold text-text-secondary">No children added yet</h3>
            <p className="text-text-muted mt-2">Click "Add New Child" to get started!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', damping: 18 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-100 hover:border-neon-pink/30 transition-all shadow-lg shadow-purple-50 hover:shadow-pink-100"
              >
                {/* Delete button */}
                <button
                  onClick={() => handleDeleteChild(child.id)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
                >
                  <FiTrash2 />
                </button>

                {/* Avatar */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 border-2 border-purple-200 overflow-hidden mb-3">
                    {child.avatar_url ? (
                      <img
                        src={child.avatar_url}
                        alt={child.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiUser className="text-3xl text-purple-300" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary">{child.name}</h3>
                </div>

                {/* Points */}
                <div className="flex justify-center mb-4">
                  <PointsBadge points={child.points || 0} />
                </div>

                {/* Go to child view */}
                <Link to={`/child/${child.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all"
                  >
                    Open Tasks <FiArrowRight />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
