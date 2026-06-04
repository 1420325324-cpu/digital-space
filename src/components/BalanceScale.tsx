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
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.6 }}
    >
      <p className="text-xs tracking-widest text-neutral-400 uppercase">
        Balance
      </p>

      {/* 天平 */}
      <div className="relative w-40 h-20">
        {/* 支点 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-neutral-300" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neutral-400" />

        {/* 横杆 */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-neutral-300 origin-center"
          animate={{ rotate: tilt }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ transformOrigin: 'center' }}
        />

        {/* 左盘 - Work */}
        <motion.div
          className="absolute bottom-4 left-4"
          animate={{ y: tilt > 0 ? 4 : -4 }}
          transition={{ duration: 1.5 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
              <span className="text-xs text-neutral-500">W</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1">
              {(work * 100).toFixed(0)}%
            </span>
          </div>
        </motion.div>

        {/* 右盘 - Life */}
        <motion.div
          className="absolute bottom-4 right-4"
          animate={{ y: tilt > 0 ? -4 : 4 }}
          transition={{ duration: 1.5 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
              <span className="text-xs text-neutral-500">L</span>
            </div>
            <span className="text-[10px] text-neutral-400 mt-1">
              {(life * 100).toFixed(0)}%
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
