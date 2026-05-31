/**
 * SectionTitle.tsx
 *
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { ThemeColors } from "../../features/landing/domain/types";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  tag?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  colors: ThemeColors;
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  tag: Tag = "h2",
  align = "left",
  colors,
  className = "",
  delay = 0,
  immediate = false,
}: SectionTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [lineWidth, setLineWidth] = useState("0px");
  const [subVisible, setSubVisible] = useState(false);

  const [hovered, setHovered] = useState(false);

  const words = title.split(" ");
  const lastWordDelay = words.length * 80; // when last word finishes

  useEffect(() => {
    const fire = () => {
      if (revealed) return;
      setTimeout(() => {
        setRevealed(true);

        setTimeout(() => setLineWidth("180px"), lastWordDelay + 100);

        setTimeout(() => setSubVisible(true), lastWordDelay + 500);
      }, delay);
    };

    if (immediate) {
      fire();
      return;
    }

    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fire();
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, immediate, revealed, lastWordDelay]);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!isMobile) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHovered(entry.isIntersecting);
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`${align === "center" ? "text-center" : "text-left"} ${className} select-none`}
      style={{ cursor: "default" }}
    >
      <Tag
        className="font-bold tracking-tight leading-[1.1]"
        style={{
          color: colors.text,
          fontSize:
            Tag === "h1"
              ? "clamp(2.5rem, 6vw, 5rem)"
              : "clamp(2rem, 4vw, 3.5rem)",
          display: "flex",
          justifyContent: align === "center" ? "center" : "flex-start",
          flexWrap: "wrap",
          gap: "0 0.3em",
          transform: revealed && hovered ? "scale(1.015)" : "scale(1)",
          transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          transformOrigin: align === "center" ? "center center" : "left center",
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
              lineHeight: 1.15,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: revealed ? "translateY(0)" : "translateY(110%)",
                opacity: revealed ? 1 : 0,
                transition: revealed
                  ? `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms, opacity 0.4s ease ${i * 80}ms`
                  : "none",
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </Tag>

      <div
        style={{
          height: "3px",
          borderRadius: "2px",
          background: "#A3D045",
          marginTop: "10px",
          width: revealed ? (hovered ? "280px" : lineWidth) : "0px",
          margin: align === "center" ? "10px auto 0" : "10px 0 0",
          boxShadow:
            revealed && hovered
              ? "0 0 14px #A3D045, 0 0 24px rgba(163,208,69,0.6)"
              : "none",
          transition:
            "width 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease",
        }}
      />

      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed max-w-2xl ${align === "center" ? "mx-auto" : ""}`}
          style={{
            color: hovered ? colors.text : colors.textMuted,
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? "translateY(0)" : "translateY(10px)",
            transition:
              "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), color 0.3s ease",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
