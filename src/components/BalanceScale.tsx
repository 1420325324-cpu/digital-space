'use client'

import { motion } from 'framer-motion'

interface BalanceScaleProps {
  work: number
  life: number
}

export default function BalanceScale({ work, life }: BalanceScaleProps) {
  // 倾斜角度：work > life 向右倾
  const tilt = (work - life) * 15

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6 }}
    >
      <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase font-medium">
        Balance
      </p>

      {/* 天平 */}
      <div className="relative w-48 h-24">
        {/* 支点 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-10 bg-neutral-400 rounded-full" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-neutral-500"
          style={{ boxShadow: '0 0 10px rgba(150,180,220,0.4)' }} />

        {/* 横杆 */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-0.5 bg-neutral-400 origin-center"
          animate={{ rotate: tilt }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ transformOrigin: 'center' }}
        />

        {/* 左盘 - Work */}
        <motion.div
          className="absolute bottom-4 left-4"
          animate={{ y: tilt > 0 ? 5 : -5 }}
          transition={{ duration: 1.5 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-white border-2 border-neutral-300 flex items-center justify-center shadow-md">
              <span className="text-lg text-neutral-600 font-medium">W</span>
            </div>
            <span className="text-xs text-neutral-500 mt-2 font-medium">
              {(work * 100).toFixed(0)}%
            </span>
          </div>
        </motion.div>

        {/* 右盘 - Life */}
        <motion.div
          className="absolute bottom-4 right-4"
          animate={{ y: tilt > 0 ? -5 : 5 }}
          transition={{ duration: 1.5 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-white border-2 border-neutral-300 flex items-center justify-center shadow-md">
              <span className="text-lg text-neutral-600 font-medium">L</span>
            </div>
            <span className="text-xs text-neutral-500 mt-2 font-medium">
              {(life * 100).toFixed(0)}%
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
