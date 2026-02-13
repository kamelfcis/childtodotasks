import { motion } from 'framer-motion'

export default function PointsBadge({ points, size = 'md' }) {
  const sizes = {
    sm: 'text-sm px-3 py-1',
    md: 'text-lg px-4 py-2',
    lg: 'text-2xl px-6 py-3',
    xl: 'text-4xl px-8 py-4',
  }

  return (
    <motion.div
      className={`inline-flex items-center gap-2 ${sizes[size]} rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 font-black text-neon-orange shadow-sm`}
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
      <span className="text-xs font-normal text-text-muted">pts</span>
    </motion.div>
  )
}
