import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cameraPath } from '../utils/cameraPath';

const PULSE_COUNT = 6;
const tempPoint = new THREE.Vector3();

export default function DataPipeline() {
  const mainTubeRef = useRef();
  const glowTubeRef = useRef();
  const pulsesGroupRef = useRef();

  // Create tube geometry along the camera path
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(cameraPath, 200, 0.03, 8, false);
  }, []);

  const glowTubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(cameraPath, 200, 0.08, 8, false);
  }, []);

  const pulseIndices = useMemo(() => Array.from({ length: PULSE_COUNT }, (_, i) => i), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Animate glow intensity
    if (glowTubeRef.current) {
      glowTubeRef.current.material.opacity = 0.15 + Math.sin(t * 0.8) * 0.05;
    }

    // Animate data pulses traveling smoothly along the pipeline
    if (pulsesGroupRef.current) {
      const children = pulsesGroupRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const progress = (t * 0.045 + i / PULSE_COUNT) % 1;
        cameraPath.getPointAt(progress, tempPoint);
        children[i].position.copy(tempPoint);
        const pulseScale = 0.85 + Math.sin(t * 3 + i * 1.5) * 0.25;
        children[i].scale.setScalar(pulseScale);
      }
    }
  });

  return (
    <group>
      {/* Core pipeline line */}
      <mesh ref={mainTubeRef} geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#00d4ff"
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow tube */}
      <mesh ref={glowTubeRef} geometry={glowTubeGeometry}>
        <meshBasicMaterial
          color="#4f46e5"
          transparent
          opacity={0.15}
          toneMapped={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Animated data pulses along the pipeline */}
      <group ref={pulsesGroupRef}>
        {pulseIndices.map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial
              color="#00d4ff"
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
