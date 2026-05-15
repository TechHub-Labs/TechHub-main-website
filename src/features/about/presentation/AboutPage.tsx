import { useEffect } from 'react';
import { useTheme } from '../../landing/domain/useTheme';
import { Navigation } from '../../landing/presentation/Navigation';
import { Footer } from '../../landing/presentation/Footer';
import { CTASection } from '../../landing/presentation/CTASection';
import { AboutHero } from './AboutHero';
import { TheProblem } from './TheProblem';
import { TheSolution } from './TheSolution';
import { Trajectory } from './Trajectory';
import { ValuesAndCulture } from './ValuesAndCulture';

export function AboutPage() {
  const { dark, setDark, colors } = useTheme();

  useEffect(() => {
    document.documentElement.style.background = colors.bg;
    document.documentElement.style.color = colors.text;
    window.scrollTo(0, 0);
  }, [colors]);

  return (
    <div style={{ background: colors.bg, color: colors.text, transition: 'all 0.3s' }}>
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />
      
      <main>
        <AboutHero colors={colors} />
        <TheProblem colors={colors} />
        <TheSolution colors={colors} />
        <Trajectory colors={colors} />
        <ValuesAndCulture colors={colors} dark={dark} />
        <CTASection dark={dark} />
      </main>

      <Footer colors={colors} />
    </div>
  );
}