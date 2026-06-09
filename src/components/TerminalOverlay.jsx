import { useState } from 'react';

/**
 * TerminalOverlay — "Initialize a Project Pipeline" contact console.
 * Sends emails via Resend API through /api/contact endpoint.
 */
export default function TerminalOverlay({ scrollProgress, showBrands }) {
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Fade in 0.92 → 0.98 (final section, stays visible)
  const opacity = showBrands
    ? 0
    : Math.max(0, Math.min(1, (scrollProgress - 0.92) / 0.06));
  const isVisible = opacity > 0.01 && !showBrands;

  const handleExecute = () => {
    if (!showForm) setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      project: formData.get('project') || '',
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true);
      } else {
        setError('Transmission failed. Try again or email directly.');
      }
    } catch {
      setError('Network error. Try again or email directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="terminal-overlay"
      id="terminal-overlay"
      style={{
        opacity,
        pointerEvents: isVisible ? 'auto' : 'none',
        display: isVisible ? 'flex' : 'none',
      }}
    >
      <div className="terminal-card">
        <div className="terminal-card__accent" />

        {/* Terminal header bar */}
        <div className="terminal-card__header">
          <div className="terminal-card__dots">
            <span className="terminal-card__dot terminal-card__dot--red" />
            <span className="terminal-card__dot terminal-card__dot--yellow" />
            <span className="terminal-card__dot terminal-card__dot--green" />
          </div>
          <span className="terminal-card__title-bar">pipeline_terminal v2.0</span>
        </div>

        {/* Terminal body */}
        <div className="terminal-card__body">
          <div className="terminal-card__line">
            <span className="terminal-card__prompt">$</span>
            <span className="terminal-card__cmd">initialize --project-pipeline</span>
          </div>

          <h2 className="terminal-card__headline">Initialize a Project Pipeline</h2>

          <p className="terminal-card__system-text">
            <span className="terminal-card__system-label">[SYSTEM]</span>
            Console Ready. If you are looking to build custom AI workflows, optimize
            enterprise CRM architectures, scale automated client acquisition, or modernize
            your business operations, initialize a direct deployment request below.
          </p>

          <div className="terminal-card__blink-line">
            <span className="terminal-card__prompt">$</span>
            <span className="terminal-card__cursor">_</span>
          </div>

          {/* Execute button */}
          {!showForm && !sent && (
            <button
              className="terminal-card__execute"
              onClick={handleExecute}
              type="button"
              id="execute-contact"
            >
              <span className="terminal-card__execute-bracket">[</span>
              Execute Contact Request
              <span className="terminal-card__execute-bracket">]</span>
            </button>
          )}

          {/* Contact form */}
          {showForm && !sent && (
            <form className="terminal-card__form" onSubmit={handleSubmit}>
              <div className="terminal-card__line">
                <span className="terminal-card__prompt">&gt;</span>
                <span className="terminal-card__cmd">loading contact_module...</span>
                <span className="terminal-card__success">OK</span>
              </div>

              <div className="terminal-card__field">
                <label className="terminal-card__label" htmlFor="contact-name">
                  <span className="terminal-card__prompt">$</span> name:
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  className="terminal-card__input"
                  placeholder="Enter your name"
                  required
                  autoFocus
                />
              </div>

              <div className="terminal-card__field">
                <label className="terminal-card__label" htmlFor="contact-email">
                  <span className="terminal-card__prompt">$</span> email:
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  className="terminal-card__input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="terminal-card__field">
                <label className="terminal-card__label" htmlFor="contact-project">
                  <span className="terminal-card__prompt">$</span> project_brief:
                </label>
                <textarea
                  id="contact-project"
                  name="project"
                  className="terminal-card__input terminal-card__textarea"
                  placeholder="Describe your project requirements..."
                  rows={3}
                  required
                />
              </div>

              {error && (
                <div className="terminal-card__line">
                  <span className="terminal-card__prompt" style={{ color: '#ff5f57' }}>!</span>
                  <span className="terminal-card__cmd" style={{ color: '#ff5f57' }}>{error}</span>
                </div>
              )}

              <button
                className="terminal-card__submit"
                type="submit"
                disabled={sending}
              >
                <span className="terminal-card__execute-bracket">[</span>
                {sending ? 'Deploying...' : 'Deploy Request'}
                <span className="terminal-card__execute-bracket">]</span>
              </button>
            </form>
          )}

          {/* Success state */}
          {sent && (
            <div className="terminal-card__success-block">
              <div className="terminal-card__line">
                <span className="terminal-card__prompt">&gt;</span>
                <span className="terminal-card__cmd">deploying request...</span>
                <span className="terminal-card__success">SENT</span>
              </div>
              <div className="terminal-card__line">
                <span className="terminal-card__prompt">&gt;</span>
                <span className="terminal-card__cmd">pipeline initialized successfully.</span>
              </div>
              <p className="terminal-card__system-text" style={{ marginTop: '1rem' }}>
                <span className="terminal-card__system-label">[SYSTEM]</span>
                Your project request has been transmitted. Expect a response within 24 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
