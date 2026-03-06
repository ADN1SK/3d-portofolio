'use client';

import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { ParticleField } from './ParticleField';
import { HeroSection } from './HeroSection';
import { ProjectsGallery } from './ProjectsGallery';
import { SkillsOrbit } from './SkillsOrbit';
import { ContactPortal } from './ContactPortal';
import { CameraController } from './CameraController';
import { GridFloor } from './GridFloor';
import { NavigationUI } from './NavigationUI';
import { ProjectDetailOverlay } from './ProjectDetailOverlay';
import type { Project } from '@/data/projects';

export type SectionName = 'hero' | 'projects' | 'skills' | 'contact';

const SECTION_POSITIONS: Record<SectionName, [number, number, number]> = {
  hero: [0, 2, 0],
  projects: [0, 2, -20],
  skills: [0, 2, -40],
  contact: [0, 2, -60],
};

const CAMERA_TARGETS: Record<SectionName, [number, number, number]> = {
  hero: [0, 1.5, 0],
  projects: [0, 1.5, -20],
  skills: [0, 1.5, -40],
  contact: [0, 1.5, -60],
};

export function Scene3D() {
  const [activeSection, setActiveSection] = useState<SectionName>('hero');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSectionChange = useCallback((section: SectionName) => {
    setActiveSection(section);
  }, []);

  const handleProjectSelect = useCallback((project: Project | null) => {
    setSelectedProject(project);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050510]">
      {/* Loading overlay */}
      <div
        className={`absolute inset-0 z-50 flex items-center justify-center bg-[#050510] transition-opacity duration-1000 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400/70 text-sm tracking-widest uppercase">Loading Environment</p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 2, 12], fov: 60, near: 0.1, far: 200 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          {/* Fog for depth */}
          <fog attach="fog" args={['#050510', 30, 80]} />

          {/* Ambient light */}
          <ambientLight intensity={0.15} color="#4488ff" />

          {/* Camera controller */}
          <CameraController
            activeSection={activeSection}
            sectionPositions={SECTION_POSITIONS}
            cameraTargets={CAMERA_TARGETS}
          />

          {/* Background particles */}
          <ParticleField />

          {/* Grid floor */}
          <GridFloor />

          {/* Sections */}
          <group position={SECTION_POSITIONS.hero}>
            <HeroSection />
          </group>

          <group position={SECTION_POSITIONS.projects}>
            <ProjectsGallery onProjectSelect={handleProjectSelect} />
          </group>

          <group position={SECTION_POSITIONS.skills}>
            <SkillsOrbit />
          </group>

          <group position={SECTION_POSITIONS.contact}>
            <ContactPortal />
          </group>

          {/* Environment lighting */}
          <Environment preset="night" />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new THREE.Vector2(0.0005, 0.0005)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette
              offset={0.3}
              darkness={0.7}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>

          <Preload all />
        </Suspense>
      </Canvas>

      {/* Navigation UI overlay */}
      <NavigationUI
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Project detail overlay */}
      {selectedProject && (
        <ProjectDetailOverlay
          project={selectedProject}
          onClose={() => handleProjectSelect(null)}
        />
      )}
    </div>
  );
}
