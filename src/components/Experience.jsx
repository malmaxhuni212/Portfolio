import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Scene from './Scene';

/**
 * Experience — R3F Canvas providing the 3D background.
 * Camera position driven by scrollProgress.
 */
export default function Experience({ scrollProgress, showBrands }) {
  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: false }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#000000']} />

      <Scene scrollProgress={scrollProgress} showBrands={showBrands} />

      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.8}
          luminanceSmoothing={0.3}
          intensity={1.8}
          levels={6}
        />
      </EffectComposer>
    </Canvas>
  );
}
