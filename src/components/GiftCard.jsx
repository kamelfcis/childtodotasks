import { motion } from 'framer-motion'
import { FiGift, FiLock, FiCheck } from 'react-icons/fi'

export default function GiftCard({ gift, childPoints = 0, onClaim, index, canClaim = false, isRedeeming = false }) {
  const isAffordable = childPoints >= gift.required_points
  const progressPercent = Math.min((childPoints / gift.required_points) * 100, 100)
  const pointsNeeded = gift.required_points - childPoints

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', damping: 18, stiffness: 120 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className={`relative rounded-3xl overflow-hidden border-2 transition-all shadow-sm ${
        isAffordable && canClaim
          ? 'border-green-400 shadow-xl shadow-green-100/60 bg-white'
          : canClaim
          ? 'border-purple-100 hover:border-pink-300 bg-white'
          : 'border-purple-100 bg-white'
      }`}
    >
      {/* Affordable badge */}
      {isAffordable && canClaim && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-neon-green text-white font-bold text-xs flex items-center gap-1 shadow-lg shadow-green-200"
        >
          <FiCheck className="text-sm" /> Ready!
        </motion.div>
      )}

      {/* Image */}
      <div className={`h-40 bg-gradient-to-br flex items-center justify-center overflow-hidden relative ${
        isAffordable && canClaim
          ? 'from-green-100 to-blue-100'
          : 'from-purple-100 to-pink-100'
      }`}>
        {gift.image_url ? (
          <img src={gift.image_url} alt={gift.title} className="w-full h-full object-cover" />
        ) : (
          <motion.div
            animate={
              isAffordable && canClaim
                ? { rotate: [0, 8, -8, 0], scale: [1, 1.12, 1] }
                : { rotate: [0, 4, -4, 0] }
            }
            transition={{ repeat: Infinity, duration: 3, ease: [0.45, 0, 0.55, 1] }}
            className="text-7xl"
          >
            🎁
          </motion.div>
        )}

        {/* Locked overlay */}
        {canClaim && !isAffordable && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <FiLock className="text-4xl text-purple-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-text-primary text-lg mb-1">{gift.title}</h3>

        {/* Points cost */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-300">
            <span className="text-neon-orange font-black text-lg">{gift.required_points}</span>
            <span className="text-neon-yellow text-sm">⭐</span>
          </div>
          {canClaim && (
            <span className={`text-sm font-semibold ${isAffordable ? 'text-neon-green' : 'text-text-muted'}`}>
              {isAffordable ? 'You can get this!' : `Need ${pointsNeeded} more`}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {canClaim && (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold text-text-muted">Your progress</span>
              <span className={`text-xs font-bold ${isAffordable ? 'text-neon-green' : 'text-neon-pink'}`}>
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden border border-purple-200">
              <motion.div
                className={`h-full rounded-full ${
                  isAffordable
                    ? 'bg-gradient-to-r from-neon-green via-green-400 to-neon-green'
                    : 'bg-gradient-to-r from-neon-pink to-neon-purple'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1], delay: index * 0.1 }}
              />
            </div>
          </div>
        )}

        {/* ========== REDEEM BUTTON ========== */}
        {canClaim && (
          <motion.button
            whileHover={isAffordable ? { scale: 1.04 } : { scale: 1 }}
            whileTap={isAffordable ? { scale: 0.96 } : { scale: 1 }}
            onClick={() => isAffordable && onClaim?.(gift)}
            disabled={!isAffordable || isRedeeming}
            className={`w-full mt-4 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden ${
              isAffordable
                ? 'bg-gradient-to-r from-neon-green via-green-400 to-neon-blue text-white hover:shadow-xl hover:shadow-green-200 cursor-pointer'
                : 'bg-purple-50 text-purple-300 cursor-not-allowed border border-purple-200'
            }`}
          >
            {isRedeeming ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-2xl"
              >
                ⏳
              </motion.span>
            ) : isAffordable ? (
              <>
                <motion.span
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: [0.45, 0, 0.55, 1] }}
                  className="text-2xl"
                >
                  🎉
                </motion.span>
                <span>Redeem Now!</span>
                <motion.span
                  animate={{ rotate: [0, -12, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: [0.45, 0, 0.55, 1] }}
                  className="text-2xl"
                >
                  🎉
                </motion.span>
              </>
            ) : (
              <>
                <FiLock className="text-xl" />
                <span>Need {pointsNeeded} more ⭐</span>
              </>
            )}

            {/* Shimmer sweep when affordable */}
            {isAffordable && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              />
            )}
          </motion.button>
        )}

        {/* Not in child mode */}
        {!canClaim && (
          <div className="mt-4 py-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <span className="text-text-muted font-semibold text-sm">
              <FiGift className="inline mr-1" />
              Select a child to redeem
            </span>
          </div>
        )}
      </div>

      {/* Shimmer overlay for affordable gifts */}
      {isAffordable && canClaim && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/30 to-transparent pointer-events-none"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}
