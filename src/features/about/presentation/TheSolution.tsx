import { ThemeColors } from '../../landing/domain/types';

export function TheSolution({ colors }: { colors: ThemeColors }) {
  const items = [
    {
      title: "Build in Public",
      desc: "We encourage open-sourcing our core projects, documenting the journey, and learning in the open."
    },
    {
      title: "Team workflows",
      desc: "Learn to navigate Git, PR reviews, CI/CD pipelines, and project management tools used in the industry."
    },
    {
      title: "Cross-functional teams",
      desc: "Work alongside PMs, Designers, and other devs. Understand the entire product lifecycle."
    },
    {
      title: "Standards of Industry",
      desc: "Transition from writing code that 'just works' to writing scalable, maintainable, and robust systems."
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          So a few builders decided to change that.
        </h2>
        <p className="text-lg max-w-2xl font-medium" style={{ color: colors.textMuted }}>
          NH TechHub is driven by the premise that execution beats intention. Here is what we actively push for:
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-3">{item.title}</h4>
              <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
                {item.desc}
              </p>
            </div>
            <div 
              className="w-full sm:w-40 h-40 rounded-xl shrink-0"
              style={{ background: colors.memberBg }}
            />
          </div>
        ))}
      </div>

      <p className="mt-20 font-bold text-center text-lg">
        Nothing builds competence like shipping real products.
      </p>
    </section>
  );
}