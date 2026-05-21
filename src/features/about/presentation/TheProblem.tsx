/**
 * THE PROBLEM SECTION — "The Problem isn't Talent"
 * - Between-item lines: gradient (blue top → transparent bottom)
 * - Right progress line: scroll-driven, fills based on which bullet you're at
 */

import { useEffect, useRef, useState, useCallback } from 'react';
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
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState<boolean[]>(
    new Array(problems.length).fill(false)
  );
  // 0 = empty, 1 = full (fraction of right line filled)
  const [lineProgress, setLineProgress] = useState(0);

  // Scroll handler: measure how far into the section we are
  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // How many px of the section have scrolled past the center of the viewport
    // Start filling when section top hits viewport center, finish when bottom does
    const start = sectionRect.top - viewportH * 0.5;
    const end = sectionRect.bottom - viewportH * 0.5;
    const total = end - start;

    if (total <= 0) return;
    const scrolled = -start; // positive = we've scrolled past start
    const raw = Math.max(0, Math.min(1, scrolled / total));

    setLineProgress(raw);
  }, []);

  useEffect(() => {
    // Initial visibility trigger
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          problems.forEach((_, i) => {
            setTimeout(() => {
              setItemsVisible(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, 200 + i * 180);
          });
        }
      },
      { threshold: 0.06 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    // Scroll listener for progress line
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0F1B4D] text-white py-20 sm:py-28 -mx-4 lg:-mx-[99px]"
    >
      <div className="px-4 lg:px-[99px]">

        {/* ── HEADING ── */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            <span className="relative inline-block">
              <span>The Problem</span>
              <span
                className="absolute bottom-[-5px] left-0 h-[3px] bg-[#A3D045]"
                style={{
                  width: visible ? '100%' : '0%',
                  transition: 'width 0.8s ease 0.4s',
                }}
              />
            </span>
            {' '}isn't Talent
          </h2>
          <p className="text-base sm:text-lg text-white leading-relaxed max-w-xl mb-14">
            Students were attending classes, watching tutorials, and learning skills, But many still lacked
          </p>
        </div>

        {/* ── LIST + RIGHT PROGRESS LINE ── */}
        <div className="relative flex gap-6 sm:gap-10">

          {/* LEFT: bullet items with gradient stems between them */}
          <div className="flex-1">
            {problems.map((item, i) => {
              const isLast = i === problems.length - 1;
              return (
                <div
                  key={i}
                  ref={el => { itemRefs.current[i] = el; }}
                >
                  {/* Bullet row */}
                  <div
                    className="flex items-center gap-5"
                    style={{
                      opacity: itemsVisible[i] ? 1 : 0,
                      transform: itemsVisible[i] ? 'translateX(0)' : 'translateX(-20px)',
                      transition: 'opacity 0.5s ease, transform 0.5s ease',
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: '#ffffff' }}
                    />
                    <h4 className="text-lg sm:text-xl font-semibold text-white">
                      {item}
                    </h4>
                  </div>

                  {/* Gradient stem BELOW each item (except last) */}
                  {!isLast && (
                    <div
                      style={{
                        marginLeft: '3px',
                        marginTop: '12px',
                        marginBottom: '0px',
                        width: '1px',
                        height: '100px',
                        background: 'linear-gradient(to bottom, transparent 0%, #F8F9FE 50%, transparent 100%)',
                        borderRadius: '1px',
                        opacity: itemsVisible[i] ? 1 : 0,
                        transform: itemsVisible[i] ? 'scaleY(1)' : 'scaleY(0)',
                        transformOrigin: 'top',
                        transition: 'opacity 0.4s ease 0.2s, transform 0.5s ease 0.2s',
                      }}
                    />
                  )}

                  {/* Spacer after last item */}
                  {isLast && <div style={{ height: '8px' }} />}
                </div>
              );
            })}
          </div>

          {/* RIGHT: scroll-driven progress line */}
          <div
            className="hidden sm:block relative shrink-0"
            style={{ width: '2px', alignSelf: 'stretch' }}
          >
            {/* Track (dim background) */}
            <div
              className="absolute inset-0"
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '2px',
              }}
            />

            {/* Filled portion — driven by scroll progress */}
            <div
              ref={progressLineRef}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${lineProgress * 100}%`,
                // Blue at top → white at the leading edge
                background: 'linear-gradient(to bottom, #3B5BDB 0%, #3B5BDB 70%, rgba(255,255,255,0.9) 100%)',
                borderRadius: '2px',
                transition: 'height 0.12s ease-out',
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}