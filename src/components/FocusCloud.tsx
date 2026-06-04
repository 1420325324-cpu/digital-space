'use client'

import { motion } from 'framer-motion'

interface FocusArea {
  name: string
  weight: number
}

interface FocusCloudProps {
  areas: FocusArea[]
}

export default function FocusCloud({ areas }: FocusCloudProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase font-medium">
        Focus
      </p>

      {/* 气泡云 */}
      <div className="flex flex-wrap items-center justify-center gap-4 max-w-xs">
        {areas.map((area, i) => {
          const size = 40 + area.weight * 56
          const opacity = 0.6 + area.weight * 0.4

          return (
            <motion.div
              key={area.name}
              className="flex items-center justify-center rounded-full border-2 border-neutral-300 bg-white/50 backdrop-blur-sm"
              style={{
                width: size,
                height: size,
                opacity,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.4 + i * 0.1,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.15,
                borderColor: 'rgba(120,160,220,0.8)',
                boxShadow: '0 0 20px rgba(120,160,220,0.3)',
              }}
            >
              <span
                className="text-neutral-700 font-medium select-none"
                style={{ fontSize: `${12 + area.weight * 8}px` }}
              >
                {area.name}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
