import { useEffect, useRef, useState } from 'react';

export function usePremiumReveal(delay = 0, threshold = 0.1) {
  const ref = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, threshold]);

  // Unconventional 3D Tilt + Blur + Scale Animation
  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'perspective(1200px) rotateX(0deg) translateY(0) scale(1)'
      : 'perspective(1200px) rotateX(20deg) translateY(60px) scale(0.95)',
    filter: isVisible ? 'blur(0px)' : 'blur(12px)',
    transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity, filter',
  };

  return { ref, style, isVisible };
}