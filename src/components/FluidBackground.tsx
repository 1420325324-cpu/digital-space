'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ mood, energy }: { mood: number; energy: number }) {
  const mesh = useRef<THREE.Points>(null!)
  const count = 200

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
      vel[i * 3] = (Math.random() - 0.5) * 0.01
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005
    }
    return [pos, vel]
  }, [])

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // mood: 0=冷蓝, 0.5=中性灰, 1=暖橙
      const r = mood * 0.9 + 0.1
      const g = 0.5 + (1 - mood) * 0.2
      const b = (1 - mood) * 0.8 + 0.1
      cols[i * 3] = r
      cols[i * 3 + 1] = g
      cols[i * 3 + 2] = b
    }
    return cols
  }, [mood])

  useFrame((state) => {
    if (!mesh.current) return
    const posAttr = mesh.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const speed = 0.3 + energy * 0.7

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * speed
      arr[i * 3 + 1] += velocities[i * 3 + 1] * speed
      arr[i * 3 + 2] += velocities[i * 3 + 2] * speed

      // 柔和边界反弹
      if (Math.abs(arr[i * 3]) > 5) velocities[i * 3] *= -1
      if (Math.abs(arr[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1
      if (Math.abs(arr[i * 3 + 2]) > 2.5) velocities[i * 3 + 2] *= -1
    }
    posAttr.needsUpdate = true
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

interface FluidBackgroundProps {
  mood: number
  energy: number
}

export default function FluidBackground({ mood, energy }: FluidBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Particles mood={mood} energy={energy} />
      </Canvas>
    </div>
  )
}
