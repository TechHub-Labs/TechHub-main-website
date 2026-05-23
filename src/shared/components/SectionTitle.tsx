/**
 * SectionTitle — Word-by-word slide-up reveal
 * ─────────────────────────────────────────────────────────────────────────────
 * Each word slides up from below into a masked container (overflow hidden).
 * Smooth, clean, easy on the eyes — no flickering.
 *
 * Timeline per word: staggered 80ms apart
 *   translateY(110%) → translateY(0) with cubic-bezier spring
 *   After all words: green accent line draws in
 *   Then: subtitle fades + slides up
 */

import { useEffect, useRef, useState } from 'react';
import { ThemeColors } from '../../features/landing/domain/types';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  tag?: 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center';
  colors: ThemeColors;
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  tag: Tag = 'h2',
  align = 'left',
  colors,
  className = '',
  delay = 0,
  immediate = false,
}: SectionTitleProps) {
  const containerRef              = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed]   = useState(false);
  const [lineWidth, setLineWidth] = useState('0px');
  const [subVisible, setSubVisible] = useState(false);

  const words = title.split(' ');
  const lastWordDelay = words.length * 80; // when last word finishes

  useEffect(() => {
    const fire = () => {
      if (revealed) return;
      setTimeout(() => {
        setRevealed(true);
        // Accent line after words finish
        setTimeout(() => setLineWidth('180px'), lastWordDelay + 100);
        // Subtitle after line
        setTimeout(() => setSubVisible(true), lastWordDelay + 500);
      }, delay);
    };

    if (immediate) { fire(); return; }

    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { fire(); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, immediate, revealed, lastWordDelay]);

  return (
    <div
      ref={containerRef}
      className={`${align === 'center' ? 'text-center' : 'text-left'} ${className}`}
    >
      {/* Words — each in overflow:hidden mask */}
      <Tag
        className="font-bold tracking-tight leading-[1.1]"
        style={{
          color: colors.text,
          fontSize: Tag === 'h1' ? 'clamp(2.5rem, 6vw, 5rem)' : 'clamp(2rem, 4vw, 3.5rem)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0 0.3em',
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              lineHeight: 1.15,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: revealed ? 'translateY(0)' : 'translateY(110%)',
                opacity: revealed ? 1 : 0,
                transition: revealed
                  ? `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms, opacity 0.4s ease ${i * 80}ms`
                  : 'none',
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </Tag>

      {/* Accent line */}
      <div
        style={{
          height: '3px',
          borderRadius: '2px',
          background: '#A3D045',
          marginTop: '10px',
          width: lineWidth,
          transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* Subtitle */}
      {subtitle && (
        <p
          className="mt-4 text-base sm:text-lg leading-relaxed max-w-2xl"
          style={{
            color: colors.textMuted,
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
