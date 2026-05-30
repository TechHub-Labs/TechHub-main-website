/**
 * HERO SECTION
 * Original design preserved exactly.
 * ADDED (animation only, zero styling change):
 *   - Numbers count up from 0 on mount (useCountUp)
 *   - Cards float continuously using JS rAF time (avoids CSS animation/transform conflict)
 *   - Hover scale preserved via same JS transform string
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeColors } from '../domain/types';
import { useCountUp } from '../../../shared/hooks/useCountUp';
import { supabase } from '../../../core/supabase/client';

import { ThemeButton } from '../../../shared/components/ThemeButton';

interface HeroProps {
  colors: ThemeColors;
  dark?: boolean;
}

export function HeroSection({ colors, dark = false }: HeroProps) {
  const [typed, setTyped]                       = useState("");
  const [cursorVisible, setCursorVisible]       = useState(true);
  const words                                   = ["Launch.", "Innovate.", "Create.", "Scale."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting]             = useState(false);
  const isDark                                  = dark;
  const [hoveredCard, setHoveredCard]           = useState<string | null>(null);

  // ── Float: JS rAF so transform doesn't conflict with hover scale ──────────
  const floatRef  = useRef(0);
  const [ft, setFt] = useState(0);   // float time in seconds

  // ── Count-up ─────────────────────────────────────────────────────────────
  const [started, setStarted] = useState(false);
  const members  = useCountUp({ target: 250, suffix: '+', duration: 1800, start: started, delay: 0   });
  const stacks   = useCountUp({ target: 12,  suffix: '+', duration: 1400, start: started, delay: 100 });
  const projects = useCountUp({ target: 40,  suffix: '+', duration: 1600, start: started, delay: 50  });
  const teams    = useCountUp({ target: 6,   suffix: '+', duration: 1200, start: started, delay: 150 });

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Float animation loop
  useEffect(() => {
    const origin = performance.now();
    let raf: number;
    const tick = () => {
      floatRef.current = (performance.now() - origin) / 1000;
      setFt(floatRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Typing animation — exact original logic
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting) {
      if (typed.length < currentWord.length) {
        timeout = setTimeout(() => setTyped(currentWord.slice(0, typed.length + 1)), 100);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 500);
      }
    } else {
      if (typed.length > 0) {
        timeout = setTimeout(() => setTyped(typed.slice(0, -1)), 50);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [typed, isDeleting, currentWordIndex]);   // eslint-disable-line

  useEffect(() => {
    const iv = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(iv);
  }, []);

  const normalCardBg = isDark ? colors.bgCardHover : colors.bgCard;

  const [avatars, setAvatars] = useState<string[]>([
    "https://i.pravatar.cc/100?img=33",
    "https://i.pravatar.cc/100?img=47",
    "https://i.pravatar.cc/100?img=12",
    "https://i.pravatar.cc/100?img=32",
    "https://i.pravatar.cc/100?img=57",
  ]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const { data } = await supabase.from('members').select('avatar_url').order('sort_order', { ascending: true }).limit(5);
      if (data && data.length > 0) {
        setAvatars(data.map((m, i) => m.avatar_url || `https://i.pravatar.cc/100?img=${i + 10}`));
      }
    };
    fetchAvatars();
  }, []);

  // Per-card float offsets — different periods & phase so they never sync
  const f1 = Math.sin(ft * (2 * Math.PI / 4.0)) * 5;
  const f2 = Math.sin((ft + 0.8) * (2 * Math.PI / 5.2)) * 5;
  const f3 = Math.sin((ft + 1.5) * (2 * Math.PI / 4.5)) * 5;
  const f4 = Math.sin((ft + 0.3) * (2 * Math.PI / 3.8)) * 5;

  const cardStyle = (key: string, floatY: number, bg: string, fg: string) => ({
    background: hoveredCard === key ? colors.teal : bg,
    color:      hoveredCard === key ? colors.tealText : fg,
    // Float + hover scale combined — no CSS animation conflict
    transform:  `translateY(${floatY}px) scale(${hoveredCard === key ? 1.02 : 1})`,
    transition: 'background 0.25s ease, color 0.25s ease',
  });

  const textCol = (key: string) =>
    hoveredCard === key ? colors.tealText : colors.text;

  return (
    <section className="relative pt-3 overflow-hidden flex items-center min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT ── */}
          <div className="max-w-xl">
            <h1
              className="text-4xl sm:text-5xl lg:text-[5.5rem] font-bold mb-5 leading-[0.9] tracking-tight min-h-[3.15em]"
              style={{ color: colors.text }}
            >
              Build.<br />
              Collaborate.<br />
              {typed}
              <span style={{
                display: "inline-block", width: "4px", height: "0.85em",
                backgroundColor: colors.accent, opacity: cursorVisible ? 1 : 0,
                transition: "opacity 0.1s", marginLeft: "6px",
                verticalAlign: "baseline", position: "relative", top: "0.1em",
              }} />
            </h1>

            <p className="text-base sm:text-xl mb-10 leading-relaxed font-normal" style={{ color: colors.text }}>
              TechHub is a community of developers, designers, and innovators building real products and real opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/join" className="w-max">
                <ThemeButton
                  variant="primary"
                  colors={colors}
                  isDark={isDark}
                  className="fun-cursor"
                >
                  Join TechHub
                </ThemeButton>
              </Link>
              <Link to="/projects" className="w-max">
                <ThemeButton
                  variant="secondary"
                  colors={colors}
                  isDark={isDark}
                  className="fun-cursor"
                >
                  Explore Projects
                </ThemeButton>
              </Link>
            </div>
          </div>

          {/* ── RIGHT — exact original grid, float + count-up added ── */}
          <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-4 sm:gap-5 h-[500px] sm:h-[460px]">

            {/* Members */}
            <div
              onMouseEnter={() => setHoveredCard('members')}
              onMouseLeave={() => setHoveredCard(null)}
              className="row-span-3 rounded-sm p-4 sm:p-6 lg:p-8 flex flex-col justify-between cursor-default shadow-sm"
              style={cardStyle('members', f1, normalCardBg, colors.text)}
            >
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img key={i} src={src} alt={`Member ${i + 1}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] object-cover"
                    style={{ borderColor: hoveredCard === 'members' ? colors.teal : normalCardBg }}
                  />
                ))}
              </div>
              <div className="mt-8">
                <div className="text-3xl sm:text-5xl font-medium mb-1 tracking-tight tabular-nums" style={{ color: textCol('members') }}>{members}</div>
                <div className="text-sm sm:text-base font-medium"                                  style={{ color: textCol('members') }}>Active members</div>
              </div>
            </div>

            {/* Stacks */}
            <div
              onMouseEnter={() => setHoveredCard('stacks')}
              onMouseLeave={() => setHoveredCard(null)}
              className="row-span-2 rounded-sm p-4 sm:p-6 lg:p-8 flex flex-col justify-end cursor-default shadow-sm"
              style={cardStyle('stacks', f2, normalCardBg, colors.text)}
            >
              <div className="text-2xl sm:text-4xl font-medium mb-1 tracking-tight tabular-nums" style={{ color: textCol('stacks') }}>{stacks}</div>
              <div className="text-xs sm:text-sm font-medium"                                    style={{ color: textCol('stacks') }}>Tech Stacks Used</div>
            </div>

            {/* Projects */}
            <div
              onMouseEnter={() => setHoveredCard('projects')}
              onMouseLeave={() => setHoveredCard(null)}
              className="row-span-2 rounded-sm p-4 sm:p-6 lg:p-8 flex flex-col justify-center cursor-default shadow-sm"
              style={cardStyle('projects', f3, normalCardBg, colors.text)}
            >
              <div className="text-2xl sm:text-4xl font-medium mb-1 tracking-tight tabular-nums" style={{ color: textCol('projects') }}>{projects}</div>
              <div className="text-xs sm:text-sm font-medium"                                    style={{ color: textCol('projects') }}>Projects Built</div>
            </div>

            {/* Teams */}
            <div
              onMouseEnter={() => setHoveredCard('teams')}
              onMouseLeave={() => setHoveredCard(null)}
              className="row-span-3 rounded-sm p-4 sm:p-6 lg:p-8 flex flex-col justify-end cursor-default shadow-sm"
              style={cardStyle('teams', f4, normalCardBg, colors.text)}
            >
              <div className="text-3xl sm:text-5xl font-medium mb-1 tracking-tight tabular-nums" style={{ color: textCol('teams') }}>{teams}</div>
              <div className="text-sm sm:text-base font-medium"                                  style={{ color: textCol('teams') }}>Active Teams</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}