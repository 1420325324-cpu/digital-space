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
  const { dimensions, identity, recent, now } = state

  return (
    <main className="relative min-h-screen flex flex-col items-center px-6 py-16">
      {/* 流动粒子背景 */}
      <FluidBackground
        mood={dimensions.mood.temperature}
        energy={dimensions.energy.value}
      />

      {/* 头部 - 身份 */}
      <motion.header
        className="text-center mb-20 max-w-2xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 border border-neutral-300/50 shadow-lg flex items-center justify-center">
          <span className="text-2xl text-neutral-500">年</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-light text-neutral-800 mb-4 tracking-tight">
          {identity.name}
          <span className="text-neutral-300 mx-3">·</span>
          <span className="text-neutral-400 text-2xl md:text-3xl">数字空间</span>
        </h1>

        <p className="text-lg text-neutral-500 font-light leading-relaxed mb-6">
          {identity.tagline}
        </p>

        <p className="text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
          {identity.bio}
        </p>
      </motion.header>

      {/* 当前状态 */}
      <motion.section
        className="mb-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-neutral-200 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-neutral-600">{now.status}</span>
        </div>
      </motion.section>

      {/* 核心区域 - 五个维度 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20 max-w-5xl w-full mb-20">
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
      </section>

      {/* 近期关注 */}
      <motion.section
        className="max-w-2xl w-full mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <h2 className="text-xs tracking-[0.3em] text-neutral-400 uppercase font-medium text-center mb-8">
          Recent Focus
        </h2>

        <div className="flex flex-wrap justify-center gap-3">
          {recent.topics.map((topic, i) => (
            <motion.div
              key={topic}
              className="px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-sm border border-neutral-200 text-sm text-neutral-600 hover:border-neutral-300 hover:shadow-md transition-all cursor-default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
            >
              {topic}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-neutral-400 text-sm mt-6">
          {recent.activity}
        </p>
      </motion.section>

      {/* 底部 - 状态摘要 */}
      <motion.footer
        className="mt-auto pt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="flex items-center justify-center gap-8 text-neutral-400 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs">能量 {dimensions.energy.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-xs">情绪 {dimensions.mood.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-xs">思维 {dimensions.thinking.label}</span>
          </div>
        </div>

        <p className="text-[10px] tracking-widest text-neutral-300">
          {new Date(state.lastUpdated).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </motion.footer>
    </main>
  )
}
