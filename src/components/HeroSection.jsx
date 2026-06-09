import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import HeroRobot from './HeroRobot';
import HeroParticles from './HeroParticles';

/**
 * HeroSection — Full-viewport landing overlay.
 * Opacity driven by scrollProgress: visible at 0, faded by ~0.4.
 */
export default function HeroSection({ scrollProgress, onExplore }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Fade out over the first 8% of scroll
  const heroOpacity = Math.max(0, Math.min(1, 1 - scrollProgress / 0.08));
  const isHidden = heroOpacity < 0.01;

  return (
    <div
      className="hero-section"
      id="hero-section"
      style={{
        opacity: heroOpacity,
        transform: `scale(${1 + (1 - heroOpacity) * 0.04})`,
        pointerEvents: isHidden ? 'none' : 'auto',
        display: isHidden ? 'none' : 'block',
      }}
    >
      {/* 3D Canvas — Robot + Particles */}
      {!isHidden && (
        <div className="hero-canvas">
          <Canvas
            camera={{ position: [0, 0.5, 4], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
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

            <EffectComposer>
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
      )}

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
          <p className="hero-card__body">
            With over{' '}
            <span className="hero-card__highlight">300 successful projects</span>, I drive
            practical business growth through custom AI workflows, seamless CRM integrations,
            and real-world technical solutions.
          </p>
          <div className="hero-card__tags">
            <span className="hero-card__tag">AI Workflows</span>
            <span className="hero-card__tag">CRM Integration</span>
            <span className="hero-card__tag">Web Ecosystems</span>
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
            <span className="hero-tech-label__text">Code Deployment</span>
          </div>
          <div className="hero-tech-label" style={{ top: '28%', left: '1%', animationDelay: '1.2s' }}>
            <span className="hero-tech-label__icon">◈</span>
            <span className="hero-tech-label__text">AI Integration</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '48%', left: '2%', animationDelay: '2.4s' }}>
            <span className="hero-tech-label__icon">⟡</span>
            <span className="hero-tech-label__text">Voice Agents</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '12%', left: '2%', animationDelay: '3.6s' }}>
            <span className="hero-tech-label__icon">⬡</span>
            <span className="hero-tech-label__text">Machine Learning</span>
          </div>
          <div className="hero-tech-label" style={{ top: '5%', left: '35%', animationDelay: '0.6s' }}>
            <span className="hero-tech-label__icon">⊞</span>
            <span className="hero-tech-label__text">System Architecture</span>
          </div>
          <div className="hero-tech-label" style={{ top: '3%', right: '25%', animationDelay: '1.8s' }}>
            <span className="hero-tech-label__icon">⟐</span>
            <span className="hero-tech-label__text">API Integration</span>
          </div>
          <div className="hero-tech-label" style={{ top: '15%', right: '5%', animationDelay: '0.8s' }}>
            <span className="hero-tech-label__icon">▣</span>
            <span className="hero-tech-label__text">Data Analytics</span>
          </div>
          <div className="hero-tech-label" style={{ top: '38%', right: '2%', animationDelay: '2.8s' }}>
            <span className="hero-tech-label__icon">⟳</span>
            <span className="hero-tech-label__text">Automation</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '35%', right: '8%', animationDelay: '1.5s' }}>
            <span className="hero-tech-label__icon">⬢</span>
            <span className="hero-tech-label__text">CRM Systems</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '18%', right: '3%', animationDelay: '3.2s' }}>
            <span className="hero-tech-label__icon">❖</span>
            <span className="hero-tech-label__text">Web Development</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '8%', left: '30%', animationDelay: '2.0s' }}>
            <span className="hero-tech-label__icon">⎔</span>
            <span className="hero-tech-label__text">Cloud Deploy</span>
          </div>
          <div className="hero-tech-label" style={{ bottom: '5%', right: '18%', animationDelay: '4.0s' }}>
            <span className="hero-tech-label__icon">◆</span>
            <span className="hero-tech-label__text">LLM Pipelines</span>
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
}
