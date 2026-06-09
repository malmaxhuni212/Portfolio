import { useState, useRef, useCallback, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import Experience from './components/Experience';
import ExperienceOverlay from './components/ExperienceOverlay';
import MethodologyOverlay from './components/MethodologyOverlay';
import CredentialsOverlay from './components/CredentialsOverlay';
import TerminalOverlay from './components/TerminalOverlay';

/**
 * App — Root with 5 scroll-driven sections:
 *   Hero → Career Overview → Methodology → Credentials → Terminal
 * Each section independently fades in and out via scrollProgress (0-1).
 */
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBrands, setShowBrands] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (showBrands) return;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showBrands]);

  const handleExplore = useCallback(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.18, behavior: 'smooth' });
  }, []);

  const handleViewBrands = useCallback(() => {
    setShowBrands(true);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('scroll-lock');
  }, []);

  const handleBackToOverview = useCallback(() => {
    setShowBrands(false);
    document.body.style.overflow = '';
    document.body.classList.remove('scroll-lock');
  }, []);

  return (
    <>
      <div className="scroll-spacer" ref={scrollContainerRef}>
        <div className="scroll-snap-point" style={{ top: '0%' }} />
        <div className="scroll-snap-point" style={{ top: '18%' }} />
        <div className="scroll-snap-point" style={{ top: '46%' }} />
        <div className="scroll-snap-point" style={{ top: '74%' }} />
        <div className="scroll-snap-point" style={{ top: '95%' }} />
      </div>

      <div className="experience-wrapper">
        <Experience scrollProgress={scrollProgress} showBrands={showBrands} />
      </div>

      <HeroSection scrollProgress={scrollProgress} onExplore={handleExplore} />

      <ExperienceOverlay
        scrollProgress={scrollProgress}
        showBrands={showBrands}
        onViewBrands={handleViewBrands}
        onBack={handleBackToOverview}
      />

      <MethodologyOverlay scrollProgress={scrollProgress} showBrands={showBrands} />

      <CredentialsOverlay scrollProgress={scrollProgress} showBrands={showBrands} />

      <TerminalOverlay scrollProgress={scrollProgress} showBrands={showBrands} />
    </>
  );
}
