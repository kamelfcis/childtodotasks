import { motion } from 'framer-motion'

// ============================================
// SOFT COLORFUL GRADIENT ORBS
// ============================================
const orbs = [
  { colors: 'from-pink-300/40 to-rose-200/30', size: 300, top: '5%', left: '-5%', delay: 0 },
  { colors: 'from-blue-300/35 to-cyan-200/25', size: 350, top: '50%', left: '75%', delay: 1 },
  { colors: 'from-yellow-300/30 to-amber-200/20', size: 280, top: '70%', left: '5%', delay: 2 },
  { colors: 'from-green-300/30 to-emerald-200/20', size: 240, top: '15%', left: '55%', delay: 1.5 },
  { colors: 'from-purple-300/35 to-violet-200/25', size: 320, top: '80%', left: '45%', delay: 0.5 },
  { colors: 'from-orange-300/25 to-yellow-200/20', size: 200, top: '10%', left: '80%', delay: 3 },
  { colors: 'from-indigo-300/25 to-blue-200/20', size: 260, top: '40%', left: '15%', delay: 2.5 },
  { colors: 'from-teal-300/25 to-cyan-200/15', size: 220, top: '60%', left: '90%', delay: 1.8 },
  { colors: 'from-fuchsia-300/20 to-pink-200/15', size: 280, top: '30%', left: '35%', delay: 3.2 },
  { colors: 'from-lime-300/20 to-green-200/15', size: 190, top: '85%', left: '70%', delay: 0.8 },
]

// ============================================
// CUTE ANIMATED CHARACTERS (more!)
// ============================================
const characters = [
  // Row 1 - Top area
  { emoji: '🦄', top: '3%', left: '8%', size: 44, delay: 0, anim: 'gentle-bounce' },
  { emoji: '🌈', top: '2%', left: '45%', size: 52, delay: 0.5, anim: 'slow-float' },
  { emoji: '🎈', top: '5%', left: '78%', size: 40, delay: 1, anim: 'rise' },
  { emoji: '⭐', top: '8%', left: '92%', size: 30, delay: 2, anim: 'twinkle' },
  { emoji: '🦋', top: '6%', left: '30%', size: 34, delay: 1.5, anim: 'flutter' },

  // Row 2 - Upper area
  { emoji: '🐰', top: '18%', left: '5%', size: 40, delay: 0.8, anim: 'peek' },
  { emoji: '🎵', top: '15%', left: '60%', size: 28, delay: 2.5, anim: 'dance' },
  { emoji: '🍭', top: '20%', left: '88%', size: 36, delay: 1.2, anim: 'spin-gentle' },
  { emoji: '💖', top: '22%', left: '38%', size: 30, delay: 3, anim: 'pulse' },
  { emoji: '🎪', top: '16%', left: '72%', size: 38, delay: 0.3, anim: 'slow-float' },

  // Row 3 - Middle area
  { emoji: '🐻', top: '35%', left: '3%', size: 42, delay: 1, anim: 'wobble' },
  { emoji: '🌟', top: '38%', left: '25%', size: 32, delay: 2, anim: 'twinkle' },
  { emoji: '🐸', top: '40%', left: '55%', size: 36, delay: 0.5, anim: 'gentle-bounce' },
  { emoji: '🎨', top: '32%', left: '80%', size: 34, delay: 1.8, anim: 'spin-gentle' },
  { emoji: '🧁', top: '42%', left: '93%', size: 32, delay: 3.2, anim: 'wobble' },

  // Row 4 - Lower-middle
  { emoji: '🦊', top: '55%', left: '8%', size: 38, delay: 2.2, anim: 'dance' },
  { emoji: '🍬', top: '52%', left: '42%', size: 30, delay: 0.7, anim: 'spin-gentle' },
  { emoji: '🐼', top: '58%', left: '70%', size: 40, delay: 1.5, anim: 'peek' },
  { emoji: '💫', top: '50%', left: '92%', size: 28, delay: 2.8, anim: 'twinkle' },
  { emoji: '🚀', top: '53%', left: '22%', size: 34, delay: 3.5, anim: 'flutter' },

  // Row 5 - Lower area
  { emoji: '🐨', top: '68%', left: '5%', size: 38, delay: 0.4, anim: 'wobble' },
  { emoji: '🎈', top: '72%', left: '35%', size: 36, delay: 1.8, anim: 'rise' },
  { emoji: '🦁', top: '65%', left: '60%', size: 36, delay: 2.5, anim: 'gentle-bounce' },
  { emoji: '🍦', top: '70%', left: '85%', size: 34, delay: 0.9, anim: 'wobble' },
  { emoji: '🎀', top: '75%', left: '15%', size: 28, delay: 3, anim: 'spin-gentle' },

  // Row 6 - Bottom area
  { emoji: '🐝', top: '82%', left: '25%', size: 30, delay: 1.3, anim: 'flutter' },
  { emoji: '🌸', top: '85%', left: '50%', size: 34, delay: 0.6, anim: 'slow-float' },
  { emoji: '🎁', top: '88%', left: '75%', size: 36, delay: 2, anim: 'gentle-bounce' },
  { emoji: '🐱', top: '80%', left: '92%', size: 38, delay: 1.6, anim: 'peek' },
  { emoji: '🌻', top: '90%', left: '10%', size: 32, delay: 2.8, anim: 'slow-float' },
]

