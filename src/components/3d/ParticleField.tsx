'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000;

// Simple seeded pseudo-random number generator for deterministic results
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate particle data at module level (outside component) to avoid impure render
const random = seededRandom(42);

const INITIAL_POSITIONS = (() => {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    arr[i3] = (random() - 0.5) * 60;
    arr[i3 + 1] = random() * 30 - 5;
    arr[i3 + 2] = (random() - 0.5) * 120 - 20;
  }
  return arr;
})();

const INITIAL_COLORS = (() => {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const colorChoice = random();
    if (colorChoice < 0.4) {
      arr[i3] = 0.0;
      arr[i3 + 1] = 0.8;
      arr[i3 + 2] = 1.0;
    } else if (colorChoice < 0.7) {
      arr[i3] = 0.2;
      arr[i3 + 1] = 0.4;
      arr[i3 + 2] = 1.0;
    } else {
      arr[i3] = 0.6;
      arr[i3 + 1] = 0.2;
      arr[i3 + 2] = 1.0;
    }
  }
  return arr;
})();

const INITIAL_SIZES = (() => {
  const arr = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    arr[i] = random() * 3 + 0.5;
  }
  return arr;
})();

export function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    return {
      positions: new Float32Array(INITIAL_POSITIONS),
      colors: new Float32Array(INITIAL_COLORS),
      sizes: new Float32Array(INITIAL_SIZES),
    };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime * 0.1;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Gentle floating motion
      posArray[i3 + 1] += Math.sin(time + i * 0.01) * 0.002;
      posArray[i3] += Math.cos(time + i * 0.015) * 0.001;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={PARTICLE_COUNT}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
