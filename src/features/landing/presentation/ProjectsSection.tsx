/**
 * PROJECTS SECTION — Landing Page
 * ─────────────────────────────────────────────────────────────────────────────
 * - SectionTitle with green curtain reveal
 * - 3D tilt on hover (desktop only, via @media hover:hover)
 * - Live dot ripple effect
 * - Staggered AnimatedCard entries
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeColors } from '../domain/types';
import { AnimatedCard } from '../../../shared/components/AnimatedCard';
import { supabase } from '../../../core/supabase/client';
import { SectionTitle } from '../../../shared/components/SectionTitle';

interface ProjectsSectionProps {
  colors: ThemeColors;
}

function ProjectCard({
  project,
  index,
  colors,
}: {
  project: any;
  index: number;
  colors: ThemeColors;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shine: 0, shineX: 0, shineY: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Desktop-only 3D tilt
    if (window.matchMedia('(hover: none)').matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 14;   // rotateX
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 14;  // rotateY
    const shineX = ((e.clientX - rect.left) / rect.width) * 100;
    const shineY = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({ x, y, shine: 0.18, shineX, shineY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, shine: 0, shineX: 50, shineY: 50 });
    setHovered(false);
  };

  return (
    <AnimatedCard
      index={index}
      stepMs={140}
      direction={index % 2 === 0 ? 'rotate-left' : 'rotate-right'}
      threshold={0.1}
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center h-full relative overflow-hidden cursor-default"
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.cardBorder}`,
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? 'scale(1.02)' : 'scale(1)'}`,
          transition: 'transform 0.2s ease, box-shadow 0.3s ease',
          boxShadow: hovered
            ? '0 24px 64px rgba(0,0,0,0.14)'
            : '0 1px 4px rgba(0,0,0,0.06)',
          willChange: 'transform',
        }}
      >
        {/* Shine overlay (desktop only) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255,255,255,${tilt.shine}), transparent 60%)`,
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease',
            borderRadius: 'inherit',
          }}
        />

        {/* Live status badge with ripple */}
        <div className="flex items-center gap-2.5 mb-8 relative z-10">
          <span className="relative flex items-center justify-center">
            <span
              className="absolute inline-flex w-4 h-4 rounded-full opacity-60"
              style={{
                background: project.status === 'LIVE' ? '#4ade80' : '#fbbf24',
                animation: project.status === 'LIVE' ? 'rippleDot 2s ease-out infinite' : 'none',
              }}
            />
            <span
              className="relative w-2.5 h-2.5 rounded-full"
              style={{ background: project.status === 'LIVE' ? '#4ade80' : '#fbbf24' }}
            />
          </span>
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: colors.textMuted }}
          >
            {project.status}
          </span>
        </div>

        {/* Avatar */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 transition-transform duration-700"
          style={{
            background: colors.memberBg,
            transform: hovered ? 'scale(1.12) rotate(6deg)' : 'scale(1)',
          }}
        />

        <h3
          className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight relative z-10"
          style={{ color: colors.text }}
        >
          {project.title}
        </h3>
        <p className="text-base leading-relaxed mb-8 px-2 relative z-10" style={{ color: colors.textMuted }}>
          {project.short_description}
        </p>

        {/* Tags */}
        <div className="flex gap-2.5 justify-center mt-auto flex-wrap relative z-10">
          {(project.tech || []).map((tag: string) => (
            <span
              key={tag}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: colors.tagBg, color: colors.tagText }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
}

export function ProjectsSection({ colors }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(3);
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <section className="pt-40 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <SectionTitle
            title="What We're Building"
            subtitle="Real products shipped by our ecosystem — platforms and tools our community has built and pushed live."
            colors={colors}
          />
          <Link to="/projects" className="shrink-0">
            <span
              className="text-sm font-semibold transition-all duration-300 flex items-center gap-1 group whitespace-nowrap"
              style={{ color: colors.text }}
            >
              View All
              <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} colors={colors} />
          ))}
        </div>
      </div>
    </section>
  );
}