// Smooth character animation variants
const getCharacterAnim = (type, delay) => {
  const anims = {
    'gentle-bounce': {
      animate: { y: [0, -16, 0] },
      transition: { duration: 4, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay },
    },
    'slow-float': {
      animate: { y: [0, -12, 0], x: [0, 5, 0], rotate: [0, 3, -3, 0] },
      transition: { duration: 7, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay },
    },
    'wobble': {
      animate: { rotate: [0, 6, -6, 4, -4, 0], y: [0, -6, 0] },
      transition: { duration: 5, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay },
    },
    'dance': {
      animate: { y: [0, -10, -4, -14, -6, 0], rotate: [0, -4, 4, -3, 2, 0] },
      transition: { duration: 6, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay },
    },
    'flutter': {
      animate: { y: [0, -10, -5, -15, -8, 0], x: [0, 8, -5, 10, -3, 0] },
      transition: { duration: 8, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay },
    },
    'peek': {
      animate: { y: [8, 0, 8], scale: [0.95, 1.02, 0.95], opacity: [0.7, 1, 0.7] },
      transition: { duration: 5, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay },
    },
    'spin-gentle': {
      animate: { rotate: [0, 360], y: [0, -6, 0] },
      transition: { duration: 12, repeat: Infinity, ease: 'linear', delay },
    },
    'rise': {
      animate: { y: [0, -20, -10, -25, -12, 0], x: [0, 3, -4, 2, -2, 0] },
      transition: { duration: 9, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay },
    },
    'twinkle': {
      animate: { scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] },
      transition: { duration: 3.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay },
    },
    'pulse': {
      animate: { scale: [1, 1.15, 1, 1.1, 1], opacity: [0.8, 1, 0.8] },
      transition: { duration: 3, repeat: Infinity, ease: [0.45, 0, 0.55, 1], delay },
    },
  }
  return anims[type] || anims['gentle-bounce']
}

// ============================================
// COLORFUL TWINKLING STARS
// ============================================
const starColors = ['text-yellow-400', 'text-pink-400', 'text-blue-400', 'text-green-400', 'text-purple-400', 'text-orange-400']
const starShapes = ['✦', '✧', '⋆', '✵', '·', '⊹']
const stars = Array.from({ length: 25 }, (_, i) => ({
  top: `${Math.random() * 95}%`,
  left: `${Math.random() * 95}%`,
  delay: Math.random() * 5,
  size: Math.random() * 12 + 8,
  color: starColors[i % starColors.length],
  shape: starShapes[i % starShapes.length],
}))

