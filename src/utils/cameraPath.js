import * as THREE from 'three';

// Define the camera flight path through the 3D experience
// The camera follows this CatmullRomCurve3 as the user scrolls
export const CAMERA_PATH_POINTS = [
  new THREE.Vector3(0, 0, 20),      // Entry — wide overview
  new THREE.Vector3(-4, 1, 12),     // Approach to Part 1
  new THREE.Vector3(-8, 2, 5),      // Stop 1 — Mavix AI Engineer
  new THREE.Vector3(-2, 1.5, 0),    // Transition
  new THREE.Vector3(3, -0.5, -3),   // Approach to Part 2  
  new THREE.Vector3(6, -1, -5),     // Stop 2 — Frashëri Case Study
  new THREE.Vector3(2, 1, -9),      // Transition
  new THREE.Vector3(-3, 2, -12),    // Approach to Part 3
  new THREE.Vector3(-5, 3, -15),    // Stop 3 — M-Design CRM
  new THREE.Vector3(0, 2, -19),     // Transition
  new THREE.Vector3(5, 0.5, -22),   // Approach to Part 4
  new THREE.Vector3(8, 0, -25),     // Stop 4 — Analytics
  new THREE.Vector3(8, 0.5, -28),   // Outro
];

// Create the smooth curve
export const cameraPath = new THREE.CatmullRomCurve3(
  CAMERA_PATH_POINTS,
  false,         // not closed
  'catmullrom',  // curve type
  0.5            // tension
);

// Look-at targets (slightly offset from stops for better framing)
export const LOOK_AT_TARGETS = [
  new THREE.Vector3(-8, 2, 4),     // Look at Stop 1
  new THREE.Vector3(6, -1, -6),    // Look at Stop 2
  new THREE.Vector3(-5, 3, -16),   // Look at Stop 3
  new THREE.Vector3(8, 0, -26),    // Look at Stop 4
];

// Scroll progress ranges for each stop (0-1)
// Each stop occupies a range of the total scroll
export const STOP_RANGES = [
  { start: 0.08, end: 0.22, center: 0.15 },   // Stop 1: Mavix
  { start: 0.28, end: 0.42, center: 0.35 },   // Stop 2: Frashëri
  { start: 0.50, end: 0.64, center: 0.57 },   // Stop 3: M-Design  
  { start: 0.72, end: 0.88, center: 0.80 },   // Stop 4: Analytics
];

/**
 * Check if the scroll position is near a specific stop
 * @param {number} scrollOffset - Current scroll progress (0-1)
 * @param {number} stopIndex - Index of the stop (0-3)
 * @param {number} threshold - How close to be considered "near"
 * @returns {number} - 0 to 1 proximity value (1 = at center)
 */
export function getStopProximity(scrollOffset, stopIndex, threshold = 0.12) {
  const stop = STOP_RANGES[stopIndex];
  if (!stop) return 0;
  const distance = Math.abs(scrollOffset - stop.center);
  if (distance > threshold) return 0;
  return 1 - (distance / threshold);
}

/**
 * Get which stop is currently closest
 * @param {number} scrollOffset
 * @returns {number} - Stop index (0-3) or -1 if none near
 */
export function getCurrentStop(scrollOffset) {
  for (let i = 0; i < STOP_RANGES.length; i++) {
    if (scrollOffset >= STOP_RANGES[i].start && scrollOffset <= STOP_RANGES[i].end) {
      return i;
    }
  }
  return -1;
}
