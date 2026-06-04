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

  const color = useMemo(() => {
    const r = 0.4 + temperature * 0.5
    const g = 0.4 + (1 - temperature) * 0.1
    const b = 0.7 + (1 - temperature) * 0.2
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
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0.5, 2], fov: 50 }}>
        <Wave temperature={temperature} />
      </Canvas>
    </div>
  )
}
