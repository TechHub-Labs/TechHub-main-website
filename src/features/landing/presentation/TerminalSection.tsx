/**
 * TerminalSection.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeColors } from "../domain/types";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { AnimatedCard } from "../../../shared/components/AnimatedCard";

interface TerminalSectionProps {
  colors: ThemeColors;
}

const TERMINAL_LINES = [
  "$ npm run speed-test",
  "> Initializing challenge...",
  "> Loading random code snippet...",
  "> Ready. Type as fast as you can!",
  "▌",
];

export function TerminalSection({ colors }: TerminalSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [termVisible, setTermVisible] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [rippling, setRippling] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTermVisible(true);

          TERMINAL_LINES.forEach((line, i) => {
            setTimeout(
              () => {
                setLines((prev) => [...prev, line]);
              },
              600 + i * 480,
            );
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handlePlay = () => {
    setRippling(true);
    setTimeout(() => setRippling(false), 600);
  };

  return (
    <section ref={sectionRef} className="pt-40 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <SectionTitle
            title="Test Your Speed"
            subtitle="Do you think you can type faster than a developer? Try Speed Code and find out."
            colors={colors}
          />
        </div>

        <AnimatedCard direction="up" distance={40} threshold={0.15}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: colors.terminalBg,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: termVisible
                ? "0 32px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(163,208,69,0.1)"
                : "0 8px 32px rgba(0,0,0,0.15)",
              transition: "box-shadow 1s ease 0.8s",
            }}
          >
            <div
              className="px-5 py-3.5 flex items-center gap-2 border-b"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div className="flex gap-2">
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full transition-transform duration-200 hover:scale-125"
                    style={{
                      background: c,
                      animation:
                        i === 2 ? "pulseGlow 2s ease-in-out infinite" : "none",
                    }}
                  />
                ))}
              </div>
              <span
                className="ml-3 text-xs font-mono"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                speed-code — bash
              </span>
            </div>

            <div className="px-6 py-6 font-mono min-h-[300px] sm:min-h-[380px] flex flex-col justify-between">
              <div className="space-y-2">
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className="text-sm sm:text-base"
                    style={{
                      color: line.startsWith("$")
                        ? "#A3D045"
                        : line.startsWith(">")
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(255,255,255,0.4)",
                      opacity: 1,
                      animation: "slideUpFade 0.3s ease both",
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Link to="/play" onClick={handlePlay}>
                  <button
                    className="relative px-10 py-4 rounded-lg font-bold text-base overflow-hidden"
                    style={{
                      background: "#A3D045",
                      color: "#0F1524",
                      animation: termVisible
                        ? "pulseGlow 3s ease-in-out infinite"
                        : "none",
                      transition:
                        "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.07)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 12px 40px rgba(163,208,69,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "none";
                    }}
                  >
                    {rippling && (
                      <span
                        className="absolute inset-0 rounded-lg"
                        style={{
                          animation: "rippleExpand 0.6s ease-out both",
                          background: "rgba(255,255,255,0.3)",
                        }}
                      />
                    )}
                    ▶ &nbsp;Play Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
