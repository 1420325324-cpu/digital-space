'use client'

import { motion } from 'framer-motion'

interface EnergyOrbProps {
  value: number
  delta: number
  label: string
}

export default function EnergyOrb({ value, delta, label }: EnergyOrbProps) {
  const size = 80 + value * 120
  const glowIntensity = value * 30
  const pulseSpeed = 2 + (1 - value) * 3

  return (
    <motion.div
      className="relative flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* 能量球 */}
      <motion.div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%,
            rgba(255,255,255,0.9),
            rgba(200,220,240,0.6) 40%,
            rgba(150,180,220,0.3) 70%,
            transparent)`,
          boxShadow: `0 0 ${glowIntensity}px rgba(180,200,230,0.4),
                      inset 0 0 ${glowIntensity / 2}px rgba(255,255,255,0.3)`,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 标签 */}
      <div className="text-center">
        <p className="text-xs tracking-widest text-neutral-400 uppercase">
          Energy
        </p>
        <p className="text-sm font-light text-neutral-600 mt-1">
          {label}
        </p>
        {delta !== 0 && (
          <p className={`text-xs mt-1 ${delta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {delta > 0 ? '↑' : '↓'} {Math.abs(delta * 100).toFixed(0)}%
          </p>
        )}
      </div>
    </motion.div>
  )
}
