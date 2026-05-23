/**
 * PageShell — Universal page scaffold
 * ─────────────────────────────────────
 * Wraps every page with WebsiteBackground + Navigation + Footer.
 * Eliminates the 8 identical page layouts.
 *
 * Usage:
 *   <PageShell>
 *     <main className="flex-1 w-full">
 *       <PageMargin>...</PageMargin>
 *     </main>
 *   </PageShell>
 */

import { useEffect, ReactNode } from 'react';
import { useTheme } from '../../features/landing/domain/useTheme';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { WebsiteBackground } from './WebsiteBackground';

interface PageShellProps {
  children: ReactNode;
  /** If provided, scroll to top when this value changes */
  scrollKey?: string | number;
}

export function PageShell({ children, scrollKey }: PageShellProps) {
  const { dark, setDark, colors } = useTheme();

  useEffect(() => {
    document.documentElement.style.color = colors.text;
    document.documentElement.style.transition = 'color 0.3s';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [colors, scrollKey]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />
      <div className="flex-1 w-full">
        {typeof children === 'function' ? (children as (c: typeof colors, d: boolean) => ReactNode)(colors, dark) : children}
      </div>
      <Footer colors={colors} />
    </div>
  );
}

/**
 * usePageColors — Lightweight hook for pages that don't use PageShell
 * but still need colors + theme toggle.
 */
export { useTheme };
