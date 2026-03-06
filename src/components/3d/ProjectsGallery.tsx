'use client';

import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { projects, type Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  position: [number, number, number];
  rotation?: [number, number, number];
  index: number;
  onSelect: (project: Project) => void;
}

function ProjectCard3D({ project, position, rotation = [0, 0, 0], index, onSelect }: ProjectCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame((state) => {
    if (!groupRef.current) return;

    // Floating animation
    groupRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.5 + index * 0.7) * 0.15;

    // Hover scale
    const targetScale = hovered ? 1.08 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );

    // Glow intensity on hover
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, hovered ? 0.4 : 0.1, 0.1);
    }
  });

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'default';
  }, []);

  const handleClick = useCallback(() => {
    onSelect(project);
  }, [project, onSelect]);

  // Color based on category
  const categoryColors: Record<string, string> = {
    'Web Application': '#00aaff',
    'SaaS': '#aa44ff',
    'Data Visualization': '#00ffaa',
    'Mobile App': '#ff6644',
    'Developer Tools': '#ffaa00',
  };
  const accentColor = categoryColors[project.category] || '#00aaff';

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Card background */}
      <RoundedBox args={[3.5, 4, 0.1]} radius={0.08} smoothness={4} castShadow>
        <meshStandardMaterial
          color="#0a0a2e"
          emissive={hovered ? accentColor : '#001122'}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </RoundedBox>

      {/* Glow border */}
      <mesh ref={glowRef} position={[0, 0, -0.06]}>
        <planeGeometry args={[3.6, 4.1]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Top accent line */}
      <mesh position={[0, 1.95, 0.06]}>
        <planeGeometry args={[3.3, 0.02]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Project thumbnail placeholder */}
      <mesh position={[0, 0.8, 0.06]}>
        <planeGeometry args={[3, 1.8]} />
        <meshStandardMaterial
          color="#111133"
          emissive={accentColor}
          emissiveIntensity={0.05}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Holographic scan line effect */}
      <mesh position={[0, 0.8, 0.07]}>
        <planeGeometry args={[3, 0.01]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={hovered ? 0.5 : 0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Project title */}
      <Text
        position={[0, -0.5, 0.06]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        font="/fonts/inter-bold.woff"
      >
        {project.title}
      </Text>

      {/* Project description */}
      <Text
        position={[0, -0.9, 0.06]}
        fontSize={0.11}
        color="#88aacc"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        lineHeight={1.4}
        font="/fonts/inter-medium.woff"
      >
        {project.description.length > 80
          ? project.description.substring(0, 80) + '...'
          : project.description}
      </Text>

      {/* Category badge */}
      <group position={[0, -1.4, 0.06]}>
        <RoundedBox args={[1.8, 0.3, 0.02]} radius={0.05} smoothness={4}>
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={0.2}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.02]}
          fontSize={0.1}
          color={accentColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-medium.woff"
        >
          {project.category}
        </Text>
      </group>

      {/* Tech tags */}
      {project.technologies.slice(0, 3).map((tech, i) => (
        <Text
          key={tech}
          position={[-1 + i * 1, -1.75, 0.06]}
          fontSize={0.08}
          color="#6688aa"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-medium.woff"
        >
          {tech}
        </Text>
      ))}

      {/* Featured badge */}
      {project.featured && (
        <group position={[1.4, 1.7, 0.06]}>
          <mesh>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial
              color="#ffaa00"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            ★
          </Text>
        </group>
      )}

      {/* Pedestal / base */}
      <mesh position={[0, -2.2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 0.1, 32]} />
        <meshStandardMaterial
          color="#0a0a2e"
          emissive={accentColor}
          emissiveIntensity={0.1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Pedestal glow ring */}
      <mesh position={[0, -2.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.02, 16, 64]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={hovered ? 0.6 : 0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

interface ProjectsGalleryProps {
  onProjectSelect: (project: Project | null) => void;
}

export function ProjectsGallery({ onProjectSelect }: ProjectsGalleryProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Arrange projects in a curved gallery layout
  const getProjectPosition = (index: number, total: number): [number, number, number] => {
    const spacing = 5;
    const totalWidth = (total - 1) * spacing;
    const x = -totalWidth / 2 + index * spacing;
    const z = Math.pow(x / 10, 2) * 2; // Slight curve
    return [x, 0, z];
  };

  const getProjectRotation = (index: number, total: number): [number, number, number] => {
    const spacing = 5;
    const totalWidth = (total - 1) * spacing;
    const x = -totalWidth / 2 + index * spacing;
    return [0, -x * 0.03, 0]; // Slight rotation toward center
  };

  return (
    <group ref={groupRef}>
      {/* Section title */}
      <Float speed={1} rotationIntensity={0} floatIntensity={0.3}>
        <Text
          position={[0, 5, 0]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
          font="/fonts/inter-bold.woff"
        >
          PROJECTS
        </Text>
        <Text
          position={[0, 4.3, 0]}
          fontSize={0.18}
          color="#4488aa"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          font="/fonts/inter-medium.woff"
        >
          FEATURED WORK & CASE STUDIES
        </Text>
        {/* Underline */}
        <mesh position={[0, 4.05, 0]}>
          <planeGeometry args={[3, 0.003]} />
          <meshBasicMaterial
            color="#00aaff"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Float>

      {/* Spotlights for gallery */}
      <spotLight position={[0, 8, 5]} angle={0.5} penumbra={0.8} intensity={1.5} color="#4488ff" />
      <spotLight position={[-8, 6, 3]} angle={0.4} penumbra={0.8} intensity={0.8} color="#8844ff" />
      <spotLight position={[8, 6, 3]} angle={0.4} penumbra={0.8} intensity={0.8} color="#00ffaa" />

      {/* Project cards */}
      {projects.map((project, index) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          position={getProjectPosition(index, projects.length)}
          rotation={getProjectRotation(index, projects.length)}
          index={index}
          onSelect={onProjectSelect}
        />
      ))}
    </group>
  );
}
