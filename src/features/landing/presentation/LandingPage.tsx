/**
 * LANDING PAGE
 * 
 * Main landing page component that combines all sections.
 * Manages theme state and renders each section with appropriate props.
 */

import { useEffect } from 'react';
import { useTheme } from '../domain/useTheme';
import { Navigation } from './Navigation';
import { HeroSection } from './Hero';
import { ProjectsSection } from './ProjectsSection';
import { MembersSection } from './MembersSection';
import { TerminalSection } from './TerminalSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

export function LandingPage() {
  const { dark, setDark, colors } = useTheme();

  // Update document background for smooth theme transitions
  useEffect(() => {
    document.documentElement.style.background = colors.bg;
    document.documentElement.style.color = colors.text;
    document.documentElement.style.transition = 'background 0.3s, color 0.3s';
  }, [colors]);

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        transition: 'background 0.3s, color 0.3s',
        minHeight: '100vh',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${colors.bg};
        }
        ::-webkit-scrollbar-thumb {
          background: ${colors.bgCard};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${colors.accent};
        }
      `}</style>

      {/* Navigation */}
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />

      {/* Main Content */}
      <main className="px-6 lg:px-[99px]">
        <HeroSection colors={colors} />
        <ProjectsSection colors={colors} />
        <MembersSection colors={colors} />
        <TerminalSection colors={colors} />
        <CTASection dark={dark} />
      </main>

      {/* Footer */}
      <Footer colors={colors} />
    </div>
  );
}
