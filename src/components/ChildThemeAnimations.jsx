import { useState, useEffect, useMemo, useRef } from 'react'
import Lottie from 'lottie-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howl } from 'howler'

// ============================================
// CHILD → ANIMATION THEME MAPPING
// ============================================
const CHILD_THEMES = {
  karim: {
    file: '/The Dark Knight - Day 19.json',
    sound: '/batmansound.mp3',
    label: 'Great job, hero! 🦇',
    bg: 'from-indigo-500/90 to-slate-900/90',
    textColor: 'text-yellow-300',
    subColor: 'text-blue-200',
  },
  reem: {
    file: '/Stitch animation.json',
    sound: null,
    label: 'Ohana means family! 💙',
    bg: 'from-sky-400/90 to-blue-600/90',
    textColor: 'text-white',
    subColor: 'text-sky-100',
  },
}

export default function ChildThemeAnimations({ childName, show, onClose }) {
  const [animationData, setAnimationData] = useState(null)
  const soundRef = useRef(null)

  // Determine which theme to use
  const theme = useMemo(() => {
    if (!childName) return null
    const nameLower = childName.toLowerCase().trim()
    for (const [key, value] of Object.entries(CHILD_THEMES)) {
      if (nameLower === key || nameLower.startsWith(key) || nameLower.includes(key)) {
        return value
      }
    }
    return null
  }, [childName])

  // Fetch the Lottie JSON from public folder
  useEffect(() => {
    if (!theme) {
      setAnimationData(null)
      return
    }

    let cancelled = false
    const loadAnimation = async () => {
      try {
        const response = await fetch(theme.file)
        if (!response.ok) throw new Error('Failed to load animation')
        const data = await response.json()
        if (!cancelled) setAnimationData(data)
      } catch (err) {
        console.warn('Could not load child theme animation:', err)
      }
    }
    loadAnimation()
    return () => { cancelled = true }
  }, [theme])

  // Play character sound when modal opens
  useEffect(() => {
    if (show && theme?.sound) {
      // Stop any previous sound
      if (soundRef.current) {
        soundRef.current.stop()
      }
      soundRef.current = new Howl({
        src: [theme.sound],
        volume: 0.7,
      })
      soundRef.current.play()
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.stop()
      }
    }
  }, [show, theme])

  // Auto-close after 3 seconds
  useEffect(() => {
    if (show && theme && animationData) {
      const timer = setTimeout(() => {
        onClose?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, theme, animationData, onClose])

  // Don't render if no theme or no animation data
  if (!theme || !animationData) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${theme.bg} backdrop-blur-md`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 150 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* The single Lottie animation */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
            >
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: 280, height: 280 }}
              />
            </motion.div>

            {/* Celebration text */}
            <motion.h2
              className={`text-4xl font-black mt-4 ${theme.textColor} text-center drop-shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', damping: 12 }}
            >
              WOOOOW! 🎉
            </motion.h2>

            <motion.p
              className={`text-xl font-bold mt-2 ${theme.subColor} text-center`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring', damping: 12 }}
            >
              {theme.label}
            </motion.p>

            {/* Tap to close hint */}
            <motion.p
              className="text-white/40 text-sm mt-6 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Tap anywhere to close
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
