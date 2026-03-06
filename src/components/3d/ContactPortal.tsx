'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { profile } from '@/data/profile';

function PortalRing({ radius, speed, color, thickness = 0.03 }: {
  radius: number;
  speed: number;
  color: string;
  thickness?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * speed) * 0.2;
    ringRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, thickness, 16, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function DataStream({ angle, radius }: { angle: number; radius: number }) {
  const streamRef = useRef<THREE.Group>(null);

  const particlePositions = useMemo(() => {
    const arr = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      const i3 = i * 3;
      const t = i / 30;
      arr[i3] = Math.cos(angle) * radius * t;
      arr[i3 + 1] = t * 5 - 2.5;
      arr[i3 + 2] = Math.sin(angle) * radius * t;
    }
    return arr;
  }, [angle, radius]);

  useFrame((state) => {
    if (!streamRef.current) return;
    streamRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={streamRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
            count={30}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00ffaa"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

function ContactInfoCard({
  position,
  icon,
  label,
  value,
  color,
}: {
  position: [number, number, number];
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  const cardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!cardRef.current) return;
    cardRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.1;
    // Face camera
    cardRef.current.lookAt(state.camera.position);
  });

  return (
    <group ref={cardRef} position={position}>
      <RoundedBox args={[3, 0.6, 0.05]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#0a0a2e"
          emissive={color}
          emissiveIntensity={0.1}
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </RoundedBox>

      {/* Border glow */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[3.05, 0.65]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Icon */}
      <Text
        position={[-1.1, 0.05, 0.04]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {icon}
      </Text>

      {/* Label */}
      <Text
        position={[0.2, 0.1, 0.04]}
        fontSize={0.08}
        color="#6688aa"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.1}
        font="/fonts/inter-medium.woff"
      >
        {label.toUpperCase()}
      </Text>

      {/* Value */}
      <Text
        position={[0.2, -0.1, 0.04]}
        fontSize={0.12}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        font="/fonts/inter-medium.woff"
      >
        {value}
      </Text>
    </group>
  );
}

export function ContactPortal() {
  const portalRef = useRef<THREE.Group>(null);

  return (
    <group ref={portalRef}>
      {/* Section title */}
      <Float speed={1} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 5.5, 0]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          font="/fonts/inter-bold.woff"
        >
          CONTACT
        </Text>
        <Text
          position={[0, 4.8, 0]}
          fontSize={0.18}
          color="#4488aa"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          font="/fonts/inter-medium.woff"
        >
          LET&apos;S BUILD SOMETHING AMAZING
        </Text>
        <mesh position={[0, 4.55, 0]}>
          <planeGeometry args={[3, 0.003]} />
          <meshBasicMaterial
            color="#00aaff"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>

      {/* Lighting */}
      <spotLight position={[0, 8, 5]} angle={0.5} penumbra={0.8} intensity={1.5} color="#00ffaa" />
      <pointLight position={[0, 0, 3]} intensity={1} color="#0088ff" distance={10} />

      {/* Central portal sphere */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <MeshDistortMaterial
            color="#00aaff"
            emissive="#004488"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.8}
            distort={0.4}
            speed={3}
            transparent
            opacity={0.25}
          />
        </mesh>
      </Float>

      {/* Portal rings */}
      <group position={[0, 1, 0]}>
        <PortalRing radius={2} speed={0.4} color="#00ffaa" />
        <PortalRing radius={2.5} speed={-0.3} color="#00aaff" />
        <PortalRing radius={3} speed={0.2} color="#8844ff" thickness={0.02} />
      </group>

      {/* Data streams */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <DataStream key={i} angle={(i / 6) * Math.PI * 2} radius={4} />
      ))}

      {/* Contact info cards */}
      <ContactInfoCard
        position={[-3.5, 2.5, 2]}
        icon="✉"
        label="Email"
        value={profile.email}
        color="#00aaff"
      />

      {profile.phone && (
        <ContactInfoCard
          position={[3.5, 2.5, 2]}
          icon="📱"
          label="Phone"
          value={profile.phone}
          color="#00ffaa"
        />
      )}

      <ContactInfoCard
        position={[-3.5, 1.5, 2]}
        icon="📍"
        label="Location"
        value={profile.location}
        color="#aa44ff"
      />

      {profile.github && (
        <ContactInfoCard
          position={[3.5, 1.5, 2]}
          icon="💻"
          label="GitHub"
          value={profile.github.replace('https://github.com/', '@')}
          color="#ffaa00"
        />
      )}

      {/* CTA text */}
      <Float speed={0.8} rotationIntensity={0} floatIntensity={0.2}>
        <group position={[0, -1.5, 2]}>
          <RoundedBox args={[5, 0.8, 0.05]} radius={0.08} smoothness={4}>
            <meshStandardMaterial
              color="#001122"
              emissive="#003366"
              emissiveIntensity={0.2}
              metalness={0.5}
              roughness={0.3}
              transparent
              opacity={0.8}
            />
          </RoundedBox>
          <Text
            position={[0, 0, 0.04]}
            fontSize={0.16}
            color="#88ccff"
            anchorX="center"
            anchorY="middle"
            maxWidth={4.5}
            textAlign="center"
            lineHeight={1.5}
            font="/fonts/inter-medium.woff"
          >
            {`Ready to collaborate? Reach out at\n${profile.email}`}
          </Text>
        </group>
      </Float>

      {/* Decorative hexagons */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 5;
        return (
          <mesh
            key={`hex-${i}`}
            position={[Math.cos(angle) * r, -2, Math.sin(angle) * r]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <cylinderGeometry args={[0.5, 0.5, 0.02, 6]} />
            <meshBasicMaterial
              color="#00aaff"
              transparent
              opacity={0.1}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}
