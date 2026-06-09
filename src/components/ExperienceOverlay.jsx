/**
 * ExperienceOverlay — HTML overlay containing the 2-step career content.
 * Career Overview opacity is driven by scrollProgress.
 * Brand Cards are button-triggered.
 */
export default function ExperienceOverlay({ scrollProgress, showBrands, onViewBrands, onBack }) {
  // Career overview fades in over 0.10 → 0.18, fades out over 0.24 → 0.30
  const fadeIn = Math.max(0, Math.min(1, (scrollProgress - 0.10) / 0.08));
  const fadeOut = Math.max(0, Math.min(1, (scrollProgress - 0.24) / 0.06));
  const overviewOpacity = showBrands
    ? 0
    : fadeIn * (1 - fadeOut);
  const overviewVisible = overviewOpacity > 0.01 && !showBrands;
  const isOverlayVisible = overviewVisible || showBrands;

  return (
    <div
      className="experience-overlay"
      id="experience-overlay"
      style={{
        pointerEvents: isOverlayVisible ? 'auto' : 'none',
        display: isOverlayVisible ? 'flex' : 'none',
      }}
    >

      {/* ═══ STEP 1: Career Overview (scroll-driven) ═══ */}
      <div
        className={`exp-step ${overviewVisible ? 'exp-step--active' : 'exp-step--hidden'}`}
        id="step-overview"
        style={{
          opacity: overviewOpacity,
          transform: `translateY(${(1 - overviewOpacity) * 30}px)`,
          pointerEvents: overviewVisible ? 'auto' : 'none',
        }}
      >
        <div className="career-card">
          <div className="career-card__accent" />

          <div className="career-card__badge">
            <span className="career-card__badge-dot" />
            CAREER PROFILE
          </div>

          <h2 className="career-card__headline">Career Overview</h2>

          <p className="career-card__body">
            I engineer digital growth through advanced automations and CRM systems. My aim is to bridge the business and AI world together for practical growth and modernization.
          </p>

          <div className="career-card__stats">
            <div className="career-card__stat">
              <span className="career-card__stat-value">50+</span>
              <span className="career-card__stat-label">Industry Partners</span>
            </div>
            <div className="career-card__stat">
              <span className="career-card__stat-value">2+</span>
              <span className="career-card__stat-label">Years Experience</span>
            </div>
            <div className="career-card__stat">
              <span className="career-card__stat-value">300+</span>
              <span className="career-card__stat-label">Projects Delivered</span>
            </div>
          </div>

          <button
            className="career-card__cta"
            onClick={onViewBrands}
            onTouchEnd={(e) => { e.preventDefault(); onViewBrands(); }}
            type="button"
            id="view-experience-btn"
          >
            <span>View Experience</span>
            <span className="career-card__cta-arrow">→</span>
          </button>
        </div>
      </div>

      {/* ═══ STEP 2: Brand Cards (button-driven) ═══ */}
      <div
        className={`exp-step ${showBrands ? 'exp-step--active' : 'exp-step--hidden'}`}
        id="step-brands"
      >
        <div className="brand-cards-container">
          <div className="brand-cards-header">
            <button
              className="exp-back-btn"
              onClick={onBack}
              type="button"
              id="back-to-overview"
            >
              ← Back to Overview
            </button>
          </div>

          <div className="brand-cards-grid">
          {/* ── Card A: M-Design ── */}
          <div className="brand-card brand-card--mdesign" id="card-mdesign">
            <div className="brand-card__accent brand-card__accent--indigo" />

            <div className="brand-card__header">
              <span className="brand-card__brand">M-DESIGN</span>
              <span className="brand-card__badge">CRM INTEGRATION & DESIGN</span>
            </div>

            <h3 className="brand-card__title">CRM Integration & Design Collaborations</h3>
            <p className="brand-card__period">Jun 2024 — May 2026</p>

            <ul className="brand-card__achievements">
              <li>Partnered with over 50 leading industry brands to implement intelligent CRM systems.</li>
              <li>Delivered hyper-realistic 3D AI enhanced rendering visualizations that directly empowered furniture stores to close 5-figure deals.</li>
              <li>Managed Facebook ad campaigns achieving an ultra-optimized acquisition cost of just $0.43 per message (across $5000+ in ad spend) by utilizing AI for copywriting and creative enhancements.</li>
            </ul>

            <div className="brand-card__tech-list">
              <span className="brand-card__tech-item">CRM Integration</span>
              <span className="brand-card__tech-item">Facebook Ads Strategy</span>
              <span className="brand-card__tech-item">Rendering</span>
              <span className="brand-card__tech-item">AI Copywriting</span>
              <span className="brand-card__tech-item">Client Acquisition</span>
            </div>

            <div className="brand-card__links">
              <a
                href="https://m-design-nine.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-card__social"
                id="link-mdesign-web"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>View Website</span>
              </a>
              <a
                href="https://www.tiktok.com/@m_des1gn"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-card__social"
                id="link-mdesign-tiktok"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.97 1.23 2.37 2.05 3.85 2.27v4.14c-1.89-.09-3.72-.88-5.08-2.22-.09-.08-.18-.17-.26-.26v6.62c.03 3.14-1.78 6.13-4.66 7.39-2.91 1.25-6.39.75-8.81-1.27-2.43-2.02-3.41-5.46-2.43-8.5 1.01-3.08 4.14-5.2 7.37-5.12.11 0 .22 0 .33.01v4.11c-.81-.14-1.65-.05-2.42.24-.77.3-1.42.87-1.82 1.58-.8 1.4-.41 3.28.89 4.22 1.3 1.02 3.25.68 4.13-.76.32-.51.48-1.11.47-1.71V.02z" />
                </svg>
                <span>TikTok Socials</span>
              </a>
            </div>
          </div>

          {/* ── Card B: Mavix ── */}
          <div className="brand-card brand-card--mavix" id="card-mavix">
            <div className="brand-card__accent brand-card__accent--cyan" />

            <div className="brand-card__header">
              <span className="brand-card__brand">MAVIX</span>
              <span className="brand-card__badge">AI SOLUTIONS & WEB DEV</span>
            </div>

            <h3 className="brand-card__title">Artificial Intelligence Engineer</h3>
            <p className="brand-card__period">Apr 2025 — Mar 2026</p>

            <ul className="brand-card__achievements">
              <li>Built AI workflows designed to save time and costs to drive business scaling.</li>
              <li>Web and software development for brands looking to grow their digital presence.</li>
              <li>Engineered Agentic Systems that fit into real-world solutions.</li>
            </ul>

            <div className="brand-card__tech-list">
              <span className="brand-card__tech-item">Agentic Workflows</span>
              <span className="brand-card__tech-item">Local LLM Architectures</span>
              <span className="brand-card__tech-item">API Integrations</span>
              <span className="brand-card__tech-item">Web & Software Dev</span>
              <span className="brand-card__tech-item">Python Automation</span>
            </div>

            <div className="brand-card__links">
              <a
                href="https://www.instagram.com/mavix.ks/"
                target="_blank"
                rel="noopener noreferrer"
                className="brand-card__social"
                id="link-mavix"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span>Mavix Socials</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
