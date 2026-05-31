/**
 * TheSolution.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { ThemeColors } from "../../landing/domain/types";
import { SectionTitle } from "../../../shared/components/SectionTitle";

const items = [
  {
    title: "Projects were started.",
    desc: "We stopped watching tutorials and started initializing repositories. Real-world problems became our primary curriculum.",
  },
  {
    title: "Teams were formed",
    desc: "Building alone has a ceiling. We structured specialized squads to ensure every project had the engineering and design depth it deserved.",
  },
  {
    title: "Designers met developers.",
    desc: "We bridged the gap between high-fidelity visions and production-ready code, creating a seamless pipeline for execution.",
  },
  {
    title: "Ideas became products",
    desc: "Intentions were converted into shipped solutions. We moved beyond the planning phase and started pushing to live environments.",
  },
];

export function TheSolution({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === "#0d1340";
  const imgBg = isDark ? "#1e2870" : "#e8ecf5";

  const sectionRef = useRef<HTMLElement>(null);
  const [rowsVisible, setRowsVisible] = useState<boolean[]>(
    new Array(items.length).fill(false),
  );
  const [taglineVisible, setTaglineVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((_, i) => {
            setTimeout(
              () => {
                setRowsVisible((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              },
              300 + i * 200,
            );
          });
          setTimeout(
            () => setTaglineVisible(true),
            300 + items.length * 200 + 200,
          );
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 -mx-4 lg:-mx-[99px]">
      <div className="px-4 lg:px-[99px]">
        <div className="mb-14">
          <SectionTitle
            title="So a Few Builders Decided to Change That."
            subtitle="TechHub started with a small group of students who believed learning should go beyond classrooms and tutorials. Instead of waiting for opportunities, they began creating them."
            colors={colors}
          />
        </div>

        <div className="space-y-10 sm:space-y-12 mb-16 justify-center">
          {items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 sm:gap-52 items-center"
              style={{
                opacity: rowsVisible[i] ? 1 : 0,
                transform: rowsVisible[i]
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: "opacity 0.55s ease, transform 0.55s ease",
              }}
            >
              <div className="flex-1">
                <h4
                  className="text-xl sm:text-3xl font-medium mb-2 leading-snug"
                  style={{ color: colors.text }}
                >
                  {item.title}
                </h4>
                <p
                  className="text-base sm:text-xl leading-relaxed"
                  style={{ color: colors.textMuted }}
                >
                  {item.desc}
                </p>
              </div>

              <div
                className="w-full sm:w-[300px] h-[300px] shrink-0 rounded"
                style={{
                  background: imgBg,
                  transform: rowsVisible[i] ? "scale(1)" : "scale(0.96)",
                  transition: "transform 0.5s ease 0.1s, opacity 0.55s ease",
                  opacity: rowsVisible[i] ? 1 : 0,
                }}
              />
            </div>
          ))}
        </div>

        <p
          className="text-left text-base sm:text-xl font-medium"
          style={{
            color: colors.textMuted,
            opacity: taglineVisible ? 1 : 0,
            transform: taglineVisible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          Slowly, a culture began to form; A culture of builders.
        </p>
      </div>
    </section>
  );
}
