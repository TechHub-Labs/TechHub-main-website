/**
 * AboutPage.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect } from "react";
import { useTheme } from "../../landing/domain/useTheme";
import { AboutHero } from "./AboutHero";
import { TheProblem } from "./TheProblem";
import { TheSolution } from "./TheSolution";
import { Trajectory } from "./Trajectory";
import { MoreThanCommunity } from "./MoreThanCommunity";
import { ValuesAndCulture } from "./ValuesAndCulture";

import { Navigation } from "../../../shared/components/Navigation";
import { Footer } from "../../../shared/components/Footer";
import { CTASection } from "../../../shared/components/CTASection";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";

export function AboutPage() {
  const { dark, setDark, colors } = useTheme();

  useEffect(() => {
    document.documentElement.style.color = colors.text;
    window.scrollTo(0, 0);
  }, [colors]);

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

      <main className="flex-1 w-full">
        <PageMargin>
          <AboutHero colors={colors} />
          <TheProblem colors={colors} />
          <TheSolution colors={colors} />
          <Trajectory colors={colors} />
          <MoreThanCommunity colors={colors} />
          <ValuesAndCulture colors={colors} dark={dark} />
          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>

      <Footer colors={colors} />
    </div>
  );
}
