import { useEffect } from 'react';
import { useTheme } from '../domain/useTheme';
import { HeroSection } from './Hero';
import { ProjectsSection } from './ProjectsSection';
import { MembersSection } from './MembersSection';
import { TerminalSection } from './TerminalSection';

// Shared Components
import { Navigation } from '../../../shared/components/Navigation';
import { Footer } from '../../../shared/components/Footer';
import { CTASection } from '../../../shared/components/CTASection';
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';
import { PageMargin } from '../../../shared/components/PageMargin';

export function LandingPage() {
  const { dark, setDark, colors } = useTheme();

  // Only handle the text color here now; WebsiteBackground handles the background completely
  useEffect(() => {
    document.documentElement.style.color = colors.text;
    document.documentElement.style.transition = 'color 0.3s';
  }, [colors]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Injects the global background color AND pattern safely */}
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />

      <main className="flex-1 w-full">
        <PageMargin>
          <HeroSection colors={colors} />
          <ProjectsSection colors={colors} />
          <MembersSection colors={colors} />
          <TerminalSection colors={colors} />
          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>

      <Footer colors={colors} />
    </div>
  );
}