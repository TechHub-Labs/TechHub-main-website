/**
 * THE PROBLEM ISN'T TALENT — Section
 * Design: Dark navy background, heading with green underline, bullet list,
 * animated vertical progress line on the right side.
 */

import { useEffect, useRef, useState } from 'react';
import { ThemeColors } from '../../landing/domain/types';

const problems = [
  'No Real Projects',
  'Collaboration Experience',
  'Mentorship',
  'Execution culture',
  'Access to opportunities',
];

export function TheProblem({ colors: _colors }: { colors: ThemeColors }) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState<boolean[]>(new Array(problems.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Stagger each bullet item
          problems.forEach((_, i) => {
            setTimeout(() => {
              setItemsVisible(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, 200 + i * 160);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0F1524] text-white py-20 sm:py-28 px-6 sm:px-10 lg:px-16 -mx-4 lg:-mx-[99px]"
    >
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div
          className="mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
            <span className="relative inline-block">
              <span className="relative z-10">The Problem</span>
              {/* Green underline accent on "The Problem" */}
              <span
                className="absolute bottom-[-6px] left-0 h-[3px] bg-[#A3D045]"
                style={{
                  width: visible ? '100%' : '0%',
                  transition: 'width 0.8s ease 0.3s',
                }}
              />
            </span>
            {' '}isn't Talent
          </h2>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl">
            Students were attending classes, watching tutorials, and learning skills. But many still lacked
          </p>
        </div>

        {/* Problem list + vertical animated line */}
        <div className="relative flex gap-8 sm:gap-16">

          {/* Bullet list */}
          <div className="flex-1 space-y-8 sm:space-y-10">
            {problems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4"
                style={{
                  opacity: itemsVisible[i] ? 1 : 0,
                  transform: itemsVisible[i] ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                {/* Bullet dot */}
                <span
                  className="w-2 h-2 rounded-full shrink-0 mt-[2px]"
                  style={{ background: '#ffffff' }}
                />
                <h4 className="text-lg sm:text-xl font-semibold text-white">
                  {item}
                </h4>
              </div>
            ))}
          </div>

          {/* Vertical animated progress line — right side, matching design */}
          <div className="hidden sm:block relative w-[2px] shrink-0 self-stretch">
            {/* Background track */}
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            {/* Animated fill */}
            <div
              ref={lineRef}
              className="absolute top-0 left-0 w-full rounded-full"
              style={{
                background: 'linear-gradient(to bottom, #3B5BDB, #A3D045)',
                height: visible ? '80%' : '0%',
                transition: 'height 1.8s cubic-bezier(0.25, 1, 0.5, 1) 0.4s',
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}