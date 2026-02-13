import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

export default function TaskCard({ task, isDone, onComplete, index }) {
  const taskData = task.default_tasks || task

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', damping: 20, stiffness: 120 }}
      whileHover={{ scale: isDone ? 1 : 1.02, y: isDone ? 0 : -2 }}
      whileTap={{ scale: isDone ? 1 : 0.98 }}
      className={`relative rounded-3xl p-5 border-2 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm ${
        isDone
          ? 'bg-green-50 border-green-300 shadow-green-100'
          : 'bg-white border-purple-100 hover:border-neon-pink/40 hover:shadow-lg hover:shadow-pink-100'
      }`}
      onClick={() => !isDone && onComplete?.()}
    >
      {/* Glow effect */}
      {!isDone && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-50/50 via-transparent to-blue-50/50 opacity-0 hover:opacity-100 transition-opacity" />
      )}

      <div className="flex items-center gap-4 relative z-10">
        {/* Check circle */}
        <motion.div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 transition-all ${
            isDone
              ? 'bg-neon-green border-neon-green text-white'
              : 'border-purple-200 bg-purple-50 text-purple-300'
          }`}
          whileTap={{ rotate: isDone ? 0 : 360 }}
          transition={{ duration: 0.6, ease: [0.45, 0, 0.55, 1] }}
        >
          {isDone ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 200 }}
            >
              <FiCheck className="text-2xl" />
            </motion.div>
          ) : (
            <span className="text-2xl">{taskData.icon || '⭐'}</span>
          )}
        </motion.div>

        {/* Task info */}
        <div className="flex-1">
          <h3
            className={`font-bold text-lg ${
              isDone ? 'text-neon-green line-through' : 'text-text-primary'
            }`}
          >
            {taskData.title}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-neon-orange text-sm font-bold">+{taskData.points}</span>
            <span className="text-neon-yellow text-xs">⭐</span>
          </div>
        </div>

        {/* Status badge */}
        {isDone && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200 }}
            className="text-3xl"
          >
            ✅
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}
