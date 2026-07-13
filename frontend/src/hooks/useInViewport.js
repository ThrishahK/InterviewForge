import { useEffect, useRef, useState } from 'react';

/**
 * useInViewport
 *
 * Fires once when the element first enters the viewport, then disconnects -
 * this is a one-time reveal, not a repeating scroll-jank effect. Returns a
 * ref to attach and a boolean for whether the element has been seen.
 */
export function useInViewport({ threshold = 0.2, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // Respect reduced-motion users by just showing content immediately.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isInView];
}
