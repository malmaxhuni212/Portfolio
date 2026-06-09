/**
 * MethodologyOverlay — "System Logic & Projects" section.
 * Fades in via scrollProgress after the Experience section fades out.
 * Features a floating animation and GitHub CTA.
 */
export default function MethodologyOverlay({ scrollProgress, showBrands }) {
  // Fade in 0.38 → 0.50, fade out 0.55 → 0.63
  const fadeIn = Math.max(0, Math.min(1, (scrollProgress - 0.38) / 0.12));
  const fadeOut = Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.08));
  const opacity = showBrands ? 0 : fadeIn * (1 - fadeOut);
  const isVisible = opacity > 0.01 && !showBrands;

  return (
    <div
      className="methodology-overlay"
      id="methodology-overlay"
      style={{
        opacity,
        pointerEvents: isVisible ? 'auto' : 'none',
        display: isVisible ? 'flex' : 'none',
      }}
    >
      <div className="methodology-card" id="methodology-card">
        <div className="methodology-card__accent" />

        {/* Badge */}
        <div className="methodology-card__badge">
          <span className="methodology-card__badge-dot" />
          SYSTEM METHODOLOGY
        </div>

        {/* Headline */}
        <h2 className="methodology-card__headline">System Logic & Projects</h2>

        {/* Body — Philosophy paragraphs */}
        <div className="methodology-card__body">
          <p>
            Instead of a traditional portfolio project showcase showing projects I have done,
            I wanted to showcase my logic when approaching any project (I have left the link
            for my GitHub down below.)
          </p>
          <p>
            Before doing anything project wise, I dissect the core business logic behind a
            project to understand exactly how it will drive revenue, scale operations, or
            eliminate inefficiencies.
          </p>
          <p>
            Grasping this real-world application first allows me to architect solutions that
            are both technically doable and practically beneficial.
          </p>
          <p>
            As AI rapidly becomes an everyday essential, I continuously adapt and integrate
            the latest intelligent tools to maximize productivity and build smarter workflows.
          </p>
          <p>
            AI is here to stay and I don't think we should fight or avoid it — rather, the
            people who know how to use AI will always be ahead of the people who don't.
          </p>
        </div>

        {/* Divider */}
        <div className="methodology-card__divider" />

        {/* GitHub CTA */}
        <div className="methodology-card__cta-section">
          <p className="methodology-card__cta-desc">
            Explore my active logic, automations, and system architectures.
          </p>

          <a
            href="https://github.com/malmaxhuni212?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="methodology-card__cta"
            id="github-cta"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
              className="methodology-card__cta-icon"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>View GitHub</span>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="methodology-card__cta-arrow"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
