import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple lerp helper
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * HeroRobot — Friendly futuristic robot from R3F primitives.
 * Waves and smiles every ~8 seconds, then returns to idle.
 */
export default function HeroRobot() {
  const groupRef = useRef();
  const rightArmRef = useRef();
  const leftArmRef = useRef();
  const antennaRef = useRef();
  const eyeLeftRef = useRef();
  const eyeRightRef = useRef();
  const visorGlowRef = useRef();
  const smileRef = useRef();
  const cheekLeftRef = useRef();
  const cheekRightRef = useRef();
  const rightHandRef = useRef();

  // Colors
  const bodyColor = useMemo(() => new THREE.Color('#0d0d1a'), []);

  // Wave cycle constants
  const WAVE_INTERVAL = 8;    // seconds between wave starts
  const WAVE_DURATION = 3;    // seconds each wave lasts
  const WAVE_FADE_IN = 0.4;   // seconds to raise arm
  const WAVE_FADE_OUT = 0.5;  // seconds to lower arm

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // === WAVE CYCLE ===
    const cycleTime = t % WAVE_INTERVAL;
    const isWaving = cycleTime < WAVE_DURATION;

    // Wave intensity: ramps up, sustains, ramps down
    let waveIntensity = 0;
    if (isWaving) {
      if (cycleTime < WAVE_FADE_IN) {
        // Ramp up
        waveIntensity = cycleTime / WAVE_FADE_IN;
      } else if (cycleTime > WAVE_DURATION - WAVE_FADE_OUT) {
        // Ramp down
        waveIntensity = (WAVE_DURATION - cycleTime) / WAVE_FADE_OUT;
      } else {
        // Full wave
        waveIntensity = 1;
      }
    }
    waveIntensity = Math.max(0, Math.min(1, waveIntensity));

    // === FLOATING HOVER (always active) ===
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.06;
    }

    // === RIGHT ARM — wave during cycle, rest otherwise ===
    if (rightArmRef.current) {
      // Wave motion: arm raised high + oscillating side to side
      const waveAngle = -1.8 + Math.sin(t * 4) * 0.4;
      const restAngle = 0.15;
      const targetZ = lerp(restAngle, waveAngle, waveIntensity);
      rightArmRef.current.rotation.z = lerp(rightArmRef.current.rotation.z, targetZ, 0.18);

      // Forward tilt when waving for more visibility
      const targetX = waveIntensity * (0.3 + Math.sin(t * 4) * 0.15);
      rightArmRef.current.rotation.x = lerp(rightArmRef.current.rotation.x, targetX, 0.15);
    }

    // === RIGHT HAND — glow bright during wave ===
    if (rightHandRef.current) {
      const handGlow = 0.5 + waveIntensity * 2.5;
      rightHandRef.current.material.emissiveIntensity = lerp(
        rightHandRef.current.material.emissiveIntensity, handGlow, 0.1
      );
    }

    // === LEFT ARM — subtle idle sway ===
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.15 + Math.sin(t * 0.7) * 0.04;
    }

    // === ANTENNA — bobs gently ===
    if (antennaRef.current) {
      antennaRef.current.rotation.x = Math.sin(t * 1.8) * 0.12;
      antennaRef.current.rotation.z = Math.sin(t * 1.2) * 0.08;
    }

    // === EYES — brighter during wave ===
    const baseEyePulse = 1.2 + Math.sin(t * 2) * 0.3;
    const waveBrightness = baseEyePulse + waveIntensity * 1.5;
    if (eyeLeftRef.current) eyeLeftRef.current.material.emissiveIntensity = waveBrightness;
    if (eyeRightRef.current) eyeRightRef.current.material.emissiveIntensity = waveBrightness;

    // === VISOR GLOW ===
    if (visorGlowRef.current) {
      visorGlowRef.current.material.opacity = 0.12 + Math.sin(t * 1.5) * 0.06 + waveIntensity * 0.08;
    }

    // === SMILE — appears during wave ===
    if (smileRef.current) {
      const targetSmileScale = waveIntensity;
      smileRef.current.scale.x = lerp(smileRef.current.scale.x, targetSmileScale, 0.08);
      smileRef.current.scale.y = lerp(smileRef.current.scale.y, targetSmileScale, 0.08);
      smileRef.current.scale.z = lerp(smileRef.current.scale.z, targetSmileScale, 0.08);
      smileRef.current.material.opacity = lerp(smileRef.current.material.opacity, waveIntensity * 0.9, 0.1);
    }

    // === CHEEK GLOW — appears during wave ===
    if (cheekLeftRef.current) {
      cheekLeftRef.current.material.opacity = lerp(cheekLeftRef.current.material.opacity, waveIntensity * 0.35, 0.06);
    }
    if (cheekRightRef.current) {
      cheekRightRef.current.material.opacity = lerp(cheekRightRef.current.material.opacity, waveIntensity * 0.35, 0.06);
    }
  });

  return (
    <group ref={groupRef} scale={1.1}>
      {/* === HEAD === */}
      <group position={[0, 1.05, 0]}>
        {/* Main head body */}
        <mesh>
          <boxGeometry args={[0.72, 0.6, 0.55]} />
          <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Visor / face plate */}
        <mesh position={[0, -0.02, 0.28]}>
          <boxGeometry args={[0.58, 0.35, 0.02]} />
          <meshStandardMaterial color="#0a0a2e" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Visor glow overlay */}
        <mesh ref={visorGlowRef} position={[0, -0.02, 0.29]}>
          <boxGeometry args={[0.6, 0.37, 0.005]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} toneMapped={false} />
        </mesh>

        {/* Left eye */}
        <mesh ref={eyeLeftRef} position={[-0.14, 0.02, 0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.5} toneMapped={false}
          />
        </mesh>

        {/* Right eye */}
        <mesh ref={eyeRightRef} position={[0.14, 0.02, 0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.5} toneMapped={false}
          />
        </mesh>

        {/* === SMILE ARC — only visible during wave === */}
        <mesh ref={smileRef} position={[0, -0.1, 0.295]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.1, 0.018, 8, 20, Math.PI]} />
          <meshBasicMaterial
            color="#00d4ff" transparent opacity={0} toneMapped={false}
          />
        </mesh>

        {/* Left cheek glow */}
        <mesh ref={cheekLeftRef} position={[-0.22, -0.06, 0.28]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial
            color="#7c3aed" transparent opacity={0} toneMapped={false}
          />
        </mesh>

        {/* Right cheek glow */}
        <mesh ref={cheekRightRef} position={[0.22, -0.06, 0.28]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial
            color="#7c3aed" transparent opacity={0} toneMapped={false}
          />
        </mesh>

        {/* Antenna stalk */}
        <group ref={antennaRef} position={[0, 0.32, 0]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.02, 0.22, 8]} />
            <meshStandardMaterial color="#1a1a3e" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Antenna tip — glowing orb */}
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial
              color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2} toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial
              color="#7c3aed" transparent opacity={0.2} toneMapped={false}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        {/* Ear panels */}
        <mesh position={[-0.39, 0, 0]}>
          <boxGeometry args={[0.06, 0.25, 0.2]} />
          <meshStandardMaterial color="#1a1a3e" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.39, 0, 0]}>
          <boxGeometry args={[0.06, 0.25, 0.2]} />
          <meshStandardMaterial color="#1a1a3e" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* === NECK === */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 8]} />
        <meshStandardMaterial color="#1a1a3e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* === TORSO === */}
      <group position={[0, 0.25, 0]}>
        <mesh>
          <boxGeometry args={[0.7, 0.75, 0.45]} />
          <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Chest plate / arc reactor */}
        <mesh position={[0, 0.08, 0.23]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          <meshStandardMaterial
            color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.2} toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.08, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.015, 8, 24]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} toneMapped={false} />
        </mesh>

        {/* Torso detail lines */}
        <mesh position={[0, -0.2, 0.23]}>
          <boxGeometry args={[0.4, 0.02, 0.005]} />
          <meshBasicMaterial color="#4f46e5" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.28, 0.23]}>
          <boxGeometry args={[0.3, 0.02, 0.005]} />
          <meshBasicMaterial color="#4f46e5" toneMapped={false} />
        </mesh>
      </group>

      {/* === RIGHT ARM (waves periodically — viewer's right side) === */}
      <group position={[0.48, 0.4, 0]}>
        <group ref={rightArmRef}>
          {/* Upper arm */}
          <mesh position={[0.12, -0.05, 0]}>
            <boxGeometry args={[0.13, 0.35, 0.13]} />
            <meshStandardMaterial color="#111128" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Shoulder joint */}
          <mesh>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#1a1a3e" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0.12, -0.38, 0]}>
            <boxGeometry args={[0.11, 0.3, 0.11]} />
            <meshStandardMaterial color="#161636" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Hand — glows bright cyan during wave */}
          <mesh ref={rightHandRef} position={[0.12, -0.56, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial
              color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} toneMapped={false}
            />
          </mesh>
          {/* Hand glow aura */}
          <mesh position={[0.12, -0.56, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshBasicMaterial
              color="#00d4ff" transparent opacity={0.08} toneMapped={false}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      </group>

      {/* === LEFT ARM === */}
      <group position={[-0.48, 0.4, 0]}>
        <group ref={leftArmRef}>
          <mesh position={[-0.12, -0.05, 0]}>
            <boxGeometry args={[0.12, 0.35, 0.12]} />
            <meshStandardMaterial color="#0d0d1a" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#1a1a3e" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[-0.12, -0.38, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color="#1a1a3e" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-0.12, -0.56, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#1a1a3e" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* === LOWER BODY / HOVER BASE === */}
      <group position={[0, -0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.15, 0.35]} />
          <meshStandardMaterial color="#0d0d1a" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.3, 0.2, 0.12, 6]} />
          <meshStandardMaterial color="#1a1a3e" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.04, 16]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 24]} />
          <meshBasicMaterial
            color="#00d4ff" transparent opacity={0.15} toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
