'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { SectionName } from './Scene3D';

interface CameraControllerProps {
  activeSection: SectionName;
  sectionPositions: Record<SectionName, [number, number, number]>;
  cameraTargets: Record<SectionName, [number, number, number]>;
}

export function CameraController({
  activeSection,
  sectionPositions,
  cameraTargets,
}: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 2, 12));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, 0));
  const mouseOffset = useRef(new THREE.Vector2(0, 0));
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const pos = sectionPositions[activeSection];
    const target = cameraTargets[activeSection];

    targetPosition.current.set(pos[0], pos[1], pos[2] + 12);
    targetLookAt.current.set(target[0], target[1], target[2]);
  }, [activeSection, sectionPositions, cameraTargets]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseOffset.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseOffset.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    const lerpFactor = 1 - Math.pow(0.05, delta);

    // Smooth mouse parallax
    smoothMouse.current.lerp(mouseOffset.current, lerpFactor * 0.5);

    // Calculate camera position with mouse parallax
    const parallaxX = smoothMouse.current.x * 0.5;
    const parallaxY = -smoothMouse.current.y * 0.3;

    const finalTarget = new THREE.Vector3(
      targetPosition.current.x + parallaxX,
      targetPosition.current.y + parallaxY,
      targetPosition.current.z
    );

    // Smooth camera position
    camera.position.lerp(finalTarget, lerpFactor);

    // Smooth look-at
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
