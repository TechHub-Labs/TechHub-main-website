import { ThemeColors } from '../../landing/domain/types';

export function AboutHero({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === '#0d1340';
  const boxBg1 = isDark ? '#1b3233' : '#eaf2e8';
  const boxBg2 = isDark ? '#1e2870' : '#eef2fc';

  return (
    <section className="px-6 lg:px-8 py-20 lg:py-28 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            Builders Need<br />
            an Actual<br />
            Ecosystem.
          </h1>
          <p className="text-lg leading-relaxed font-medium max-w-md" style={{ color: colors.textMuted }}>
            A place to grow beyond tutorials. A playground for real-world projects, team dynamics, and raw experience. Because the best way to learn is by doing it for real.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 sm:p-8 rounded-lg flex flex-col justify-center h-40" style={{ background: boxBg1 }}>
            <h3 className="text-3xl font-bold mb-1">1.5M</h3>
            <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>Lines of Code</p>
          </div>
          <div className="p-6 sm:p-8 rounded-lg flex flex-col justify-center h-40" style={{ background: boxBg2 }}>
            <h3 className="text-3xl font-bold mb-1">11+</h3>
            <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>Active Repos</p>
          </div>
          <div className="p-6 sm:p-8 rounded-lg flex flex-col justify-center h-40" style={{ background: boxBg2 }}>
            <h3 className="text-3xl font-bold mb-1">400+</h3>
            <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>PRs Merged</p>
          </div>
          <div className="p-6 sm:p-8 rounded-lg flex flex-col justify-center h-40" style={{ background: boxBg2 }}>
            <h3 className="text-3xl font-bold mb-1">90%</h3>
            <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>Deployment Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}