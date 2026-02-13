import { memo } from 'react'

export default memo(function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-neon-purple animate-spin" />
      <p className="text-text-muted font-semibold animate-pulse-soft">
        Loading magic... ✨
      </p>
    </div>
  )
})
