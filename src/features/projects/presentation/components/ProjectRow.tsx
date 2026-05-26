/**
 * ProjectRow — A single animated project row for the Projects listing page.
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../landing/domain/useTheme';
import { Project } from '../ProjectsPage';

interface ProjectRowProps {
  project: Project;
  index: number;
  colors: ReturnType<typeof useTheme>['colors'];
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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const getStatusColor = () => {
    switch (project.status) {
      case 'LIVE':         return colors.statusLive;
      case 'BETA':         return '#a8cf45';
      case 'PAUSED':       return colors.statusPaused;
      case 'IN DEVELOPMENT': return colors.statusInDev;
      case 'UPCOMING':    return colors.statusUpcoming;
      default:             return colors.statusLive;
    }
  };

  return (
    <Link to={`/projects/${project.id}`} className="block no-underline">
      <div
        ref={ref}
        className="group flex items-center gap-5 lg:gap-7 border-b px-5 sm:px-7 py-6"
        style={{
          borderColor: colors.divider,
          background: colors.bgCard,
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateY(0px) translateX(0px)'
            : index % 2 === 0
              ? 'translateY(18px) translateX(-8px)'
              : 'translateY(18px) translateX(8px)',
          transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.008) translateX(4px)';
          (e.currentTarget as HTMLDivElement).style.background = colors.bgCardHover || colors.bgCard;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) translateX(0)';
          (e.currentTarget as HTMLDivElement).style.background = colors.bgCard;
        }}
      >
        {/* Icon placeholder */}
        <div
          className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{ background: colors.memberBg }}
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3
            className="mb-2 text-2xl sm:text-[2rem] font-bold leading-none tracking-tight"
            style={{ color: colors.text }}
          >
            {project.name}
          </h3>
          <p className="mb-3 text-sm sm:text-base leading-relaxed" style={{ color: colors.textMuted }}>
            {project.desc}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
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

        {/* Status */}
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="h-[10px] w-[10px] rounded-full"
            style={{
              background: getStatusColor(),
              animation: project.status === 'LIVE' ? 'pulseGlow 2s ease-in-out infinite' : 'none',
            }}
          />
          <span className="text-xs sm:text-sm font-bold tracking-wide" style={{ color: getStatusColor() }}>
            {project.status}
          </span>
        </div>

        {/* Arrow */}
        <span
          className="text-xl shrink-0 transition-transform duration-300 group-hover:translate-x-2 opacity-0 group-hover:opacity-100"
          style={{ color: colors.textMuted }}
        >
          →
        </span>
      </div>
    </Link>
  );
}
