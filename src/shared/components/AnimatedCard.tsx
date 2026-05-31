/**
 * AnimatedCard.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState, ReactNode } from "react";

type Direction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "rotate-left"
  | "rotate-right";

interface AnimatedCardProps {
  children: ReactNode;
  index?: number; // Used to stagger delay: index * stepMs
  stepMs?: number; // ms between staggered items (default 100)
  delay?: number; // base delay in ms before any stagger
  direction?: Direction; // entry direction
  distance?: number; // px to travel (default 30)
  threshold?: number; // IntersectionObserver threshold (default 0.1)
  className?: string;
  style?: React.CSSProperties;
  once?: boolean; // only animate once (default true)
}

function getHiddenTransform(direction: Direction, distance: number): string {
  switch (direction) {
    case "up":
      return `translateY(${distance}px)`;
    case "down":
      return `translateY(-${distance}px)`;
    case "left":
      return `translateX(${distance}px)`;
    case "right":
      return `translateX(-${distance}px)`;
    case "scale":
      return `scale(0.85)`;
    case "rotate-left":
      return `translateY(${distance}px) rotate(-2deg)`;
    case "rotate-right":
      return `translateY(${distance}px) rotate(2deg)`;
  }
}

export function AnimatedCard({
  children,
  index = 0,
  stepMs = 100,
  delay = 0,
  direction = "up",
  distance = 30,
  threshold = 0.1,
  className = "",
  style = {},
  once = true,
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const totalDelay = delay + index * stepMs;
          if (totalDelay > 0) {
            setTimeout(() => setVisible(true), totalDelay);
          } else {
            setVisible(true);
          }
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, stepMs, delay, once, threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) translateX(0) scale(1) rotate(0deg)"
          : getHiddenTransform(direction, distance),
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.34,1.56,0.64,1)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
