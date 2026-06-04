/**
 * AboutHero.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { ThemeColors } from "../../landing/domain/types";
import { useCountUp } from "../../../shared/hooks/useCountUp";
import { useMobileScrollHover } from "../../../shared/hooks/useMobileScrollHover";
import { SectionTitle } from "../../../shared/components/SectionTitle";

export function AboutHero({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === "#0d1340";
  const normalCardBg = isDark ? colors.bgCardHover : colors.bgCard;
  const [hovered, setHovered] = useState<string | null>(null);

  const refA = useMobileScrollHover("a", setHovered);
  const refB = useMobileScrollHover("b", setHovered);
  const refC = useMobileScrollHover("c", setHovered);
  const refD = useMobileScrollHover("d", setHovered);

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const [ft, setFt] = useState(0);
  useEffect(() => {
    const origin = performance.now();
    let raf: number;
    const tick = () => {
      setFt((performance.now() - origin) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(t);
  }, []);

  const stat1 = useCountUp({
    target: 1.8,
    suffix: "M",
    decimals: 1,
    duration: 2000,
    start: started,
    delay: 0,
  });
  const stat2 = useCountUp({
    target: 10,
    suffix: "%",
    prefix: "<",
    duration: 1500,
    start: started,
    delay: 100,
  });
  const stat3 = useCountUp({
    target: 70,
    suffix: "%",
    duration: 1800,
    start: started,
    delay: 50,
  });

  const f1 = Math.sin(ft * ((2 * Math.PI) / 4.0)) * 5;
  const f2 = Math.sin((ft + 0.8) * ((2 * Math.PI) / 5.2)) * 5;
  const f3 = Math.sin((ft + 1.5) * ((2 * Math.PI) / 4.5)) * 5;
  const f4 = Math.sin((ft + 0.3) * ((2 * Math.PI) / 3.8)) * 5;

  const cardStyle = (key: string, floatY: number) => ({
    background: hovered === key ? colors.teal : normalCardBg,
    color: hovered === key ? colors.tealText : colors.text,
    transform: `translateY(${floatY}px) scale(${hovered === key ? 1.02 : 1})`,
    transition: "background 0.25s ease, color 0.25s ease",
  });

  const textCol = (key: string) =>
    hovered === key ? colors.tealText : colors.text;

  return (
    <section
      ref={heroRef}
      className="relative pt-4 lg:pt-8 pb-8 lg:pb-16 overflow-hidden flex items-start min-h-[calc(100vh-80px)]"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="max-w-xl">
            <div className="mb-8">
              <SectionTitle
                title="Builders Need an Actual Ecosystem."
                tag="h1"
                colors={colors}
                immediate={true}
              />
            </div>
            <p
              className="text-base sm:text-xl leading-relaxed font-medium mb-[14px]"
              style={{ color: colors.textMuted }}
            >
              TechHub is a project-driven technology ecosystem focused on
              helping students and young builders gain real experience,
              collaborate on meaningful ideas, and grow into world-class
              innovators.
            </p>
          </div>

          <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-4 sm:gap-4 h-[420px] sm:h-[400px] lg:h-[380px] lg:w-[90%] lg:ml-auto">
            <div
              ref={refA}
              onMouseEnter={() => setHovered("a")}
              onMouseLeave={() => setHovered(null)}
              className="row-span-3 rounded-sm p-5 sm:p-7 lg:p-8 flex flex-col justify-end cursor-default shadow-sm"
              style={cardStyle("a", f1)}
            >
              <div className="mt-8">
                <div
                  className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-1 tracking-tight tabular-nums"
                  style={{ color: textCol("a") }}
                >
                  {stat1}
                </div>
                <div
                  className="text-xs sm:text-sm font-medium"
                  style={{ color: textCol("a") }}
                >
                  tertiary students study tech without guidance.
                </div>
              </div>
            </div>

            <div
              ref={refB}
              onMouseEnter={() => setHovered("b")}
              onMouseLeave={() => setHovered(null)}
              className="row-span-2 rounded-sm p-5 sm:p-7 lg:p-8 flex flex-col justify-end cursor-default shadow-sm"
              style={cardStyle("b", f2)}
            >
              <div
                className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-1 tracking-tight tabular-nums"
                style={{ color: textCol("b") }}
              >
                {stat2}
              </div>
              <div
                className="text-xs sm:text-sm font-medium"
                style={{ color: textCol("b") }}
              >
                of campus tech projects ever reach a launch.
              </div>
            </div>

            <div
              ref={refC}
              onMouseEnter={() => setHovered("c")}
              onMouseLeave={() => setHovered(null)}
              className="row-span-2 rounded-sm p-5 sm:p-7 lg:p-8 flex flex-col justify-center cursor-default shadow-sm"
              style={cardStyle("c", f3)}
            >
              <div
                className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-1 tracking-tight"
                style={{ color: textCol("c") }}
              >
                1 in 5
              </div>
              <div
                className="text-xs sm:text-sm font-medium"
                style={{ color: textCol("c") }}
              >
                Junior devs have experience shipping production-level code.
              </div>
            </div>

            <div
              ref={refD}
              onMouseEnter={() => setHovered("d")}
              onMouseLeave={() => setHovered(null)}
              className="row-span-3 rounded-sm p-5 sm:p-7 lg:p-8 flex flex-col justify-end cursor-default shadow-sm"
              style={cardStyle("d", f4)}
            >
              <div
                className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-1 tracking-tight tabular-nums"
                style={{ color: textCol("d") }}
              >
                {stat3}
              </div>
              <div
                className="text-xs sm:text-sm font-medium"
                style={{ color: textCol("d") }}
              >
                of university tech talent will never work in a cross-functional
                team before graduating.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
