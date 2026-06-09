import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 1500;

export default function ParticleField() {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    
    const color1 = new THREE.Color('#1a1a3e');
    const color2 = new THREE.Color('#4f46e5');
    const color3 = new THREE.Color('#00d4ff');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread particles along the full camera path length
      pos[i * 3] = (Math.random() - 0.5) * 40;      // x: wide spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;  // y: moderate spread
      pos[i * 3 + 2] = (Math.random()) * -50 + 25;   // z: along path depth

      // Randomize colors between dark blue and neon
      const mixFactor = Math.random();
      const selectedColor = mixFactor < 0.7 ? color1 : mixFactor < 0.95 ? color2 : color3;
      col[i * 3] = selectedColor.r;
      col[i * 3 + 1] = selectedColor.g;
      col[i * 3 + 2] = selectedColor.b;
    }

    return [pos, col];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.01;
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.005) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        toneMapped={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
