/**
 * Hero.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useCountUp } from "../../../shared/hooks/useCountUp";
import { useMobileScrollHover } from "../../../shared/hooks/useMobileScrollHover";
import { supabase } from "../../../core/supabase/client";

import { ThemeButton } from "../../../shared/components/ThemeButton";

interface Props {
  colors: any;
  dark: boolean;
  onLoaded?: () => void;
}

export function HeroSection({ colors, dark: isDark, onLoaded }: Props) {
  const [typed, setTyped] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const words = ["Launch.", "Innovate.", "Create.", "Scale."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const refMembers = useMobileScrollHover("members", setHoveredCard);
  const refStacks = useMobileScrollHover("stacks", setHoveredCard);
  const refProjects = useMobileScrollHover("projects", setHoveredCard);
  const refTeams = useMobileScrollHover("teams", setHoveredCard);

  const floatRef = useRef(0);
  const [ft, setFt] = useState(0); // float time in seconds

  const [started, setStarted] = useState(false);
  const members = useCountUp({
    target: 250,
    suffix: "+",
    duration: 1800,
    start: started,
    delay: 0,
  });
  const stacks = useCountUp({
    target: 12,
    suffix: "+",
    duration: 1400,
    start: started,
    delay: 100,
  });
  const projects = useCountUp({
    target: 40,
    suffix: "+",
    duration: 1600,
    start: started,
    delay: 50,
  });
  const teams = useCountUp({
    target: 6,
    suffix: "+",
    duration: 1200,
    start: started,
    delay: 150,
  });

  useEffect(() => {
    if (isReady) {
      const t = setTimeout(() => setStarted(true), 300);
      return () => clearTimeout(t);
    }
  }, [isReady]);

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

  useEffect(() => {
    if (!isReady) return;
    const currentWord = words[currentWordIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting) {
      if (typed.length < currentWord.length) {
        timeout = setTimeout(
          () => setTyped(currentWord.slice(0, typed.length + 1)),
          100,
        );
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
  }, [typed, isDeleting, currentWordIndex, isReady]); // eslint-disable-line

  useEffect(() => {
    const iv = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(iv);
  }, []);

  const normalCardBg = isDark ? colors.bgCardHover : colors.bgCard;

  const [avatars, setAvatars] = useState<string[]>([]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const { data } = await supabase
        .from("members")
        .select("avatar_url")
        .order("sort_order", { ascending: true })
        .limit(5);
      
      if (data && data.length > 0) {
        const newAvatars = data.map(
          (m, i) => m.avatar_url || `https://i.pravatar.cc/100?img=${i + 10}`
        );

        // Preload images completely before showing the page
        await Promise.all(
          newAvatars.map((url) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve; // resolve on error to avoid hanging
              img.src = url;
            });
          })
        );

        setAvatars(newAvatars);
      }
      setIsReady(true);
      if (onLoaded) onLoaded();
    };
    fetchAvatars();
  }, [onLoaded]);

  const f1 = Math.sin(ft * ((2 * Math.PI) / 4.0)) * 5;
  const f2 = Math.sin((ft + 0.8) * ((2 * Math.PI) / 5.2)) * 5;
  const f3 = Math.sin((ft + 1.5) * ((2 * Math.PI) / 4.5)) * 5;
  const f4 = Math.sin((ft + 0.3) * ((2 * Math.PI) / 3.8)) * 5;

  const cardStyle = (key: string, floatY: number, bg: string, fg: string) => ({
    background: hoveredCard === key ? colors.teal : bg,
    color: hoveredCard === key ? colors.tealText : fg,

    transform: `translateY(${floatY}px) scale(${hoveredCard === key ? 1.02 : 1})`,
    transition: "background 0.25s ease, color 0.25s ease",
  });

  const textCol = (key: string) =>
    hoveredCard === key ? colors.tealText : colors.text;

  return (
    <section className="relative pt-4 lg:pt-8 pb-8 lg:pb-16 overflow-hidden flex items-start min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-xl">
            <h1
              className="text-[3.25rem] sm:text-6xl lg:text-[4.5rem] font-bold mb-4 leading-[1.05] tracking-tight min-h-[3.15em]"
              style={{ color: colors.text }}
            >
              Build.
              <br />
              Collaborate.
              <br />
              {typed}
              <span
                style={{
                  display: "inline-block",
                  width: "4px",
                  height: "0.85em",
                  backgroundColor: colors.accent,
                  opacity: cursorVisible ? 1 : 0,
                  transition: "opacity 0.1s",
                  marginLeft: "6px",
                  verticalAlign: "baseline",
                  position: "relative",
                  top: "0.1em",
                }}
              />
            </h1>

            <p
              className="text-lg sm:text-xl mb-8 leading-relaxed font-normal"
              style={{ color: colors.text }}
            >
              TechHub is a community of developers, designers, and innovators
              building real products and real opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link to="/join" className="w-full sm:w-max">
                <ThemeButton
                  variant="primary"
                  colors={colors}
                  isDark={isDark}
                  className="fun-cursor w-full sm:w-auto flex justify-center"
                >
                  Join TechHub
                </ThemeButton>
              </Link>
              <Link to="/projects" className="w-full sm:w-max">
                <ThemeButton
                  variant="secondary"
                  colors={colors}
                  isDark={isDark}
                  className="fun-cursor w-full sm:w-auto flex justify-center"
                >
                  Explore Projects
                </ThemeButton>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-5 sm:grid-flow-col gap-4 sm:gap-4 h-auto sm:h-[400px] lg:h-[380px] mt-8 sm:mt-0">
            <div
              ref={refMembers}
              onMouseEnter={() => setHoveredCard("members")}
              onMouseLeave={() => setHoveredCard(null)}
              className="sm:row-span-3 rounded-sm p-5 sm:p-7 lg:p-8 flex flex-col justify-between cursor-default shadow-sm min-h-[160px] sm:min-h-0"
              style={cardStyle("members", f1, normalCardBg, colors.text)}
            >
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Member ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] object-cover"
                    style={{
                      borderColor:
                        hoveredCard === "members" ? colors.teal : normalCardBg,
                    }}
                  />
                ))}
              </div>
              <div className="mt-8">
                <div
                  className="text-5xl sm:text-4xl lg:text-5xl font-medium mb-2 sm:mb-1 tracking-tight tabular-nums"
                  style={{ color: textCol("members") }}
                >
                  {members}
                </div>
                <div
                  className="text-base sm:text-sm font-medium"
                  style={{ color: textCol("members") }}
                >
                  Active members
                </div>
              </div>
            </div>

            <div
              ref={refStacks}
              onMouseEnter={() => setHoveredCard("stacks")}
              onMouseLeave={() => setHoveredCard(null)}
              className="sm:row-span-2 rounded-sm p-5 sm:p-7 lg:p-8 flex flex-col justify-end cursor-default shadow-sm min-h-[130px] sm:min-h-0"
              style={cardStyle("stacks", f2, normalCardBg, colors.text)}
            >
              <div
                className="text-4xl sm:text-3xl lg:text-4xl font-medium mb-2 sm:mb-1 tracking-tight tabular-nums"
                style={{ color: textCol("stacks") }}
              >
                {stacks}
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: textCol("stacks") }}
              >
                Tech Stacks Used
              </div>
            </div>

            <div
              ref={refProjects}
              onMouseEnter={() => setHoveredCard("projects")}
              onMouseLeave={() => setHoveredCard(null)}
              className="sm:row-span-2 rounded-sm p-5 sm:p-7 lg:p-8 flex flex-col justify-center cursor-default shadow-sm min-h-[130px] sm:min-h-0"
              style={cardStyle("projects", f3, normalCardBg, colors.text)}
            >
              <div
                className="text-4xl sm:text-3xl lg:text-4xl font-medium mb-2 sm:mb-1 tracking-tight tabular-nums"
                style={{ color: textCol("projects") }}
              >
                {projects}
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: textCol("projects") }}
              >
                Projects Built
              </div>
            </div>

            <div
              ref={refTeams}
              onMouseEnter={() => setHoveredCard("teams")}
              onMouseLeave={() => setHoveredCard(null)}
              className="sm:row-span-3 rounded-sm p-5 sm:p-7 lg:p-8 flex flex-col justify-end cursor-default shadow-sm min-h-[160px] sm:min-h-0"
              style={cardStyle("teams", f4, normalCardBg, colors.text)}
            >
              <div
                className="text-5xl sm:text-4xl lg:text-5xl font-medium mb-2 sm:mb-1 tracking-tight tabular-nums"
                style={{ color: textCol("teams") }}
              >
                {teams}
              </div>
              <div
                className="text-base sm:text-sm font-medium"
                style={{ color: textCol("teams") }}
              >
                Active Teams
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
