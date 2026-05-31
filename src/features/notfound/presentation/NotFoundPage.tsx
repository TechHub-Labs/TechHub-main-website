/**
 * NotFoundPage.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../landing/domain/useTheme";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { Navigation } from "../../../shared/components/Navigation";

export function NotFoundPage() {
  const { dark, setDark, colors } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation
        colors={colors}
        dark={dark}
        onThemeToggle={() => setDark(!dark)}
      />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          ref={containerRef}
          style={{ textAlign: "center", maxWidth: "560px" }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontSize: "clamp(7rem, 20vw, 10rem)",
                fontWeight: 800,
                letterSpacing: "-4px",
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: `2px ${colors.text}`,
                display: "block",
                userSelect: "none",
              }}
            >
              404
            </span>

            <span
              style={{
                position: "absolute",
                inset: 0,
                fontSize: "clamp(7rem, 20vw, 10rem)",
                fontWeight: 800,
                letterSpacing: "-4px",
                lineHeight: 1,
                color: "#A3D045",
                clipPath: "inset(0 58% 0 32%)", // reveals only the middle "0"
                display: "block",
                userSelect: "none",
                animation: "pulse404 3s ease-in-out infinite",
              }}
            >
              404
            </span>
          </div>

          <div
            style={{
              height: "3px",
              width: "80px",
              background: "#A3D045",
              margin: "0 auto 24px",
              borderRadius: "2px",
            }}
          />

          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 700,
              color: colors.text,
              marginBottom: "12px",
              letterSpacing: "-0.5px",
            }}
          >
            Page not found.
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: colors.textMuted,
              lineHeight: 1.7,
              marginBottom: "36px",
            }}
          >
            The page you're looking for doesn't exist or has been moved.
            <br />
            Let's get you back on track.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 28px",
                borderRadius: "6px",
                background: "#A3D045",
                color: "#0f1d00",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1.03)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 8px 24px rgba(163,208,69,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >
              ← Back to Home
            </Link>
            <Link
              to="/members"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "12px 28px",
                borderRadius: "6px",
                border: `1px solid ${colors.divider}`,
                color: colors.text,
                fontWeight: 500,
                fontSize: "15px",
                textDecoration: "none",
                transition: "border-color 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "#A3D045";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  colors.divider;
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1)";
              }}
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse404 {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
