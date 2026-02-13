import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useChildren } from '../hooks/useChildren'
import { useTasks, useChildTasks } from '../hooks/useTasks'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiArrowRight } from 'react-icons/fi'
import FloatingShapes from '../components/FloatingShapes'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import ProgressBar from '../components/ProgressBar'
import PointsBadge from '../components/PointsBadge'
import ConfettiExplosion from '../components/ConfettiExplosion'
import ChildThemeAnimations from '../components/ChildThemeAnimations'
import LoadingSpinner from '../components/LoadingSpinner'
import { playWow, playSuccess } from '../sounds/useSounds'

// ============================================
// Single child task section with its own state
// ============================================
function ChildTaskSection({ child, defaultTasks, onPointsUpdate }) {
  const { childTasks, loading, initDailyTasks, completeTask } = useChildTasks(child.id)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCharacterModal, setShowCharacterModal] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [localPoints, setLocalPoints] = useState(child.points || 0)

  // Sync points from parent
  useEffect(() => {
    setLocalPoints(child.points || 0)
  }, [child.points])

  // Initialize daily tasks — only once when defaultTasks are ready
  useEffect(() => {
    if (defaultTasks.length > 0) {
      initDailyTasks(defaultTasks)
    }
  }, [defaultTasks, initDailyTasks])

  const handleCompleteTask = useCallback(async (task) => {
    if (task.is_done) return

    const taskData = task.default_tasks || {}
    const pointsEarned = taskData.points || 5

    const { error } = await completeTask(task.id)
    if (error) return

    // Update points
    const newPoints = localPoints + pointsEarned
    await supabase
      .from('children')
      .update({ points: newPoints })
      .eq('id', child.id)

    setLocalPoints(newPoints)
    setEarnedPoints(pointsEarned)
    onPointsUpdate?.(child.id, newPoints)

    // Celebration!
    playWow()
    setShowConfetti(true)
    setShowCharacterModal(true)
    setTimeout(() => {
      setShowConfetti(false)
      playSuccess()
    }, 2500)
  }, [localPoints, child.id, completeTask, onPointsUpdate])

  const completedCount = childTasks.filter(ct => ct.is_done).length
  const totalCount = childTasks.length

  // Card gradient colors for visual distinction
  const cardColors = [
    { border: 'border-pink-200', header: 'from-pink-50 to-purple-50', shadow: 'shadow-pink-100' },
    { border: 'border-blue-200', header: 'from-blue-50 to-cyan-50', shadow: 'shadow-blue-100' },
    { border: 'border-green-200', header: 'from-green-50 to-teal-50', shadow: 'shadow-green-100' },
    { border: 'border-orange-200', header: 'from-orange-50 to-yellow-50', shadow: 'shadow-orange-100' },
    { border: 'border-purple-200', header: 'from-purple-50 to-indigo-50', shadow: 'shadow-purple-100' },
  ]
  const colorIdx = child.name?.charCodeAt(0) % cardColors.length || 0
  const colors = cardColors[colorIdx]

  return (
    <>
      {/* Confetti & character modal */}
      <ConfettiExplosion show={showConfetti} onComplete={() => setShowConfetti(false)} />
      <ChildThemeAnimations
        childName={child.name}
        show={showCharacterModal}
        onClose={() => setShowCharacterModal(false)}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 18 }}
        className={`bg-white/80 backdrop-blur-xl rounded-3xl border-2 ${colors.border} overflow-hidden shadow-lg ${colors.shadow}`}
      >
        {/* Child Header */}
        <div className={`bg-gradient-to-r ${colors.header} p-5 border-b ${colors.border}`}>
          {/* Large avatar */}
          <div className="flex justify-center mb-3">
            <motion.div
              className="w-40 h-40 rounded-2xl bg-white border-3 border-white/80 overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              {child.avatar_url ? (
                <img src={child.avatar_url} alt={child.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100">
                  <FiUser className="text-4xl text-purple-300" />
                </div>
              )}
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-text-primary truncate">
                {child.name} 🎯
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <PointsBadge points={localPoints} size="sm" />
                {earnedPoints > 0 && (
                  <AnimatePresence>
                    <motion.span
                      key={earnedPoints + Date.now()}
                      initial={{ opacity: 1, y: 0, scale: 1 }}
                      animate={{ opacity: 0, y: -20, scale: 1.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5 }}
                      className="text-neon-green font-black text-sm"
                    >
                      +{earnedPoints} ⭐
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Go to full child view */}
            <Link to={`/child/${child.id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl bg-white/80 border border-purple-200 text-text-muted hover:text-neon-purple hover:border-neon-purple/40 transition-all shadow-sm"
                title="Open full view"
              >
                <FiArrowRight className="text-lg" />
              </motion.button>
            </Link>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <ProgressBar completed={completedCount} total={totalCount} />
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="py-6 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-3xl inline-block"
              >
                ⏳
              </motion.div>
              <p className="text-text-muted text-sm mt-2">Loading tasks...</p>
            </div>
          ) : childTasks.length === 0 ? (
            <div className="py-6 text-center">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-text-muted text-sm">No tasks yet today</p>
            </div>
          ) : (
            childTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                isDone={task.is_done}
                onComplete={() => handleCompleteTask(task)}
                index={index}
              />
            ))
          )}
        </div>

        {/* All done celebration */}
        {completedCount === totalCount && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="mx-4 mb-4 text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-5 border-2 border-green-200"
          >
            <motion.div
              className="text-4xl mb-2"
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] }}
            >
              🏆
            </motion.div>
            <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
              ALL DONE!
            </h3>
            <p className="text-text-muted text-sm mt-1 font-semibold">
              Amazing job, {child.name}! 🌟
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function MyChilds() {
  const { children, loading, updateChildPoints } = useChildren()
  const { defaultTasks } = useTasks()

  const handlePointsUpdate = useCallback((childId, newPoints) => {
    updateChildPoints(childId, newPoints)
  }, [updateChildPoints])

  return (
    <div className="min-h-screen bg-light-bg">
      <FloatingShapes />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-text-primary flex items-center gap-3">
            👨‍👩‍👧‍👦 My Childs
            <motion.span
              animate={{ rotate: [0, 12, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] }}
              className="text-3xl"
            >
              ✨
            </motion.span>
          </h1>
          <p className="text-text-secondary mt-2 font-semibold">
            All your children's daily tasks in one place! 🗺️
          </p>
          <p className="text-text-muted text-sm mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>

        {/* Loading */}
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
            <p className="text-text-muted mt-2">Go to Dashboard to add your children first!</p>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold shadow-lg shadow-pink-200"
              >
                Go to Dashboard →
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          /* Children grid — side by side */
          <div className={`grid gap-6 ${
            children.length === 1
              ? 'grid-cols-1 max-w-2xl mx-auto'
              : children.length === 2
              ? 'grid-cols-1 lg:grid-cols-2'
              : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
          }`}>
            {children.map((child) => (
              <ChildTaskSection
                key={child.id}
                child={child}
                defaultTasks={defaultTasks}
                onPointsUpdate={handlePointsUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

