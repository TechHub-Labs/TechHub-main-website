/**
 * NAVIGATION
 * ───────────────────────────────────────────────────────────────────────────
 * - Sticky top-0 with frosted-glass blur on scroll
 * - Slide-down mount animation
 * - Animated active-link underline
 * - Mobile menu with smooth height transition
 * - "Join Us" button with pulse-glow hover
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeColors } from '../../features/landing/domain/types';

interface NavigationProps {
  colors: ThemeColors;
  dark: boolean;
  onThemeToggle: () => void;
}

const navLinks = [
  { name: 'Home',              path: '/' },
  { name: 'About',             path: '/about' },
  { name: 'Members',           path: '/members' },
  { name: 'Projects',          path: '/projects' },
  { name: 'Executive Council', path: '/executives' },
  { name: 'Play',              path: '/play' },
];

export function Navigation({ colors, dark, onThemeToggle }: NavigationProps) {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [scrolled, setScrolled]       = useState(false);
  const [mounted, setMounted]         = useState(false);
  const mobileRef                     = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Slide-down mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Scroll listener for frosted-glass effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ─── Mobile menu height animation ─────────────────────────────────────────
  const mobileMenuHeight = mobileOpen
    ? mobileRef.current?.scrollHeight
    : 0;

  // Opaque navbar — always thick, no transparent bleed-through
  const navBg = dark
    ? scrolled ? 'rgba(13,19,64,0.97)' : colors.nav
    : scrolled ? 'rgba(255,255,255,0.97)' : colors.nav;

  const navBlur   = scrolled ? 'blur(12px) saturate(1.4)' : 'none';
  const navShadow = scrolled
    ? dark
      ? '0 2px 32px rgba(0,0,0,0.4)'
      : '0 2px 20px rgba(13,19,64,0.1)'
    : 'none';

  return (
    <nav
      style={{
        background: navBg,
        backdropFilter: navBlur,
        WebkitBackdropFilter: navBlur,
        borderBottom: `1px solid ${colors.navBorder}`,
        boxShadow: navShadow,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        // Slide-down entry
        transform: mounted ? 'translateY(0)' : 'translateY(-100%)',
        opacity: mounted ? 1 : 0,
        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease, background 0.3s ease, box-shadow 0.4s ease, backdrop-filter 0.3s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        {/* ── MAIN ROW ── */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 transition-transform duration-300 hover:scale-[1.04]"
          >
            <img src="/images/Logo.png" alt="NH TechHub Logo" className="h-14 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-7 items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <Link
                    to={link.path}
                    className="text-[15px] font-medium transition-opacity duration-200"
                    style={{
                      color: colors.text,
                      opacity: isActive ? 1 : 0.75,
                    }}
                  >
                    {link.name}
                  </Link>

                  {/* Animated underline */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      height: '2px',
                      borderRadius: '2px',
                      background: isActive ? '#A3D045' : colors.text,
                      width: isActive ? '100%' : hoveredLink === link.name ? '100%' : '0%',
                      transition: 'width 0.25s cubic-bezier(0.22,1,0.36,1), background 0.2s ease',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex gap-3 items-center">
            {/* Theme toggle */}
            <button
              onClick={onThemeToggle}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full border flex items-center justify-center text-sm transition-all duration-300 hover:scale-110 hover:rotate-12"
              style={{
                borderColor: colors.navBorder,
                color: colors.text,
                background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(13,19,64,0.04)',
              }}
            >
              {dark ? '☀' : '☾'}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg border transition-all duration-300 hover:scale-105"
              style={{ borderColor: colors.navBorder, color: colors.text, background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(13,19,64,0.04)' }}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen(v => !v)}
            >
              <span
                className="block w-4 h-[1.5px] rounded-full origin-center"
                style={{
                  background: colors.text,
                  transform: mobileOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
                  transition: 'transform 0.3s ease',
                }}
              />
              <span
                className="block w-4 h-[1.5px] rounded-full"
                style={{
                  background: colors.text,
                  opacity: mobileOpen ? 0 : 1,
                  transition: 'opacity 0.2s ease',
                }}
              />
              <span
                className="block w-4 h-[1.5px] rounded-full origin-center"
                style={{
                  background: colors.text,
                  transform: mobileOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                  transition: 'transform 0.3s ease',
                }}
              />
            </button>

            {/* CTA */}
            <button
              onClick={() => navigate('/join')}
              className="hidden sm:flex px-5 py-2 rounded font-bold text-sm items-center gap-1 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg active:scale-[0.97]"
              style={{
                background: '#A3D045',
                color: '#0F1524',
                boxShadow: '0 0 0 0 rgba(163,208,69,0.4)',
                animation: 'pulseGlow 3s ease-in-out infinite',
              }}
            >
              Join Us
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU (height-animated) ── */}
        <div
          ref={mobileRef}
          style={{
            height: mobileMenuHeight,
            overflow: 'hidden',
            transition: 'height 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div
            className="py-4 border-t flex flex-col gap-1"
            style={{ borderColor: colors.navBorder }}
          >
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center gap-3 px-2 py-3 rounded-lg text-base font-medium transition-all duration-200"
                  style={{
                    color: isActive ? '#A3D045' : colors.text,
                    background: isActive
                      ? dark ? 'rgba(163,208,69,0.08)' : 'rgba(163,208,69,0.1)'
                      : 'transparent',
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(-12px)',
                    transition: `opacity 0.3s ease ${i * 40}ms, transform 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 40}ms, background 0.2s ease`,
                  }}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A3D045] shrink-0" />
                  )}
                  {link.name}
                </Link>
              );
            })}

            <button
              onClick={() => navigate('/join')}
              className="mt-2 w-full py-3 rounded font-bold text-sm transition-all duration-200 hover:opacity-90"
              style={{
                background: '#A3D045',
                color: '#0F1524',
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 0.3s ease ${navLinks.length * 40}ms, transform 0.35s ease ${navLinks.length * 40}ms`,
              }}
            >
              Join Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}