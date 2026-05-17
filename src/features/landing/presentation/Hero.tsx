/**
 * HERO SECTION
 * Main hero banner with dynamic typing headline and staggered asymmetrical stat grid.
 */

import { useEffect, useState } from 'react';
import { ThemeColors } from '../domain/types';

interface HeroProps {
  colors: ThemeColors;
}

export function HeroSection({ colors }: HeroProps) {
  const [typed, setTyped] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const words = ["Launch.", "Innovate.", "Create.", "Scale."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDark = colors.bg === '#0d1340';

  // Typing animation logic
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (typed.length < currentWord.length) {
        timeout = setTimeout(() => {
          setTyped(currentWord.slice(0, typed.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 400);
      }
    } else {
      if (typed.length > 0) {
        timeout = setTimeout(() => {
          setTyped(typed.slice(0, -1));
        }, 10);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typed, isDeleting, currentWordIndex, words]);

  useEffect(() => {
    const iv = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(iv);
  }, []);

  const topLeftCardBg = isDark ? '#14363E' : '#EEF4EC';
  const normalCardBg = isDark ? '#18286A' : '#EEF2FE';

  // Placeholder avatars for the "Active members" card
  const avatars = [
    "https://i.pravatar.cc/100?img=33",
    "https://i.pravatar.cc/100?img=47",
    "https://i.pravatar.cc/100?img=12",
    "https://i.pravatar.cc/100?img=32",
    "https://i.pravatar.cc/100?img=57"
  ];

  return (
    <section
      className="relative pt-3 overflow-hidden flex items-center min-h-[calc(100vh-80px)]" 
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left - Headline & CTA */}
          <div className="max-w-xl">
            <h1
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold mb-5 leading-[0.9] tracking-tight min-h-[3.15em]"
              style={{ color: colors.text }}
            >
              Build.<br />
              Collaborate.<br />
              {typed}
              <span
                style={{
                  display: "inline-block",
                  width: "4px",
                  height: "0.85em",
                  backgroundColor: '#A3D045',
                  opacity: cursorVisible ? 1 : 0,
                  transition: "opacity 0.1s",
                  marginLeft: "6px",
                  verticalAlign: "baseline",
                  position: "relative",
                  top: "0.1em"
                }}
              />
            </h1>

            <p
              className="text-base sm:text-xl mb-10 leading-relaxed font-normal"
              style={{ color: colors.text }}
            >
              TechHub is a community of developers, designers, and innovators building real products and real opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-8 py-3 rounded-md font-medium transition-all text-sm sm:text-base shadow-sm hover:scale-105 hover:shadow-lg active:scale-95"
                style={{
                  background: colors.text,
                  color: colors.btnPrimaryText,
                }}
              >
                Join TechHub
              </button>
              <button
                className="px-8 py-3 rounded-md font-medium transition-all text-sm sm:text-base border border-current hover:scale-105 hover:bg-opacity-10 active:scale-95"
                style={{
                  background: colors.btnSecondary,
                  color: colors.text,
                }}
              >
                Explore Projects
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-4 sm:gap-5 h-[400px] sm:h-[460px]">
            <div
              className="row-span-3 rounded-sm p-6 sm:p-8 flex flex-col justify-between transition-transform hover:scale-[1.02] cursor-default shadow-sm"
              style={{ background: topLeftCardBg }}
            >
              <div className="flex -space-x-3">
                {avatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Member ${i+1}`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] object-cover"
                    style={{ borderColor: topLeftCardBg }}
                  />
                ))}
              </div>
              <div className="mt-8">
                <div className="text-4xl sm:text-5xl font-medium mb-1 tracking-tight" style={{ color: colors.text }}>
                  250+
                </div>
                <div className="text-sm sm:text-base font-medium" style={{ color: colors.text }}>
                  Active members
                </div>
              </div>
            </div>

            {/* Card 3: Tech Stacks Used */}
            <div
              className="row-span-2 rounded-sm p-6 sm:p-8 flex flex-col justify-end transition-transform hover:scale-[1.02] cursor-default shadow-sm"
              style={{ background: normalCardBg }}
            >
              <div className="text-3xl sm:text-4xl font-medium mb-1 tracking-tight" style={{ color: colors.text }}>
                12+
              </div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: colors.text }}>
                Tech Stacks Used
              </div>
            </div>

            {/* COLUMN 2 */}
            {/* Card 2: Projects Built */}
            <div
              className="row-span-2 rounded-sm p-6 sm:p-8 flex flex-col justify-center transition-transform hover:scale-[1.02] cursor-default shadow-sm"
              style={{ background: normalCardBg }}
            >
              <div className="text-3xl sm:text-4xl font-medium mb-1 tracking-tight" style={{ color: colors.text }}>
                40+
              </div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: colors.text }}>
                Projects Built
              </div>
            </div>

            {/* Card 4: Active Teams */}
            <div
              className="row-span-3 rounded-sm p-6 sm:p-8 flex flex-col justify-end transition-transform hover:scale-[1.02] cursor-default shadow-sm"
              style={{ background: normalCardBg }}
            >
              <div className="text-4xl sm:text-5xl font-medium mb-1 tracking-tight" style={{ color: colors.text }}>
                6+
              </div>
              <div className="text-sm sm:text-base font-medium" style={{ color: colors.text }}>
                Active Teams
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}