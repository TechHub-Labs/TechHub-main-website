/**
 * ProjectActiveBuilders — Grid of active builders shown on the project details page.
 */

import { useTheme } from '../../../landing/domain/useTheme';
import { DEMO_PROJECT_BUILDERS as builders } from '../../../../core/data/demoData';

interface ProjectActiveBuildersProps {
  colors: ReturnType<typeof useTheme>['colors'];
  dark: boolean;
  mounted: boolean;
}

export function ProjectActiveBuilders({ colors, dark, mounted }: ProjectActiveBuildersProps) {
  return (
    <div className="mt-28">
      <h2
        className="text-5xl lg:text-6xl font-bold mb-14 tracking-tight"
        style={{ color: colors.text }}
      >
        Active Builders
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {builders.map((builder, i) => (
          <div
            key={builder.name + i}
            className={`rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{
              transitionDelay: `${i * 120}ms`,
              background: colors.bgCard,
              borderColor: colors.divider,
            }}
          >
            {/* Avatar image placeholder */}
            <div
              className="h-[260px] transition-transform duration-500 group-hover:scale-105"
              style={{ background: dark ? '#1f2768' : '#EEF0F8' }}
            />

            <div className="p-7 text-center">
              <h3 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: colors.text }}>
                {builder.name}
              </h3>
              <p className="text-base mb-5" style={{ color: colors.textMuted }}>{builder.role}</p>
              <p className="italic text-base" style={{ color: colors.textSubtle }}>{builder.quote}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
