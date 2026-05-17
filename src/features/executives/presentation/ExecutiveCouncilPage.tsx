/**
 * EXECUTIVE COUNCIL PAGE
 * Design: "Executive Council" hero, 2 filter tabs (Founding Council / '27),
 * 2-column card grid, click-to-open modal identical to Members modal style.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../landing/domain/useTheme';
import { Navigation } from '../../../shared/components/Navigation';
import { Footer } from '../../../shared/components/Footer';
import { CTASection } from '../../../shared/components/CTASection';
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';
import { PageMargin } from '../../../shared/components/PageMargin';

interface CouncilMember {
  id: number;
  name: string;
  role: string;
  description: string;
  category: ('Founding Council' | "'27")[];
  skills: string[];
}

const councilMembers: CouncilMember[] = [
  { id: 1, name: 'Habeeb Abayomi M.', role: 'Executive President', description: 'Leads vision and strategic direction.', category: ['Founding Council'], skills: ['Node.js', 'PostgreSQL'] },
  { id: 2, name: 'Chinwe Eze', role: 'Chief Technology Officer', description: 'Oversees technological innovation', category: ['Founding Council'], skills: ['React', 'TypeScript'] },
  { id: 3, name: 'Olumide Akinola', role: 'Head of Marketing', description: 'Drives brand awareness and engagement.', category: ['Founding Council'], skills: ['Strategy', 'Growth'] },
  { id: 4, name: 'Amina Yusuf', role: 'Finance Manager', description: 'Manages budgets and financial reporting.', category: ['Founding Council'], skills: ['Finance', 'Excel'] },
  { id: 5, name: 'Emeka Okafor', role: 'Operations Director', description: 'Ensures efficient daily business operations.', category: ['Founding Council'], skills: ['Operations', 'Logistics'] },
  { id: 6, name: 'Sade Balogun', role: 'Human Resources Lead', description: 'Handles recruitment, welfare, and compliance.', category: ['Founding Council'], skills: ['HR', 'People Ops'] },
  { id: 7, name: 'Tunde Adeyemi', role: 'Product Lead', description: 'Coordinates product roadmap and delivery.', category: ["'27"], skills: ['Product', 'Agile'] },
  { id: 8, name: 'Ngozi Okonkwo', role: 'Design Lead', description: 'Drives visual identity and design systems.', category: ["'27"], skills: ['Figma', 'Design Systems'] },
];

const FILTERS = ['Founding Council', "'27"] as const;
type Filter = typeof FILTERS[number];

const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/>
  </svg>
);

function CouncilCard({ member, index, onClick, colors, isDark }: {
  member: CouncilMember; index: number;
  onClick: (m: CouncilMember) => void;
  colors: ReturnType<typeof useTheme>['colors']; isDark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), (index % 2) * 100); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref} onClick={() => onClick(member)}
      className="rounded-xl overflow-hidden cursor-pointer border border-transparent"
      style={{ background: isDark ? '#1a2160' : '#ffffff', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(22px)', transition: 'opacity 0.55s ease, transform 0.55s ease, border-color 0.25s, box-shadow 0.25s, transform 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#3B5BDB'; el.style.boxShadow = '0 8px 24px rgba(59,91,219,0.14)'; el.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = 'transparent'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; el.style.transform = 'translateY(0)'; }}
    >
      <div className="w-full" style={{ background: isDark ? '#1e2870' : '#eef0fb', aspectRatio: '4/3' }} />
      <div className="px-5 pt-5 pb-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-1 tracking-tight" style={{ color: colors.text }}>{member.name}</h3>
        <p className="text-sm font-medium mb-3" style={{ color: colors.textSubtle }}>{member.role}</p>
        <p className="text-sm italic leading-snug" style={{ color: colors.textMuted }}>{member.description}</p>
      </div>
    </div>
  );
}

function CouncilModal({ member, onClose, colors, isDark }: {
  member: CouncilMember; onClose: () => void;
  colors: ReturnType<typeof useTheme>['colors']; isDark: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { document.body.style.overflow = 'hidden'; requestAnimationFrame(() => setMounted(true)); return () => { document.body.style.overflow = ''; }; }, []);
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [onClose]);

  const tagBg = isDark ? 'rgba(255,255,255,0.08)' : '#f0f2fb';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,19,64,0.08)';

  return (
    <div ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose(); }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(10,14,40,0.72)', backdropFilter: 'blur(6px)', opacity: mounted ? 1 : 0, transition: 'opacity 0.25s ease' }}>
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: isDark ? '#0d1340' : '#ffffff', transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)', transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1)', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(13,19,64,0.08)', color: colors.text }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div className="w-full" style={{ background: isDark ? '#1e2870' : '#eef0fb', aspectRatio: '1 / 1.05' }} />
        <div className="px-6 pt-6 pb-8">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: colors.text }}>{member.name}</h2>
              <p className="text-sm sm:text-base font-medium mt-0.5" style={{ color: colors.textSubtle }}>{member.role}</p>
            </div>
            <div className="flex items-center gap-3 mt-1 shrink-0" style={{ color: colors.text }}>
              <a href="#" className="hover:opacity-60 transition-opacity"><LinkIcon /></a>
              <a href="#" className="hover:opacity-60 transition-opacity"><LinkedInIcon /></a>
              <a href="#" className="hover:opacity-60 transition-opacity"><XIcon /></a>
            </div>
          </div>
          <p className="text-sm sm:text-base italic mt-4 mb-5" style={{ color: colors.textMuted }}>{member.description}</p>
          <div className="h-px mb-5" style={{ background: borderColor }} />
          <div className="flex flex-wrap gap-2">
            {member.skills.map(s => (
              <span key={s} className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium" style={{ background: tagBg, color: colors.text }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExecutiveCouncilPage() {
  const { dark, setDark, colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<Filter>('Founding Council');
  const [selected, setSelected] = useState<CouncilMember | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => { document.documentElement.style.color = colors.text; window.scrollTo(0, 0); setTimeout(() => setHeaderVisible(true), 80); }, [colors]);

  const filtered = councilMembers.filter(m => m.category.includes(activeFilter));
  const handleClick = useCallback((m: CouncilMember) => setSelected(m), []);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />
      <main className="flex-1 w-full">
        <PageMargin>
          {/* HERO */}
          <div className="text-center pt-16 pb-10" style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-3" style={{ color: colors.text }}>Executive Council</h1>
            <div className="mx-auto h-[3px] bg-[#A3D045] mb-5" style={{ width: headerVisible ? '80px' : '0px', transition: 'width 0.7s ease 0.35s' }} />
            <p className="text-base sm:text-lg" style={{ color: colors.textMuted }}>Vision. Strategy. Execution.</p>
          </div>
          {/* FILTERS */}
          <div className="flex gap-2 sm:gap-3 mb-10 justify-center" style={{ opacity: headerVisible ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className="px-5 py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-200 hover:scale-[1.04]"
                style={{ background: activeFilter === f ? colors.text : 'transparent', color: activeFilter === f ? (dark ? '#0d1340' : '#ffffff') : colors.text, border: `1px solid ${activeFilter === f ? 'transparent' : colors.divider}` }}>
                {f}
              </button>
            ))}
          </div>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-24">
            {filtered.map((m, i) => <CouncilCard key={m.id} member={m} index={i} onClick={handleClick} colors={colors} isDark={dark} />)}
          </div>
          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>
      <Footer colors={colors} />
      {selected && <CouncilModal member={selected} onClose={handleClose} colors={colors} isDark={dark} />}
    </div>
  );
}