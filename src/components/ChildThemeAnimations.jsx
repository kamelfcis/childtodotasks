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
    emojis: ['🦇', '⚡', '🌙', '💥', '🔥', '🛡️', '💪', '🏆', '⭐', '🎯', '🦸', '✨', '🎁', '🎉', '🎊'],
    giftEmojis: ['🎁', '🏆', '🥇', '👑', '💎', '🌟'],
  },
  reem: {
    file: '/Stitch animation.json',
    sound: '/afahkoma.mp3',
    label: 'Ohana means family! 💙',
    bg: 'from-sky-400/90 to-blue-600/90',
    textColor: 'text-white',
    subColor: 'text-sky-100',
    emojis: ['💙', '🌺', '🦋', '🌈', '✨', '🎀', '🌸', '💜', '🧸', '🎠', '🦄', '🍭', '🎁', '🎉', '🎊'],
    giftEmojis: ['🎁', '🎀', '👑', '💎', '🌟', '🦄'],
  },
}

// ============================================
// Floating celebration emojis
// ============================================
function FloatingEmojis({ emojis }) {
  return (
    <>
      {emojis.map((emoji, i) => {
        const left = Math.random() * 100
        const size = 20 + Math.random() * 28
        const delay = Math.random() * 1.5
        const duration = 2 + Math.random() * 2
        const startY = 110 + Math.random() * 20

        return (
          <motion.div
            key={`float-${i}`}
            className="absolute pointer-events-none select-none"
            style={{
              left: `${left}%`,
              bottom: `-${size}px`,
              fontSize: `${size}px`,
              zIndex: 5,
            }}
            initial={{ y: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: [`${startY}vh`, '-120vh'],
              opacity: [0, 1, 1, 0.8, 0],
              rotate: [0, Math.random() > 0.5 ? 360 : -360],
              x: [0, (Math.random() - 0.5) * 120],
            }}
            transition={{
              duration: duration,
              delay: delay,
              ease: [0.45, 0, 0.55, 1],
            }}
          >
            {emoji}
          </motion.div>
        )
      })}
    </>
  )
}

// ============================================
// Sparkle burst particles
// ============================================
function SparkleBurst() {
  const sparkles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360
    const distance = 80 + Math.random() * 160
    const rad = (angle * Math.PI) / 180
    const x = Math.cos(rad) * distance
    const y = Math.sin(rad) * distance
    const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#FF6347', '#7CFC00', '#FF1493', '#00CED1', '#FFB6C1']
    const color = colors[i % colors.length]
    const size = 4 + Math.random() * 8

    return (
      <motion.div
        key={`sparkle-${i}`}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `0 0 ${size * 2}px ${color}`,
          top: '50%',
          left: '50%',
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
        animate={{
          x: x,
          y: y,
          opacity: [0, 1, 1, 0],
          scale: [0, 1.5, 1, 0],
        }}
        transition={{
          duration: 1.2,
          delay: 0.2 + Math.random() * 0.3,
          ease: [0.45, 0, 0.55, 1],
        }}
      />
    )
  })

  return <div className="absolute inset-0 pointer-events-none">{sparkles}</div>
}

// ============================================
// Rotating star ring
// ============================================
function StarRing() {
  const stars = ['⭐', '🌟', '✨', '💫', '⭐', '🌟', '✨', '💫']

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: 360, height: 360, top: '50%', left: '50%', marginTop: -180, marginLeft: -180 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    >
      {stars.map((star, i) => {
        const angle = (i / stars.length) * 360
        const rad = (angle * Math.PI) / 180
        const radius = 160
        const x = Math.cos(rad) * radius + 160
        const y = Math.sin(rad) * radius + 160

        return (
          <motion.span
            key={`star-ring-${i}`}
            className="absolute text-2xl"
            style={{ left: x, top: y }}
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          >
            {star}
          </motion.span>
        )
      })}
    </motion.div>
  )
}

// ============================================
// Gift explosion - gifts flying out from center
// ============================================
function GiftExplosion({ giftEmojis }) {
  return (
    <>
      {giftEmojis.map((emoji, i) => {
        const angle = (i / giftEmojis.length) * 360 + Math.random() * 30
        const rad = (angle * Math.PI) / 180
        const distance = 120 + Math.random() * 100
        const x = Math.cos(rad) * distance
        const y = Math.sin(rad) * distance

        return (
          <motion.div
            key={`gift-${i}`}
            className="absolute pointer-events-none"
            style={{ top: '45%', left: '50%', fontSize: '36px', zIndex: 15 }}
            initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{
              x: x,
              y: y,
              scale: [0, 1.8, 1.2],
              rotate: [0, Math.random() > 0.5 ? 180 : -180],
              opacity: [0, 1, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              delay: 0.5 + i * 0.1,
              ease: [0.45, 0, 0.55, 1],
            }}
          >
            {emoji}
          </motion.div>
        )
      })}
    </>
  )
}

