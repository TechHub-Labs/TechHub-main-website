/**
 * PROJECTS PAGE
 * Design: "Projects" heading + subtitle, search bar + Category dropdown + Filter by Status,
 * list-style rows (icon | name + desc + tags | status badge), pagination.
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../landing/domain/useTheme';
import { Navigation } from '../../../shared/components/Navigation';
import { Footer } from '../../../shared/components/Footer';
import { CTASection } from '../../../shared/components/CTASection';
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';
import { PageMargin } from '../../../shared/components/PageMargin';

export interface Project {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  status: 'LIVE' | 'BETA' | 'PAUSED' | 'IN DEVELOPMENT' | 'UPCOMING';
  category: string;
  teamSize: string;
  tech: string;
  launchDate: string;
  website: string;
  about: string;
  about2: string;
}

export const allProjects: Project[] = [
  { id: 'nexus', name: 'Nexus', desc: 'Discover events and hangout spots around you', tags: ['Mobile', 'Discovery'], status: 'LIVE', category: 'Discovery', teamSize: 'Nil', tech: 'JS, Node', launchDate: 'May 15, 2026', website: 'www.nexus.com', about: 'Nexus was born out of a simple observation: students were learning in isolation, unaware of the vibrant tech events and hangout spots happening right around them. While the talent existed, a central directory for connection didn\'t. Nexus serves as the definitive discovery platform to bridge that gap. The Solution Nexus provides a real-time, curated feed of tech conferences, meetups, and social hubs tailored specifically for the student innovator. By categorizing opportunities into "Events" and "Hangout Spots," it ensures that collaboration isn\'t just restricted to the classroom. It\'s a tool built to foster a project-driven community where serendipitous meetings turn into real products.', about2: 'Nexus didn\'t start as a plan; it started as a problem. Students were learning in isolation, unaware of the vibrant tech events and hangout spots happening around them. While talent existed, direction and a central platform for discovery didn\'t. A small group within TechHub decided to change that. Nexus is designed to be the definitive discovery engine for the student tech ecosystem. It bridges the gap between learning and building by connecting peers with real-world opportunities and social hubs. It isn\'t just an app; it\'s a structured pipeline that ensures collaboration isn\'t restricted to the classroom.' },
  { id: 'pulse', name: 'Pulse', desc: 'Real-time news and trends tailored for you', tags: ['Web', 'News'], status: 'BETA', category: 'News', teamSize: '4', tech: 'React, Firebase', launchDate: 'TBD', website: 'www.pulse.app', about: 'Pulse aggregates real-time news and trending topics curated for the student tech community.', about2: 'Built by a team of developers passionate about keeping builders informed and ahead of the curve.' },
  { id: 'fittrack', name: 'FitTrack', desc: 'Monitor your health and fitness goals effortlessly', tags: ['Mobile', 'Health'], status: 'LIVE', category: 'Health', teamSize: '3', tech: 'Flutter, Node', launchDate: 'March 2026', website: 'www.fittrack.io', about: 'FitTrack helps users build healthy habits by tracking workouts and nutrition goals.', about2: 'Started as a side project within TechHub\'s engineering track and shipped within 6 weeks.' },
  { id: 'studybuddy', name: 'StudyBuddy', desc: 'Connect with peers and share study resources', tags: ['Web', 'Education'], status: 'PAUSED', category: 'Education', teamSize: '2', tech: 'Next.js', launchDate: 'TBD', website: '', about: 'StudyBuddy makes peer-to-peer learning seamless for university students.', about2: 'Currently paused while the team refines the core matching algorithm.' },
  { id: 'shopease', name: 'ShopEase', desc: 'Personalized shopping recommendations and deals', tags: ['Mobile', 'E-commerce'], status: 'IN DEVELOPMENT', category: 'E-commerce', teamSize: '5', tech: 'React Native', launchDate: 'TBD', website: '', about: 'ShopEase uses AI to surface deals that match the user\'s taste and budget.', about2: 'In active development — an early alpha is available for internal testing.' },
  { id: 'travelmate', name: 'TravelMate', desc: 'Plan trips and explore destinations with locals', tags: ['Mobile', 'Travel'], status: 'UPCOMING', category: 'Travel', teamSize: '3', tech: 'React Native, Node', launchDate: 'Q4 2026', website: '', about: 'TravelMate connects travelers with local guides and community-curated itineraries.', about2: 'Slated for launch in Q4 2026 following a successful design sprint.' },
  { id: 'codelab', name: 'CodeLab', desc: 'Interactive coding challenges and tutorials', tags: ['Web', 'Education'], status: 'LIVE', category: 'Education', teamSize: '4', tech: 'Vue, Python', launchDate: 'Jan 2026', website: 'www.codelab.dev', about: 'CodeLab gamifies the learning experience with progressive coding challenges.', about2: 'Used by over 200 students across 3 campuses since launch.' },
  { id: 'greenthumb', name: 'GreenThumb', desc: 'Gardening tips and plant care reminders', tags: ['Mobile', 'Lifestyle'], status: 'UPCOMING', category: 'Lifestyle', teamSize: '2', tech: 'Flutter', launchDate: 'Q3 2026', website: '', about: 'GreenThumb helps urban dwellers grow and maintain houseplants with smart reminders.', about2: 'A passion project championed by TechHub\'s creative track.' },
  { id: 'soundscape', name: 'SoundScape', desc: 'Create and share ambient sound mixes', tags: ['Web', 'Entertainment'], status: 'BETA', category: 'Entertainment', teamSize: '3', tech: 'React, Web Audio', launchDate: 'TBD', website: 'www.soundscape.io', about: 'SoundScape lets creators blend and share immersive ambient audio environments.', about2: 'Beta testers report significant improvements in focus and mood.' },
];

// Status colors are provided by the theme `colors` at runtime

const PAGE_SIZE = 9;

function ProjectRow({ project, index, colors, isDark }: { project: Project; index: number; colors: ReturnType<typeof useTheme>['colors']; isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), index * 60); obs.disconnect(); } }, { threshold: 0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, [index]);

  const tagBg = colors.tagBg;
  const rowBg = colors.bgCard;
  const borderColor = colors.divider;

  return (
    <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
      <div
        ref={ref}
        className="flex items-center gap-4 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5 border-b cursor-pointer transition-all duration-200 hover:brightness-[0.97]"
        style={{ background: rowBg, borderColor, opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-12px)', transition: 'opacity 0.45s ease, transform 0.45s ease, background 0.2s' }}
      >
        {/* Icon placeholder */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0" style={{ background: colors.memberBg }} />

        {/* Name + desc + tags */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold mb-0.5 truncate" style={{ color: colors.text }}>{project.name}</h3>
          <p className="text-xs sm:text-sm mb-2 truncate" style={{ color: colors.textMuted }}>{project.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map(tag => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: tagBg, color: colors.text }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: project.status === 'LIVE' || project.status === 'BETA' ? colors.statusLive : project.status === 'PAUSED' ? colors.statusPaused : project.status === 'IN DEVELOPMENT' ? colors.statusInDev : colors.statusUpcoming
            }}
          />
          <span className="text-xs sm:text-sm font-semibold tracking-wide" style={{ color: project.status === 'LIVE' || project.status === 'BETA' ? colors.statusLive : project.status === 'PAUSED' ? colors.statusPaused : project.status === 'IN DEVELOPMENT' ? colors.statusInDev : colors.statusUpcoming }}>{project.status}</span>
        </div>
      </div>
    </Link>
  );
}

