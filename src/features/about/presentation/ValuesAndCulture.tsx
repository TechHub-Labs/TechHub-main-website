import { ThemeColors } from '../../landing/domain/types';

export function ValuesAndCulture({ colors, dark }: { colors: ThemeColors, dark: boolean }) {
  const cardBg = dark ? '#1a2160' : '#ffffff';
  
  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Values Section */}
      <div className="mb-32">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">More Than a Community.</h2>
          <p className="text-lg max-w-3xl font-medium" style={{ color: colors.textMuted }}>
            We stand on a foundation of core values that dictate how we operate, how we collaborate, and how we measure success.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-24">
          {[
            { icon: "🤝", title: "The Builder Community", desc: "A space to connect, share ideas, and find co-founders for your next big project." },
            { icon: "🚀", title: "The Talent Ecosystem", desc: "Bridging the gap between student developers and industry opportunities." },
            { icon: "🌍", title: "Open Source & Impact", desc: "Contributing to open-source projects and building tools that serve our immediate environment." },
            { icon: "💡", title: "Continuous Learning", desc: "Fostering an environment of constant growth, mentorship, and peer-to-peer education." }
          ].map((val, i) => (
            <div key={i} className="p-8 rounded-xl text-center shadow-sm border border-transparent transition-colors hover:border-[#3B5BDB]" style={{ background: cardBg }}>
              <div className="text-3xl mb-4 text-[#3B5BDB]">{val.icon}</div>
              <h4 className="text-xl font-bold mb-3">{val.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>{val.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-10">What is TechHub's Foundation</h3>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 text-3xl sm:text-4xl font-bold" style={{ color: colors.textSubtle }}>
            <span className="hover:text-[#A3D045] transition-colors cursor-default">Build</span>
            <span className="hover:text-[#A3D045] transition-colors cursor-default">Collab</span>
            <span className="hover:text-[#A3D045] transition-colors cursor-default">Learn</span>
            <span className="hover:text-[#A3D045] transition-colors cursor-default">Launch</span>
          </div>
        </div>
      </div>

      {/* Culture & Leadership Block */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">A Culture Built Around Builders</h2>
        <p className="text-lg mb-12 font-medium" style={{ color: colors.textMuted }}>
          We believe that execution intention. We favor minimalist, functional design over decorative fluff, and we are always waiting for a valid Pull Request with no conflicts.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-32">
          <div className="md:col-span-2 h-80 rounded-xl" style={{ background: colors.memberBg }} />
          <div className="flex flex-col justify-center p-8 rounded-xl border" style={{ borderColor: colors.divider }}>
            <p className="text-xl font-bold italic leading-relaxed mb-6">
              "Learn from the best, execute with the rest."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full" style={{ background: colors.textSubtle }} />
              <div>
                <p className="font-bold text-sm">TechHub Community</p>
                <p className="text-xs" style={{ color: colors.textMuted }}>Est. 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leadership Block */}
        <div className="p-10 sm:p-16 rounded-2xl bg-[#0F1524] text-white text-center sm:text-left">
          <h2 className="text-3xl font-bold mb-4">Leadership Through Execution.</h2>
          <p className="text-base sm:text-lg leading-relaxed text-gray-300 max-w-4xl">
            At TechHub, leadership is defined by responsibility, not titles. Our Executive Council is composed of builders who actively drive projects, manage event operations, mentor members, and push the community forward. We lead by doing, ensuring every initiative creates tangible financial and educational value.
          </p>
        </div>
      </div>
    </section>
  );
}