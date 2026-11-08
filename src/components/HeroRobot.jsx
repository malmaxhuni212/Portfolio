import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple lerp helper
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Frame-rate independent damping helper
function damp(a, b, lambda, dt) {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

/**
 * HeroRobot — Friendly futuristic robot from R3F primitives.
 * Raises its right arm with an articulated elbow and waves hello visibly.
 */
export default function HeroRobot() {
  const groupRef = useRef();
  const headRef = useRef();
  const rightArmRef = useRef();
  const rightForearmRef = useRef();
  const leftArmRef = useRef();
  const antennaRef = useRef();
  const eyeLeftRef = useRef();
  const eyeRightRef = useRef();
  const visorGlowRef = useRef();
  const smileRef = useRef();
  const cheekLeftRef = useRef();
  const cheekRightRef = useRef();
  const rightHandRef = useRef();
  const waveRingRef = useRef();

  // Colors — slightly brighter cyber-slate so limbs stand out clearly against dark space
  const bodyColor = useMemo(() => new THREE.Color('#11162b'), []);
  const limbColor = useMemo(() => new THREE.Color('#1b2444'), []);

  // Wave cycle: waves for 5.2s out of every 6.5s so the user always sees it waving hello
  const WAVE_INTERVAL = 6.5;
  const WAVE_DURATION = 5.2;
  const WAVE_FADE_IN = 0.45;
  const WAVE_FADE_OUT = 0.5;

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 0.1);

    // === WAVE CYCLE ===
    const cycleTime = t % WAVE_INTERVAL;
    const isWaving = cycleTime < WAVE_DURATION;

    let waveIntensity = 0;
    if (isWaving) {
      if (cycleTime < WAVE_FADE_IN) {
        waveIntensity = cycleTime / WAVE_FADE_IN;
      } else if (cycleTime > WAVE_DURATION - WAVE_FADE_OUT) {
        waveIntensity = (WAVE_DURATION - cycleTime) / WAVE_FADE_OUT;
      } else {
        waveIntensity = 1;
      }
    }
    waveIntensity = Math.max(0, Math.min(1, waveIntensity));

    // === FLOATING HOVER (always active) ===
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.1) * 0.11;
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.08;
    }

    // === FRIENDLY HEAD TILT WHILE WAVING ===
    if (headRef.current) {
      const targetTiltZ = waveIntensity * (-0.08 + Math.sin(t * 3.5) * 0.04);
      const targetNodX = Math.sin(t * 1.8) * 0.04;
      headRef.current.rotation.z = damp(headRef.current.rotation.z, targetTiltZ, 8, dt);
      headRef.current.rotation.x = damp(headRef.current.rotation.x, targetNodX, 8, dt);
    }

    // === RIGHT ARM (Shoulder + Elbow articulated wave up beside the head) ===
    // Note: Arm is on +X side and hangs toward -Y at rest.
    // Positive Z rotation swings the arm OUTWARD (+X) and UPWARD (+Y)!
    if (rightArmRef.current) {
      const restShoulderZ = 0.18;
      const waveShoulderZ = 1.85 + Math.sin(t * 7.2) * 0.16; // Raised high and outward
      const targetShoulderZ = lerp(restShoulderZ, waveShoulderZ, waveIntensity);
      rightArmRef.current.rotation.z = damp(rightArmRef.current.rotation.z, targetShoulderZ, 12, dt);

      const targetShoulderX = lerp(0, -0.22, waveIntensity); // Slight forward angle toward camera
      rightArmRef.current.rotation.x = damp(rightArmRef.current.rotation.x, targetShoulderX, 10, dt);
    }

    if (rightForearmRef.current) {
      const restElbowZ = 0.08;
      // Forearm bends upward so the hand is up near head level waving side-to-side
      const waveElbowZ = 1.05 + Math.sin(t * 7.2) * 0.48;
      const targetElbowZ = lerp(restElbowZ, waveElbowZ, waveIntensity);
      rightForearmRef.current.rotation.z = damp(rightForearmRef.current.rotation.z, targetElbowZ, 15, dt);
    }

    // === RIGHT HAND & WAVE PULSE — glow bright during wave ===
    if (rightHandRef.current) {
      const handGlow = 1.2 + waveIntensity * 2.2 + Math.sin(t * 7.2) * 0.4 * waveIntensity;
      rightHandRef.current.material.emissiveIntensity = damp(
        rightHandRef.current.material.emissiveIntensity, handGlow, 8, dt
      );
    }

    if (waveRingRef.current) {
      const ringScale = 1 + Math.sin(t * 7.2) * 0.22 * waveIntensity;
      waveRingRef.current.scale.setScalar(ringScale);
      waveRingRef.current.material.opacity = damp(
        waveRingRef.current.material.opacity,
        0.18 + waveIntensity * 0.35,
        8,
        dt
      );
    }

    // === LEFT ARM — subtle idle sway outward (-Z rotation on -X side) ===
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = -0.18 - Math.sin(t * 0.9) * 0.05;
    }

    // === ANTENNA — bobs gently ===
    if (antennaRef.current) {
      antennaRef.current.rotation.x = Math.sin(t * 2.0) * 0.12;
      antennaRef.current.rotation.z = Math.sin(t * 3.6) * (0.08 + waveIntensity * 0.08);
    }

    // === EYES — brighter during wave ===
    const baseEyePulse = 1.3 + Math.sin(t * 2.2) * 0.25;
    const waveBrightness = baseEyePulse + waveIntensity * 1.4;
    if (eyeLeftRef.current) eyeLeftRef.current.material.emissiveIntensity = waveBrightness;
    if (eyeRightRef.current) eyeRightRef.current.material.emissiveIntensity = waveBrightness;

    // === VISOR GLOW ===
    if (visorGlowRef.current) {
      visorGlowRef.current.material.opacity = 0.14 + Math.sin(t * 1.5) * 0.05 + waveIntensity * 0.08;
    }

    // === SMILE — visible during wave ===
    if (smileRef.current) {
      const targetSmileScale = Math.max(0.35, waveIntensity);
      smileRef.current.scale.x = damp(smileRef.current.scale.x, targetSmileScale, 6, dt);
      smileRef.current.scale.y = damp(smileRef.current.scale.y, targetSmileScale, 6, dt);
      smileRef.current.scale.z = damp(smileRef.current.scale.z, targetSmileScale, 6, dt);
      smileRef.current.material.opacity = damp(
        smileRef.current.material.opacity,
        0.35 + waveIntensity * 0.6,
        6,
        dt
      );
    }

    // === CHEEK GLOW — appears during wave ===
    if (cheekLeftRef.current) {
      cheekLeftRef.current.material.opacity = damp(cheekLeftRef.current.material.opacity, waveIntensity * 0.4, 5, dt);
    }
    if (cheekRightRef.current) {
      cheekRightRef.current.material.opacity = damp(cheekRightRef.current.material.opacity, waveIntensity * 0.4, 5, dt);
    }
  });

  return (
    <group ref={groupRef} scale={1.1}>
      {/* === HEAD === */}
      <group ref={headRef} position={[0, 1.05, 0]}>
        {/* Main head body */}
        <mesh>
          <boxGeometry args={[0.72, 0.6, 0.55]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive="#0b132b"
            emissiveIntensity={0.35}
            metalness={0.7}
            roughness={0.25}
          />
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
        <mesh ref={eyeLeftRef} position={[-0.14, 0.04, 0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.6} toneMapped={false}
          />
        </mesh>

        {/* Right eye */}
        <mesh ref={eyeRightRef} position={[0.14, 0.04, 0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.6} toneMapped={false}
          />
        </mesh>

        {/* === SMILE ARC === */}
        <mesh ref={smileRef} position={[0, -0.08, 0.298]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.095, 0.018, 8, 24, Math.PI]} />
          <meshBasicMaterial
            color="#00d4ff" transparent opacity={0.85} toneMapped={false}
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
          <meshStandardMaterial color="#1e294b" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0.39, 0, 0]}>
          <boxGeometry args={[0.06, 0.25, 0.2]} />
          <meshStandardMaterial color="#1e294b" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* === NECK === */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 8]} />
        <meshStandardMaterial color="#1e294b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* === TORSO === */}
      <group position={[0, 0.25, 0]}>
        <mesh>
          <boxGeometry args={[0.7, 0.75, 0.45]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive="#0b132b"
            emissiveIntensity={0.3}
            metalness={0.7}
            roughness={0.25}
          />
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

      {/* === RIGHT ARM (Articulated waving arm — viewer's right side) === */}
      <group position={[0.44, 0.5, 0.04]}>
        <group ref={rightArmRef}>
          {/* Glowing shoulder joint */}
          <mesh>
            <sphereGeometry args={[0.095, 14, 14]} />
            <meshStandardMaterial
              color={limbColor}
              emissive="#4f46e5"
              emissiveIntensity={0.6}
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>

          {/* Upper arm segment */}
          <mesh position={[0, -0.17, 0]}>
            <boxGeometry args={[0.13, 0.3, 0.13]} />
            <meshStandardMaterial
              color={limbColor}
              emissive="#1e3a8a"
              emissiveIntensity={0.45}
              metalness={0.6}
              roughness={0.25}
            />
          </mesh>

          {/* Upper arm neon cuff */}
          <mesh position={[0, -0.17, 0.068]}>
            <boxGeometry args={[0.09, 0.18, 0.01]} />
            <meshBasicMaterial color="#4f46e5" transparent opacity={0.75} toneMapped={false} />
          </mesh>

          {/* ELBOW PIVOT & FOREARM */}
          <group ref={rightForearmRef} position={[0, -0.33, 0]}>
            {/* Glowing cyan elbow joint */}
            <mesh>
              <sphereGeometry args={[0.075, 14, 14]} />
              <meshStandardMaterial
                color="#00d4ff"
                emissive="#00d4ff"
                emissiveIntensity={1.1}
                toneMapped={false}
              />
            </mesh>

            {/* Forearm segment */}
            <mesh position={[0, -0.16, 0]}>
              <boxGeometry args={[0.115, 0.28, 0.115]} />
              <meshStandardMaterial
                color={limbColor}
                emissive="#00d4ff"
                emissiveIntensity={0.35}
                metalness={0.55}
                roughness={0.25}
              />
            </mesh>

            {/* Forearm glowing cyan stripe */}
            <mesh position={[0, -0.16, 0.06]}>
              <boxGeometry args={[0.05, 0.2, 0.01]} />
              <meshBasicMaterial color="#00d4ff" transparent opacity={0.9} toneMapped={false} />
            </mesh>

            {/* Waving Hand — bright glowing palm + 3 holographic fingers */}
            <group position={[0, -0.34, 0]}>
              <mesh ref={rightHandRef}>
                <sphereGeometry args={[0.085, 16, 16]} />
                <meshStandardMaterial
                  color="#00d4ff"
                  emissive="#00d4ff"
                  emissiveIntensity={2.2}
                  toneMapped={false}
                />
              </mesh>

              {/* 3 little glowing cyber-fingers so the hand shape is unmistakable */}
              <mesh position={[-0.045, -0.085, 0]} rotation={[0, 0, -0.25]}>
                <capsuleGeometry args={[0.016, 0.045, 4, 8]} />
                <meshBasicMaterial color="#00d4ff" toneMapped={false} />
              </mesh>
              <mesh position={[0, -0.095, 0]}>
                <capsuleGeometry args={[0.016, 0.055, 4, 8]} />
                <meshBasicMaterial color="#00d4ff" toneMapped={false} />
              </mesh>
              <mesh position={[0.045, -0.085, 0]} rotation={[0, 0, 0.25]}>
                <capsuleGeometry args={[0.016, 0.045, 4, 8]} />
                <meshBasicMaterial color="#00d4ff" toneMapped={false} />
              </mesh>

              {/* Hand glow aura */}
              <mesh ref={waveRingRef}>
                <sphereGeometry args={[0.145, 14, 14]} />
                <meshBasicMaterial
                  color="#00d4ff"
                  transparent
                  opacity={0.3}
                  toneMapped={false}
                  side={THREE.BackSide}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* === LEFT ARM === */}
      <group position={[-0.44, 0.5, 0]}>
        <group ref={leftArmRef}>
          <mesh>
            <sphereGeometry args={[0.085, 12, 12]} />
            <meshStandardMaterial
              color={limbColor}
              emissive="#4f46e5"
              emissiveIntensity={0.4}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-0.06, -0.17, 0]}>
            <boxGeometry args={[0.12, 0.32, 0.12]} />
            <meshStandardMaterial
              color={limbColor}
              emissive="#1e3a8a"
              emissiveIntensity={0.3}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-0.06, -0.45, 0]}>
            <boxGeometry args={[0.1, 0.28, 0.1]} />
            <meshStandardMaterial
              color={limbColor}
              emissive="#1e3a8a"
              emissiveIntensity={0.3}
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-0.06, -0.63, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={0.9}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* === LOWER BODY / HOVER BASE === */}
      <group position={[0, -0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.15, 0.35]} />
          <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.3, 0.2, 0.12, 6]} />
          <meshStandardMaterial color="#1e294b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.04, 16]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.35} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 24]} />
          <meshBasicMaterial
            color="#00d4ff" transparent opacity={0.18} toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