export function ProjectsPage() {
  const { dark, setDark, colors } = useTheme();
  const isDark = dark;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Category');
  const [statusFilter, setStatusFilter] = useState('Filter by Status');
  const [page, setPage] = useState(1);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);

  useEffect(() => { document.documentElement.style.color = colors.text; window.scrollTo(0, 0); setTimeout(() => setHeaderVisible(true), 80); }, [colors]);

  const categories = ['All', ...Array.from(new Set(allProjects.map(p => p.category)))];
  const statuses: (Project['status'] | 'All')[] = ['All', 'LIVE', 'BETA', 'PAUSED', 'IN DEVELOPMENT', 'UPCOMING'];

  const filtered = allProjects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Category' || category === 'All' || p.category === category;
    const matchStatus = statusFilter === 'Filter by Status' || statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const inputBg = colors.bgCard;
  const dropBg = colors.bgCard;
  const borderColor = colors.divider;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />
      <main className="flex-1 w-full">
        <PageMargin>
          {/* HERO */}
          <div className="pt-14 pb-8" style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-3" style={{ color: colors.text }}>Projects</h1>
            <div className="h-[3px] mb-4" style={{ width: headerVisible ? '56px' : '0px', transition: 'width 0.7s ease 0.3s', background: colors.accent }} />
            <p className="text-base sm:text-lg" style={{ color: colors.textMuted }}>Building real products. Solving real problems.</p>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8" style={{ opacity: headerVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }}>
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg border" style={{ background: inputBg, borderColor }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: colors.textSubtle, flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search" className="flex-1 bg-transparent outline-none text-sm" style={{ color: colors.text }} />

              {/* Category dropdown */}
              <div className="relative">
                <button onClick={() => { setShowCatDrop(p => !p); setShowStatusDrop(false); }} className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded transition-colors hover:opacity-70" style={{ color: colors.text }}>
                  {category}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
                {showCatDrop && (
                  <div className="absolute top-full left-0 mt-1 z-50 rounded-lg shadow-lg border py-1 min-w-[140px]" style={{ background: dropBg, borderColor }}>
                    {categories.map(c => <button key={c} onClick={() => { setCategory(c); setShowCatDrop(false); setPage(1); }} className="w-full text-left px-3 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: colors.text }}>{c}</button>)}
                  </div>
                )}
              </div>
            </div>

            {/* Status dropdown */}
            <div className="relative">
              <button onClick={() => { setShowStatusDrop(p => !p); setShowCatDrop(false); }} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all hover:opacity-80" style={{ background: inputBg, borderColor, color: colors.text }}>
                {statusFilter}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              {showStatusDrop && (
                <div className="absolute top-full right-0 mt-1 z-50 rounded-lg shadow-lg border py-1 min-w-[160px]" style={{ background: dropBg, borderColor }}>
                  {statuses.map(s => <button key={s} onClick={() => { setStatusFilter(s); setShowStatusDrop(false); setPage(1); }} className="w-full text-left px-3 py-2 text-sm hover:opacity-70 transition-opacity" style={{ color: colors.text }}>{s}</button>)}
                </div>
              )}
            </div>
          </div>

          {/* PROJECT LIST */}
          <div className="rounded-xl overflow-hidden border mb-6" style={{ borderColor }}>
            {paginated.length === 0
              ? <div className="py-16 text-center text-sm" style={{ color: colors.textMuted }}>No projects found.</div>
              : paginated.map((p, i) => <ProjectRow key={p.id} project={p} index={i} colors={colors} isDark={isDark} />)
            }
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm mb-20" style={{ color: colors.textMuted }}>
              <span>Page {page} of {totalPages}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)} className="w-8 h-8 rounded flex items-center justify-center font-medium transition-colors" style={{ background: page === n ? colors.text : 'transparent', color: page === n ? (isDark ? colors.accentText : '#ffffff') : colors.text }}>{n}</button>
                ))}
                {totalPages > 5 && <span className="px-1">...</span>}
                {totalPages > 5 && [totalPages - 1, totalPages].map(n => (
                  <button key={n} onClick={() => setPage(n)} className="w-8 h-8 rounded flex items-center justify-center font-medium transition-colors" style={{ background: page === n ? colors.text : 'transparent', color: page === n ? (isDark ? colors.accentText : '#ffffff') : colors.text }}>{n}</button>
                ))}
                {page < totalPages && <button onClick={() => setPage(p => p + 1)} className="px-3 h-8 rounded font-medium transition-colors hover:opacity-70" style={{ color: colors.text }}>Next</button>}
              </div>
            </div>
          )}

          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>
      <Footer colors={colors} />
    </div>
  );
}