/**
 * TRAJECTORY SECTION — "The Trajectory of a Movement."
 * Design: Vertical center line, alternating left/right nodes with play-button arrows.
 * 4 milestones: 2024, 2025, 2026, The Future.
 */

import { useEffect, useRef, useState } from 'react';
import { ThemeColors } from '../../landing/domain/types';

const timeline = [
  {
    year: '2024 — The Foundation',
    desc: 'A few members began collaborating on projects to bridge the gap between theory and reality.',
    side: 'left',
  },
  {
    year: '2025 — Structure Emerged',
    desc: 'Specialized roles and leadership systems were introduced to handle growing complexity.',
    side: 'right',
  },
  {
    year: '2026 — Projects Shipping',
    desc: 'Internal products and collaborations gained traction, moving from local to global relevance.',
    side: 'left',
  },
  {
    year: 'The Future — Beyond Campus',
    desc: 'TechHub evolves into a larger innovation ecosystem, becoming a launchpad for world-class innovators.',
    side: 'right',
  },
];

export function Trajectory({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === '#0d1340';
  const lineColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(13,19,64,0.1)';
  const dotColor = '#3B5BDB';
  const arrowColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(13,19,64,0.1)';

  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [nodesVisible, setNodesVisible] = useState<boolean[]>(new Array(timeline.length).fill(false));
  const [lineHeight, setLineHeight] = useState('0%');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setLineHeight('100%');
          timeline.forEach((_, i) => {
            setTimeout(() => {
              setNodesVisible(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, 200 + i * 250);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div
          className="mb-16 sm:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            The Trajectory of a Movement.
          </h2>
          <div
            className="h-[3px] bg-[#A3D045] mb-5"
            style={{
              width: visible ? '56px' : '0px',
              transition: 'width 0.6s ease 0.3s',
            }}
          />
          <p
            className="text-base sm:text-lg"
            style={{ color: colors.textMuted }}
          >
            Since 2024, TechHub has evolved from a small collective into a structured ecosystem for African builders.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Vertical center line */}
          <div
            className="absolute left-1/2 top-0 w-[2px] -translate-x-1/2"
            style={{
              background: lineColor,
              height: '100%',
            }}
          >
            {/* Animated fill */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: lineHeight,
                background: `linear-gradient(to bottom, #3B5BDB 0%, #A3D045 100%)`,
                transition: 'height 2s cubic-bezier(0.25, 1, 0.5, 1) 0.4s',
              }}
            />
          </div>

          {/* Nodes */}
          <div className="space-y-16 sm:space-y-20">
            {timeline.map((node, i) => {
              const isLeft = node.side === 'left';
              return (
                <div
                  key={i}
                  className="relative flex items-start"
                  style={{
                    opacity: nodesVisible[i] ? 1 : 0,
                    transform: nodesVisible[i]
                      ? 'translateX(0)'
                      : isLeft ? 'translateX(-24px)' : 'translateX(24px)',
                    transition: 'opacity 0.55s ease, transform 0.55s ease',
                  }}
                >
                  {/* Left content */}
                  <div className={`flex-1 ${isLeft ? 'pr-8 sm:pr-12 text-right' : ''}`}>
                    {isLeft && (
                      <NodeContent
                        year={node.year}
                        desc={node.desc}
                        colors={colors}
                        align="right"
                      />
                    )}
                  </div>

                  {/* Center dot + arrow */}
                  <div className="relative flex flex-col items-center z-10 px-2">
                    {/* Arrow indicator — play button shape, like design */}
                    <div
                      className="w-6 h-6 rounded-sm mb-2 flex items-center justify-center"
                      style={{ background: arrowColor }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d={isLeft ? 'M7 5L3 2.5V7.5L7 5Z' : 'M3 5L7 2.5V7.5L3 5Z'}
                          fill={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(13,19,64,0.3)'}
                        />
                      </svg>
                    </div>
                    {/* Dot */}
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white"
                      style={{ background: dotColor }}
                    />
                  </div>

                  {/* Right content */}
                  <div className={`flex-1 ${!isLeft ? 'pl-8 sm:pl-12' : ''}`}>
                    {!isLeft && (
                      <NodeContent
                        year={node.year}
                        desc={node.desc}
                        colors={colors}
                        align="left"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function NodeContent({
  year,
  desc,
  colors,
  align,
}: {
  year: string;
  desc: string;
  colors: ThemeColors;
  align: 'left' | 'right';
}) {
  return (
    <div className={`max-w-xs ${align === 'right' ? 'ml-auto' : ''}`}>
      <h4
        className="text-base sm:text-lg font-bold mb-2"
        style={{ color: colors.text }}
      >
        {year}
      </h4>
      <p
        className="text-sm leading-relaxed"
        style={{ color: colors.textMuted }}
      >
        {desc}
      </p>
    </div>
  );
}