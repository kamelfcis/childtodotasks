import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-neon-purple"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.p
        className="text-text-muted font-semibold"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
      >
        Loading magic... ✨
      </motion.p>
    </div>
  )
}
