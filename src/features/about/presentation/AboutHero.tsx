/**
 * ABOUT US HERO SECTION
 * Matches design: "Builders Need an Actual Ecosystem." headline + 2x2 stats grid
 */

import { useEffect, useRef } from 'react';
import { ThemeColors } from '../../landing/domain/types';

export function AboutHero({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === '#0d1340';

  // Stat card background colors matching design mockup exactly
  const card1Bg = isDark ? '#1b3a33' : '#e8f0e4'; // green-tinted
  const card2Bg = isDark ? '#1a1f5a' : '#f0f2fb'; // light blue/white
  const card3Bg = isDark ? '#161c50' : '#f4f5fb'; // very light
  const card4Bg = isDark ? '#1e2460' : '#eaedfa'; // pale blue

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const stats = [
    { value: '1.8M', label: 'tertiary students study tech without guidance.' },
    { value: '1 in 5', label: 'Junior devs have experience shipping production-level code.' },
    { value: '<10%', label: 'of campus tech projects ever reach a launch.' },
    { value: '70%', label: 'of university tech talent will never work in a cross-functional team before graduating.' },
  ];

  const cardBgs = [card1Bg, card2Bg, card3Bg, card4Bg];

  return (
    <section ref={heroRef} className="py-16 lg:py-24 relative z-10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* LEFT — Headline & Sub */}
          <div className="max-w-xl">
            <h1
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight mb-6 leading-[1.05]"
              style={{ color: colors.text }}
            >
              Builders Need<br />
              an Actual<br />
              Ecosystem.
            </h1>
            {/* Green underline accent under "Ecosystem" — matching design */}
            <div className="w-14 h-[3px] bg-[#A3D045] mb-6" />
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: colors.textMuted }}
            >
              TechHub is a project-driven technology ecosystem focused on helping students and young builders gain real experience, collaborate on meaningful ideas, and grow into world-class innovators.
            </p>
          </div>

          {/* RIGHT — 2×2 Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-5 sm:p-7 rounded-sm flex flex-col justify-center shadow-sm transition-transform duration-300 hover:scale-[1.03] cursor-default"
                style={{
                  background: cardBgs[i],
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <h3
                  className="text-3xl sm:text-4xl font-black mb-2 tracking-tight"
                  style={{ color: colors.text }}
                >
                  {stat.value}
                </h3>
                <p
                  className="text-xs sm:text-sm leading-snug"
                  style={{ color: colors.textMuted }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}