import { memo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import { FiHome, FiLogOut, FiGift, FiUsers } from 'react-icons/fi'

export default memo(function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = useCallback(async () => {
    await signOut()
    navigate('/login')
  }, [signOut, navigate])

  if (!user) return null

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-purple-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <span className="text-3xl">✨</span>
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple group-hover:from-neon-orange group-hover:to-neon-pink transition-all">
            Happy Tasks
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          <Link to="/dashboard">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-text-secondary hover:text-text-primary hover:border-neon-purple/40 hover:bg-purple-100 transition-all text-sm font-semibold">
              <FiHome /> <span className="hidden sm:inline">Dashboard</span>
            </button>
          </Link>

          <Link to="/my-childs">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-text-secondary hover:text-text-primary hover:border-neon-blue/40 hover:bg-blue-100 transition-all text-sm font-semibold">
              <FiUsers /> <span className="hidden sm:inline">My Childs</span>
            </button>
          </Link>

          <Link to="/rewards">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-200 text-text-secondary hover:text-text-primary hover:border-neon-yellow/50 hover:bg-yellow-100 transition-all text-sm font-semibold">
              <FiGift /> <span className="hidden sm:inline">Rewards</span>
            </button>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all text-sm font-semibold"
          >
            <FiLogOut /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  )
})
