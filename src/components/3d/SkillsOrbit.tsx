'use client';

import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { skills, getUsedCategories, getSkillsByCategory, type Skill } from '@/data/skills';

const CATEGORY_COLORS: Record<string, string> = {
  Languages: '#00ffaa',
  Frontend: '#00aaff',
  Backend: '#aa44ff',
  Databases: '#ff6644',
  Cloud: '#ffaa00',
  DevOps: '#ff44aa',
};

function SkillNode({
  skill,
  position,
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  color,
}: {
  skill: Skill;
  position: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime * orbitSpeed + orbitOffset;
    groupRef.current.position.x = Math.cos(time) * orbitRadius;
    groupRef.current.position.z = Math.sin(time) * orbitRadius;
    groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.3;

    // Always face camera
    groupRef.current.lookAt(state.camera.position);
  });

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'default';
  }, []);

  // Size based on skill level
  const size = 0.3 + (skill.level / 100) * 0.5;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Skill sphere */}
      <mesh>
        <dodecahedronGeometry args={[size * 0.3, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[size * 0.4, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Skill name */}
      <Text
        position={[0, size * 0.5, 0]}
        fontSize={hovered ? 0.18 : 0.13}
        color={hovered ? '#ffffff' : color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {skill.name}
      </Text>

      {/* Level indicator (shown on hover) */}
      {hovered && (
        <>
          <Text
            position={[0, -size * 0.5, 0]}
            fontSize={0.1}
            color="#88aacc"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-medium.woff"
          >
            {`${skill.level}%${skill.yearsOfExperience ? ` · ${skill.yearsOfExperience}yr` : ''}`}
          </Text>

          {/* Progress ring */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[size * 0.35, 0.015, 8, 64, (skill.level / 100) * Math.PI * 2]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

function CategoryRing({
  category,
  radius,
  yOffset,
  color,
  skills: categorySkills,
}: {
  category: string;
  radius: number;
  yOffset: number;
  color: string;
  skills: Skill[];
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <group>
      {/* Orbit ring */}
      <mesh ref={ringRef} position={[0, yOffset, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008, 8, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Category label */}
      <Text
        position={[radius + 0.5, yOffset + 0.5, 0]}
        fontSize={0.12}
        color={color}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.1}
        font="/fonts/inter-medium.woff"
      >
        {category.toUpperCase()}
      </Text>

      {/* Skill nodes */}
      {categorySkills.map((skill, i) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          position={[0, yOffset, 0]}
          orbitRadius={radius}
          orbitSpeed={0.15 + i * 0.02}
          orbitOffset={(i / categorySkills.length) * Math.PI * 2}
          color={color}
        />
      ))}
    </group>
  );
}

export function SkillsOrbit() {
  const categories = getUsedCategories();

  return (
    <group>
      {/* Section title */}
      <Float speed={1} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 6, 0]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          font="/fonts/inter-bold.woff"
        >
          SKILLS
        </Text>
        <Text
          position={[0, 5.3, 0]}
          fontSize={0.18}
          color="#4488aa"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          font="/fonts/inter-medium.woff"
        >
          TECHNICAL EXPERTISE & PROFICIENCY
        </Text>
        <mesh position={[0, 5.05, 0]}>
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
      <pointLight position={[0, 3, 0]} intensity={1} color="#4488ff" distance={15} />
      <pointLight position={[5, 0, 0]} intensity={0.5} color="#00ffaa" distance={10} />
      <pointLight position={[-5, 0, 0]} intensity={0.5} color="#aa44ff" distance={10} />

      {/* Central core */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial
          color="#0066ff"
          emissive="#0044ff"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#0066ff"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Total skills count */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {skills.length.toString()}
      </Text>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.08}
        color="#88aacc"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-medium.woff"
      >
        SKILLS
      </Text>

      {/* Category rings */}
      {categories.map((category, i) => {
        const categorySkills = getSkillsByCategory(category);
        const radius = 3 + i * 1.5;
        const color = CATEGORY_COLORS[category] || '#00aaff';

        return (
          <CategoryRing
            key={category}
            category={category}
            radius={radius}
            yOffset={-0.5 + i * 0.3}
            color={color}
            skills={categorySkills}
          />
        );
      })}
    </group>
  );
}
