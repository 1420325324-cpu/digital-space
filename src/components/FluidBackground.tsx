'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ mood, energy }: { mood: number; energy: number }) {
  const mesh = useRef<THREE.Points>(null!)
  const count = 600

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      vel[i * 3] = (Math.random() - 0.5) * 0.015
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.015
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008
    }
    return [pos, vel]
  }, [])

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // 冷蓝 → 暖紫
      const r = 0.3 + mood * 0.4
      const g = 0.35 + (1 - mood) * 0.15
      const b = 0.6 + (1 - mood) * 0.3
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
    const speed = 0.4 + energy * 0.8

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * speed
      arr[i * 3 + 1] += velocities[i * 3 + 1] * speed
      arr[i * 3 + 2] += velocities[i * 3 + 2] * speed

      if (Math.abs(arr[i * 3]) > 7.5) velocities[i * 3] *= -1
      if (Math.abs(arr[i * 3 + 1]) > 7.5) velocities[i * 3 + 1] *= -1
      if (Math.abs(arr[i * 3 + 2]) > 4) velocities[i * 3 + 2] *= -1
    }
    posAttr.needsUpdate = true
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 连线效果
function Connections({ energy }: { energy: number }) {
  const lineRef = useRef<THREE.LineSegments>(null!)
  const count = 80
  const particleCount = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 6)
    for (let i = 0; i < count; i++) {
      const x1 = (Math.random() - 0.5) * 10
      const y1 = (Math.random() - 0.5) * 10
      const z1 = (Math.random() - 0.5) * 5
      const x2 = x1 + (Math.random() - 0.5) * 3
      const y2 = y1 + (Math.random() - 0.5) * 3
      const z2 = z1 + (Math.random() - 0.5) * 2
      pos[i * 6] = x1
      pos[i * 6 + 1] = y1
      pos[i * 6 + 2] = z1
      pos[i * 6 + 3] = x2
      pos[i * 6 + 4] = y2
      pos[i * 6 + 5] = z2
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!lineRef.current) return
    lineRef.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#6e8efb" transparent opacity={0.06 + energy * 0.04} />
    </lineSegments>
  )
}

interface FluidBackgroundProps {
  mood: number
  energy: number
}

export default function FluidBackground({ mood, energy }: FluidBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10" style={{ background: '#0a0a0a' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Particles mood={mood} energy={energy} />
        <Connections energy={energy} />
      </Canvas>
    </div>
  )
}
