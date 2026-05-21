/**
 * TRAJECTORY SECTION — "The Trajectory of a Movement."
 * Center vertical line with large spacing between nodes.
 * Left nodes: text-left, right-pointing arrow, dot on center line.
 * Right nodes: dot on center line, left-pointing arrow, text-right.
 */

import { useEffect, useRef, useState } from 'react';
import { ThemeColors } from '../../landing/domain/types';

const timeline = [
  {
    year: '2024 — The Foundation',
    desc: 'A few members began collaborating on projects to bridge the gap between theory and reality.',
    side: 'left' as const,
  },
  {
    year: '2025 — Structure Emerged',
    desc: 'Specialized roles and leadership systems were introduced to handle growing complexity.',
    side: 'right' as const,
  },
  {
    year: '2026 — Projects Shipping',
    desc: 'Internal products and collaborations gained traction, moving from local to global relevance.',
    side: 'left' as const,
  },
  {
    year: 'The Future — Beyond Campus',
    desc: 'TechHub evolves into a larger innovation ecosystem, becoming a launchpad for world-class innovators.',
    side: 'right' as const,
  },
];

export function Trajectory({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === '#0d1340';

  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [nodesVisible, setNodesVisible] = useState<boolean[]>(
    new Array(timeline.length).fill(false)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          timeline.forEach((_, i) => {
            setTimeout(() => {
              setNodesVisible(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, 250 + i * 300);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const trackColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(13,19,64,0.1)';
  const fillColor = isDark
    ? 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.06))'
    : 'linear-gradient(to bottom, rgba(13,19,64,0.3), rgba(13,19,64,0.06))';
  const arrowFill = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(13,19,64,0.22)';
  const dotBorder = isDark ? '#0d1340' : '#f4f5fa';

  return (
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto">

        {/* ── HEADER ── */}
        <div
          className="mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: colors.text }}>
            The Trajectory of a Movement.
          </h2>
          <div
            className="h-[3px] bg-[#A3D045] mb-5"
            style={{ width: visible ? '56px' : '0px', transition: 'width 0.6s ease 0.3s' }}
          />
          <p className="text-base sm:text-lg" style={{ color: colors.textMuted }}>
            Since 2024, TechHub has evolved from a small collective into a structured ecosystem for African builders.
          </p>
        </div>

        {/* ── TIMELINE BODY ── */}
        <div className="relative">

          {/* Vertical center track */}
          <div
            className="absolute"
            style={{
              left: '50%',
              top: 0,
              bottom: 0,
              width: '1.5px',
              transform: 'translateX(-50%)',
              background: trackColor,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: visible ? '100%' : '0%',
                background: fillColor,
                transition: 'height 2.6s cubic-bezier(0.25, 1, 0.5, 1) 0.5s',
              }}
            />
          </div>

          {/* Nodes — each occupies ~160px min height to create the big spacing from design */}
          {timeline.map((node, i) => {
            const isLeft = node.side === 'left';

            return (
              <div
                key={i}
                className="relative flex items-start"
                style={{ minHeight: '160px' }}
              >
                {/* LEFT content area */}
                <div
                  className="flex-1 flex items-start justify-end"
                  style={{ paddingRight: '28px', paddingTop: '2px' }}
                >
                  {isLeft && (
                    <div
                      className="text-right"
                      style={{
                        maxWidth: '210px',
                        opacity: nodesVisible[i] ? 1 : 0,
                        transform: nodesVisible[i] ? 'translateX(0)' : 'translateX(-28px)',
                        transition: 'opacity 0.55s ease, transform 0.55s ease',
                      }}
                    >
                      <h4
                        className="text-sm sm:text-base font-bold mb-2 leading-snug"
                        style={{ color: colors.text }}
                      >
                        {node.year}
                      </h4>
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: colors.textMuted }}
                      >
                        {node.desc}
                      </p>
                    </div>
                  )}
                </div>

                {/* CENTER column: arrow + dot stacked */}
                <div
                  className="relative flex flex-col items-center shrink-0 z-10"
                  style={{ width: '28px' }}
                >
                  {/* Arrow icon */}
                  <div
                    style={{
                      marginBottom: '4px',
                      opacity: nodesVisible[i] ? 1 : 0,
                      transition: 'opacity 0.4s ease 0.15s',
                    }}
                  >
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      {isLeft ? (
                        /* Right-pointing play triangle */
                        <path d="M1.5 1.5L7.5 4.5L1.5 7.5V1.5Z" fill={arrowFill} />
                      ) : (
                        /* Left-pointing play triangle */
                        <path d="M7.5 1.5L1.5 4.5L7.5 7.5V1.5Z" fill={arrowFill} />
                      )}
                    </svg>
                  </div>

                  {/* Center dot */}
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#3B5BDB',
                      border: `2px solid ${dotBorder}`,
                      opacity: nodesVisible[i] ? 1 : 0,
                      transform: nodesVisible[i] ? 'scale(1)' : 'scale(0)',
                      transition: 'opacity 0.4s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                  />
                </div>

                {/* RIGHT content area */}
                <div
                  className="flex-1 flex items-start justify-start"
                  style={{ paddingLeft: '28px', paddingTop: '2px' }}
                >
                  {!isLeft && (
                    <div
                      style={{
                        maxWidth: '210px',
                        opacity: nodesVisible[i] ? 1 : 0,
                        transform: nodesVisible[i] ? 'translateX(0)' : 'translateX(28px)',
                        transition: 'opacity 0.55s ease, transform 0.55s ease',
                      }}
                    >
                      <h4
                        className="text-sm sm:text-base font-bold mb-2 leading-snug"
                        style={{ color: colors.text }}
                      >
                        {node.year}
                      </h4>
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: colors.textMuted }}
                      >
                        {node.desc}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}