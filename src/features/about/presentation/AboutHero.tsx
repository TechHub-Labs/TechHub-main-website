/**
 * ABOUT US HERO SECTION
 */

import { useEffect, useRef, useState } from "react";
import { ThemeColors } from "../../landing/domain/types";

export function AboutHero({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === "#0d1340";
  const topLeftCardBg = isDark ? colors.teal : "#EEF4EC";
  const normalCardBg = isDark ? colors.bgCardHover : colors.bgCard;
  const [hovered, setHovered] = useState<string | null>(null);

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

  return (
    <section ref={heroRef} className="py-10 lg:py-12 relative z-10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* LEFT */}
          <div className="max-w-xl">
            <h1
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-semibold tracking-tight mb-8 leading-[1.05]"
              style={{ color: colors.text }}
            >
              Builders Need
              <br />
              an Actual
              <br />
              Ecosystem.
            </h1>
            <p
              className="text-base sm:text-xl leading-relaxed font-medium mb-[14px]"
              style={{ color: colors.textMuted }}
            >
              TechHub is a project-driven technology ecosystem focused on
              helping students and young builders gain real experience,
              collaborate on meaningful ideas, and grow into world-class
              innovators.
            </p>
            <div className="w-80 h-[3px] bg-[#A3D045] mb-6" />
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-4 sm:gap-5 h-[400px] sm:h-[460px]">
            <div
              onMouseEnter={() => setHovered('a')}
              onMouseLeave={() => setHovered(null)}
              className="row-span-3 rounded-sm p-4 sm:p-6 flex flex-col justify-end transition-transform hover:scale-[1.02] cursor-default shadow-sm transition-colors"
              style={{ background: hovered === 'a' ? colors.teal : topLeftCardBg, color: hovered === 'a' ? colors.tealText : undefined }}
            >
              <div className="mt-8">
                <div
                  className="text-4xl sm:text-5xl font-medium mb-1 tracking-tight"
                  style={{ color: colors.text }}
                >
                  1.8M
                </div>
                <div
                  className="text-xs sm:text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  tertiary students study tech without guidance.
                </div>
              </div>
            </div>

            {/* Card 3: Tech Stacks Used */}
            <div
              onMouseEnter={() => setHovered('b')}
              onMouseLeave={() => setHovered(null)}
              className="row-span-2 rounded-sm p-4 sm:p-6 flex flex-col justify-end transition-transform hover:scale-[1.02] cursor-default shadow-sm transition-colors"
              style={{ background: hovered === 'b' ? colors.teal : normalCardBg, color: hovered === 'b' ? colors.tealText : undefined }}
            >
              <div
                className="text-4xl sm:text-5xl font-medium mb-1 tracking-tight"
                style={{ color: colors.text }}
              >
                &lt;10%
              </div>
              <div
                className="text-xs sm:text-sm font-medium"
                style={{ color: colors.text }}
              >
                of campus tech projects ever reach a launch.
              </div>
            </div>

            {/* COLUMN 2 */}
            {/* Card 2: Projects Built */}
            <div
              onMouseEnter={() => setHovered('c')}
              onMouseLeave={() => setHovered(null)}
              className="row-span-2 rounded-sm p-4 sm:p-6 flex flex-col justify-center transition-transform hover:scale-[1.02] cursor-default shadow-sm transition-colors"
              style={{ background: hovered === 'c' ? colors.teal : normalCardBg, color: hovered === 'c' ? colors.tealText : undefined }}
            >
              <div
                className="text-4xl sm:text-5xl font-medium mb-1 tracking-tight"
                style={{ color: colors.text }}
              >
                1 in 5
              </div>
              <div
                className="text-xs sm:text-sm font-medium"
                style={{ color: colors.text }}
              >
                Junior devs have experience shipping production-level code.
              </div>
            </div>

            {/* Card 4: Active Teams */}
            <div
              onMouseEnter={() => setHovered('d')}
              onMouseLeave={() => setHovered(null)}
              className="row-span-3 rounded-sm p-4 sm:p-6 flex flex-col justify-end transition-transform hover:scale-[1.02] cursor-default shadow-sm transition-colors"
              style={{ background: hovered === 'd' ? colors.teal : normalCardBg, color: hovered === 'd' ? colors.tealText : undefined }}
            >
              <div
                className="text-4xl sm:text-5xl font-medium mb-1 tracking-tight"
                style={{ color: colors.text }}
              >
                70%
              </div>
              <div
                className="text-xs sm:text-sm font-medium"
                style={{ color: colors.text }}
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
