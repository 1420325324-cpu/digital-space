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
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <p className="text-xs tracking-widest text-neutral-400 uppercase">
        Focus
      </p>

      {/* 气泡云 */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-xs">
        {areas.map((area, i) => {
          const size = 32 + area.weight * 48
          const opacity = 0.4 + area.weight * 0.6

          return (
            <motion.div
              key={area.name}
              className="flex items-center justify-center rounded-full border border-neutral-200"
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
                scale: 1.1,
                borderColor: 'rgba(180,200,230,0.6)',
              }}
            >
              <span
                className="text-neutral-500 font-light select-none"
                style={{ fontSize: `${10 + area.weight * 6}px` }}
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
