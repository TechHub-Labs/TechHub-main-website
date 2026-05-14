/**
 * FOOTER SECTION
 * * Footer with links, branding, and newsletter signup. Adapts to light/dark themes.
 */

import { ThemeColors } from '../domain/types';

interface FooterProps {
  colors: ThemeColors;
}

const footerCols = [
  {
    title: "ECOSYSTEM",
    links: ["About Us", "Executive Council", "Partners", "Careers"],
  },
  {
    title: "PIPELINE",
    links: ["Projects", "Incubation", "Development", "Training"],
  },
  {
    title: "COMMUNITY",
    links: ["Members", "Talent Spotlight", "Events", "Play"],
  },
  {
    title: "RESOURCES",
    links: ["Blog", "Brand Assets", "FAQ", "Contact"],
  },
];

export function Footer({ colors }: FooterProps) {
  const isDark = colors.bg === '#0d1340' || colors.footerBg === '#ffffff';

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: colors.footerBg,
        borderTop: `1px solid ${colors.divider}`,
      }}
    >

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-[99px]">
        <div className="max-w-7xl mx-auto">
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 mb-16 sm:mb-20">
            {/* Brand Column (Spans 2 columns on large screens to give space) */}
            <div className="lg:col-span-2">
              <h3
                className="font-bold text-2xl sm:text-3xl mb-3 tracking-tight"
                style={{ color: colors.text }}
              >
                NH TechHub
              </h3>
              <p
                className="text-base sm:text-lg leading-relaxed pr-8 font-medium"
                style={{ color: colors.textSubtle }}
              >
                Africa's strongest student<br />tech ecosystem.
              </p>
            </div>

            {/* Link Columns */}
            {footerCols.map((col) => (
              <div key={col.title}>
                <h4
                  className="text-sm font-semibold tracking-wide mb-5"
                  style={{ color: colors.textSubtle }}
                >
                  {col.title}
                </h4>
                <ul className="space-y-3.5">
                  {col.links.map((link) => (
                    <li
                      key={link}
                      className="text-sm sm:text-base cursor-pointer transition-opacity hover:opacity-70 font-medium"
                      style={{ color: colors.text }}
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div
            className="border-t pt-8 flex flex-col-reverse md:flex-row md:justify-between md:items-end gap-8"
            style={{ borderColor: colors.divider }}
          >
            {/* Copyright */}
            <p
              className="text-sm font-medium"
              style={{ color: colors.textSubtle }}
            >
              © 2026 NH TechHub. All Rights Reserved.
            </p>

            {/* Social & Newsletter */}
            <div className="flex flex-col items-start md:items-end gap-5">
              
              {/* Social Icons (SVG) */}
              <div className="flex items-center gap-4" style={{ color: colors.text }}>
                {/* Instagram */}
                <a href="#" className="hover:opacity-70 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" className="hover:opacity-70 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                {/* TikTok (Custom Path) */}
                <a href="#" className="hover:opacity-70 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                {/* X / Twitter */}
                <a href="#" className="hover:opacity-70 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>

              {/* Newsletter Input & Button */}
              <div className="flex gap-3 w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:w-64 px-4 py-2.5 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#3B5BDB] transition-all"
                  style={{
                    background: isDark ? "#EEF2FF" : "#F4F5FA",
                    color: "#0F1524",
                  }}
                />
                <button
                  className="px-6 py-2.5 rounded-lg font-semibold text-sm transition-transform hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                  style={{
                    background: isDark ? "#1E3A8A" : "#0F1524", 
                    color: "#FFFFFF",
                  }}
                >
                  Subscribe
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}