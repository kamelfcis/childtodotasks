import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX } from 'react-icons/fi'

// ============================================
// EMOJI LIBRARY with searchable names
// ============================================
const EMOJI_LIST = [
  // Daily Tasks & Hygiene
  { emoji: '🪥', keywords: 'brush teeth toothbrush dental hygiene' },
  { emoji: '🚿', keywords: 'shower bath clean wash hygiene' },
  { emoji: '🧼', keywords: 'soap wash clean hygiene hands' },
  { emoji: '🧴', keywords: 'lotion shampoo clean hygiene' },
  { emoji: '💆', keywords: 'massage relax spa self care' },
  { emoji: '🛁', keywords: 'bath bathtub clean wash' },

  // Education & Study
  { emoji: '📚', keywords: 'books study read education school learn' },
  { emoji: '📖', keywords: 'book read story reading open' },
  { emoji: '📝', keywords: 'write memo note homework pencil' },
  { emoji: '✏️', keywords: 'pencil write draw homework' },
  { emoji: '🖊️', keywords: 'pen write sign' },
  { emoji: '📐', keywords: 'ruler math geometry measure triangle' },
  { emoji: '🔢', keywords: 'numbers math count input' },
  { emoji: '🧮', keywords: 'abacus math calculate count' },
  { emoji: '🎓', keywords: 'graduation cap school education graduate' },
  { emoji: '🏫', keywords: 'school building education' },
  { emoji: '💻', keywords: 'laptop computer study coding technology' },
  { emoji: '🧪', keywords: 'science test tube experiment lab' },
  { emoji: '🔬', keywords: 'microscope science lab research' },
  { emoji: '🌍', keywords: 'earth globe geography world' },

  // Religion & Prayer
  { emoji: '🤲', keywords: 'pray prayer hands palms worship dua' },
  { emoji: '🕌', keywords: 'mosque prayer islam muslim worship' },
  { emoji: '📿', keywords: 'prayer beads rosary tasbih worship' },
  { emoji: '🕋', keywords: 'kaaba mecca hajj islam worship' },
  { emoji: '🙏', keywords: 'pray prayer hands folded thank please' },
  { emoji: '⭐', keywords: 'star gold favorite default' },
  { emoji: '🌙', keywords: 'moon crescent night ramadan islam' },

  // Cleaning & Chores
  { emoji: '🧹', keywords: 'broom clean sweep room floor' },
  { emoji: '🧽', keywords: 'sponge clean wash dishes' },
  { emoji: '🧺', keywords: 'basket laundry clothes wash' },
  { emoji: '🗑️', keywords: 'trash garbage bin waste dispose' },
  { emoji: '🪣', keywords: 'bucket mop clean water' },
  { emoji: '👕', keywords: 'shirt clothes laundry fold dress' },
  { emoji: '🛏️', keywords: 'bed bedroom make sleep tidy' },

  // Health & Food
  { emoji: '💧', keywords: 'water droplet drink hydrate blue' },
  { emoji: '🥗', keywords: 'salad healthy eat food green vegetables' },
  { emoji: '🍎', keywords: 'apple fruit healthy food red' },
  { emoji: '🍌', keywords: 'banana fruit healthy food yellow' },
  { emoji: '🥕', keywords: 'carrot vegetable healthy food orange' },
  { emoji: '🥛', keywords: 'milk glass dairy drink white' },
  { emoji: '🍳', keywords: 'egg cooking breakfast food fry' },
  { emoji: '🥦', keywords: 'broccoli vegetable healthy green food' },
  { emoji: '🍉', keywords: 'watermelon fruit summer food' },
  { emoji: '🍊', keywords: 'orange tangerine fruit citrus food' },
  { emoji: '🍇', keywords: 'grapes fruit purple food' },
  { emoji: '🧃', keywords: 'juice box drink beverage' },
  { emoji: '🍽️', keywords: 'plate dinner food eat meal' },
  { emoji: '💊', keywords: 'pill medicine vitamin health' },

  // Exercise & Sports
  { emoji: '🏃', keywords: 'run exercise jog fitness sport' },
  { emoji: '🚴', keywords: 'bike bicycle cycling exercise sport' },
  { emoji: '🏊', keywords: 'swim swimming pool exercise sport water' },
  { emoji: '⚽', keywords: 'soccer football ball sport play' },
  { emoji: '🏀', keywords: 'basketball ball sport play' },
  { emoji: '🎾', keywords: 'tennis ball racket sport play' },
  { emoji: '🤸', keywords: 'gymnastics cartwheel exercise flexible sport' },
  { emoji: '🧘', keywords: 'yoga meditation exercise calm relax' },
  { emoji: '🏋️', keywords: 'weight lift gym exercise strong muscle' },
  { emoji: '🚶', keywords: 'walk walking step exercise' },
  { emoji: '🤾', keywords: 'handball sport throw play' },
  { emoji: '⛹️', keywords: 'basketball person bouncing sport' },
  { emoji: '🎯', keywords: 'target aim goal focus' },

  // Family & Social
  { emoji: '🤝', keywords: 'handshake help parents assist team agree' },
  { emoji: '👨‍👩‍👧', keywords: 'family parents child together' },
  { emoji: '👩‍👧', keywords: 'mother daughter family' },
  { emoji: '👨‍👦', keywords: 'father son family' },
  { emoji: '💝', keywords: 'heart love gift present ribbon' },
  { emoji: '🤗', keywords: 'hug love happy embrace warm' },
  { emoji: '😊', keywords: 'smile happy face kind nice' },
  { emoji: '👋', keywords: 'wave hello hi greeting bye' },
  { emoji: '💬', keywords: 'talk chat speak communication message' },
  { emoji: '🎤', keywords: 'microphone sing karaoke speak voice' },

  // Sleep & Rest
  { emoji: '😴', keywords: 'sleep sleeping zzz rest tired nap' },
  { emoji: '🌙', keywords: 'moon night sleep bedtime' },
  { emoji: '⏰', keywords: 'alarm clock wake up time morning' },
  { emoji: '🛌', keywords: 'sleep bed rest person' },
  { emoji: '🌅', keywords: 'sunrise morning wake early' },

  // Creative & Arts
  { emoji: '🎨', keywords: 'art paint palette creative colors draw' },
  { emoji: '🖍️', keywords: 'crayon draw color art creative' },
  { emoji: '✂️', keywords: 'scissors cut craft art' },
  { emoji: '🎵', keywords: 'music note song listen play' },
  { emoji: '🎹', keywords: 'piano music keyboard play instrument' },
  { emoji: '🎸', keywords: 'guitar music instrument play rock' },
  { emoji: '🎭', keywords: 'theater drama acting arts mask' },
  { emoji: '📷', keywords: 'camera photo picture photography' },
  { emoji: '🎬', keywords: 'movie film clapper cinema' },
  { emoji: '🧩', keywords: 'puzzle piece game jigsaw brain' },

  // Nature & Outdoors
  { emoji: '🌳', keywords: 'tree nature outdoors green park' },
  { emoji: '🌻', keywords: 'sunflower flower garden nature plant' },
  { emoji: '🌱', keywords: 'plant grow seedling garden nature' },
  { emoji: '🐕', keywords: 'dog pet animal walk feed' },
  { emoji: '🐈', keywords: 'cat pet animal feed care' },
  { emoji: '🐟', keywords: 'fish pet animal aquarium feed' },
  { emoji: '🐦', keywords: 'bird animal nature fly' },
  { emoji: '🦋', keywords: 'butterfly insect nature beautiful' },

  // Rewards & Achievements
  { emoji: '🏆', keywords: 'trophy win champion award prize' },
  { emoji: '🥇', keywords: 'gold medal first place winner award' },
  { emoji: '🥈', keywords: 'silver medal second place award' },
  { emoji: '🥉', keywords: 'bronze medal third place award' },
  { emoji: '🎖️', keywords: 'military medal honor award badge' },
  { emoji: '🎗️', keywords: 'ribbon reminder award' },
  { emoji: '👑', keywords: 'crown king queen royal winner' },
  { emoji: '💎', keywords: 'diamond gem jewel precious treasure' },
  { emoji: '🌟', keywords: 'star glow shiny special bright' },
  { emoji: '✨', keywords: 'sparkles sparkle magic shine' },
  { emoji: '🔥', keywords: 'fire hot streak flame' },
  { emoji: '💪', keywords: 'muscle strong power flex arm' },
  { emoji: '🚀', keywords: 'rocket launch fast super power' },
  { emoji: '⚡', keywords: 'lightning bolt electric power fast energy' },

  // Time & Schedule
  { emoji: '📅', keywords: 'calendar date schedule plan day' },
  { emoji: '🕐', keywords: 'clock time hour schedule' },
  { emoji: '⌛', keywords: 'hourglass time wait sand timer' },
  { emoji: '📌', keywords: 'pin pushpin important remember' },
  { emoji: '✅', keywords: 'check done complete task success' },
  { emoji: '📋', keywords: 'clipboard checklist todo list plan' },

  // Fun & Play
  { emoji: '🎮', keywords: 'game controller play video gaming' },
  { emoji: '🧸', keywords: 'teddy bear toy play plush' },
  { emoji: '🎪', keywords: 'circus tent fun play show' },
  { emoji: '🎠', keywords: 'carousel horse ride fun play' },
  { emoji: '🎡', keywords: 'ferris wheel ride fun park' },
  { emoji: '🏖️', keywords: 'beach sand sun vacation' },
  { emoji: '🎈', keywords: 'balloon party fun celebration' },
  { emoji: '🎉', keywords: 'party celebration confetti fun' },
  { emoji: '🎁', keywords: 'gift present wrap surprise reward' },

  // Transport
  { emoji: '🚗', keywords: 'car drive ride auto vehicle' },
  { emoji: '🚌', keywords: 'bus school transport ride' },
  { emoji: '✈️', keywords: 'airplane fly travel trip' },
  { emoji: '🚂', keywords: 'train locomotive transport' },

  // Miscellaneous
  { emoji: '🧠', keywords: 'brain think smart mind intelligence' },
  { emoji: '👀', keywords: 'eyes look see watch observe' },
  { emoji: '👂', keywords: 'ear listen hear sound' },
  { emoji: '🫶', keywords: 'heart hands love care gratitude' },
  { emoji: '🪴', keywords: 'plant pot indoor garden grow' },
  { emoji: '🏠', keywords: 'home house building family' },
  { emoji: '🔑', keywords: 'key lock unlock secret important' },
  { emoji: '💡', keywords: 'light bulb idea smart bright think' },
  { emoji: '📱', keywords: 'phone mobile screen device' },
  { emoji: '🎒', keywords: 'backpack bag school carry' },
  { emoji: '👟', keywords: 'shoe sneaker run sport footwear' },
  { emoji: '🧢', keywords: 'cap hat baseball sport head' },
  { emoji: '🌈', keywords: 'rainbow colorful beautiful weather' },
  { emoji: '☀️', keywords: 'sun sunny bright warm weather' },
  { emoji: '🌤️', keywords: 'sun cloud weather partly' },
  { emoji: '❤️', keywords: 'heart love red valentine' },
  { emoji: '💙', keywords: 'blue heart love' },
  { emoji: '💚', keywords: 'green heart love nature' },
  { emoji: '💛', keywords: 'yellow heart love' },
  { emoji: '💜', keywords: 'purple heart love' },
  { emoji: '🧡', keywords: 'orange heart love' },
]

