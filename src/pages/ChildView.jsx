import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useTasks, useChildTasks } from '../hooks/useTasks'
import { useGifts } from '../hooks/useGifts'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiGift, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import FloatingShapes from '../components/FloatingShapes'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import ProgressBar from '../components/ProgressBar'
import PointsBadge from '../components/PointsBadge'
import GiftCard from '../components/GiftCard'
import ConfettiExplosion from '../components/ConfettiExplosion'
import LoadingSpinner from '../components/LoadingSpinner'
import { playWow, playSuccess, playClaim } from '../sounds/useSounds'
import ChildThemeAnimations from '../components/ChildThemeAnimations'

export default function ChildView() {
  const { id: childId } = useParams()
  const { defaultTasks } = useTasks()
  const { childTasks, loading, initDailyTasks, completeTask } = useChildTasks(childId)
  const { gifts, claimGift, getChildRewards } = useGifts()
  const [child, setChild] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [showGifts, setShowGifts] = useState(false)
  const [redeemingGiftId, setRedeemingGiftId] = useState(null)
  const [claimedRewards, setClaimedRewards] = useState([])
  const [showCharacterModal, setShowCharacterModal] = useState(false)

  // Fetch child data
  useEffect(() => {
    const fetchChild = async () => {
      const { data } = await supabase
        .from('children')
        .select('*')
        .eq('id', childId)
        .single()
      if (data) setChild(data)
    }
    fetchChild()
  }, [childId])

  // Initialize daily tasks — only once when defaultTasks are ready
  useEffect(() => {
    if (defaultTasks.length > 0) {
      initDailyTasks(defaultTasks)
    }
  }, [defaultTasks, initDailyTasks])

  // Fetch claimed rewards
  useEffect(() => {
    if (childId) {
      getChildRewards(childId).then(({ data }) => {
        if (data) setClaimedRewards(data)
      })
    }
  }, [childId])

  const handleCompleteTask = useCallback(async (task) => {
    if (task.is_done) return

    const taskData = task.default_tasks || {}
    const pointsEarned = taskData.points || 5

    const { error } = await completeTask(task.id)
    if (error) return

    // Update child points
    const newPoints = (child?.points || 0) + pointsEarned
    await supabase
      .from('children')
      .update({ points: newPoints })
      .eq('id', childId)

    setChild(prev => ({ ...prev, points: newPoints }))
    setEarnedPoints(pointsEarned)

    // Celebration!
    playWow()
    setShowConfetti(true)
    setShowCharacterModal(true)
    setTimeout(() => {
      setShowConfetti(false)
      playSuccess()
    }, 2500)
  }, [child, childId, completeTask])

  const handleRedeemGift = useCallback(async (gift) => {
    if (!child || child.points < gift.required_points) return

    setRedeemingGiftId(gift.id)

    const { error } = await claimGift(
      childId,
      gift.id,
      child.points,
      gift.required_points
    )

    if (!error) {
      const newPoints = child.points - gift.required_points
      setChild(prev => ({ ...prev, points: newPoints }))

      playClaim()
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        playWow()
      }, 2500)

      // Refresh claimed rewards
      const { data } = await getChildRewards(childId)
      if (data) setClaimedRewards(data)
    }

    setRedeemingGiftId(null)
  }, [child, childId, claimGift, getChildRewards])

  const completedCount = childTasks.filter(ct => ct.is_done).length
  const totalCount = childTasks.length
  const affordableGifts = gifts.filter(g => (child?.points || 0) >= g.required_points)

  if (!child && !loading) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-text-primary">Child not found</h2>
          <Link to="/dashboard" className="text-neon-blue mt-4 inline-block font-semibold">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg">
      <FloatingShapes />
      <Navbar />
      <ConfettiExplosion
        show={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Character celebration modal (Dark Knight for Karim, Stitch for Reem) */}
      <ChildThemeAnimations
        childName={child?.name}
        show={showCharacterModal}
        onClose={() => setShowCharacterModal(false)}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Back button */}
        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 font-semibold transition-colors"
          >
            <FiArrowLeft /> Back to Dashboard
          </motion.button>
        </Link>

        {/* Child Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-100 mb-8 shadow-lg shadow-purple-50"
        >
          {/* Large avatar */}
          <div className="flex justify-center mb-4">
            <motion.div
              className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-br from-pink-100 to-blue-100 border-4 border-purple-200 overflow-hidden shadow-xl shadow-purple-100"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              {child?.avatar_url ? (
                <img src={child.avatar_url} alt={child?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">
                  👦
                </div>
              )}
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-black text-text-primary">
                {child?.name}'s Tasks 🎯
              </h1>
              <p className="text-text-muted mt-1 font-semibold">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 relative">
              <PointsBadge points={child?.points || 0} size="lg" />
              {earnedPoints > 0 && (
                <AnimatePresence>
                  <motion.span
                    key={earnedPoints + Date.now()}
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -30, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="text-neon-green font-black text-xl absolute -top-4"
                  >
                    +{earnedPoints} ⭐
                  </motion.span>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <ProgressBar completed={completedCount} total={totalCount} />
          </div>
        </motion.div>

        {/* ========== REWARDS SECTION ========== */}
        {gifts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', damping: 18 }}
            className="mb-8"
          >
            {/* Toggle button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowGifts(!showGifts)}
              className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all border-2 ${
                affordableGifts.length > 0
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:border-yellow-400 shadow-md shadow-yellow-100'
                  : 'bg-white/60 border-purple-100 hover:border-purple-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <motion.span
                  className="text-4xl"
                  animate={affordableGifts.length > 0 ? { rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] }}
                >
                  🎁
                </motion.span>
                <div className="text-left">
                  <h3 className="font-bold text-text-primary text-lg">Rewards Shop</h3>
                  <p className="text-text-muted text-sm">
                    {affordableGifts.length > 0
                      ? `🎉 You can redeem ${affordableGifts.length} gift${affordableGifts.length > 1 ? 's' : ''}!`
                      : 'Keep earning stars to unlock gifts!'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {affordableGifts.length > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: [0.45, 0, 0.55, 1] }}
                    className="px-3 py-1 rounded-full bg-neon-green text-white font-bold text-sm shadow-sm"
                  >
                    {affordableGifts.length} ready!
                  </motion.span>
                )}
                {showGifts ? (
                  <FiChevronUp className="text-text-muted text-xl" />
                ) : (
                  <FiChevronDown className="text-text-muted text-xl" />
                )}
              </div>
            </motion.button>

            {/* Expandable gifts grid */}
            <AnimatePresence>
              {showGifts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.45, 0, 0.55, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                    {gifts.map((gift, index) => (
                      <GiftCard
                        key={gift.id}
                        gift={gift}
                        childPoints={child?.points || 0}
                        onClaim={handleRedeemGift}
                        index={index}
                        canClaim={true}
                        isRedeeming={redeemingGiftId === gift.id}
                      />
                    ))}
                  </div>

                  {/* Claimed rewards */}
                  {claimedRewards.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-text-secondary mb-3">🏆 Your Claimed Rewards</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {claimedRewards.map((reward, index) => (
                          <motion.div
                            key={reward.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
                          >
                            <span className="text-2xl">🏆</span>
                            <div>
                              <h4 className="font-bold text-text-primary text-sm">{reward.gifts?.title}</h4>
                              <p className="text-text-muted text-xs">
                                {new Date(reward.claimed_at).toLocaleDateString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link to full rewards page */}
                  <Link to={`/rewards?child=${childId}`}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-200 text-center text-text-muted hover:text-text-secondary text-sm font-semibold transition-all"
                    >
                      View full Rewards Shop →
                    </motion.div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Tasks list */}
        {loading ? (
          <LoadingSpinner />
        ) : childTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-text-secondary">Loading tasks...</h3>
            <p className="text-text-muted mt-2">Preparing your daily adventure!</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Today's Adventures 🗺️
            </h2>
            {childTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                isDone={task.is_done}
                onComplete={() => handleCompleteTask(task)}
                index={index}
              />
            ))}
          </div>
        )}

        {/* All done celebration */}
        {completedCount === totalCount && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="mt-8 text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 border-2 border-green-200 shadow-lg shadow-green-100"
          >
            <motion.div
              className="text-7xl mb-4"
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] }}
            >
              🏆
            </motion.div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
              SUPERSTAR!
            </h2>
            <p className="text-text-secondary mt-2 text-lg font-semibold">
              You completed all tasks today! Amazing job! 🌟
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
