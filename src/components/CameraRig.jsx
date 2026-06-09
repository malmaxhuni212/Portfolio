import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Camera waypoints along the full scroll journey
const WAYPOINTS = [
  { pos: new THREE.Vector3(0, 0, 20),      look: new THREE.Vector3(0, 0, 0) },      // 0.00 — Hero
  { pos: new THREE.Vector3(-1, 1.5, 5),    look: new THREE.Vector3(0, 0, -4) },     // 0.20 — Career Overview
  { pos: new THREE.Vector3(0, 3, -4),      look: new THREE.Vector3(0, 0, -12) },    // 0.40 — Methodology
  { pos: new THREE.Vector3(0.5, 4, -12),   look: new THREE.Vector3(0, 0, -20) },    // 0.60 — Deep space gap
  { pos: new THREE.Vector3(1, 3, -18),     look: new THREE.Vector3(0, 0, -28) },    // 0.80 — Credentials
  { pos: new THREE.Vector3(0, 2, -24),     look: new THREE.Vector3(0, 0, -34) },    // 1.00 — Terminal
];

// Brands override position
const POS_BRANDS = new THREE.Vector3(0.5, 2, 2);
const LOOK_BRANDS = new THREE.Vector3(0, 0, -6);

// Persistent vectors to avoid GC
const currentPos = new THREE.Vector3();
const currentLookAt = new THREE.Vector3();
const targetPos = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();

/**
 * Smoothly interpolate through waypoints based on a 0-1 progress value.
 */
function sampleWaypoints(progress, outPos, outLook) {
  const segCount = WAYPOINTS.length - 1;
  const t = Math.max(0, Math.min(1, progress)) * segCount;
  const segIndex = Math.min(Math.floor(t), segCount - 1);
  const segT = t - segIndex;

  // Ease-in-out cubic for smooth transitions
  const eased = segT * segT * (3 - 2 * segT);

  outPos.lerpVectors(WAYPOINTS[segIndex].pos, WAYPOINTS[segIndex + 1].pos, eased);
  outLook.lerpVectors(WAYPOINTS[segIndex].look, WAYPOINTS[segIndex + 1].look, eased);
}

/**
 * CameraRig — Scroll-driven camera flying through 6 waypoints.
 */
export default function CameraRig({ scrollProgress, showBrands }) {
  const { camera } = useThree();
  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (showBrands) {
      targetPos.copy(POS_BRANDS);
      targetLookAt.copy(LOOK_BRANDS);
    } else {
      sampleWaypoints(scrollProgress, targetPos, targetLookAt);
    }

    if (!initialized.current) {
      currentPos.copy(targetPos);
      currentLookAt.copy(targetLookAt);
      camera.position.copy(currentPos);
      camera.lookAt(currentLookAt);
      initialized.current = true;
      return;
    }

    const speed = 1 - Math.pow(0.03, delta);
    currentPos.lerp(targetPos, speed);
    currentLookAt.lerp(targetLookAt, speed);

    camera.position.copy(currentPos);
    camera.lookAt(currentLookAt);
  });

  return null;
}