// ============================================
// SOFT PASTEL BUBBLES
// ============================================
const bubbleStyles = [
  'border-pink-300/40 bg-pink-200/15',
  'border-blue-300/40 bg-blue-200/15',
  'border-yellow-300/40 bg-yellow-200/15',
  'border-green-300/40 bg-green-200/15',
  'border-purple-300/40 bg-purple-200/15',
  'border-orange-300/40 bg-orange-200/15',
  'border-cyan-300/40 bg-cyan-200/15',
  'border-rose-300/40 bg-rose-200/15',
  'border-indigo-300/40 bg-indigo-200/15',
  'border-teal-300/40 bg-teal-200/15',
]
const bubbles = Array.from({ length: 12 }, (_, i) => ({
  left: `${Math.random() * 90 + 5}%`,
  delay: Math.random() * 10,
  duration: Math.random() * 6 + 10,
  size: Math.random() * 24 + 14,
  style: bubbleStyles[i % bubbleStyles.length],
}))

export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* ============ SOFT GRADIENT ORBS ============ */}
      {orbs.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          className={`absolute rounded-full bg-gradient-to-br ${orb.colors} blur-3xl`}
          style={{ top: orb.top, left: orb.left, width: orb.size, height: orb.size }}
          animate={{
            y: [0, -20, 8, -15, 0],
            x: [0, 10, -6, 5, 0],
            scale: [1, 1.08, 0.97, 1.05, 1],
          }}
          transition={{
            duration: 14 + orb.delay * 2,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
            delay: orb.delay,
          }}
        />
      ))}

      {/* ============ ANIMATED CHARACTERS (30!) ============ */}
      {characters.map((char, i) => {
        const anim = getCharacterAnim(char.anim, char.delay)
        return (
          <motion.div
            key={`char-${i}`}
            className="absolute select-none"
            style={{
              top: char.top,
              left: char.left,
              fontSize: char.size,
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))',
            }}
            animate={anim.animate}
            transition={anim.transition}
          >
            {char.emoji}
          </motion.div>
        )
      })}

      {/* ============ COLORFUL TWINKLING STARS ============ */}
      {stars.map((star, i) => (
        <motion.div
          key={`star-${i}`}
          className={`absolute ${star.color}`}
          style={{ top: star.top, left: star.left, fontSize: star.size }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.6, 1.3, 0.6],
          }}
          transition={{
            duration: 3 + star.delay * 0.3,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
            delay: star.delay,
          }}
        >
          {star.shape}
        </motion.div>
      ))}

      {/* ============ SOFT PASTEL BUBBLES ============ */}
      {bubbles.map((bubble, i) => (
        <motion.div
          key={`bubble-${i}`}
          className={`absolute rounded-full border-2 ${bubble.style}`}
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            bottom: '-5%',
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight : 900) * 1.2],
            x: [0, Math.sin(i * 1.3) * 20, 0],
            opacity: [0, 0.6, 0.7, 0.4, 0],
            scale: [0.5, 0.9, 1, 0.8, 0.4],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: bubble.delay,
          }}
        />
      ))}

      {/* ============ RAINBOW ARC (light) ============ */}
      <motion.div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-t-full opacity-[0.06]"
        style={{
          background: 'conic-gradient(from 180deg, #ff6ec7, #ff9100, #ffd600, #00c853, #00b4d8, #b44aff, #ff85a2, #ff6ec7)',
        }}
        animate={{ opacity: [0.04, 0.08, 0.04], scale: [0.95, 1.02, 0.95] }}
        transition={{ duration: 10, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
      />

      {/* ============ GENTLE SPARKLE DOTS ============ */}
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-yellow-300 to-orange-300"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  )
}
