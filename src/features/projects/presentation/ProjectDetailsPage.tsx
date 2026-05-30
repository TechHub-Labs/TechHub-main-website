/* =========================================
   PROJECT DETAILS PAGE — Controller
   Delegates sidebar & builders to sub-components.
========================================= */

import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FaGithub, FaLinkedinIn, FaTiktok, FaXTwitter } from 'react-icons/fa6';

import { useTheme } from '../../landing/domain/useTheme';

import { Navigation } from '../../../shared/components/Navigation';
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';
import { PageMargin } from '../../../shared/components/PageMargin';
import { Footer } from '../../../shared/components/Footer';
import { CTASection } from '../../../shared/components/CTASection';
import { ProjectDetailsSidebar } from './components/ProjectDetailsSidebar';
import { ProjectActiveBuilders } from './components/ProjectActiveBuilders';
import { supabase } from '../../../core/supabase/client';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'LIVE':           return '#A3D045';
    case 'BETA':           return '#A3D045';
    case 'PAUSED':         return '#E53935';
    case 'IN DEVELOPMENT': return '#4A7DFF';
    case 'UPCOMING':       return '#D9C63F';
    default:               return '#A3D045';
  }
};

export function ProjectDetailsPage() {
  const { dark, setDark, colors } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dbProject, setDbProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { id }   = useParams();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    window.scrollTo(0, 0);

    const loadProject = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
        if (data && !error) {
          setDbProject(data);
        }
      } catch (err) {
        console.warn("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const project = useMemo(() => {
    if (dbProject) {
      return {
        id: dbProject.id,
        name: dbProject.title,
        desc: dbProject.description || '',
        about: dbProject.description || 'Detailed description coming soon.',
        about2: '',
        image: dbProject.image_url || undefined,
        status: dbProject.status || (dbProject.in_development ? 'IN DEVELOPMENT' : 'LIVE'),
        category: dbProject.category || 'Product',
        teamSize: dbProject.team_size || 'Nil',
        tech: Array.isArray(dbProject.tech) ? dbProject.tech.join(', ') : (dbProject.tech || ''),
        launchDate: dbProject.launch_date || 'TBA',
        website: dbProject.live_url || '',
        tags: Array.isArray(dbProject.tech) ? dbProject.tech : (dbProject.tech ? dbProject.tech.split(',').map((t: string) => t.trim()) : []),
        github_url: dbProject.github_url || '',
        tiktok_url: dbProject.tiktok_url || '',
        linkedin_url: dbProject.linkedin_url || '',
        twitter_url: dbProject.twitter_url || '',
      };
    return null;
  }, [dbProject, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
        <h1 className="text-xl font-semibold animate-pulse" style={{ color: colors.textMuted }}>Loading Project Details...</h1>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
        <h1 className="text-4xl font-bold" style={{ color: colors.text }}>Project not found</h1>
      </div>
    );
  }

  const breadcrumbItems = location.pathname.split('/').filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="transition-colors duration-300">
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />

      <main className="w-full flex-1">
        <PageMargin>
          <div className="max-w-[1400px] mx-auto pt-14 pb-24">

            {/* Breadcrumb */}
            <div
              className={`flex items-center gap-2 text-sm lg:text-[15px] mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ color: colors.textMuted }}
            >
              {breadcrumbItems.map((item, index) => {
                const path   = '/' + breadcrumbItems.slice(0, index + 1).join('/');
                const isLast = index === breadcrumbItems.length - 1;
                const label  = item.charAt(0).toUpperCase() + item.slice(1);
                return (
                  <div key={path} className="flex items-center gap-2">
                    {!isLast
                      ? <Link to={path} className="transition-opacity hover:opacity-70">{label}</Link>
                      : <span className="font-medium" style={{ color: colors.text }}>{project.name}</span>
                    }
                    {!isLast && <span>›</span>}
                  </div>
                );
              })}
            </div>

            {/* Main two-column layout */}
            <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-start">

              {/* Left — project info */}
              <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start gap-7 mb-8">
                  <div className="w-24 h-24 rounded-full shrink-0 flex items-center justify-center overflow-hidden" style={{ background: dark ? colors.bgCard : '#ECEFF7' }}>
                    {project.image ? (
                      <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ fontSize: '36px', fontWeight: 700, color: colors.text }}>
                        {project.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h1 className="text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: colors.text }}>
                        {project.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: getStatusColor(project.status) }} />
                        <span className="text-[15px] font-semibold" style={{ color: colors.text }}>{project.status}</span>
                      </div>
                    </div>
                    <p className="text-lg lg:text-[20px] leading-relaxed mb-5 max-w-3xl" style={{ color: colors.textMuted }}>
                      {project.desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      {project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-4 py-2 rounded-full text-sm font-semibold"
                          style={{ background: dark ? 'rgba(255,255,255,0.06)' : '#EEF2FF', color: colors.text }}
                        >{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Website link */}
                <div className="flex items-center justify-between py-6 border-y mb-10" style={{ borderColor: colors.divider }}>
                  <span className="text-lg font-semibold" style={{ color: colors.text }}>Website</span>
                  {/* @ts-ignore */}
                  <a href={`https://${project.website}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-base transition-opacity hover:opacity-70"
                    style={{ color: '#3B5BDB' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    {/* @ts-ignore */}
                    {project.website || 'View Project'}
                  </a>
                </div>

                {/* Description */}
                <div className="space-y-10 text-[17px] lg:text-[18px] leading-[2]" style={{ color: colors.textMuted }}>
                  {/* @ts-ignore */}
                  <p>{project.about || 'Detailed description coming soon.'}</p>
                  {/* @ts-ignore */}
                  {project.about2 && <p>{project.about2}</p>}
                </div>
              </div>

              {/* Right — sidebar */}
              <ProjectDetailsSidebar project={project as any} colors={colors} dark={dark} mounted={mounted} />
            </div>

            {/* Active Builders */}
            <ProjectActiveBuilders projectTitle={project.name} projectId={project.id} colors={colors} dark={dark} mounted={mounted} />

            {/* Footer socials */}
            <div className="flex items-center justify-end gap-5 mt-24">
              {/* @ts-ignore */}
              {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="text-xl transition-all duration-300 hover:scale-110" style={{ color: colors.text }}><FaGithub /></a>}
              {/* @ts-ignore */}
              {project.linkedin_url && <a href={project.linkedin_url} target="_blank" rel="noreferrer" className="text-xl transition-all duration-300 hover:scale-110" style={{ color: colors.text }}><FaLinkedinIn /></a>}
              {/* @ts-ignore */}
              {project.tiktok_url && <a href={project.tiktok_url} target="_blank" rel="noreferrer" className="text-xl transition-all duration-300 hover:scale-110" style={{ color: colors.text }}><FaTiktok /></a>}
              {/* @ts-ignore */}
              {project.twitter_url && <a href={project.twitter_url} target="_blank" rel="noreferrer" className="text-xl transition-all duration-300 hover:scale-110" style={{ color: colors.text }}><FaXTwitter /></a>}
            </div>
          </div>

          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>

      <Footer colors={colors} />
    </div>
  );
}