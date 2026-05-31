/**
 * useCountUp.ts
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  /** Final numeric target */
  target: number;
  /** ms duration of the count animation */
  duration?: number;
  /** String appended after the number e.g. "+" "%" "M" */
  suffix?: string;
  /** String prepended before the number e.g. "<" */
  prefix?: string;
  /** Whether to start counting (triggered externally) */
  start?: boolean;
  /** Decimal places (default 0) */
  decimals?: number;
  /** Easing function — 'ease-out' (default) or 'linear' */
  easing?: "ease-out" | "linear";
  /** Extra delay before the count starts (ms) */
  delay?: number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp({
  target,
  duration = 1800,
  suffix = "",
  prefix = "",
  start = false,
  decimals = 0,
  easing = "ease-out",
  delay = 0,
}: UseCountUpOptions): string {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!start || hasStarted.current) return;

    const run = () => {
      hasStarted.current = true;

      const startAt = () => {
        startTimeRef.current = null;

        const tick = (timestamp: number) => {
          if (startTimeRef.current === null) startTimeRef.current = timestamp;
          const elapsed = timestamp - startTimeRef.current;
          const progress = Math.min(elapsed / duration, 1);
          const eased =
            easing === "ease-out" ? easeOutCubic(progress) : progress;
          const current = eased * target;
          setValue(current);
          if (progress < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            setValue(target);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      };

      if (delay > 0) {
        setTimeout(startAt, delay);
      } else {
        startAt();
      }
    };

    run();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, target, duration, easing, delay]);

  const formatted = value.toFixed(decimals);
  return `${prefix}${formatted}${suffix}`;
}
