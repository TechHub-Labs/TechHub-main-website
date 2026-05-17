/**
 * MEMBERS PAGE
 * Design: "Our Members" hero, filter tabs (All / Undergrad / Alumni / '25 / '26),
 * 3-column card grid, click-to-open modal with photo, name, role, quote, socials, skills, projects.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../../landing/domain/useTheme';
import { Navigation } from '../../../shared/components/Navigation';
import { Footer } from '../../../shared/components/Footer';
import { CTASection } from '../../../shared/components/CTASection';
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';
import { PageMargin } from '../../../shared/components/PageMargin';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Member {
  id: number;
  name: string;
  role: string;
  quote: string;
  category: ('All' | 'Undergrad' | 'Alumni' | "'25" | "'26")[];
  skills: string[];
  projects: string[];
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const members: Member[] = [
  {
    id: 1,
    name: 'Chinonso Okafor',
    role: 'Backend Engineer',
    quote: '"I power seamless experiences."',
    category: ['All', 'Undergrad', "'25"],
    skills: ['Node.js', 'PostgreSQL'],
    projects: ['Nexspot', 'Glass'],
  },
  {
    id: 2,
    name: 'Chinedu Okafor',
    role: 'UX Researcher',
    quote: '"Understanding users is the first step."',
    category: ['All', 'Undergrad', "'25"],
    skills: ['Figma', 'User Testing'],
    projects: ['EventNav', 'Pulse'],
  },
  {
    id: 3,
    name: 'Amina Yusuf',
    role: 'Visual Designer',
    quote: '"Color and balance create harmony."',
    category: ['All', 'Alumni', "'26"],
    skills: ['Figma', 'Illustrator'],
    projects: ['Vibe', 'Nexspot'],
  },
  {
    id: 4,
    name: 'Tunde Adebayo',
    role: 'Interaction Designer',
    quote: '"Seamless come from interactions."',
    category: ['All', 'Undergrad', "'25"],
    skills: ['Framer', 'Prototyping'],
    projects: ['Glass', 'Orbit'],
  },
  {
    id: 5,
    name: 'Ngozi Eze',
    role: 'User Interface Designer',
    quote: '"Every pixel tells a story worth telling."',
    category: ['All', 'Undergrad', "'26"],
    skills: ['Figma', 'CSS'],
    projects: ['Pulse', 'Vibe'],
  },
  {
    id: 6,
    name: 'Ifeanyi Nwosu',
    role: 'Design Strategist',
    quote: '"Strategy transforms ideas into solutions."',
    category: ['All', 'Alumni', "'25"],
    skills: ['Strategy', 'Figma'],
    projects: ['EventNav', 'Glass'],
  },
  {
    id: 7,
    name: 'Chinelo Okafor',
    role: 'Product Designer',
    quote: '"Empathy is the heart of design."',
    category: ['All', 'Undergrad', "'25"],
    skills: ['Figma', 'Research'],
    projects: ['Nexspot', 'Orbit'],
  },
  {
    id: 8,
    name: 'Emeka Obi',
    role: 'Frontend',
    quote: '"Understanding users unlocks innovation."',
    category: ['All', 'Undergrad', "'26"],
    skills: ['React', 'TypeScript'],
    projects: ['Pulse', 'Vibe'],
  },
  {
    id: 9,
    name: 'Amina Yusuf',
    role: 'Visual Designer',
    quote: '"Color breathes life into wireframes."',
    category: ['All', 'Alumni', "'26"],
    skills: ['Figma', 'Motion'],
    projects: ['Glass', 'Orbit'],
  },
  {
    id: 10,
    name: 'Funmi Adewale',
    role: 'Marketing',
    quote: '"Experiences things deeply."',
    category: ['All', 'Undergrad', "'25"],
    skills: ['Copywriting', 'SEO'],
    projects: ['EventNav', 'Nexspot'],
  },
  {
    id: 11,
    name: 'Obinna Chukwu',
    role: 'Content Designer',
    quote: '"Words shape how users engage."',
    category: ['All', 'Undergrad', "'26"],
    skills: ['Writing', 'UX Writing'],
    projects: ['Pulse', 'Glass'],
  },
  {
    id: 12,
    name: 'Halima Bello',
    role: 'Backend Engineer',
    quote: '"Movement guides attention and emotion."',
    category: ['All', 'Alumni', "'25"],
    skills: ['Python', 'Django'],
    projects: ['Nexspot', 'Vibe'],
  },
  {
    id: 13,
    name: 'Ibrahim Salisu',
    role: 'Content',
    quote: '"Insights drive meaningful design choices."',
    category: ['All', 'Undergrad', "'26"],
    skills: ['Content Strategy', 'Analytics'],
    projects: ['EventNav', 'Orbit'],
  },
  {
    id: 14,
    name: 'Kemi Oladipo',
    role: 'Accessibility Specialist',
    quote: '"Inclusion is design\'s true north."',
    category: ['All', 'Alumni', "'25"],
    skills: ['WCAG', 'ARIA'],
    projects: ['Glass', 'Pulse'],
  },
  {
    id: 15,
    name: 'Chidimma Eze',
    role: 'Brand Designer',
    quote: '"Identity is the soul of a product."',
    category: ['All', 'Undergrad', "'26"],
    skills: ['Branding', 'Figma'],
    projects: ['Vibe', 'Nexspot'],
  },
];

const FILTERS = ['All', 'Undergrad', 'Alumni', "'25", "'26"] as const;
type Filter = typeof FILTERS[number];

// ─── Member Card ─────────────────────────────────────────────────────────────

function MemberCard({
  member,
  index,
  onClick,
  colors,
  isDark,
}: {
  member: Member;
  index: number;
  onClick: (m: Member) => void;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), (index % 3) * 80);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const cardBg = isDark ? '#1a2160' : '#ffffff';
  const imgBg = isDark ? '#1e2870' : '#eef0fb';

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(member)}
      className="rounded-xl overflow-hidden cursor-pointer group border border-transparent"
      style={{
        background: cardBg,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease, transform 0.5s ease, border-color 0.25s, box-shadow 0.25s`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#3B5BDB';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(59,91,219,0.15)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Photo placeholder */}
      <div
        className="w-full aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.02]"
        style={{ background: imgBg }}
      />

      {/* Info */}
      <div className="px-4 pt-4 pb-5">
        <h3
          className="text-base sm:text-lg font-bold mb-0.5 tracking-tight"
          style={{ color: colors.text }}
        >
          {member.name}
        </h3>
        <p
          className="text-xs sm:text-sm font-medium mb-2"
          style={{ color: colors.textSubtle }}
        >
          {member.role}
        </p>
        <p
          className="text-xs sm:text-sm italic leading-snug"
          style={{ color: colors.textMuted }}
        >
          {member.quote}
        </p>
      </div>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function MemberModal({
  member,
  onClose,
  colors,
  isDark,
}: {
  member: Member;
  onClose: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setMounted(true));
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const modalBg = isDark ? '#0d1340' : '#ffffff';
  const imgBg = isDark ? '#1e2870' : '#eef0fb';
  const tagBg = isDark ? 'rgba(255,255,255,0.08)' : '#f0f2fb';
  const projectTagBg = isDark ? 'rgba(163,208,69,0.15)' : '#eef5d6';
  const projectTagText = isDark ? '#A3D045' : '#4a6c00';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,19,64,0.08)';

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: 'rgba(10,14,40,0.7)',
        backdropFilter: 'blur(6px)',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: modalBg,
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(13,19,64,0.08)',
            color: colors.text,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(13,19,64,0.14)')}
          onMouseLeave={e => (e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(13,19,64,0.08)')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Photo — tall rectangle matching design */}
        <div
          className="w-full"
          style={{ background: imgBg, aspectRatio: '1 / 1.1' }}
        />

        {/* Info block */}
        <div className="px-6 pt-6 pb-8">
          {/* Name row + socials */}
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: colors.text }}
              >
                {member.name}
              </h2>
              <p
                className="text-sm sm:text-base font-medium mt-0.5"
                style={{ color: colors.textSubtle }}
              >
                {member.role}
              </p>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1 shrink-0">
              {/* Portfolio link */}
              <a
                href="#"
                className="transition-opacity hover:opacity-60"
                style={{ color: colors.text }}
                aria-label="Portfolio"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                className="transition-opacity hover:opacity-60"
                style={{ color: colors.text }}
                aria-label="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="#"
                className="transition-opacity hover:opacity-60"
                style={{ color: colors.text }}
                aria-label="Twitter / X"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quote */}
          <p
            className="text-sm sm:text-base italic mt-4 mb-5"
            style={{ color: colors.textMuted }}
          >
            {member.quote}
          </p>

          {/* Divider */}
          <div className="h-px mb-5" style={{ background: borderColor }} />

          {/* Skills row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {member.skills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                style={{ background: tagBg, color: colors.text }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Projects row */}
          <div className="flex flex-wrap gap-2">
            {member.projects.map(project => (
              <span
                key={project}
                className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                style={{ background: projectTagBg, color: projectTagText }}
              >
                {project}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function MembersPage() {
  const { dark, setDark, colors } = useTheme();
  const isDark = dark;

  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    document.documentElement.style.color = colors.text;
    window.scrollTo(0, 0);
    setTimeout(() => setHeaderVisible(true), 80);
  }, [colors]);

  const filtered = members.filter(m => m.category.includes(activeFilter as any));

  const handleCardClick = useCallback((m: Member) => setSelectedMember(m), []);
  const handleClose = useCallback(() => setSelectedMember(null), []);

  const filterBtnStyle = (f: Filter) => ({
    background: activeFilter === f ? colors.text : 'transparent',
    color: activeFilter === f ? (isDark ? '#0d1340' : '#ffffff') : colors.text,
    border: `1px solid ${activeFilter === f ? 'transparent' : colors.divider}`,
    transition: 'background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />

      <main className="flex-1 w-full">
        <PageMargin>

          {/* ── HERO ── */}
          <div
            className="text-center pt-16 pb-12"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
              style={{ color: colors.text }}
            >
              Our Members
            </h1>
            {/* Lime green underline accent */}
            <div
              className="mx-auto h-[3px] bg-[#A3D045] mb-5"
              style={{
                width: headerVisible ? '64px' : '0px',
                transition: 'width 0.7s ease 0.3s',
              }}
            />
            <p
              className="text-base sm:text-lg"
              style={{ color: colors.textMuted }}
            >
              Builders. Designers. Developers.
            </p>
          </div>

          {/* ── FILTER TABS ── */}
          <div
            className="flex flex-wrap gap-2 sm:gap-3 mb-10 justify-center"
            style={{
              opacity: headerVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.2s',
            }}
          >
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium"
                style={filterBtnStyle(f)}
                onMouseEnter={e => {
                  if (activeFilter !== f) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ── CATEGORY LABEL ── */}
          <div className="mb-6">
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: colors.text }}
            >
              {activeFilter}
            </h2>
            <div className="mt-1 h-[3px] w-10 bg-[#A3D045]" />
          </div>

          {/* ── GRID ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-24">
            {filtered.map((m, i) => (
              <MemberCard
                key={m.id}
                member={m}
                index={i}
                onClick={handleCardClick}
                colors={colors}
                isDark={isDark}
              />
            ))}
          </div>

          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>

      <Footer colors={colors} />

      {/* ── MODAL ── */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={handleClose}
          colors={colors}
          isDark={isDark}
        />
      )}
    </div>
  );
}