// ============================================
// Pulsing glow rings behind the animation
// ============================================
function GlowRings({ color1, color2 }) {
  return (
    <>
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={`ring-${ring}`}
          className="absolute rounded-full border-2 pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            borderColor: ring % 2 === 0 ? color1 : color2,
          }}
          initial={{ width: 0, height: 0, marginTop: 0, marginLeft: 0, opacity: 0 }}
          animate={{
            width: [0, ring * 150],
            height: [0, ring * 150],
            marginTop: [0, -(ring * 75)],
            marginLeft: [0, -(ring * 75)],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            delay: ring * 0.3,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
          }}
        />
      ))}
    </>
  )
}

// ============================================
// Bouncing surprise text
// ============================================
function SurpriseTexts({ textColor }) {
  const texts = ['AMAZING! 🔥', 'SUPER STAR! ⭐', 'WELL DONE! 💪', 'INCREDIBLE! 🚀']
  const [currentText, setCurrentText] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentText}
        className={`text-sm font-black ${textColor} text-center mt-1 drop-shadow-md`}
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -10 }}
        transition={{ duration: 0.3, ease: [0.45, 0, 0.55, 1] }}
      >
        {texts[currentText]}
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
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

  // Auto-close after 4.5 seconds (longer to enjoy animations)
  useEffect(() => {
    if (show && theme && animationData) {
      const timer = setTimeout(() => {
        onClose?.()
      }, 4500)
      return () => clearTimeout(timer)
    }
  }, [show, theme, animationData, onClose])

  // Don't render if no theme or no animation data
  if (!theme || !animationData) return null

  const isKarim = theme.file.includes('Dark Knight')
  const glowColor1 = isKarim ? 'rgba(255,215,0,0.4)' : 'rgba(0,191,255,0.4)'
  const glowColor2 = isKarim ? 'rgba(75,0,130,0.3)' : 'rgba(255,105,180,0.3)'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
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

          {/* === CELEBRATION EFFECTS === */}

          {/* Floating emojis rising from bottom */}
          <FloatingEmojis emojis={theme.emojis} />

          {/* Sparkle burst from center */}
          <SparkleBurst />

          {/* Rotating star ring */}
          <StarRing />

          {/* Glow rings pulsing outward */}
          <GlowRings color1={glowColor1} color2={glowColor2} />

          {/* Gift explosion from center */}
          <GiftExplosion giftEmojis={theme.giftEmojis} />

          {/* Corner fireworks */}
          {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
            <motion.div
              key={`corner-${i}`}
              className={`absolute ${pos} text-4xl pointer-events-none`}
              animate={{
                scale: [0, 1.5, 0.8, 1.3, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0.8, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: 0.3 + i * 0.25,
                repeat: Infinity,
                repeatDelay: 1,
                ease: [0.45, 0, 0.55, 1],
              }}
            >
              {['🎆', '🎇', '🎉', '🎊'][i]}
            </motion.div>
          ))}

          {/* Falling confetti dots */}
          {Array.from({ length: 30 }).map((_, i) => {
            const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF69B4', '#A855F7', '#F97316']
            return (
              <motion.div
                key={`confetti-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 6 + Math.random() * 6,
                  height: 6 + Math.random() * 6,
                  backgroundColor: colors[i % colors.length],
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  zIndex: 4,
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, (Math.random() - 0.5) * 100],
                  rotate: [0, Math.random() > 0.5 ? 720 : -720],
                  opacity: [1, 1, 0.5],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  delay: Math.random() * 2,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              />
            )
          })}

          {/* Modal content */}
          <motion.div
            className="relative z-20 flex flex-col items-center px-4 max-w-sm sm:max-w-md mx-auto"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 150 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glowing circle behind animation */}
            <motion.div
              className="absolute rounded-full pointer-events-none w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] -top-3 sm:-top-5 left-1/2 -translate-x-1/2"
              style={{
                background: `radial-gradient(circle, ${glowColor1}, transparent 70%)`,
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
            />

            {/* The single Lottie animation */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
              className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]"
            >
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>

            {/* Celebration text with bounce */}
            <motion.h2
              className={`text-3xl sm:text-5xl font-black mt-1 sm:mt-2 ${theme.textColor} text-center drop-shadow-lg`}
              initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: [1, 1.1, 1] }}
              transition={{ delay: 0.3, type: 'spring', damping: 10, stiffness: 100 }}
            >
              WOOOOW! 🎉
            </motion.h2>

            <motion.p
              className={`text-base sm:text-xl font-bold mt-1 sm:mt-2 ${theme.subColor} text-center`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring', damping: 12 }}
            >
              {theme.label}
            </motion.p>

            {/* Rotating surprise texts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <SurpriseTexts textColor={theme.subColor} />
            </motion.div>

            {/* Points earned badge */}
            <motion.div
              className="mt-2 sm:mt-3 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [0, 1.2, 1] }}
              transition={{ delay: 1, type: 'spring', damping: 12 }}
            >
              <span className="text-white font-black text-sm sm:text-lg">🎁 Surprise! Keep going! 🚀</span>
            </motion.div>

            {/* Tap to close hint */}
            <motion.p
              className="text-white/40 text-xs sm:text-sm mt-3 sm:mt-4 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Tap anywhere to close
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
