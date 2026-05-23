/**
 * useScrollReveal — Reusable intersection-observer hook for scroll animations.
 *
 * Usage:
 *   const { ref, visible } = useScrollReveal({ threshold: 0.1, delay: 200 });
 *   <div ref={ref} style={{ opacity: visible ? 1 : 0, ... }}>...</div>
 */

import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  delay?: number;
  once?: boolean;
}

export function useScrollReveal({
  threshold = 0.12,
  delay = 0,
  once = true,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setVisible(true), delay);
          } else {
            setVisible(true);
          }
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay, once]);

  return { ref, visible };
}

/**
 * useStaggeredReveal — Triggers each item in an array with a staggered delay.
 * Returns an array of booleans (one per item).
 *
 * Usage:
 *   const visibleItems = useStaggeredReveal(items.length, { baseDelay: 100, step: 120 });
 *   items.map((item, i) => <div style={{ opacity: visibleItems[i] ? 1 : 0 }}>)
 */
export function useStaggeredReveal(
  count: number,
  {
    baseDelay = 0,
    step = 120,
    threshold = 0.08,
  }: { baseDelay?: number; step?: number; threshold?: number } = {}
) {
  const ref = useRef<HTMLElement | null>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(count).fill(false)
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, baseDelay + i * step);
          }
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [count, baseDelay, step, threshold]);

  return { ref, visibleItems };
}
