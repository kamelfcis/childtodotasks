import { memo, useMemo } from 'react'

// ============================================
// PERFORMANCE-OPTIMIZED FLOATING SHAPES
// Uses pure CSS animations instead of JS-driven Framer Motion
// Reduces render cost for thousands of users
// ============================================

// Orbs data (reduced from 10 to 6)
const orbs = [
  { colors: 'from-pink-300/35 to-rose-200/25', size: 300, top: '5%', left: '-5%', delay: 0 },
  { colors: 'from-blue-300/30 to-cyan-200/20', size: 340, top: '50%', left: '75%', delay: 2 },
  { colors: 'from-yellow-300/25 to-amber-200/15', size: 270, top: '70%', left: '5%', delay: 4 },
  { colors: 'from-green-300/25 to-emerald-200/15', size: 230, top: '15%', left: '55%', delay: 3 },
  { colors: 'from-purple-300/30 to-violet-200/20', size: 310, top: '80%', left: '45%', delay: 1 },
  { colors: 'from-orange-300/20 to-yellow-200/15', size: 200, top: '10%', left: '80%', delay: 5 },
]

// Characters (reduced from 30 to 18 — still plenty of fun)
const characters = [
  { emoji: '🦄', top: '3%', left: '8%', size: 40, delay: 0, anim: 'float-gentle' },
  { emoji: '🌈', top: '2%', left: '45%', size: 48, delay: 1, anim: 'float-gentle' },
  { emoji: '🎈', top: '5%', left: '78%', size: 36, delay: 2, anim: 'bubble-float' },
  { emoji: '🐰', top: '18%', left: '5%', size: 38, delay: 1.5, anim: 'bounce-soft' },
  { emoji: '🍭', top: '20%', left: '88%', size: 34, delay: 3, anim: 'swing-gentle' },
  { emoji: '💖', top: '22%', left: '38%', size: 28, delay: 4, anim: 'pulse-soft' },
  { emoji: '🐻', top: '35%', left: '3%', size: 40, delay: 2, anim: 'bounce-soft' },
  { emoji: '🐸', top: '40%', left: '55%', size: 34, delay: 1, anim: 'float-gentle' },
  { emoji: '🎨', top: '32%', left: '80%', size: 32, delay: 3.5, anim: 'swing-gentle' },
  { emoji: '🦊', top: '55%', left: '8%', size: 36, delay: 0.5, anim: 'float-gentle' },
  { emoji: '🐼', top: '58%', left: '70%', size: 38, delay: 2.5, anim: 'bounce-soft' },
  { emoji: '🚀', top: '53%', left: '22%', size: 32, delay: 4.5, anim: 'bubble-float' },
  { emoji: '🐨', top: '68%', left: '5%', size: 36, delay: 1, anim: 'bounce-soft' },
  { emoji: '🦁', top: '65%', left: '60%', size: 34, delay: 3, anim: 'float-gentle' },
  { emoji: '🐝', top: '82%', left: '25%', size: 28, delay: 2, anim: 'swing-gentle' },
  { emoji: '🌸', top: '85%', left: '50%', size: 32, delay: 1, anim: 'float-gentle' },
  { emoji: '🎁', top: '88%', left: '75%', size: 34, delay: 4, anim: 'bounce-soft' },
  { emoji: '🌻', top: '90%', left: '10%', size: 30, delay: 3, anim: 'pulse-soft' },
]

// Star colors & shapes
const starColors = ['text-yellow-400', 'text-pink-400', 'text-blue-400', 'text-green-400', 'text-purple-400', 'text-orange-400']
const starShapes = ['✦', '✧', '⋆', '✵', '·', '⊹']

function FloatingShapes() {
  // Generate stars only once
  const stars = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      top: `${Math.random() * 95}%`,
      left: `${Math.random() * 95}%`,
      delay: Math.random() * 5,
      size: Math.random() * 12 + 8,
      color: starColors[i % starColors.length],
      shape: starShapes[i % starShapes.length],
    }))
  , [])

  // Generate bubbles only once
  const bubbles = useMemo(() => {
    const bubbleStyles = [
      'border-pink-300/40 bg-pink-200/15',
      'border-blue-300/40 bg-blue-200/15',
      'border-yellow-300/40 bg-yellow-200/15',
      'border-green-300/40 bg-green-200/15',
      'border-purple-300/40 bg-purple-200/15',
      'border-orange-300/40 bg-orange-200/15',
    ]
    return Array.from({ length: 8 }, (_, i) => ({
      left: `${Math.random() * 90 + 5}%`,
      delay: Math.random() * 10,
      duration: Math.random() * 6 + 10,
      size: Math.random() * 24 + 14,
      style: bubbleStyles[i % bubbleStyles.length],
    }))
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* ============ SOFT GRADIENT ORBS (CSS animated) ============ */}
      {orbs.map((orb, i) => (
        <div
          key={`orb-${i}`}
          className={`absolute rounded-full bg-gradient-to-br ${orb.colors} blur-3xl animate-float-gentle`}
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            animationDelay: `${orb.delay}s`,
            animationDuration: `${14 + orb.delay * 2}s`,
          }}
        />
      ))}

      {/* ============ ANIMATED CHARACTERS (CSS animated) ============ */}
      {characters.map((char, i) => (
        <div
          key={`char-${i}`}
          className={`absolute select-none animate-${char.anim}`}
          style={{
            top: char.top,
            left: char.left,
            fontSize: char.size,
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))',
            animationDelay: `${char.delay}s`,
          }}
        >
          {char.emoji}
        </div>
      ))}

      {/* ============ TWINKLING STARS (CSS animated) ============ */}
      {stars.map((star, i) => (
        <div
          key={`star-${i}`}
          className={`absolute ${star.color} animate-twinkle-soft`}
          style={{
            top: star.top,
            left: star.left,
            fontSize: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${3 + star.delay * 0.3}s`,
          }}
        >
          {star.shape}
        </div>
      ))}

      {/* ============ SOFT PASTEL BUBBLES (CSS animated) ============ */}
      {bubbles.map((bubble, i) => (
        <div
          key={`bubble-${i}`}
          className={`absolute rounded-full border-2 ${bubble.style} animate-bubble-float`}
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            bottom: '-5%',
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        />
      ))}

      {/* ============ RAINBOW ARC (pure CSS) ============ */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-t-full animate-pulse-soft"
        style={{
          background: 'conic-gradient(from 180deg, #ff6ec7, #ff9100, #ffd600, #00c853, #00b4d8, #b44aff, #ff85a2, #ff6ec7)',
          opacity: 0.06,
          animationDuration: '10s',
        }}
      />
    </div>
  )
}

export default memo(FloatingShapes)
