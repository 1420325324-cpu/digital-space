'use client'

import { motion } from 'framer-motion'

interface ThinkingRippleProps {
  intensity: number
  label: string
}

export default function ThinkingRipple({ intensity, label }: ThinkingRippleProps) {
  const rings = 3
  const baseSize = 60

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
    >
      <p className="text-xs tracking-widest text-neutral-400 uppercase">
        Thinking
      </p>

      {/* 涟漪 */}
      <div className="relative" style={{ width: baseSize + 60, height: baseSize + 60 }}>
        {Array.from({ length: rings }).map((_, i) => {
          const delay = i * (1.5 - intensity * 0.8)
          const maxSize = baseSize + i * 30

          return (
            <motion.div
              key={i}
              className="absolute rounded-full border border-neutral-200"
              style={{
                width: maxSize,
                height: maxSize,
                left: '50%',
                top: '50%',
                marginLeft: -maxSize / 2,
                marginTop: -maxSize / 2,
              }}
              animate={{
                scale: [0.8, 1.2],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2 - intensity * 0.5,
                delay,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )
        })}

        {/* 中心点 */}
        <motion.div
          className="absolute rounded-full bg-neutral-300"
          style={{
            width: 8,
            height: 8,
            left: '50%',
            top: '50%',
            marginLeft: -4,
            marginTop: -4,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </div>

      <p className="text-sm font-light text-neutral-600">{label}</p>
    </motion.div>
  )
}
