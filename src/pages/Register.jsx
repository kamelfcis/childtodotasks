import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion'
import FloatingShapes from '../components/FloatingShapes'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters!')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess('Account created! Check your email to confirm, then sign in. 🎉')
      setLoading(false)
      setTimeout(() => navigate('/login'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-light-bg flex items-center justify-center relative overflow-hidden px-4 py-6">
      <FloatingShapes />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring', damping: 18 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
        >
          <motion.div
            className="text-5xl sm:text-7xl mb-3 sm:mb-4"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] }}
          >
            🌟
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-green to-neon-yellow">
            Join Us!
          </h1>
          <p className="text-text-secondary mt-2 font-semibold text-sm sm:text-base">Create your parent account 🎯</p>
        </motion.div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-blue-100 shadow-xl shadow-blue-100/40">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6 text-center">Sign Up</h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-secondary mb-1.5 sm:mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-200 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-blue/50 focus:ring-2 focus:ring-blue-200 transition-all font-semibold text-sm sm:text-base"
                placeholder="parent@email.com"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-secondary mb-1.5 sm:mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-200 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-blue/50 focus:ring-2 focus:ring-blue-200 transition-all font-semibold text-sm sm:text-base"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-secondary mb-1.5 sm:mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-blue-50 border border-blue-200 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-blue/50 focus:ring-2 focus:ring-blue-200 transition-all font-semibold text-sm sm:text-base"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-500 text-xs sm:text-sm font-semibold"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="p-3 rounded-xl bg-green-50 border border-green-200 text-neon-green text-xs sm:text-sm font-semibold"
              >
                {success}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-neon-blue to-neon-green text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ⏳
                  </motion.span>
                  Creating account...
                </span>
              ) : (
                'Create Account 🎉'
              )}
            </motion.button>
          </form>

          <p className="text-center text-text-muted mt-4 sm:mt-6 font-semibold text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-neon-pink hover:text-neon-blue transition-colors"
            >
              Sign In 🔑
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
