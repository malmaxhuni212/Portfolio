/**
 * CredentialsOverlay — "Credentials & LinkedIn" section.
 * 3 certification plaques + LinkedIn verification CTA.
 * Fades in/out via scrollProgress like all other sections.
 */
export default function CredentialsOverlay({ scrollProgress, showBrands }) {
  // Fade in 0.68 → 0.76, fade out 0.80 → 0.86
  const fadeIn = Math.max(0, Math.min(1, (scrollProgress - 0.68) / 0.08));
  const fadeOut = Math.max(0, Math.min(1, (scrollProgress - 0.80) / 0.06));
  const opacity = showBrands ? 0 : fadeIn * (1 - fadeOut);
  const isVisible = opacity > 0.01 && !showBrands;

  return (
    <div
      className="credentials-overlay"
      id="credentials-overlay"
      style={{
        opacity,
        pointerEvents: isVisible ? 'auto' : 'none',
        display: isVisible ? 'flex' : 'none',
      }}
    >
      <div className="credentials-container">
        <div className="credentials__badge">
          <span className="credentials__badge-dot" />
          VERIFIED CREDENTIALS
        </div>

        <h2 className="credentials__headline">Credentials & LinkedIn</h2>

        <div className="credentials-grid">
          {/* Card 1: Cybersecurity */}
          <div className="credential-card" id="cred-cyber">
            <div className="credential-card__accent credential-card__accent--blue" />
            <div className="credential-card__category">SYSTEM INTEGRITY & PROTECTION</div>
            <h3 className="credential-card__title">
              OSCE: Foundations of Cybersecurity & Data Security
            </h3>
            <p className="credential-card__date">Issued May 2024</p>
            <div className="credential-card__divider" />
            <p className="credential-card__quote">
              "A project is useless if the security is weak. This was my first legitimate
              credential, and it gave me a real foundation for my career. It taught me a
              fundamental truth: no matter how much I learn or how many skills I have, if
              you do not secure your data and information, everything can fail."
            </p>
          </div>

          {/* Card 2: MLOps */}
          <div className="credential-card" id="cred-mlops">
            <div className="credential-card__accent credential-card__accent--indigo" />
            <div className="credential-card__category">ENTERPRISE AI DEPLOYMENTS</div>
            <h3 className="credential-card__title">
              Google Certifications: MLOps for Generative AI
            </h3>
            <p className="credential-card__date">Issued Aug 2025</p>
            <div className="credential-card__divider" />
            <p className="credential-card__quote">
              "This course was crucial for stepping out of a local sandbox environment.
              Through it, I learned real-world AI deployment and exactly how to transform
              an isolated AI project into a live, scalable, real-world solution capable of
              handling enterprise demands."
            </p>
          </div>

          {/* Card 3: Claude API */}
          <div className="credential-card" id="cred-claude">
            <div className="credential-card__accent credential-card__accent--purple" />
            <div className="credential-card__category">ADVANCED REASONING & EXECUTION</div>
            <h3 className="credential-card__title">
              Building with the Claude API
            </h3>
            <p className="credential-card__date">Issued June 2026</p>
            <div className="credential-card__divider" />
            <p className="credential-card__quote">
              "Anthropic's models are currently leading the AI industry, and you can never
              learn too much about their capabilities. This credential in specific focuses
              on how to leverage Claude's API efficiently to maximize performance and achieve
              the absolute best success when executing complex agentic tasks."
            </p>
          </div>
        </div>

        {/* LinkedIn CTA */}
        <div className="credentials__footer">
          <p className="credentials__footer-text">
            All of my verified credentials, complete project history, and relevant
            engineering background are officially documented here.
          </p>
          <a
            href="https://www.linkedin.com/in/malmaxhun1/"
            target="_blank"
            rel="noopener noreferrer"
            className="credentials__linkedin-btn"
            id="linkedin-verify"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span>Verify All Credentials on LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}
