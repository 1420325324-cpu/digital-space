'use client'

import { getState } from '@/lib/data'
import dynamic from 'next/dynamic'
import EnergyOrb from '@/components/EnergyOrb'
import FocusCloud from '@/components/FocusCloud'
import ThinkingRipple from '@/components/ThinkingRipple'
import BalanceScale from '@/components/BalanceScale'
import { motion } from 'framer-motion'

// Three.js 组件需要动态导入（避免 SSR 问题）
const FluidBackground = dynamic(() => import('@/components/FluidBackground'), {
  ssr: false,
})
const MoodWave = dynamic(() => import('@/components/MoodWave'), {
  ssr: false,
})

export default function Home() {
  const state = getState()
  const { dimensions } = state

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* 流动粒子背景 */}
      <FluidBackground
        mood={dimensions.mood.temperature}
        energy={dimensions.energy.value}
      />

      {/* 顶部 - 抽象标识 */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 border border-neutral-200/50" />
        <p className="text-[10px] tracking-[0.3em] text-neutral-300 uppercase">
          digital space
        </p>
      </motion.div>

      {/* 核心区域 - 五个维度 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-4xl w-full">
        {/* 第一行：能量 + 关注 + 情绪 */}
        <EnergyOrb
          value={dimensions.energy.value}
          delta={dimensions.energy.delta}
          label={dimensions.energy.label}
        />
        <FocusCloud areas={dimensions.focus.areas} />
        <MoodWave
          temperature={dimensions.mood.temperature}
          label={dimensions.mood.label}
        />

        {/* 第二行：思维 + 平衡（居中） */}
        <div className="md:col-start-1 md:col-span-1">
          <ThinkingRipple
            intensity={dimensions.thinking.intensity}
            label={dimensions.thinking.label}
          />
        </div>
        <div className="md:col-start-3 md:col-span-1">
          <BalanceScale
            work={dimensions.balance.work}
            life={dimensions.balance.life}
          />
        </div>
      </div>

      {/* 底部 - 更新时间 */}
      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <p className="text-[10px] tracking-widest text-neutral-300">
          {new Date(state.lastUpdated).toLocaleDateString('zh-CN', {
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </motion.div>
    </main>
  )
}
