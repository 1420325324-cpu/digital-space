'use client'

import { getState } from '@/lib/data'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const FluidBackground = dynamic(() => import('@/components/FluidBackground'), { ssr: false })
const MoodWave = dynamic(() => import('@/components/MoodWave'), { ssr: false })

function EnergyRing({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 44
  const offset = circumference * (1 - value)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#1a1a1a" strokeWidth="3" />
          <motion.circle
            cx="50" cy="50" r="44" fill="none"
            stroke="url(#energyGrad)" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6e8efb" />
              <stop offset="100%" stopColor="#a777e3" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-light text-white">{Math.round(value * 100)}</span>
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase">Energy</p>
        <p className="text-sm text-neutral-300 mt-1">{label}</p>
      </div>
    </div>
  )
}

function FocusPills({ areas }: { areas: { name: string; weight: number }[] }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase">Focus</p>
      <div className="flex flex-wrap justify-center gap-2 max-w-[200px]">
        {areas.map((area, i) => (
          <motion.span
            key={area.name}
            className="px-3 py-1.5 rounded-full text-xs border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-all cursor-default"
            style={{ opacity: 0.5 + area.weight * 0.5 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5 + area.weight * 0.5, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {area.name}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

function ThinkingDots({ intensity, label }: { intensity: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase">Thinking</p>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full"
            style={{
              background: i / 5 < intensity
                ? 'linear-gradient(180deg, #6e8efb, #a777e3)'
                : '#1a1a1a',
              height: 12 + Math.sin(i * 1.2) * 8,
            }}
            animate={{
              scaleY: i / 5 < intensity ? [1, 1.3, 1] : 1,
              opacity: i / 5 < intensity ? [0.8, 1, 0.8] : 0.3,
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.15,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
      <p className="text-sm text-neutral-300">{label}</p>
    </div>
  )
}

function BalanceBar({ work, life }: { work: number; life: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase">Balance</p>
      <div className="w-40">
        <div className="flex justify-between text-xs text-neutral-400 mb-2">
          <span>Work</span>
          <span>Life</span>
        </div>
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #6e8efb, #a777e3)',
              width: `${work * 100}%`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${work * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-xs text-neutral-500 mt-2">
          <span>{Math.round(work * 100)}%</span>
          <span>{Math.round(life * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const state = getState()
  const { dimensions, identity, recent, now } = state

  return (
    <main className="relative min-h-screen">
      <FluidBackground mood={dimensions.mood.temperature} energy={dimensions.energy.value} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* 顶部渐变光晕 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#6e8efb]/[0.07] to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.div
          className="text-center max-w-2xl relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* 头像 */}
          <motion.div
            className="w-24 h-24 mx-auto mb-10 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="text-3xl text-neutral-600 font-light">年</span>
          </motion.div>

          {/* 标题 */}
          <motion.h1
            className="text-5xl md:text-7xl font-extralight text-white mb-4 tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {identity.name}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-neutral-500 font-light mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {identity.tagline}
          </motion.p>

          <motion.p
            className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            {identity.bio}
          </motion.p>

          {/* 当前状态 */}
          <motion.div
            className="mt-12 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/30 backdrop-blur-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-neutral-400">{now.status}</span>
          </motion.div>
        </motion.div>

        {/* 向下滚动指示 */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border border-neutral-700 flex items-start justify-center p-1.5">
            <div className="w-1 h-1.5 rounded-full bg-neutral-500" />
          </div>
        </motion.div>
      </section>

      {/* Dimensions Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          {/* 标题 */}
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xs tracking-[0.4em] text-neutral-500 uppercase mb-4">Dimensions</h2>
            <p className="text-2xl md:text-3xl font-extralight text-neutral-300">此刻的状态</p>
          </motion.div>

          {/* 五个维度网格 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <EnergyRing value={dimensions.energy.value} label={dimensions.energy.label} />
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <FocusPills areas={dimensions.focus.areas} />
            </motion.div>

            <motion.div
              className="flex justify-center col-span-2 md:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center gap-3">
                <p className="text-[10px] tracking-[0.25em] text-neutral-500 uppercase">Mood</p>
                <div className="w-48 h-20">
                  <MoodWave temperature={dimensions.mood.temperature} label={dimensions.mood.label} />
                </div>
                <p className="text-sm text-neutral-300">{dimensions.mood.label}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <ThinkingDots intensity={dimensions.thinking.intensity} label={dimensions.thinking.label} />
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <BalanceBar work={dimensions.balance.work} life={dimensions.balance.life} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Focus Section */}
      <section className="relative py-32 px-6 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xs tracking-[0.4em] text-neutral-500 uppercase mb-4">Recent Focus</h2>
            <p className="text-2xl md:text-3xl font-extralight text-neutral-300">近期关注</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {recent.topics.map((topic, i) => (
              <motion.span
                key={topic}
                className="px-5 py-2.5 rounded-full border border-neutral-800 text-sm text-neutral-300 hover:border-neutral-600 hover:text-white transition-all cursor-default"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {topic}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="text-center text-neutral-500 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {recent.activity}
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-neutral-500">能量 {dimensions.energy.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-xs text-neutral-500">情绪 {dimensions.mood.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="text-xs text-neutral-500">思维 {dimensions.thinking.label}</span>
            </div>
          </div>

          <p className="text-[10px] tracking-widest text-neutral-700">
            {new Date(state.lastUpdated).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </footer>
    </main>
  )
}
