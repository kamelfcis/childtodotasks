import Lottie from 'lottie-react'
import confettiData from '../animations/confettiData.json'
import { motion, AnimatePresence } from 'framer-motion'

export default function ConfettiExplosion({ show, onComplete }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Soft overlay */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

          {/* Multiple confetti bursts */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${20 + Math.random() * 40}%`,
                left: `${10 + Math.random() * 80}%`,
                transform: `scale(${1 + Math.random()})`,
              }}
            >
              <Lottie
                animationData={confettiData}
                loop={false}
                autoplay={true}
                onComplete={i === 0 ? onComplete : undefined}
                style={{ width: 200, height: 200 }}
              />
            </div>
          ))}

          {/* Big celebration text */}
          <motion.div
            className="text-center z-10"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 150 }}
          >
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-orange to-neon-purple drop-shadow-lg">
              WOOOOW!
            </h2>
            <p className="text-2xl text-text-primary mt-3 font-bold">Amazing job! ⭐</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
