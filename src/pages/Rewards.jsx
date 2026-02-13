import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useChildren } from '../hooks/useChildren'
import { useGifts } from '../hooks/useGifts'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi'
import FloatingShapes from '../components/FloatingShapes'
import Navbar from '../components/Navbar'
import GiftCard from '../components/GiftCard'
import PointsBadge from '../components/PointsBadge'
import ConfettiExplosion from '../components/ConfettiExplosion'
import LoadingSpinner from '../components/LoadingSpinner'
import { playClaim, playWow } from '../sounds/useSounds'

export default function Rewards() {
  const [searchParams] = useSearchParams()
  const selectedChildId = searchParams.get('child')

  const { children, updateChildPoints } = useChildren()
  const { gifts, loading, addGift, deleteGift, claimGift, getChildRewards } = useGifts()
  const [showAddGift, setShowAddGift] = useState(false)
  const [giftTitle, setGiftTitle] = useState('')
  const [giftPoints, setGiftPoints] = useState(50)
  const [giftImageUrl, setGiftImageUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [selectedChild, setSelectedChild] = useState(null)
  const [claimedRewards, setClaimedRewards] = useState([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [redeemingGiftId, setRedeemingGiftId] = useState(null)

  // Auto-select child if coming from child view
  useEffect(() => {
    if (selectedChildId && children.length > 0) {
      const child = children.find(c => c.id === selectedChildId)
      if (child) setSelectedChild(child)
    }
  }, [selectedChildId, children])

  // Fetch claimed rewards when child is selected
  useEffect(() => {
    if (selectedChild) {
      getChildRewards(selectedChild.id).then(({ data }) => {
        if (data) setClaimedRewards(data)
      })
    } else {
      setClaimedRewards([])
    }
  }, [selectedChild])

  const handleAddGift = async (e) => {
    e.preventDefault()
    if (!giftTitle.trim()) return
    setAdding(true)
    await addGift(giftTitle.trim(), giftPoints, giftImageUrl || null)
    setGiftTitle('')
    setGiftPoints(50)
    setGiftImageUrl('')
    setShowAddGift(false)
    setAdding(false)
  }

  const handleClaimGift = async (gift) => {
    if (!selectedChild) return
    if (selectedChild.points < gift.required_points) return

    setRedeemingGiftId(gift.id)

    const { error } = await claimGift(
      selectedChild.id,
      gift.id,
      selectedChild.points,
      gift.required_points
    )

    if (!error) {
      const newPoints = selectedChild.points - gift.required_points
      setSelectedChild(prev => ({ ...prev, points: newPoints }))
      updateChildPoints(selectedChild.id, newPoints)

      playClaim()
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        playWow()
      }, 2500)

      // Refresh claimed rewards
      const { data } = await getChildRewards(selectedChild.id)
      if (data) setClaimedRewards(data)
    }

    setRedeemingGiftId(null)
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <FloatingShapes />
      <Navbar />
      <ConfettiExplosion show={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative z-10">
        {/* Back */}
        {selectedChildId ? (
          <Link to={`/child/${selectedChildId}`}>
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-4 sm:mb-6 font-semibold transition-colors text-sm sm:text-base"
            >
              <FiArrowLeft /> Back to {selectedChild?.name || 'Child'}'s Tasks
            </motion.button>
          </Link>
        ) : (
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-4 sm:mb-6 font-semibold transition-colors text-sm sm:text-base"
            >
              <FiArrowLeft /> Back to Dashboard
            </motion.button>
          </Link>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          className="mb-5 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary flex items-center gap-2 sm:gap-3 flex-wrap">
            🎁 <span>Rewards Shop</span>
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] }}
              className="text-2xl sm:text-3xl"
            >
              ✨
            </motion.span>
          </h1>
          <p className="text-text-secondary mt-1 sm:mt-2 font-semibold text-sm sm:text-base">
            {selectedChild
              ? `${selectedChild.name}, redeem your stars for awesome gifts!`
              : 'Manage gifts or select a child to redeem!'}
          </p>
        </motion.div>

        {/* Child selector */}
        {!selectedChild && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            className="mb-5 sm:mb-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 border-2 border-blue-200 shadow-lg shadow-blue-50"
          >
            <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">👦 Select a child to redeem gifts:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {children.map((child) => (
                <motion.button
                  key={child.id}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedChild(child)}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-purple-50 border border-purple-200 hover:border-neon-pink/40 hover:shadow-lg hover:shadow-pink-100 transition-all text-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 mx-auto mb-2 sm:mb-3 overflow-hidden border-2 border-purple-200">
                    {child.avatar_url ? (
                      <img src={child.avatar_url} alt={child.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl">👦</div>
                    )}
                  </div>
                  <p className="font-bold text-text-primary mb-1 text-sm sm:text-base truncate">{child.name}</p>
                  <PointsBadge points={child.points || 0} size="sm" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Selected child info bar */}
        {selectedChild && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            className="mb-4 sm:mb-6 p-3 sm:p-5 rounded-2xl bg-gradient-to-r from-white/90 to-purple-50/90 backdrop-blur-xl border-2 border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shadow-md"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-100 to-blue-100 overflow-hidden border-2 border-purple-200 flex-shrink-0">
                {selectedChild.avatar_url ? (
                  <img src={selectedChild.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl">👦</div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-base sm:text-lg">{selectedChild.name}'s Rewards</h3>
                <p className="text-text-muted text-xs sm:text-sm">Choose a gift below to redeem!</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <PointsBadge points={selectedChild.points || 0} size="md" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedChild(null)}
                className="px-3 sm:px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-text-muted hover:text-text-primary text-xs sm:text-sm font-semibold transition-all"
              >
                Change child
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Add Gift */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddGift(!showAddGift)}
          className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-neon-yellow to-neon-orange text-white font-bold text-base sm:text-lg shadow-lg shadow-yellow-200 hover:shadow-yellow-300 transition-all w-full sm:w-auto justify-center sm:justify-start"
        >
          <FiPlus className="text-lg sm:text-xl" />
          Add New Gift 🎁
        </motion.button>

        {/* Add Gift Form */}
        <AnimatePresence>
          {showAddGift && (
            <motion.form
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: [0.45, 0, 0.55, 1] }}
              onSubmit={handleAddGift}
              className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-yellow-200 overflow-hidden shadow-lg shadow-yellow-50"
            >
              <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">New Gift 🎁</h3>
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  value={giftTitle}
                  onChange={(e) => setGiftTitle(e.target.value)}
                  placeholder="Gift title (e.g. Toy Car, Ice Cream)..."
                  required
                  className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-yellow-50 border border-yellow-200 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-yellow/50 focus:ring-2 focus:ring-yellow-200 transition-all font-semibold text-sm sm:text-base"
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <label className="block text-xs sm:text-sm font-semibold text-text-secondary mb-1.5 sm:mb-2">
                      Points Required ⭐
                    </label>
                    <input
                      type="number"
                      value={giftPoints}
                      onChange={(e) => setGiftPoints(parseInt(e.target.value) || 0)}
                      min="1"
                      className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-yellow-50 border border-yellow-200 text-text-primary focus:outline-none focus:border-neon-yellow/50 focus:ring-2 focus:ring-yellow-200 transition-all font-semibold text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs sm:text-sm font-semibold text-text-secondary mb-1.5 sm:mb-2">
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      value={giftImageUrl}
                      onChange={(e) => setGiftImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-yellow-50 border border-yellow-200 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-yellow/50 focus:ring-2 focus:ring-yellow-200 transition-all font-semibold text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <motion.button
                    type="submit"
                    disabled={adding}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-neon-yellow to-neon-orange text-white font-bold shadow-lg shadow-yellow-200 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {adding ? 'Adding...' : 'Add Gift 🎉'}
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddGift(false)}
                    className="px-4 sm:px-6 py-3 rounded-2xl bg-gray-100 border border-gray-200 text-text-secondary font-bold text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Gifts Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : gifts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 sm:py-16"
          >
            <motion.div
              className="text-6xl sm:text-8xl mb-4 sm:mb-6"
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] }}
            >
              🎁
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-secondary">No gifts available yet</h3>
            <p className="text-text-muted mt-2 text-sm">Add some awesome rewards for your kids!</p>
          </motion.div>
        ) : (
          <>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">
              {selectedChild ? `🛒 Available Gifts for ${selectedChild.name}` : '🎁 All Gifts'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {gifts.map((gift, index) => (
                <div key={gift.id} className="relative group">
                  <GiftCard
                    gift={gift}
                    childPoints={selectedChild?.points || 0}
                    onClaim={handleClaimGift}
                    index={index}
                    canClaim={!!selectedChild}
                    isRedeeming={redeemingGiftId === gift.id}
                  />
                  {/* Delete button */}
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this gift?')) deleteGift(gift.id)
                    }}
                    className="absolute top-3 left-3 p-2 rounded-xl bg-red-500 text-white opacity-100 sm:opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-20 shadow-sm"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Claimed rewards history */}
        {claimedRewards.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'spring', damping: 18 }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">
              🏆 {selectedChild?.name}'s Claimed Rewards
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {claimedRewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', damping: 18 }}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-50 border-2 border-green-200 flex items-center gap-3 shadow-sm"
                >
                  <motion.span
                    className="text-2xl sm:text-3xl"
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: [0.45, 0, 0.55, 1], delay: index * 0.5 }}
                  >
                    🏆
                  </motion.span>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm sm:text-base">{reward.gifts?.title}</h4>
                    <p className="text-text-muted text-xs sm:text-sm">
                      Claimed {new Date(reward.claimed_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
