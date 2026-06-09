import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 2000, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateValue = () => {
    // Parse the target value (handle K suffix, commas, etc.)
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const numericTarget = parseFloat(cleanValue);
    const hasK = value.includes('K');
    const hasComma = value.includes(',');
    
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericTarget * eased;

      if (hasK) {
        setDisplayValue(current.toFixed(1) + 'K');
      } else if (hasComma) {
        setDisplayValue(Math.round(current).toLocaleString());
      } else {
        setDisplayValue(current.toFixed(value.includes('.') ? 2 : 0));
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <span ref={ref} className="animated-counter">
      {prefix}{displayValue}{suffix}
    </span>
  );
}
