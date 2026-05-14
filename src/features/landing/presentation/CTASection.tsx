/**
 * CALL-TO-ACTION SECTION
 * * Final section encouraging users to join. Features an inverted card design 
 * and a subtle circuit board pattern at the bottom.
 */

import { ThemeColors } from '../domain/types';

interface CTASectionProps {
  colors: ThemeColors;
  dark: boolean; // Refers to the global page theme
}

export function CTASection({ colors, dark }: CTASectionProps) {
  const cardBg = dark ? '#ffffff' : '#1e2870';
  const textColor = dark ? '#0d1340' : '#ffffff';
  const textMuted = dark ? 'rgba(13,19,64,0.7)' : 'rgba(255,255,255,0.7)';
  
  const btnPrimaryBg = dark ? '#1e2870' : '#ffffff';
  const btnPrimaryText = dark ? '#ffffff' : '#1e2870';
  const btnSecondaryBorder = dark ? 'rgba(13,19,64,0.4)' : 'rgba(255,255,255,0.4)';

  return (
    <section className="relative py-40 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div 
          className="rounded-2xl relative overflow-hidden px-6 py-16 sm:py-24 text-center shadow-xl transition-colors duration-300"
          style={{ background: cardBg }}
        >
          {/* Circuit Board Pattern Overlay (Bottom) */}
          <div 
            className="absolute bottom-0 left-0 w-full h-24 sm:h-32 opacity-[0.07] pointer-events-none"
            style={{ color: textColor }}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit-pattern" x="0" y="0" width="160" height="80" patternUnits="userSpaceOnUse">
                  {/* Connectors & Nodes */}
                  <path d="M0,40 H30 V20 H60 V60 H100 V30 H130 V50 H160" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  <path d="M30,40 V60 H15" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  <path d="M100,30 V10 H115" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  <circle cx="30" cy="40" r="4" fill="currentColor" />
                  <circle cx="60" cy="20" r="4.5" fill="transparent" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="100" cy="60" r="4" fill="currentColor" />
                  <circle cx="130" cy="30" r="4.5" fill="transparent" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="15" cy="60" r="3" fill="currentColor" />
                  <circle cx="115" cy="10" r="3" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight"
              style={{ color: textColor }}
            >
              Ready to build<br />Something real?
            </h2>

            <p
              className="text-base sm:text-lg mb-10 font-medium max-w-xl"
              style={{ color: textMuted }}
            >
              Your pipeline from the very first commit to final launch.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="w-full sm:w-auto px-8 py-3.5 rounded font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-sm text-sm sm:text-base"
                style={{
                  background: btnPrimaryBg,
                  color: btnPrimaryText,
                }}
              >
                Join TechHub
              </button>
              <button
                className="w-full sm:w-auto px-8 py-3.5 rounded font-bold transition-transform hover:scale-[1.02] active:scale-95 text-sm sm:text-base border-2"
                style={{
                  background: 'transparent',
                  color: textColor,
                  borderColor: btnSecondaryBorder,
                }}
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}