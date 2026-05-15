import { ThemeColors } from '../../landing/domain/types';

export function Trajectory({ colors }: { colors: ThemeColors }) {
  const isDark = colors.bg === '#0d1340';
  const lineColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const timeline = [
    {
      year: "2024",
      title: "The Genesis",
      desc: "What started as organizing community events and leadership roles at Babcock University quickly revealed a larger gap: students needed a place to actually build."
    },
    {
      year: "March 2026",
      title: "ORBIT 1.0",
      desc: "Our flagship 3-day tech summit and industrial field trip. It brought the community together, finalizing our transition from a small circle to a recognized movement."
    },
    {
      year: "May 2026",
      title: "EventNav & Beyond",
      desc: "Moving beyond tutorials to active startup development. Building out minimalist, functional MVPs and marketing strategies for real solutions."
    },
    {
      year: "2026 & Beyond",
      title: "The Future",
      desc: "Scaling our solutions, partnering with industry leaders, and incubating student startups."
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          <span className="underline decoration-[#A3D045] underline-offset-8 decoration-2">The Trajec</span>tory of a Movement.
        </h2>
        <p className="text-lg font-medium" style={{ color: colors.textMuted }}>
          We started as a small circle. We are evolving into a force. Here is how our growth has unfolded:
        </p>
      </div>

      <div className="relative border-l-2 ml-4 sm:ml-1/2 sm:-translate-x-1/2" style={{ borderColor: lineColor }}>
        {timeline.map((node, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={i} className={`relative pl-8 sm:pl-0 mb-16 ${isEven ? 'sm:pr-12 sm:text-right sm:mr-auto' : 'sm:pl-12 sm:ml-auto'} sm:w-1/2`}>
              {/* Timeline Dot */}
              <div 
                className={`absolute top-2 w-3 h-3 rounded-full bg-[#A3D045] -left-[25px] sm:left-auto ${isEven ? 'sm:-right-[7px]' : 'sm:-left-[7px]'}`} 
              />
              <span className="text-sm font-bold tracking-widest uppercase mb-2 block" style={{ color: colors.textSubtle }}>
                {node.year}
              </span>
              <h3 className="text-2xl font-bold mb-3">{node.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
                {node.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}