export default function GlowButton({ children, onClick, className = '' }) {
  return (
    <button
      className={`glow-btn ${className}`}
      onClick={onClick}
      type="button"
    >
      <span className="glow-btn__content">{children}</span>
      <span className="glow-btn__glow" />
    </button>
  );
}
