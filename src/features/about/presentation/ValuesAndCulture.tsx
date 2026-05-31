/**
 * ValuesAndCulture.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { ThemeColors } from "../../landing/domain/types";
import { SectionTitle } from "../../../shared/components/SectionTitle";

const pillars = [
  { num: "01", label: "Build" },
  { num: "02", label: "Collab" },
  { num: "03", label: "Learn" },
  { num: "04", label: "Launch" },
];

const encourages = [
  "Experimentation",
  "Collaboration",
  "Leadership",
  "Shipping Ideas",
  "Learning Publicly",
];

export function ValuesAndCulture({
  colors,
  dark,
}: {
  colors: ThemeColors;
  dark: boolean;
}) {
  const isDark = dark;
  const imgBg = isDark ? "#1e2870" : "#e8ecf8";
  const quoteBorderColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(13,19,64,0.08)";

  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [pillarsVisible, setPillarsVisible] = useState<boolean[]>(
    new Array(pillars.length).fill(false),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          pillars.forEach((_, i) => {
            setTimeout(
              () => {
                setPillarsVisible((prev) => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              },
              100 + i * 120,
            );
          });
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-15 -mx-4 lg:-mx-[99px]">
      <div className="px-4 lg:px-[99px]">
        <div
          className="mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <SectionTitle
            title="What is TechHub's Foundation"
            subtitle="These are our non-negotiables. We don't just gather to network; we operate under a strict philosophy of execution to ensure every idea has a path to deployment."
            colors={colors}
          />
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-4 mb-20 border rounded-sm overflow-hidden"
          style={{
            borderColor: colors.divider,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.2s",
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={i}
              className={`py-6 px-5 sm:px-7 flex flex-col items-center sm:items-center gap-1 cursor-default sm:${i < pillars.length - 1 && i < pillars.length + 1 ? "border-r-2" : ""}`}
              style={{
                borderColor: colors.text,
                opacity: pillarsVisible[i] ? 1 : 0,
                transform: pillarsVisible[i]
                  ? "scale(1) translateY(0)"
                  : "scale(0.7) translateY(20px)",
                transition:
                  "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <span
                className="text-2xl font-medium tracking-widest"
                style={{ color: colors.text }}
              >
                {p.num}
              </span>
              <span
                className="text-2xl sm:text-4xl font-medium"
                style={{ color: colors.text }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>

        <div
          className="mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}
        >
          <SectionTitle
            title="A Culture Built Around Builders"
            subtitle="TechHub is designed for people who love creating things."
            colors={colors}
          />
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.4s",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-md transition-transform duration-300 hover:scale-[1.03]"
              style={{ background: imgBg }}
            />
          ))}
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 sm:col-span-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-md transition-transform duration-300 hover:scale-[1.03]"
                style={{ background: imgBg }}
              />
            ))}
          </div>

          <div
            className="rounded-md h-48 sm:h-full transition-transform duration-300 hover:scale-[1.01]"
            style={{ background: imgBg }}
          />

          <div className="p-5 sm:p-6 rounded-md flex flex-col justify-between">
            <div>
              <p
                className="text-base sm:text-xl font-semibold mb-3 underline decoration-[#A3D045] underline-offset-8 decoration-2"
                style={{ color: colors.text }}
              >
                Our environment encourages
              </p>
              <ul className="space-y-2">
                {encourages.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm sm:text-lg"
                    style={{ color: colors.textMuted }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="mt-5 p-3 sm:p-4 rounded border text-base sm:text-xl italic leading-relaxed font-medium"
              style={{
                borderColor: quoteBorderColor,
                color: colors.text,
              }}
            >
              "The fastest way to grow is to build with other ambitious people"
            </div>
          </div>
        </div>

        <div
          className="px-4 lg:px-[99px] py-12 sm:py-16 -mx-4 lg:-mx-[99px]"
          style={{
            background: "#0F1B4D",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s",
          }}
        >
          <SectionTitle
            title="Leadership Through Execution."
            colors={{ ...colors, text: "#ffffff" }}
            tag="h2"
            align="left"
            className="mb-6"
          />
          <p className="text-base sm:text-2xl text-white leading-relaxed">
            At TechHub, leadership isn't a status it's a responsibility. We are
            built entirely on ownership and collaboration, expecting every
            member to take the initiative, lead projects, mentor others, and
            create new opportunities. Whether you are a developer, designer,
            strategist, or just someone curious about building, there is room
            for you here.
          </p>
        </div>
      </div>
    </section>
  );
}
