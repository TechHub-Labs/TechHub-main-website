/**
 * CALL-TO-ACTION SECTION
 * * Final section encouraging users to join. Features an inverted card design 
 * and a subtle circuit board pattern at the bottom.
 */

import { ThemeColors } from '../../features/landing/domain/types';
import { ThemeButton } from './ThemeButton';

interface CTASectionProps {
  dark: boolean;
  colors: ThemeColors;
}

export function CTASection({ dark, colors }: CTASectionProps) {
  const cardBg = dark ? '#ffffff' : '#1e2870';
  const textColor = dark ? '#0d1340' : '#ffffff';
  const textMuted = dark ? 'rgba(13,19,64,0.7)' : 'rgba(255,255,255,0.7)';

  return (
    <section className="relative py-40 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div 
          className="rounded-2xl relative overflow-hidden px-6 py-16 sm:py-24 text-center shadow-xl transition-colors duration-300"
          style={{ background: cardBg }}
        >
          <div 
            className="absolute bottom-0 left-0 w-full h-32 sm:h-40 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url('/images/CTAsection.svg')`,
              backgroundSize: 'none',
              backgroundPosition: 'bottom center',
              backgroundRepeat: 'no-repeat'
            }}
          />

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
              {/* Modular buttons using ThemeButton */}
              <ThemeButton
                variant="primary"
                colors={colors}
                isDark={dark}
              >
                Join TechHub
              </ThemeButton>
              <ThemeButton
                variant="secondary"
                colors={colors}
                isDark={dark}
                style={{ color: textColor }} // keeps contrast on inverted card background
              >
                Partner With Us
              </ThemeButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}