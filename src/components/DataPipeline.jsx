import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { cameraPath } from '../utils/cameraPath';

export default function DataPipeline() {
  const mainTubeRef = useRef();
  const glowTubeRef = useRef();
  const pulseRef = useRef();

  // Create tube geometry along the camera path
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(cameraPath, 200, 0.03, 8, false);
  }, []);

  const glowTubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(cameraPath, 200, 0.08, 8, false);
  }, []);

  // Create data pulse spheres along the path
  const pulsePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 5; i++) {
      positions.push(cameraPath.getPointAt(i / 5));
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    
    // Animate glow intensity
    if (glowTubeRef.current) {
      glowTubeRef.current.material.opacity = 0.15 + Math.sin(t * 0.5) * 0.05;
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

      {/* Connector lines branching to each data node */}
      {/* These are simple thin lines from the main path to each stop position */}
    </group>
  );
}
