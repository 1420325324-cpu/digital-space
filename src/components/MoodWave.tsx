'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Wave({ temperature }: { temperature: number }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const segments = 80

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(5, 1.5, segments, 1)
  }, [])

  useFrame((state) => {
    if (!mesh.current) return
    const posAttr = mesh.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const time = state.clock.elapsedTime

    for (let i = 0; i < segments + 1; i++) {
      const x = arr[i * 3]
      const freq = 1.5 + temperature * 2.5
      const amp = 0.08 + temperature * 0.2
      arr[i * 3 + 2] = Math.sin(x * freq + time * (0.6 + temperature)) * amp
    }
    posAttr.needsUpdate = true
  })

  // temperature: 0=冷蓝, 1=暖橙
  const color = useMemo(() => {
    const r = 0.5 + temperature * 0.5
    const g = 0.6 - temperature * 0.3
    const b = 0.85 - temperature * 0.65
    return new THREE.Color(r, g, b)
  }, [temperature])

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        wireframe
      />
    </mesh>
  )
}

interface MoodWaveProps {
  temperature: number
  label: string
}

export default function MoodWave({ temperature, label }: MoodWaveProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs tracking-[0.3em] text-neutral-500 uppercase font-medium">
        Mood
      </p>

      <div className="w-56 h-20">
        <Canvas camera={{ position: [0, 0.5, 2], fov: 50 }}>
          <Wave temperature={temperature} />
        </Canvas>
      </div>

      {/* 温度条 */}
      <div className="w-40 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${temperature * 100}%`,
            background: `linear-gradient(90deg,
              rgb(100,140,200),
              rgb(180,150,130) 50%,
              rgb(220,130,80))`,
          }}
        />
      </div>

      <p className="text-lg font-light text-neutral-700">{label}</p>
    </div>
  )
}
