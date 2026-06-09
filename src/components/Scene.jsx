import CameraRig from './CameraRig';
import DataPipeline from './DataPipeline';
import ParticleField from './ParticleField';

/**
 * Scene — 3D background elements.
 * Camera driven by scrollProgress for the fly-through effect.
 */
export default function Scene({ scrollProgress, showBrands }) {
  return (
    <>
      <CameraRig scrollProgress={scrollProgress} showBrands={showBrands} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#4f46e5" />
      <pointLight position={[-10, 5, -10]} intensity={0.2} color="#00d4ff" />
      <pointLight position={[10, -5, -20]} intensity={0.2} color="#7c3aed" />

      {/* Glowing data pipeline */}
      <DataPipeline />

      {/* Ambient particle field */}
      <ParticleField />
    </>
  );
}
