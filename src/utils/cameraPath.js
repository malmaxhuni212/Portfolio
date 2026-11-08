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
export const STOP_RANGES = [
  { start: 0.08, end: 0.22, center: 0.15 },
  { start: 0.28, end: 0.42, center: 0.35 },
  { start: 0.50, end: 0.64, center: 0.57 },
  { start: 0.72, end: 0.88, center: 0.80 },
];

// Primary scroll stations for the 6 portfolio sections:
// Welcome → Overview → Experience (Brand Cards) → Methodology → Credentials → Pipeline
export const SECTIONS = [
  { id: 'hero', label: 'Welcome', shortLabel: '01', target: 0.00, plateau: [0.00, 0.02] },
  { id: 'overview', label: 'Overview', shortLabel: '02', target: 0.19, plateau: [0.14, 0.24] },
  { id: 'experience', label: 'Experience', shortLabel: '03', target: 0.39, plateau: [0.34, 0.45] },
  { id: 'methodology', label: 'Methodology', shortLabel: '04', target: 0.60, plateau: [0.55, 0.65] },
  { id: 'credentials', label: 'Credentials', shortLabel: '05', target: 0.80, plateau: [0.75, 0.85] },
  { id: 'terminal', label: 'Pipeline', shortLabel: '06', target: 0.98, plateau: [0.95, 1.00] },
];

/**
 * Hermite smoothstep interpolation (0 to 1) with zero derivative at endpoints.
 */
export function smoothstep(min, max, value) {
  if (max <= min) return value >= max ? 1 : 0;
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * Compute smooth 3D-like opacity, Y-parallax, and scale for a scroll section.
 */
export function getSectionTransition(
  scrollProgress,
  fadeInStart,
  fadeInEnd,
  fadeOutStart = null,
  fadeOutEnd = null
) {
  const fadeIn = fadeInEnd > fadeInStart
    ? smoothstep(fadeInStart, fadeInEnd, scrollProgress)
    : 1;
  const fadeOut = fadeOutStart !== null && fadeOutEnd !== null
    ? smoothstep(fadeOutStart, fadeOutEnd, scrollProgress)
    : 0;

  const opacity = fadeIn * (1 - fadeOut);
  const translateY = (1 - fadeIn) * 28 - fadeOut * 24;
  const scale = 1 - (1 - fadeIn) * 0.04 + fadeOut * 0.03;

  return { opacity, translateY, scale, isVisible: opacity > 0.005 };
}

/**
 * Get the index of the currently active section (0 to 5)
 */
export function getActiveSectionIndex(scrollProgress) {
  if (scrollProgress < 0.09) return 0;
  if (scrollProgress < 0.29) return 1;
  if (scrollProgress < 0.50) return 2;
  if (scrollProgress < 0.70) return 3;
  if (scrollProgress < 0.90) return 4;
  return 5;
}

/**
 * Check if the scroll position is near a specific stop
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
 */
export function getCurrentStop(scrollOffset) {
  for (let i = 0; i < STOP_RANGES.length; i++) {
    if (scrollOffset >= STOP_RANGES[i].start && scrollOffset <= STOP_RANGES[i].end) {
      return i;
    }
  }
  return -1;
}
