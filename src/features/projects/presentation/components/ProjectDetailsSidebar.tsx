/**
 * ProjectDetailsSidebar.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { FaLinkedinIn, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { useTheme } from "../../../landing/domain/useTheme";
import { allProjects } from "../../../../core/data/mockData";

type Project = (typeof allProjects)[number];

interface ProjectDetailsSidebarProps {
  project: Project;
  colors: ReturnType<typeof useTheme>["colors"];
  dark: boolean;
  mounted: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "LIVE":
      return "#A3D045";
    case "BETA":
      return "#A3D045";
    case "PAUSED":
      return "#E53935";
    case "IN DEVELOPMENT":
      return "#4A7DFF";
    case "UPCOMING":
      return "#D9C63F";
    default:
      return "#A3D045";
  }
};

export function ProjectDetailsSidebar({
  project,
  colors,
  dark,
  mounted,
}: ProjectDetailsSidebarProps) {
  const rows: [string, string][] = [
    ["Status", project.status],

    ["Category", project.category || "Tech"],

    ["Team size", project.teamSize || "Loading…"],

    ["Tech", project.tech || project.tags.join(", ")],

    ["Launch date", project.launchDate || "TBA"],
  ];

  return (
    <div
      className={`rounded-3xl border p-7 transition-all duration-700 hover:-translate-y-1 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ background: colors.bgCard, borderColor: colors.divider }}
    >
      <div
        className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center overflow-hidden"
        style={{ background: dark ? "#202868" : "#ECEFF7" }}
      >
        {project.image ? (
          /* @ts-ignore */
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            style={{ fontSize: "36px", fontWeight: 700, color: colors.text }}
          >
            {project.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="space-y-5 mb-10">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between text-[15px]"
          >
            <span style={{ color: colors.textMuted }}>{label}:</span>
            <span
              className="font-medium text-right"
              style={{
                color:
                  label === "Status"
                    ? getStatusColor(String(value))
                    : colors.text,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-5">
        {project.tiktok_url && (
          /* @ts-ignore */
          <a
            href={project.tiktok_url}
            target="_blank"
            rel="noreferrer"
            className="text-2xl transition-all duration-300 hover:scale-110"
            style={{ color: colors.text }}
          >
            <FaTiktok />
          </a>
        )}

        {project.linkedin_url && (
          /* @ts-ignore */
          <a
            href={project.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className="text-2xl transition-all duration-300 hover:scale-110"
            style={{ color: colors.text }}
          >
            <FaLinkedinIn />
          </a>
        )}

        {project.twitter_url && (
          /* @ts-ignore */
          <a
            href={project.twitter_url}
            target="_blank"
            rel="noreferrer"
            className="text-2xl transition-all duration-300 hover:scale-110"
            style={{ color: colors.text }}
          >
            <FaXTwitter />
          </a>
        )}
      </div>
    </div>
  );
}
