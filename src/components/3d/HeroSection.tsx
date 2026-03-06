'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { profile } from '@/data/profile';

function HolographicRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.x = state.clock.elapsedTime * speed;
    ringRef.current.rotation.z = state.clock.elapsedTime * speed * 0.5;
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function GlowingSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!sphereRef.current) return;
    sphereRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#0088ff"
          emissive="#0044aa"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.8}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

function InfoPanel({ position, text, delay }: { position: [number, number, number]; text: string; delay: number }) {
  const panelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!panelRef.current) return;
    panelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.1;
  });

  return (
    <group ref={panelRef} position={position}>
      <RoundedBox args={[3.5, 0.5, 0.05]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#0a0a2e"
          emissive="#001133"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
          metalness={0.5}
          roughness={0.2}
        />
      </RoundedBox>
      {/* Border glow */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.55, 0.55]} />
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <Text
        position={[0, 0, 0.04]}
        fontSize={0.14}
        color="#88ccff"
        anchorX="center"
        anchorY="middle"
        maxWidth={3.2}
        font="/fonts/inter-medium.woff"
      >
        {text}
      </Text>
    </group>
  );
}

export function HeroSection() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Main spotlight */}
      <spotLight
        position={[0, 10, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
        color="#4488ff"
        castShadow
      />
      <pointLight position={[-3, 3, 2]} intensity={0.5} color="#00aaff" />
      <pointLight position={[3, 3, 2]} intensity={0.5} color="#8844ff" />

      {/* Central holographic sphere */}
      <GlowingSphere />

      {/* Holographic rings */}
      <HolographicRing radius={2.5} speed={0.3} color="#00aaff" />
      <HolographicRing radius={3} speed={-0.2} color="#8844ff" />
      <HolographicRing radius={3.5} speed={0.15} color="#00ffaa" />

      {/* Name */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
        font="/fonts/inter-bold.woff"
      >
        {profile.name.toUpperCase()}
      </Text>

      {/* Title */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.35}
        color="#00ccff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
        font="/fonts/inter-medium.woff"
      >
        {profile.title.toUpperCase()}
      </Text>

      {/* Subtitle line */}
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[4, 0.003]} />
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Highlights as floating info panels */}
      {profile.highlights.slice(0, 4).map((highlight, i) => (
        <InfoPanel
          key={i}
          position={[
            i % 2 === 0 ? -3.5 : 3.5,
            1.5 - Math.floor(i / 2) * 0.8,
            i % 2 === 0 ? -1 : -1,
          ]}
          text={highlight}
          delay={i * 0.5}
        />
      ))}

      {/* Location badge */}
      <group position={[0, -1.5, 0]}>
        <RoundedBox args={[2.5, 0.4, 0.05]} radius={0.05} smoothness={4}>
          <meshStandardMaterial
            color="#0a0a2e"
            emissive="#002244"
            emissiveIntensity={0.2}
            transparent
            opacity={0.7}
            metalness={0.5}
            roughness={0.3}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.04]}
          fontSize={0.12}
          color="#66aacc"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-medium.woff"
        >
          📍 {profile.location}
        </Text>
      </group>

      {/* Decorative light beams */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={`beam-${i}`}
            position={[Math.cos(angle) * 5, -2, Math.sin(angle) * 5]}
            rotation={[0, 0, 0]}
          >
            <cylinderGeometry args={[0.01, 0.01, 15, 8]} />
            <meshBasicMaterial
              color="#0066ff"
              transparent
              opacity={0.08}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}
