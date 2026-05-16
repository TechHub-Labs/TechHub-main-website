/**
 * THE SOLUTION SECTION — "So a Few Builders Decided to Change That."
 * Design: Light bg, heading + sub, 4 rows of text+image pairs, closing tagline.
 */

import { useEffect, useRef, useState } from 'react';
import { ThemeColors } from '../../landing/domain/types';

const items = [
  {
    title: 'Projects were started.',
    desc: 'We stopped watching tutorials and started initializing repositories. Real-world problems became our primary curriculum.',
  },
  {
    title: 'Teams were formed',
    desc: 'Building alone has a ceiling. We structured specialized squads to ensure every project had the engineering and design depth it deserved.',
  },
  {
    title: 'Designers met developers.',
    desc: 'We bridged the gap between high-fidelity visions and production-ready code, creating a seamless pipeline for execution.',
  },
  {
    title: 'Ideas became products',
    desc: 'Intentions were converted into shipped solutions. We moved beyond the planning phase and started pushing to live environments.',
  },
];

export function TheSolution({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === '#0d1340';
  const imgBg = isDark ? '#1e2870' : '#f0f2fb';

  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [rowsVisible, setRowsVisible] = useState<boolean[]>(new Array(items.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          items.forEach((_, i) => {
            setTimeout(() => {
              setRowsVisible(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 180);
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
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
          className="mb-14"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
            style={{ color: colors.text }}
          >
            So a Few Builders Decided to Change That.
          </h2>
          {/* Underline accent */}
          <div
            className="h-[3px] bg-[#A3D045] mb-5"
            style={{
              width: visible ? '56px' : '0px',
              transition: 'width 0.6s ease 0.3s',
            }}
          />
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl"
            style={{ color: colors.textMuted }}
          >
            TechHub started with a small group of students who believed learning should go beyond classrooms and tutorials. Instead of waiting for opportunities, they began creating them.
          </p>
        </div>

        {/* Items — each is text left, image placeholder right */}
        <div className="space-y-10 sm:space-y-12 mb-14">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start sm:items-center"
              style={{
                opacity: rowsVisible[i] ? 1 : 0,
                transform: rowsVisible[i] ? 'translateY(0)' : 'translateY(18px)',
                transition: 'opacity 0.55s ease, transform 0.55s ease',
              }}
            >
              {/* Text */}
              <div className="flex-1">
                <h4
                  className="text-xl sm:text-2xl font-bold mb-2"
                  style={{ color: colors.text }}
                >
                  {item.title}
                </h4>
                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: colors.textMuted }}
                >
                  {item.desc}
                </p>
              </div>
              {/* Image placeholder — matching the grey rectangles in design */}
              <div
                className="w-full sm:w-[160px] h-[120px] sm:h-[120px] rounded-lg shrink-0 transition-transform duration-300 hover:scale-[1.02]"
                style={{ background: imgBg }}
              />
            </div>
          ))}
        </div>

        {/* Closing tagline — matches "Slowly, a culture began to form; A culture of builders." */}
        <p
          className="text-center text-base sm:text-lg font-semibold"
          style={{
            color: colors.text,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease 1.2s',
          }}
        >
          Slowly, a culture began to form; A culture of builders.
        </p>

      </div>
    </section>
  );
}