import { useState, useEffect } from 'react';

export default function TerminalText({ text, speed = 20, delay = 0, onComplete }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
      // Keep cursor blinking after complete
      const interval = setInterval(() => setShowCursor(v => !v), 530);
      return () => clearInterval(interval);
    }
  }, [displayed, started, text, speed, onComplete]);

  return (
    <span className="terminal-text">
      {displayed}
      <span className={`terminal-cursor ${showCursor ? 'visible' : ''}`}>_</span>
    </span>
  );
}
