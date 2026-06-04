'use client'

import { motion } from 'framer-motion'

interface ThinkingRippleProps {
  intensity: number
  label: string
}

export default function ThinkingRipple({ intensity, label }: ThinkingRippleProps) {
  const rings = 4
  const baseSize = 70

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
    >
      <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase font-medium">
        Thinking
      </p>

      {/* 涟漪 */}
      <div className="relative" style={{ width: baseSize + 80, height: baseSize + 80 }}>
        {Array.from({ length: rings }).map((_, i) => {
          const delay = i * (1.5 - intensity * 0.8)
          const maxSize = baseSize + i * 35

          return (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-neutral-300"
              style={{
                width: maxSize,
                height: maxSize,
                left: '50%',
                top: '50%',
                marginLeft: -maxSize / 2,
                marginTop: -maxSize / 2,
              }}
              animate={{
                scale: [0.7, 1.3],
                opacity: [0.8, 0],
                borderColor: ['rgba(150,180,220,0.6)', 'rgba(150,180,220,0)'],
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
          className="absolute rounded-full bg-neutral-400"
          style={{
            width: 12,
            height: 12,
            left: '50%',
            top: '50%',
            marginLeft: -6,
            marginTop: -6,
            boxShadow: '0 0 15px rgba(150,180,220,0.5)',
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </div>

      <p className="text-lg font-light text-neutral-700">{label}</p>
    </motion.div>
  )
}
