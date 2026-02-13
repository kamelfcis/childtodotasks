import { memo } from 'react'
import { motion } from 'framer-motion'

export default memo(function PointsBadge({ points, size = 'md' }) {
  const sizes = {
    sm: 'text-xs sm:text-sm px-2.5 sm:px-3 py-0.5 sm:py-1',
    md: 'text-base sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2',
    lg: 'text-xl sm:text-2xl px-5 sm:px-6 py-2 sm:py-3',
    xl: 'text-2xl sm:text-4xl px-6 sm:px-8 py-3 sm:py-4',
  }

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 sm:gap-2 ${sizes[size]} rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 font-black text-neon-orange shadow-sm`}
      key={points}
      initial={{ scale: 1.3 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 10, stiffness: 200 }}
    >
      <span>⭐</span>
      <motion.span
        key={points}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 12 }}
      >
        {points}
      </motion.span>
      <span className="text-[9px] sm:text-xs font-normal text-text-muted">pts</span>
    </motion.div>
  )
})
