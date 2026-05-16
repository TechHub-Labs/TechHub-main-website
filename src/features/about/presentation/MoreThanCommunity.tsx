/**
 * MORE THAN A COMMUNITY — Section
 * Design: Heading + sub, 2×2 icon cards (Builder Community, Project Ecosystem, Talent Pipeline, Execution Culture)
 */

import { useEffect, useRef, useState } from 'react';
import { ThemeColors } from '../../landing/domain/types';

const offerings = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'The Builder Community',
    desc: 'A network of engineers, designers, and technical leads collaborating in a cross-functional environment.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'The Project Ecosystem',
    desc: 'A sandbox for building real-world products. We move beyond tutorials to maintain and ship live systems.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="3" x2="6" y2="15"/>
        <circle cx="18" cy="6" r="3"/>
        <circle cx="6" cy="18" r="3"/>
        <path d="M18 9a9 9 0 0 1-9 9"/>
      </svg>
    ),
    title: 'The Talent Pipeline',
    desc: 'Bridging the gap between theory and industry. We vet potential through actual execution and results.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: 'The Execution Culture',
    desc: 'A structured space for rapid prototyping. Moving ideas from a blank file to a live deployment.',
  },
];

export function MoreThanCommunity({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === '#0d1340';
  const cardBg = isDark ? '#1a2160' : '#ffffff';
  const iconColor = isDark ? '#a5b4fc' : '#3B5BDB';

  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>(new Array(offerings.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          offerings.forEach((_, i) => {
            setTimeout(() => {
              setCardsVisible(prev => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 120);
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
          className="mb-12"
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
            More Than a Community.
          </h2>
          <div
            className="h-[3px] bg-[#A3D045] mb-5"
            style={{
              width: visible ? '56px' : '0px',
              transition: 'width 0.6s ease 0.3s',
            }}
          />
          <p
            className="text-base sm:text-lg max-w-2xl leading-relaxed"
            style={{ color: colors.textMuted }}
          >
            TechHub is a project-driven infrastructure designed to turn technical potential into tangible products. We provide the structure, the teams, and the execution culture that traditional classrooms miss.
          </p>
        </div>

        {/* 2×2 Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {offerings.map((item, i) => (
            <div
              key={i}
              className="p-7 sm:p-8 rounded-xl border border-transparent transition-all duration-300 hover:border-[#3B5BDB] hover:scale-[1.02] hover:shadow-lg cursor-default"
              style={{
                background: cardBg,
                opacity: cardsVisible[i] ? 1 : 0,
                transform: cardsVisible[i] ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s, box-shadow 0.3s, transform 0.3s',
              }}
            >
              {/* Icon */}
              <div
                className="mb-5"
                style={{ color: iconColor }}
              >
                {item.icon}
              </div>
              <h4
                className="text-lg sm:text-xl font-bold mb-3"
                style={{ color: colors.text }}
              >
                {item.title}
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.textMuted }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}