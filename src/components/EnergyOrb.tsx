'use client'

import { motion } from 'framer-motion'

interface EnergyOrbProps {
  value: number
  delta: number
  label: string
}

export default function EnergyOrb({ value, delta, label }: EnergyOrbProps) {
  const size = 100 + value * 150
  const glowIntensity = value * 50
  const pulseSpeed = 2 + (1 - value) * 3

  return (
    <motion.div
      className="relative flex flex-col items-center gap-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* 能量球 */}
      <motion.div
        className="rounded-full relative"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%,
            rgba(255,255,255,1),
            rgba(180,210,240,0.9) 30%,
            rgba(120,160,220,0.7) 60%,
            rgba(80,120,200,0.4) 80%,
            transparent)`,
          boxShadow: `
            0 0 ${glowIntensity}px rgba(100,150,220,0.6),
            0 0 ${glowIntensity * 2}px rgba(100,150,220,0.3),
            inset 0 0 ${glowIntensity}px rgba(255,255,255,0.4)
          `,
        }}
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* 内部光晕 */}
        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle at 40% 40%,
              rgba(255,255,255,0.8),
              transparent 60%)`,
          }}
        />
      </motion.div>

      {/* 标签 */}
      <div className="text-center">
        <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase font-medium">
          Energy
        </p>
        <p className="text-lg font-light text-neutral-700 mt-2">
          {label}
        </p>
        {delta !== 0 && (
          <p className={`text-sm mt-2 font-medium ${delta > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {delta > 0 ? '↑' : '↓'} {Math.abs(delta * 100).toFixed(0)}%
          </p>
        )}
      </div>
    </motion.div>
  )
}
