import { useEffect, useRef, useState } from 'react';

interface RevealOptions {
  threshold?: number;
  delay?: number;   // ms
}

/**
 * Returns [ref, isVisible].
 * Attach ref to any element; once it enters the viewport
 * with the given threshold, isVisible flips to true (one-shot).
 */
export function useReveal<T extends HTMLElement = HTMLElement>(
  options: RevealOptions = {}
): [React.MutableRefObject<T | null>, boolean] {
  const { threshold = 0.15, delay = 0 } = options;
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setVisible(true), delay);
          observer.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return [ref, visible];
}
