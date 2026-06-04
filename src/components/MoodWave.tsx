'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Wave({ temperature }: { temperature: number }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const segments = 64

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(4, 1, segments, 1)
  }, [])

  useFrame((state) => {
    if (!mesh.current) return
    const posAttr = mesh.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const time = state.clock.elapsedTime

    for (let i = 0; i < segments + 1; i++) {
      const x = arr[i * 3]
      const freq = 1 + temperature * 2
      const amp = 0.05 + temperature * 0.15
      arr[i * 3 + 2] = Math.sin(x * freq + time * (0.5 + temperature)) * amp
    }
    posAttr.needsUpdate = true
  })

  // temperature: 0=冷蓝, 1=暖橙
  const color = useMemo(() => {
    const r = 0.6 + temperature * 0.4
    const g = 0.7 - temperature * 0.2
    const b = 0.9 - temperature * 0.6
    return new THREE.Color(r, g, b)
  }, [temperature])

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.6}
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
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs tracking-widest text-neutral-400 uppercase">
        Mood
      </p>

      <div className="w-48 h-16">
        <Canvas camera={{ position: [0, 0.5, 2], fov: 50 }}>
          <Wave temperature={temperature} />
        </Canvas>
      </div>

      {/* 温度条 */}
      <div className="w-32 h-1 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${temperature * 100}%`,
            background: `linear-gradient(90deg,
              rgb(150,180,220),
              rgb(200,180,160) 50%,
              rgb(220,160,120))`,
          }}
        />
      </div>

      <p className="text-sm font-light text-neutral-600">{label}</p>
    </div>
  )
}
