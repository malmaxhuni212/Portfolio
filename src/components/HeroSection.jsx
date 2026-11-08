import { useState, useEffect, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import HeroRobot from './HeroRobot';
import HeroParticles from './HeroParticles';
import { smoothstep } from '../utils/cameraPath';

/**
 * HeroSection — Full-viewport landing overlay.
 * Opacity driven by scrollProgress with smoothstep easing and persistent WebGL context.
 */
const HeroSection = memo(function HeroSection({ scrollProgress, onExplore }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smooth fade out over the first 10% of scroll
  const fadeProgress = smoothstep(0.01, 0.10, scrollProgress);
  const heroOpacity = 1 - fadeProgress;
  const isHidden = heroOpacity < 0.005;

  return (
    <div
      className="hero-section"
      id="hero-section"
      style={{
        opacity: heroOpacity,
        transform: `translate3d(0, ${-fadeProgress * 18}px, 0) scale(${1 + fadeProgress * 0.035})`,
        pointerEvents: isHidden ? 'none' : 'auto',
        visibility: isHidden ? 'hidden' : 'visible',
      }}
    >
      {/* 3D Canvas — Persistent to avoid WebGL context re-initialization hitches */}
      <div className="hero-canvas">
        <Canvas
          frameloop={isHidden ? 'never' : 'always'}
          camera={{ position: [0, 0.5, 4], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={['#050508']} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[3, 5, 4]} intensity={0.6} color="#e2e8f0" />
          <pointLight position={[-3, 2, 2]} intensity={0.4} color="#00d4ff" />
          <pointLight position={[2, -1, 3]} intensity={0.3} color="#4f46e5" />
          <pointLight position={[0, -2, 1]} intensity={0.4} color="#00d4ff" />

          <group
            position={isMobile ? [0, 0.65, 0] : [1.3, -0.3, 0]}
            rotation={isMobile ? [0, -0.15, 0] : [0, -0.3, 0]}
            scale={isMobile ? 0.55 : 1}
          >
            <HeroRobot />
          </group>

          <HeroParticles />

          <EffectComposer multisampling={0}>
            <Bloom
              mipmapBlur
              luminanceThreshold={0.8}
              luminanceSmoothing={0.3}
              intensity={1.5}
              levels={5}
            />
          </EffectComposer>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="hero-overlay">
        <div className="hero-card" id="hero-card">
          <div className="hero-card__accent" />
          <div className="hero-card__status">
            <span className="hero-card__status-dot" />
            <span className="hero-card__status-text">SYSTEMS ONLINE</span>
          </div>
          <h1 className="hero-card__headline" id="hero-headline">
            Welcome to My Digital Portfolio.
          </h1>
          <div className="hero-card__body">
            <p>
              Hello, I&apos;m <span className="hero-card__highlight">Mal</span>, a technical and
              marketing specialist building custom automations and marketing systems that drive
              practical business growth.
            </p>
            <p>
              I blend strategic business thinking, hands-on execution, and real-time adaptability
              with the latest tech trends to modernize real-world solutions.
            </p>
          </div>
          <button className="hero-card__cta" onClick={onExplore} id="hero-explore-btn" type="button">
            <span className="hero-card__cta-text">Explore Career</span>
            <span className="hero-card__cta-arrow">↓</span>
          </button>
        </div>

        {/* Floating tech labels */}
        <div className="hero-tech-labels" aria-hidden="true">
          <div className="hero-tech-label" style={{ top: '8%', left: '3%', animationDelay: '0s' }}>
            <span className="hero-tech-label__icon">⟨/⟩</span>
            <span className="hero-tech-label__text">Custom Software Development</span>
          </div>
          <div className="hero-tech-label" style={{ top: '28%', left: '1.5%', animationDelay: '1.2s' }}>
            <span className="hero-tech-label__icon">◈</span>
            <span className="hero-tech-label__text">SaaS Development</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '48%', left: '2%', animationDelay: '2.4s' }}>
            <span className="hero-tech-label__icon">⟡</span>
            <span className="hero-tech-label__text">Application Development</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '12%', left: '2.5%', animationDelay: '3.6s' }}>
            <span className="hero-tech-label__icon">⬡</span>
            <span className="hero-tech-label__text">Agile Project Management</span>
          </div>
          <div className="hero-tech-label" style={{ top: '5%', left: '35%', animationDelay: '0.6s' }}>
            <span className="hero-tech-label__icon">⊞</span>
            <span className="hero-tech-label__text">Product Marketing</span>
          </div>
          <div className="hero-tech-label" style={{ top: '4%', right: '24%', animationDelay: '1.8s' }}>
            <span className="hero-tech-label__icon">⟐</span>
            <span className="hero-tech-label__text">Marketing Strategy</span>
          </div>
          <div className="hero-tech-label" style={{ top: '15%', right: '6%', animationDelay: '0.8s' }}>
            <span className="hero-tech-label__icon">▣</span>
            <span className="hero-tech-label__text">Advertising</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '28%', right: '11%', animationDelay: '1.5s' }}>
            <span className="hero-tech-label__icon">⬢</span>
            <span className="hero-tech-label__text">Social Media Marketing</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '14%', right: '4%', animationDelay: '3.2s' }}>
            <span className="hero-tech-label__icon">❖</span>
            <span className="hero-tech-label__text">Digital Marketing</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '7%', left: '28%', animationDelay: '2.0s' }}>
            <span className="hero-tech-label__icon">◆</span>
            <span className="hero-tech-label__text">Growth Marketing</span>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <div className="hero-scroll-hint__mouse">
            <div className="hero-scroll-hint__wheel" />
          </div>
          <span className="hero-scroll-hint__text">Scroll to explore</span>
        </div>
      </div>
    </div>
  );
});

export default HeroSection;
