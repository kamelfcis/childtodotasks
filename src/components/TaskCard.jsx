import { memo } from 'react'
import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'

export default memo(function TaskCard({ task, isDone, onComplete, index }) {
  const taskData = task.default_tasks || task

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', damping: 20, stiffness: 120 }}
      whileHover={{ scale: isDone ? 1 : 1.02, y: isDone ? 0 : -2 }}
      whileTap={{ scale: isDone ? 1 : 0.96 }}
      className={`relative rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm ${
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

      <div className="flex items-center gap-3 sm:gap-4 relative z-10">
        {/* Large Task Icon */}
        <motion.div
          className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border-2 transition-all ${
            isDone
              ? 'bg-green-100 border-green-200'
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100'
          }`}
          whileHover={{ rotate: isDone ? 0 : 8 }}
          transition={{ type: 'spring', damping: 12 }}
        >
          <span className="text-3xl sm:text-4xl md:text-5xl">{taskData.icon || '⭐'}</span>
        </motion.div>

        {/* Task info */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-bold text-base sm:text-lg md:text-xl ${
              isDone ? 'text-neon-green line-through' : 'text-text-primary'
            }`}
          >
            {taskData.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
            <span className="text-neon-orange text-sm sm:text-base md:text-lg font-black">+{taskData.points}</span>
            <span className="text-neon-yellow text-xs sm:text-sm md:text-base">⭐</span>
          </div>
          {!isDone && (
            <p className="text-purple-300 text-[10px] sm:text-xs md:text-sm font-semibold mt-0.5 sm:mt-1">
              Tap to complete! 👆
            </p>
          )}
        </div>

        {/* Checkbox on the right */}
        <motion.div
          className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center border-[3px] transition-all flex-shrink-0 ${
            isDone
              ? 'bg-neon-green border-neon-green'
              : 'border-purple-300 bg-white hover:border-neon-pink/60 hover:bg-pink-50'
          }`}
          whileTap={{ scale: isDone ? 1 : 0.8 }}
          transition={{ duration: 0.3, ease: [0.45, 0, 0.55, 1] }}
        >
          {isDone ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 200 }}
            >
              <FiCheck className="text-white text-xl sm:text-2xl md:text-3xl stroke-[3]" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: [0.45, 0, 0.55, 1] }}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-purple-200"
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  )
})
