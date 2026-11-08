import { useState, useRef, useCallback, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import Experience from './components/Experience';
import ExperienceOverlay from './components/ExperienceOverlay';
import MethodologyOverlay from './components/MethodologyOverlay';
import CredentialsOverlay from './components/CredentialsOverlay';
import TerminalOverlay from './components/TerminalOverlay';
import { SECTIONS, getActiveSectionIndex } from './utils/cameraPath';

// Transition seams between the 6 section plateaus where a card is partially faded.
// If the user stops scrolling inside a seam, gently glide into the target plateau.
const TRANSITION_SEAMS = [
  { min: 0.02, max: 0.135, downTarget: 0.18, upTarget: 0.00 },
  { min: 0.245, max: 0.335, downTarget: 0.38, upTarget: 0.20 },
  { min: 0.455, max: 0.545, downTarget: 0.59, upTarget: 0.40 },
  { min: 0.655, max: 0.745, downTarget: 0.79, upTarget: 0.61 },
  { min: 0.855, max: 0.945, downTarget: 0.98, upTarget: 0.81 },
];

/**
 * App — Root with 6 scroll-driven stations:
 *   Hero → Career Overview → Experience (Brand Cards) → Methodology → Credentials → Terminal
 * Users can either press "View Experience" on Career Overview or simply scroll past it
 * to reach the Experience cards directly.
 */
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollContainerRef = useRef(null);
  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const rafIdRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const glideAnimRef = useRef(null);
  const settleTimerRef = useRef(null);
  const scrollDirectionRef = useRef(1);
  const lastRawScrollYRef = useRef(0);
  const isGlidingRef = useRef(false);

  const getMaxScroll = useCallback(() => {
    return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }, []);

  const cancelGlide = useCallback(() => {
    if (glideAnimRef.current) {
      cancelAnimationFrame(glideAnimRef.current);
      glideAnimRef.current = null;
    }
    isGlidingRef.current = false;
  }, []);

  const clearSettleTimer = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  // Start the damped smoothing loop if not already running
  const startSmoothLoop = useCallback(() => {
    if (rafIdRef.current !== null) return;
    lastFrameTimeRef.current = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.05);
      lastFrameTimeRef.current = now;

      const target = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.00015) {
        smoothProgressRef.current = target;
        setScrollProgress(target);
        rafIdRef.current = null;
        return;
      }

      // Exponential smoothing for silky 60/120/144Hz response
      const factor = 1 - Math.exp(-12 * dt);
      const next = current + diff * factor;
      smoothProgressRef.current = next;
      setScrollProgress(next);

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  // Smooth programmatic scroll to a normalized progress (0..1)
  const scrollToProgress = useCallback(
    (targetProgress, duration = 850) => {
      cancelGlide();
      clearSettleTimer();

      const maxScroll = getMaxScroll();
      const startY = window.scrollY;
      const targetY = Math.max(0, Math.min(1, targetProgress)) * maxScroll;
      const distance = targetY - startY;

      if (Math.abs(distance) < 2) return;

      isGlidingRef.current = true;
      const startTime = performance.now();

      const step = (now) => {
        if (!isGlidingRef.current) return;
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        window.scrollTo(0, startY + distance * eased);

        if (t < 1) {
          glideAnimRef.current = requestAnimationFrame(step);
        } else {
          isGlidingRef.current = false;
          glideAnimRef.current = null;
        }
      };

      glideAnimRef.current = requestAnimationFrame(step);
    },
    [cancelGlide, clearSettleTimer, getMaxScroll]
  );

  useEffect(() => {
    const scheduleSoftSettle = () => {
      clearSettleTimer();
      if (isGlidingRef.current) return;

      settleTimerRef.current = setTimeout(() => {
        if (isGlidingRef.current) return;
        const p = targetProgressRef.current;
        const dir = scrollDirectionRef.current;

        for (const seam of TRANSITION_SEAMS) {
          if (p > seam.min && p < seam.max) {
            const settleTarget = dir >= 0 ? seam.downTarget : seam.upTarget;
            scrollToProgress(settleTarget, 550);
            break;
          }
        }
      }, 360);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const deltaY = scrollY - lastRawScrollYRef.current;
      if (Math.abs(deltaY) > 0.5) {
        scrollDirectionRef.current = deltaY > 0 ? 1 : -1;
      }
      lastRawScrollYRef.current = scrollY;

      const maxScroll = getMaxScroll();
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      targetProgressRef.current = progress;

      startSmoothLoop();

      if (!isGlidingRef.current) {
        scheduleSoftSettle();
      }
    };

    const handleUserInputInterrupt = () => {
      if (isGlidingRef.current) {
        cancelGlide();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('wheel', handleUserInputInterrupt, { passive: true });
    window.addEventListener('touchstart', handleUserInputInterrupt, { passive: true });

    // Initialize on mount
    const initialMax = getMaxScroll();
    const initialProgress = Math.max(0, Math.min(1, window.scrollY / initialMax));
    targetProgressRef.current = initialProgress;
    smoothProgressRef.current = initialProgress;
    lastRawScrollYRef.current = window.scrollY;
    setScrollProgress(initialProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('wheel', handleUserInputInterrupt);
      window.removeEventListener('touchstart', handleUserInputInterrupt);
      cancelGlide();
      clearSettleTimer();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [cancelGlide, clearSettleTimer, getMaxScroll, scrollToProgress, startSmoothLoop]);

  const handleExplore = useCallback(() => {
    scrollToProgress(SECTIONS[1].target, 850);
  }, [scrollToProgress]);

  const handleViewBrands = useCallback(() => {
    scrollToProgress(SECTIONS[2].target, 800);
  }, [scrollToProgress]);

  const handleBackToOverview = useCallback(() => {
    scrollToProgress(SECTIONS[1].target, 800);
  }, [scrollToProgress]);

  const handleNavSelect = useCallback(
    (targetProgress) => {
      scrollToProgress(targetProgress, 850);
    },
    [scrollToProgress]
  );

  // Keyboard navigation (Arrow/Page keys to switch sections)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const currentIdx = getActiveSectionIndex(targetProgressRef.current);
        const nextIdx = Math.min(SECTIONS.length - 1, currentIdx + 1);
        scrollToProgress(SECTIONS[nextIdx].target, 800);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const currentIdx = getActiveSectionIndex(targetProgressRef.current);
        const prevIdx = Math.max(0, currentIdx - 1);
        scrollToProgress(SECTIONS[prevIdx].target, 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToProgress]);

  const activeSectionIdx = getActiveSectionIndex(scrollProgress);

  return (
    <>
      <div className="scroll-spacer" ref={scrollContainerRef} />

      <div className="experience-wrapper">
        <Experience
          scrollProgress={scrollProgress}
          scrollProgressRef={smoothProgressRef}
        />
      </div>

      {/* Cyber-HUD Section Navigation Rail */}
      <nav className="section-nav" aria-label="Portfolio sections">
        <div className="section-nav__track">
          <div
            className="section-nav__fill"
            style={{ transform: `scaleY(${Math.max(0, Math.min(1, scrollProgress))})` }}
          />
        </div>
        {SECTIONS.map((sec, idx) => {
          const isActive = idx === activeSectionIdx;
          return (
            <button
              key={sec.id}
              type="button"
              className={`section-nav__item ${isActive ? 'section-nav__item--active' : ''}`}
              onClick={() => handleNavSelect(sec.target)}
              aria-label={`Go to ${sec.label}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="section-nav__label">{sec.label}</span>
              <span className="section-nav__dot" />
            </button>
          );
        })}
      </nav>

      <HeroSection scrollProgress={scrollProgress} onExplore={handleExplore} />

      <ExperienceOverlay
        scrollProgress={scrollProgress}
        onViewBrands={handleViewBrands}
        onBack={handleBackToOverview}
      />

      <MethodologyOverlay scrollProgress={scrollProgress} />

      <CredentialsOverlay scrollProgress={scrollProgress} />

      <TerminalOverlay scrollProgress={scrollProgress} />
    </>
  );
}
