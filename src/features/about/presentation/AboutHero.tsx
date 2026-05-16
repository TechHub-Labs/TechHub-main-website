/**
 * ABOUT US HERO SECTION
 * * Main hero banner for the About page featuring a 2x2 stat grid.
 */

import { ThemeColors } from '../../landing/domain/types';

export function AboutHero({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === '#0d1340';
  
  // Specific card colors meticulously matching the design mockups
  const boxBg1 = isDark ? '#1b3233' : '#eaf2e8'; // Sage green
  const boxBg2 = isDark ? '#1a2160' : '#ffffff'; // White
  const boxBg3 = isDark ? '#161d52' : '#f8f9fe'; // Very light grey/blue
  const boxBg4 = isDark ? '#1e2870' : '#eef2fc'; // Pale blue

  return (
    <section className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left - Headline & Subtext */}
          <div className="max-w-xl">
            <h1 
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight mb-6 leading-[1.05]"
              style={{ color: colors.text }}
            >
              Builders Need<br />
              an Actual<br />
              Ecosystem.
            </h1>
            <p 
              className="text-base sm:text-lg leading-relaxed font-medium" 
              style={{ color: colors.textMuted }}
            >
              A place to grow beyond tutorials. A playground for real-world projects, team dynamics, and raw experience. Because the best way to learn is by doing it for real.
            </p>
          </div>

          {/* Right - 2x2 Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 h-[360px] sm:h-[420px]">
            
            {/* Card 1: 1.5M */}
            <div 
              className="p-6 sm:p-8 rounded-sm flex flex-col justify-center shadow-sm transition-transform hover:scale-[1.02] cursor-default" 
              style={{ background: boxBg1 }}
            >
              <h3 className="text-4xl sm:text-5xl font-black mb-1 tracking-tight" style={{ color: colors.text }}>
                1.5M
              </h3>
              <p className="text-sm sm:text-base font-medium" style={{ color: colors.text }}>
                Lines of code
              </p>
            </div>

            {/* Card 2: 11+ */}
            <div 
              className="p-6 sm:p-8 rounded-sm flex flex-col justify-center shadow-sm transition-transform hover:scale-[1.02] cursor-default" 
              style={{ background: boxBg2 }}
            >
              <h3 className="text-4xl sm:text-5xl font-black mb-1 tracking-tight" style={{ color: colors.text }}>
                11+
              </h3>
              <p className="text-sm sm:text-base font-medium" style={{ color: colors.text }}>
                Active repos
              </p>
            </div>

            {/* Card 3: 400+ */}
            <div 
              className="p-6 sm:p-8 rounded-sm flex flex-col justify-center shadow-sm transition-transform hover:scale-[1.02] cursor-default" 
              style={{ background: boxBg3 }}
            >
              <h3 className="text-4xl sm:text-5xl font-black mb-1 tracking-tight" style={{ color: colors.text }}>
                400+
              </h3>
              <p className="text-sm sm:text-base font-medium" style={{ color: colors.text }}>
                PRs merged
              </p>
            </div>

            {/* Card 4: 90% */}
            <div 
              className="p-6 sm:p-8 rounded-sm flex flex-col justify-center shadow-sm transition-transform hover:scale-[1.02] cursor-default" 
              style={{ background: boxBg4 }}
            >
              <h3 className="text-4xl sm:text-5xl font-black mb-1 tracking-tight" style={{ color: colors.text }}>
                90%
              </h3>
              <p className="text-sm sm:text-base font-medium" style={{ color: colors.text }}>
                Deployment rate
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}