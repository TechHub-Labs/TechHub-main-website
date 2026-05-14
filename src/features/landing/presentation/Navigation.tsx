/**
 * NAVIGATION HEADER
 *
 * Sticky navigation bar with brand, links, and CTA button.
 */

import { useState } from "react";
import { ThemeColors } from "../domain/types";

interface NavigationProps {
  colors: ThemeColors;
  dark: boolean;
  onThemeToggle: () => void;
}

const navLinks = [
  "Home",
  "About",
  "Members",
  "Projects",
  "Executive Council",
  "Play",
];

export function Navigation({ colors, dark, onThemeToggle }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <nav
      style={{
        background: colors.nav,
        borderBottom: `1px solid ${colors.navBorder}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <span
            className="text-3xl font-bold tracking-tight whitespace-nowrap"
            style={{ color: colors.text }}
          >
            NH TechHub
          </span>

          {/* Nav Links - Hidden on mobile */}
          <div className="hidden md:flex gap-6 lg:gap-8 items-center">
            {navLinks.map((link) => (
              <div key={link} className="relative">
                <span
                  className="text-lg font-light cursor-pointer transition-opacity hover:opacity-70"
                  style={{
                    color: colors.text,
                  }}
                  onMouseEnter={() => setHoveredLink(link)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {link}
                </span>
                {link === "Home" && (
                  <div
                    className="absolute left-0 right-0 h-1 mt-1"
                    style={{
                      background: colors.btnPrimary,
                    }}
                  />
                )}
                {link !== "Home" && (
                  <div
                    className="absolute left-0 right-0 h-1 mt-1"
                    style={{
                      background: colors.btnPrimary,
                      animation: hoveredLink === link 
                        ? 'slideInFromLeft 0.3s ease-out forwards' 
                        : 'slideOutToLeft 0.3s ease-out forwards',
                      opacity: hoveredLink === link ? 1 : 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex gap-2 sm:gap-3 items-center">
            <button
              onClick={onThemeToggle}
              className="px-3 sm:px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all hover:scale-105"
              style={{
                borderColor: colors.textMuted,
                color: colors.textMuted,
              }}
            >
              {dark ? "☀" : "☾"}
            </button>
            <button
              className="hidden sm:block px-8 py-3 rounded text-base font-medium transition-all hover:opacity-90"
              style={{
                background: colors.btnPrimary,
                color: colors.btnPrimaryText,
              }}
            >
              Join Us
            </button>

            {/* Hamburger Menu - Visible on mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded"
              style={{ color: colors.text }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden pb-4 border-t"
            style={{ borderColor: colors.navBorder }}
          >
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <span
                  key={link}
                  className="text-sm font-light cursor-pointer transition-opacity hover:opacity-70 block py-2"
                  style={{
                    color: colors.text,
                  }}
                >
                  {link}
                </span>
              ))}
              <button
                className="w-full px-4 py-2 rounded text-sm font-medium transition-all hover:opacity-90 mt-2"
                style={{
                  background: colors.btnPrimary,
                  color: colors.btnPrimaryText,
                }}
              >
                Join Us
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
