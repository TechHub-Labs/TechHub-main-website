/**
 * PROJECTS SECTION
 * * Showcases featured projects with status badges and tags.
 */

import { Project, ThemeColors } from '../domain/types';

interface ProjectsSectionProps {
  colors: ThemeColors;
}

const projects: Project[] = [
  {
    status: "LIVE",
    name: "Nexus",
    desc: "Discover events and hangout spots around you",
    tags: ["Mobile", "Discovery"],
    statusColor: "text-green-400" as const,
  },
  {
    status: "UPCOMING",
    name: "Pulse",
    desc: "Stay ahead with the latest tech conferences and meetups",
    tags: ["Web", "Events"],
    statusColor: "text-yellow-400" as const,
  },
  {
    status: "LIVE",
    name: "Vibe",
    desc: "Your go-to app for nightlife and local entertainment",
    tags: ["Mobile", "Lifestyle"],
    statusColor: "text-green-400" as const,
  },
];

export function ProjectsSection({ colors }: ProjectsSectionProps) {
  return (
    <section className="pt-40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 md:gap-8 mb-12">
          <div>
            <h2
              className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight"
              style={{ color: colors.text }}
            >
              <span className="underline decoration-[3px] decoration-[#A3D045] underline-offset-[10px]">
                Wha
              </span>
                t We're Building
            </h2>
            <p
              className="text-base sm:text-lg leading-relaxed max-w-xl mt-4 font-normal"
              style={{ color: colors.text }}
            >
              Real products shipped by our ecosystem. Take a look at the <br /> platforms and tools our community has built and pushed live.
            </p>
          </div>
          <span
            className="text-sm sm:text-lg font-normal cursor-pointer whitespace-nowrap mt-2 transition-all duration-300 flex items-center gap-1 hover:translate-x-1 hover:opacity-100"
            style={{ color: colors.text }}
          >
            View All Projects &rarr;
          </span>
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-[26px]">
          {projects.map((project) => (
            <div
              key={project.name}
              className="rounded-lg p-6 sm:p-7 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2 cursor-default flex flex-col items-center text-center shadow-sm"
              style={{ background: colors.bgCard }}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-center gap-2.5 mb-8">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background:
                      project.status === "LIVE"
                        ? colors.liveGreen
                        : colors.liveYellow,
                  }}
                />
                <span
                  className="text-base font-normal tracking-widest uppercase"
                  style={{ color: colors.text }}
                >
                  {project.status}
                </span>
              </div>

              {/* Icon/Avatar */}
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6"
                style={{ background: colors.memberBg }}
              />

              {/* Title */}
              <h3
                className="text-5xl font-semibold mb-3 tracking-tight"
                style={{ color: colors.text }}
              >
                {project.name}
              </h3>

              {/* Description */}
              <p
                className="text-xl font-light leading-relaxed mb-8 px-2"
                style={{ color: colors.text }}
              >
                {project.desc}
              </p>

              {/* Tags */}
              <div className="flex gap-3 justify-center mt-auto">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-base font-light"
                    style={{
                      background: colors.tagBg,
                      color: colors.text,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}