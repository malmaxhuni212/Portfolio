const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="social-link__icon">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="social-link__icon">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.28 0 .56.04.81.11v-3.51a6.43 6.43 0 0 0-.81-.05A6.34 6.34 0 0 0 3 15.64a6.34 6.34 0 0 0 6.49 6.33 6.34 6.34 0 0 0 6.48-6.33V9.09a8.16 8.16 0 0 0 4.62 1.42V7.05a4.84 4.84 0 0 1-1-.36z" />
    </svg>
  ),
};

export default function SocialLink({ platform, handle, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
      id={`social-${platform}`}
    >
      {ICONS[platform]}
      <span className="social-link__handle">{handle}</span>
      <span className="social-link__arrow">→</span>
    </a>
  );
}
