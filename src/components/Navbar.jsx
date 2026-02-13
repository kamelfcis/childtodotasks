import { memo, useCallback, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiLogOut, FiGift, FiUsers, FiMenu, FiX } from 'react-icons/fi'

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: FiHome,
    emoji: '🏠',
    gradient: 'from-purple-500 to-indigo-600',
    lightBg: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-100',
    border: 'border-purple-200',
    ring: 'ring-purple-300',
    textActive: 'text-purple-700',
    shadow: 'shadow-purple-200/50',
  },
  {
    to: '/my-childs',
    label: 'My Kids',
    icon: FiUsers,
    emoji: '👨‍👧‍👦',
    gradient: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-100',
    border: 'border-blue-200',
    ring: 'ring-blue-300',
    textActive: 'text-blue-700',
    shadow: 'shadow-blue-200/50',
  },
  {
    to: '/rewards',
    label: 'Rewards',
    icon: FiGift,
    emoji: '🎁',
    gradient: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50',
    hoverBg: 'hover:bg-amber-100',
    border: 'border-amber-200',
    ring: 'ring-amber-300',
    textActive: 'text-amber-700',
    shadow: 'shadow-amber-200/50',
  },
]

function NavButton({ item, isActive }) {
  const Icon = item.icon

  return (
    <Link to={item.to} className="flex-shrink-0">
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative flex items-center gap-2.5
          px-5 py-3 rounded-2xl
          font-bold text-[15px]
          transition-all duration-300 cursor-pointer
          border-2
          ${isActive
            ? `bg-gradient-to-r ${item.gradient} text-white border-transparent shadow-lg ${item.shadow}`
            : `${item.lightBg} ${item.hoverBg} ${item.textActive} border-${item.border.replace('border-', '')} hover:shadow-md hover:border-transparent`
          }
        `}
      >
        {/* Active glow */}
        {isActive && (
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-30 blur-lg -z-10`} />
        )}

        {/* Emoji */}
        <span className="text-xl leading-none">{item.emoji}</span>

        {/* Label */}
        <span className="hidden sm:inline">{item.label}</span>

        {/* Active dot indicator */}
        {isActive && (
          <motion.div
            layoutId="activeNavDot"
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-md"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  )
}

export default memo(function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = useCallback(async () => {
    await signOut()
    navigate('/login')
  }, [signOut, navigate])

  if (!user) return null

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-2xl bg-white/80 border-b-2 border-purple-100/60 shadow-[0_4px_30px_rgba(180,74,255,0.08)]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between">
          {/* ===== LOGO ===== */}
          <Link to="/dashboard" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue flex items-center justify-center shadow-lg shadow-purple-300/40"
            >
              <span className="text-lg sm:text-2xl">✨</span>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue leading-tight">
                Happy Tasks
              </h1>
              <p className="text-[10px] font-bold text-text-muted tracking-wider uppercase -mt-0.5">Fun & Rewards</p>
            </div>
          </Link>

          {/* ===== DESKTOP NAV BUTTONS ===== */}
          <div className="hidden md:flex items-center gap-3">
            {NAV_ITEMS.map((item) => (
              <NavButton
                key={item.to}
                item={item}
                isActive={location.pathname === item.to}
              />
            ))}

            {/* Sign out */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-[15px] bg-red-50 border-2 border-red-200 text-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-red-200/50 transition-all duration-300 cursor-pointer"
            >
              <span className="text-xl leading-none">👋</span>
              <span className="hidden sm:inline">Sign Out</span>
            </motion.button>
          </div>

          {/* ===== MOBILE HAMBURGER ===== */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-11 h-11 rounded-xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-purple-600"
          >
            {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </motion.button>
        </div>

        {/* ===== MOBILE MENU ===== */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.to
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        className={`
                          flex items-center gap-3
                          px-5 py-4 rounded-2xl
                          font-bold text-base
                          transition-all duration-300
                          border-2
                          ${isActive
                            ? `bg-gradient-to-r ${item.gradient} text-white border-transparent shadow-lg`
                            : `${item.lightBg} ${item.hoverBg} ${item.textActive} ${item.border}`
                          }
                        `}
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="ml-auto text-white/70 text-sm">●</span>
                        )}
                      </motion.div>
                    </Link>
                  )
                })}

                {/* Mobile sign out */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setMobileOpen(false); handleSignOut() }}
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-base bg-red-50 border-2 border-red-200 text-red-500 hover:bg-red-100 transition-all duration-300 w-full text-left"
                >
                  <span className="text-2xl">👋</span>
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
})
