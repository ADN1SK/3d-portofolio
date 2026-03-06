'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GridFloor() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    // Subtle pulsing glow
    const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.3;
    gridRef.current.children.forEach((child) => {
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat.opacity !== undefined) {
          mat.opacity = pulse;
        }
      }
    });
  });

  return (
    <group ref={gridRef}>
      {/* Main grid */}
      <gridHelper
        args={[200, 100, '#0066ff', '#0033aa']}
        position={[0, -2, -30]}
        rotation={[0, 0, 0]}
      />

      {/* Reflective floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.01, -30]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#050510"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Glow lines along Z axis */}
      {[-15, -5, 5, 15].map((x, i) => (
        <mesh key={i} position={[x, -1.99, -30]}>
          <planeGeometry args={[0.02, 200]} />
          <meshBasicMaterial
            color="#00aaff"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
