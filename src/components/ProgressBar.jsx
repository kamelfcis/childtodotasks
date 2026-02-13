import { motion } from 'framer-motion'

export default function ProgressBar({ completed, total }) {
  const percentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-bold text-text-secondary">
          Today's Progress
        </span>
        <span className="text-sm font-bold text-neon-orange">
          {completed}/{total} tasks ⭐
        </span>
      </div>
      <div className="w-full h-5 bg-purple-100 rounded-full overflow-hidden border border-purple-200">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: [0.45, 0, 0.55, 1] }}
        />
      </div>
      {percentage === 100 && (
        <motion.p
          className="text-center text-neon-green font-bold mt-2 text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 12 }}
        >
          🏆 All tasks completed! You're a STAR! 🌟
        </motion.p>
      )}
    </div>
  )
}
