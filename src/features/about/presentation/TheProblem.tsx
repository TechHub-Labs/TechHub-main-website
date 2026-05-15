import { ThemeColors } from '../../landing/domain/types';

export function TheProblem({  }: { colors: ThemeColors }) {
  // This section remains dark navy as per design, regardless of light/dark mode
  return (
    <section className="bg-[#0F1524] text-white py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            <span className="underline decoration-[#A3D045] underline-offset-8 decoration-2">The Proble</span>m Isn't Talent.
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Students are stuck building "Todo apps" in isolation. What they actually need is an environment that mirrors the reality of the tech industry.
          </p>
        </div>

        <div className="space-y-8">
          {[
            "Real-World Scenarios",
            "Collaborative Experience",
            "Mentorship",
            "Honest Feedback",
            "Access to Opportunities"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3D045]" />
              <h4 className="text-xl font-medium">{item}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}