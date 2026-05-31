/**
 * ProjectRow.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../landing/domain/useTheme";

interface ProjectRowProps {
  project: any;
  index: number;
  colors: ReturnType<typeof useTheme>["colors"];
}

export function ProjectRow({ project, index, colors }: ProjectRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 70);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const getStatusColor = () => {
    const status =
      project.status || (project.in_development ? "IN DEVELOPMENT" : "LIVE");
    switch (status) {
      case "LIVE":
        return colors.statusLive;
      case "BETA":
        return "#a8cf45";
      case "PAUSED":
        return colors.statusPaused;
      case "IN DEVELOPMENT":
        return colors.statusInDev;
      case "UPCOMING":
        return colors.statusUpcoming;
      default:
        return colors.statusLive;
    }
  };

  return (
    <Link to={`/projects/${project.id}`} className="block no-underline">
      <div
        ref={ref}
        className="group flex flex-col sm:flex-row sm:items-center justify-between border-b px-5 sm:px-7 py-6 gap-3 sm:gap-4 relative"
        style={{
          borderColor: colors.divider,
          background: colors.bgCard,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0px) translateX(0px)"
            : index % 2 === 0
              ? "translateY(18px) translateX(-8px)"
              : "translateY(18px) translateX(8px)",
          transition:
            "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "scale(1.008) translateX(4px)";
          (e.currentTarget as HTMLDivElement).style.background =
            colors.bgCardHover || colors.bgCard;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform =
            "scale(1) translateX(0)";
          (e.currentTarget as HTMLDivElement).style.background = colors.bgCard;
        }}
      >
        <div className="flex flex-1 items-start sm:items-center gap-4 sm:gap-5 lg:gap-7 min-w-0 w-full">
          <div
            className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 flex items-center justify-center overflow-hidden"
            style={{ background: colors.memberBg }}
          >
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: colors.text,
                }}
              >
                {project.title ? project.title.charAt(0).toUpperCase() : "P"}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="mb-1 sm:mb-2 text-xl sm:text-[2rem] font-bold leading-none tracking-tight"
              style={{ color: colors.text }}
            >
              {project.title}
            </h3>
            <p
              className="mb-3 text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-1"
              style={{ color: colors.textMuted }}
            >
              {project.short_description}
            </p>
            <div className="flex flex-wrap gap-2">
              {(project.tech || []).map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-semibold sm:text-sm transition-transform duration-200 hover:scale-105"
                  style={{ background: colors.tagBg, color: colors.text }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start sm:self-center ml-[72px] sm:ml-4 mt-1 sm:mt-0">
          <span
            className="h-[10px] w-[10px] rounded-full"
            style={{
              background: getStatusColor(),
              animation:
                project.status === "LIVE"
                  ? "pulseGlow 2s ease-in-out infinite"
                  : "none",
            }}
          />
          <span
            className="text-xs font-bold tracking-widest uppercase mt-0.5"
            style={{ color: getStatusColor() }}
          >
            {project.status ||
              (project.in_development ? "IN DEVELOPMENT" : "LIVE")}
          </span>
        </div>

        <span
          className="hidden sm:block text-xl shrink-0 transition-transform duration-300 group-hover:translate-x-2 opacity-0 group-hover:opacity-100 absolute right-6"
          style={{ color: colors.textMuted }}
        >
          →
        </span>
      </div>
    </Link>
  );
}
