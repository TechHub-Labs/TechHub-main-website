/**
 * NAVIGATION HEADER
 *
 * Sticky navigation bar with brand, links, and CTA button.
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Add this import
import { ThemeColors } from "../domain/types";

interface NavigationProps {
  colors: ThemeColors;
  dark: boolean;
  onThemeToggle: () => void;
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Members", path: "/#members" },
  { name: "Projects", path: "/#projects" },
  { name: "Executive Council", path: "/#council" },
  { name: "Play", path: "/#play" },
];

export function Navigation({ colors, dark, onThemeToggle }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation(); // Initialize useLocation here

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight"
              style={{ color: colors.text }}
            >
              NH TechHub
            </Link>

            <div className="hidden md:flex gap-6 lg:gap-8 items-center">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <div key={link.name} className="relative">
                    <Link
                      to={link.path}
                      className="text-[15px] font-medium transition-opacity hover:opacity-70"
                      style={{ color: colors.text }}
                      onMouseEnter={() => setHoveredLink(link.name)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.name}
                    </Link>
                    {isActive && (
                      <div
                        className="absolute left-0 right-0 h-0.5 mt-1"
                        style={{ background: "#A3D045" }}
                      />
                    )}
                    {!isActive && hoveredLink === link.name && (
                      <div
                        className="absolute left-0 right-0 h-0.5 mt-1 animate-pulse"
                        style={{ background: colors.textSubtle }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 items-center">
              <button
                onClick={onThemeToggle}
                className="px-3 py-1.5 rounded-full border text-sm transition-all hover:scale-105"
                style={{
                  borderColor: colors.textSubtle,
                  color: colors.textSubtle,
                }}
              >
                {dark ? "☀" : "☾"}
              </button>
              <button
                className="hidden sm:block px-6 py-2.5 rounded font-bold text-sm transition-transform hover:scale-[1.02]"
                style={{ background: "#A3D045", color: "#0F1524" }}
              >
                Join Us
              </button>
            </div>
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
                  key={link.name}
                  className="text-sm font-light cursor-pointer transition-opacity hover:opacity-70 block py-2"
                  style={{
                    color: colors.text,
                  }}
                >
                  {link.name}
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