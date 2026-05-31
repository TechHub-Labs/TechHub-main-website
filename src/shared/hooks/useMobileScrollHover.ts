/**
 * useMobileScrollHover.ts
 *
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef } from "react";

export function useMobileScrollHover(
  id: string,
  setHovered: (id: string | null) => void
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!isMobile) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHovered(id);
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px", // Trigger when the element crosses the middle 10% of the screen
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setHovered]);

  return ref;
}
