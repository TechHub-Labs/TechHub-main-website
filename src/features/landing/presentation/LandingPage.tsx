/**
 * LandingPage.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useState } from "react";
import { useTheme } from "../domain/useTheme";
import { HeroSection } from "./Hero";
import { ProjectsSection } from "./ProjectsSection";
import { MembersSection } from "./MembersSection";
import { TerminalSection } from "./TerminalSection";

import { Navigation } from "../../../shared/components/Navigation";
import { Footer } from "../../../shared/components/Footer";
import { CTASection } from "../../../shared/components/CTASection";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";

export function LandingPage() {
  const { dark, setDark, colors } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.style.color = colors.text;
    document.documentElement.style.transition = "color 0.3s";
  }, [colors]);

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: colors.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: `3px solid ${colors.divider}`,
              borderTopColor: colors.accent,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        <WebsiteBackground isDark={dark} bgColor={colors.bg} />

      <Navigation
        colors={colors}
        dark={dark}
        onThemeToggle={() => setDark(!dark)}
      />

      <main className="flex-1 w-full">
        <PageMargin>
          <HeroSection
            colors={colors}
            dark={dark}
            onLoaded={() => setLoading(false)}
          />
          <ProjectsSection colors={colors} />
          <MembersSection colors={colors} />
          <TerminalSection colors={colors} />
          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>

      <Footer colors={colors} />
      </div>
    </>
  );
}