export default function IconPicker({ selectedIcon, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const searchRef = useRef(null)
  const containerRef = useRef(null)

  // Focus search input when opened
  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 100)
  }, [])

  // Close on click outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return EMOJI_LIST
    const q = search.toLowerCase().trim()
    return EMOJI_LIST.filter(item =>
      item.keywords.toLowerCase().includes(q) ||
      item.emoji.includes(q)
    )
  }, [search])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed sm:absolute z-50 sm:top-full sm:mt-2 left-2 right-2 sm:left-0 sm:right-auto top-1/4 sm:top-auto w-auto sm:w-80 bg-white rounded-2xl border-2 border-purple-100 shadow-2xl shadow-purple-100/50 overflow-hidden"
    >
      {/* Search bar */}
      <div className="p-3 border-b border-purple-100">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icon... (e.g. book, sport, pray)"
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-purple-50 border border-purple-200 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-pink/50 focus:ring-2 focus:ring-pink-200 transition-all text-sm font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-purple-100 text-purple-300 transition-colors"
            >
              <FiX className="text-sm" />
            </button>
          )}
        </div>
        <p className="text-xs text-text-muted mt-2 font-medium">
          {filteredEmojis.length} icons found
        </p>
      </div>

      {/* Emoji grid */}
      <div className="p-3 max-h-60 overflow-y-auto scrollbar-thin">
        {filteredEmojis.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-text-muted text-sm">No icons match "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {filteredEmojis.map((item, i) => (
              <motion.button
                key={item.emoji + i}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => {
                  onSelect(item.emoji)
                  onClose?.()
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all ${
                  selectedIcon === item.emoji
                    ? 'bg-neon-pink/20 border-2 border-neon-pink ring-2 ring-pink-200'
                    : 'hover:bg-purple-50 border border-transparent'
                }`}
                title={item.keywords}
              >
                {item.emoji}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

