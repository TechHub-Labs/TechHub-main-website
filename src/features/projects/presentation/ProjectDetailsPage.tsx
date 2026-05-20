/**
 * PROJECT DETAIL PAGE
 * Design: breadcrumb, header row (icon + name + status), website link,
 * two-column layout (description left, sidebar right), Active Builders grid.
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../../landing/domain/useTheme';
import { Navigation } from '../../../shared/components/Navigation';
import { Footer } from '../../../shared/components/Footer';
import { CTASection } from '../../../shared/components/CTASection';
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';
import { PageMargin } from '../../../shared/components/PageMargin';
import { allProjects } from './ProjectsPage';

// status colors are provided by theme `colors`

const activeBuilders = [
  { name: 'Chinonso Okafor', role: 'Backend Engineer', quote: '"I power seamless experiences."' },
  { name: 'Chinedu Okafor', role: 'UX Researcher', quote: '"Understanding users is the first step"' },
  { name: 'Amina Yusuf', role: 'Visual Designer', quote: '"Color and balance create harmony"' },
  { name: 'Chinonso Okafor', role: 'Backend Engineer', quote: '"I power seamless experiences."' },
  { name: 'Chinedu Okafor', role: 'UX Researcher', quote: '"Understanding users is the first step"' },
  { name: 'Amina Yusuf', role: 'Visual Designer', quote: '"Color and balance create harmony"' },
];

export function ProjectDetailsPage() {
  const { dark, setDark, colors } = useTheme();
  const { id } = useParams<{ id: string }>();
  const project = allProjects.find(p => p.id === id) || allProjects[0];
  const [visible, setVisible] = useState(false);

  useEffect(() => { document.documentElement.style.color = colors.text; window.scrollTo(0, 0); setTimeout(() => setVisible(true), 80); }, [colors]);

  const cardBg = colors.bgCard;
  const imgBg = colors.bgCardHover;
  const borderColor = colors.divider;
  const tagBg = colors.tagBg;
  const sidebarBg = colors.bgCard;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WebsiteBackground isDark={dark} bgColhor={colors.bg} />
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />
      <main className="flex-1 w-full">
        <PageMargin>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.55s ease, transform 0.55s ease' }}>

            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-sm pt-8 pb-6" style={{ color: colors.textMuted }}>
              <Link to="/projects" className="hover:opacity-70 transition-opacity" style={{ color: colors.statusInDev }}>Projects</Link>
              <span>›</span>
              <span style={{ color: colors.text }}>{project.name}</span>
            </div>

            {/* TWO-COLUMN LAYOUT */}
            <div className="grid lg:grid-cols-[1fr_260px] gap-8 lg:gap-12">

              {/* ── LEFT ── */}
              <div>
                {/* Header row */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl shrink-0" style={{ background: imgBg }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.text }}>{project.name}</h1>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: project.status === 'LIVE' || project.status === 'BETA' ? colors.statusLive : project.status === 'PAUSED' ? colors.statusPaused : project.status === 'IN DEVELOPMENT' ? colors.statusInDev : colors.statusUpcoming }} />
                        <span className="text-sm font-semibold" style={{ color: project.status === 'LIVE' || project.status === 'BETA' ? colors.statusLive : project.status === 'PAUSED' ? colors.statusPaused : project.status === 'IN DEVELOPMENT' ? colors.statusInDev : colors.statusUpcoming }}>{project.status}</span>
                      </div>
                    </div>
                    <p className="text-sm mt-1 mb-3" style={{ color: colors.textMuted }}>{project.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: tagBg, color: colors.text }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Website link */}
                {project.website && (
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b" style={{ borderColor }}>
                    <span className="text-sm font-medium" style={{ color: colors.text }}>Website</span>
                    <div className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.statusInDev} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                      <a href={`https://${project.website}`} target="_blank" rel="noreferrer" className="text-sm hover:opacity-70 transition-opacity" style={{ color: colors.statusInDev }}>{project.website}</a>
                    </div>
                  </div>
                )}

                {/* About paragraphs */}
                <p className="text-sm sm:text-base leading-relaxed mb-5" style={{ color: colors.textMuted }}>{project.about}</p>
                <p className="text-sm sm:text-base leading-relaxed mb-12" style={{ color: colors.textMuted }}>{project.about2}</p>

                {/* Active Builders */}
                <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: colors.text }}>Active Builders</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
                  {activeBuilders.map((b, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-transparent transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-default" style={{ background: cardBg, borderColor: 'transparent' }} onMouseEnter={e => (e.currentTarget.style.borderColor = colors.statusInDev)} onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
                      <div className="w-full" style={{ background: imgBg, aspectRatio: '4/3' }} />
                      <div className="px-4 pt-3 pb-4">
                        <h4 className="text-sm font-bold mb-0.5" style={{ color: colors.text }}>{b.name}</h4>
                        <p className="text-xs mb-1.5" style={{ color: colors.textSubtle }}>{b.role}</p>
                        <p className="text-xs italic" style={{ color: colors.textMuted }}>{b.quote}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RIGHT SIDEBAR ── */}
              <div className="lg:pt-[88px]">
                <div className="rounded-xl border overflow-hidden" style={{ background: sidebarBg, borderColor }}>
                  {/* Sidebar image */}
                  <div className="w-full h-28" style={{ background: imgBg }} />

                  {/* Meta rows */}
                  <div className="px-5 py-5 space-y-3 text-sm border-b" style={{ borderColor }}>
                    {[
                      ['Status', project.status],
                      ['Category', project.category],
                      ['Team size:', project.teamSize],
                      ['Tech:', project.tech],
                      ['Launch date', project.launchDate],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-2">
                        <span style={{ color: colors.textSubtle }}>{label}</span>
                        <span className="font-medium text-right" style={{ color: colors.text }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Social icons */}
                  <div className="px-5 py-4 flex items-center gap-4" style={{ color: colors.text }}>
                    <a href={project.website ? `https://${project.website}` : 'https://nhtechhub.org'} target="_blank" rel="noreferrer" className="hover:opacity-60 transition-opacity" aria-label="TikTok">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                    </a>
                    <a href={project.website ? `https://${project.website}` : 'https://nhtechhub.org'} target="_blank" rel="noreferrer" className="hover:opacity-60 transition-opacity" aria-label="LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                    <a href={project.website ? `https://${project.website}` : 'https://nhtechhub.org'} target="_blank" rel="noreferrer" className="hover:opacity-60 transition-opacity" aria-label="X">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <CTASection dark={dark} colors={colors} />
          </div>
        </PageMargin>
      </main>
      <Footer colors={colors} />
    </div>
  );
}