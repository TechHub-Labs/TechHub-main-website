/**
 * FOOTER SECTION
 * 
 * Footer with links, branding, and social icons. Adapts to light/dark themes.
 */

import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { ThemeColors } from '../../features/landing/domain/types';

interface FooterProps {
  colors: ThemeColors;
}

const footerCols = [
  {
    title: "ECOSYSTEM",
    links: ["About Us", "Executive Council", "Partners"],
  },
  {
    title: "PIPELINE",
    links: ["Projects", "Play"],
  },
  {
    title: "COMMUNITY",
    links: ["Members", "Contact"],
  },
];

export function Footer({ colors }: FooterProps) {
  return (
    <footer
      className="relative overflow-hidden"
    >
      <div className="relative z-10 px-4 sm:px-6 lg:px-[99px] py-16 sm:py-20 lg:pt-[99px] lg:pb-[40px]">
        <div className="max-w-7xl mx-auto">
          
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20 lg:mb-32">
            
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <h3
                className="font-bold text-2xl sm:text-5xl mb-3 tracking-tight"
                style={{ color: colors.text }}
              >
                NH TechHub
              </h3>
              <p
                className="text-lg sm:text-xl leading-relaxed font-medium pr-8"
                style={{ color: colors.textSubtle }}
              >
                Africa's strongest student<br className="hidden sm:block" />
                tech ecosystem.
              </p>
            </div>

            {/* Link Columns */}
            {footerCols.map((col) => (
              <div key={col.title}>
                <h4
                  className="text-lg font-semibold tracking-widest mb-5 uppercase"
                  style={{ color: colors.textSubtle }}
                >
                  {col.title}
                </h4>
                <ul className="space-y-3.5">
                  {col.links.map((link) => (
                        <li key={link}>
                          <Link
                            to={
                              link === 'About Us' ? '/about' :
                              link === 'Executive Council' ? '/executives' :
                              link === 'Partners' ? '/partners' :
                              link === 'Projects' ? '/projects' :
                              link === 'Play' ? '/play' :
                              link === 'Members' ? '/members' :
                              link === 'Contact' ? '/contact' : '#'
                            }
                            className="text-lg fun-cursor transition-opacity hover:opacity-70 font-medium"
                            style={{ color: colors.text }}
                          >
                            {link}
                          </Link>
                        </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-end gap-8">
            
            {/* Copyright */}
            <p className="text-[18px] font-medium" style={{ color: colors.textSubtle }}>
              © {new Date().getFullYear()} NH TechHub. All Rights Reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-5" style={{ color: colors.text }}>
              {/* Instagram */}
              <a href="https://instagram.com/nhtechhub" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
                <InstagramLogoIcon width={22} height={22} />
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com/company/nhtechhub" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
                <LinkedInLogoIcon width={22} height={22} />
              </a>
              {/* TikTok */}
              <a href="https://nhtechhub.org" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://twitter.com/nhtechhub" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
                <TwitterLogoIcon width={20} height={20} />
              </a>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}