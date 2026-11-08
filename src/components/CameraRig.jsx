import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Smooth continuous camera position spline along the 6-station scroll journey
const POS_CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 20),       // 0.00 — Hero
    new THREE.Vector3(-1.4, 1.5, 9),   // 0.19 — Career Overview
    new THREE.Vector3(0.6, 2.1, 1),    // 0.39 — Experience (Brand Cards)
    new THREE.Vector3(-0.6, 2.9, -7),  // 0.60 — Methodology
    new THREE.Vector3(0.8, 3.2, -16),  // 0.80 — Credentials
    new THREE.Vector3(0, 2.0, -24),    // 1.00 — Terminal
  ],
  false,
  'catmullrom',
  0.5
);

// Smooth continuous camera look-at spline
const LOOK_CURVE = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 0),        // 0.00 — Hero
    new THREE.Vector3(0, 0.2, -2),     // 0.19 — Career Overview
    new THREE.Vector3(0, 0.3, -9),     // 0.39 — Experience (Brand Cards)
    new THREE.Vector3(-0.2, 0.5, -17), // 0.60 — Methodology
    new THREE.Vector3(0.2, 0.5, -26),  // 0.80 — Credentials
    new THREE.Vector3(0, 0.4, -34),    // 1.00 — Terminal
  ],
  false,
  'catmullrom',
  0.5
);

// Persistent vectors to avoid GC pressure
const currentPos = new THREE.Vector3();
const currentLookAt = new THREE.Vector3();
const targetPos = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const parallaxOffset = new THREE.Vector3();
const targetParallax = new THREE.Vector3();
const finalPos = new THREE.Vector3();

/**
 * CameraRig — Scroll-driven camera flying along continuous C2 splines
 * with subtle damped pointer parallax for natural 3D depth.
 */
export default function CameraRig({ scrollProgress, scrollProgressRef }) {
  const { camera } = useThree();
  const initialized = useRef(false);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const progress = scrollProgressRef ? scrollProgressRef.current : scrollProgress;
    const clampedProgress = Math.max(0, Math.min(1, progress));

    POS_CURVE.getPointAt(clampedProgress, targetPos);
    LOOK_CURVE.getPointAt(clampedProgress, targetLookAt);

    // Subtle pointer parallax so the 3D scene breathes with cursor movement
    targetParallax.set(state.pointer.x * 0.45, state.pointer.y * 0.28, 0);

    if (!initialized.current) {
      currentPos.copy(targetPos);
      currentLookAt.copy(targetLookAt);
      parallaxOffset.copy(targetParallax);
      camera.position.copy(currentPos);
      camera.lookAt(currentLookAt);
      initialized.current = true;
      return;
    }

    // Frame-rate independent exponential damping
    const posFollow = 1 - Math.exp(-8.5 * dt);
    const parallaxFollow = 1 - Math.exp(-4.5 * dt);

    currentPos.lerp(targetPos, posFollow);
    currentLookAt.lerp(targetLookAt, posFollow);
    parallaxOffset.lerp(targetParallax, parallaxFollow);

    finalPos.copy(currentPos).add(parallaxOffset);
    camera.position.copy(finalPos);
    camera.lookAt(currentLookAt);
  });

  return null;
}
