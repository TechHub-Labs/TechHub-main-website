/**
 * EXECUTIVE COUNCIL PAGE
 * Design: "Executive Council" hero, 2 filter tabs (Founding Council / '27),
 * 2-column card grid, click-to-open modal identical to Members modal style.
 * Animations: spring card pop-in, hover tilt, modal scale-in
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../landing/domain/useTheme";
import { Navigation } from "../../../shared/components/Navigation";
import { Footer } from "../../../shared/components/Footer";
import { CTASection } from "../../../shared/components/CTASection";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";
import { supabase } from "../../../core/supabase/client";

// Local interface matching what the page expects
interface CouncilMember {
  id: string;
  name: string;
  role: string;
  description: string;
  quote?: string;
  avatar_url?: string;
  category: string[];
  skills: string[];
  portfolio?: string;
  linkedin?: string;
  twitter?: string;
}

const FILTERS = ["Founding Council", "'27"] as const;
type Filter = (typeof FILTERS)[number];

function CouncilCard({
  member,
  index,
  onClick,
  colors,
  isDark,
}: {
  member: CouncilMember;
  index: number;
  onClick: (m: CouncilMember) => void;
  colors: ReturnType<typeof useTheme>["colors"];
  isDark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(true), (index % 2) * 100);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      onClick={() => onClick(member)}
      className="rounded-xl flex flex-col justify-center items-center overflow-hidden cursor-pointer border border-transparent"
      style={{
        background: isDark ? colors.bgCard : colors.bgCard,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition:
          "opacity 0.55s ease, transform 0.55s ease, border-color 0.25s, box-shadow 0.25s, transform 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = colors.accent;
        el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
        el.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "transparent";
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
        el.style.transform = "translateY(0)";
      }}
    >
      <div
        className="w-full bg-cover bg-center"
        style={{
          background: member.avatar_url ? `url(${member.avatar_url}) center / cover` : (isDark ? colors.bgCardHover : colors.bgCardHover),
          aspectRatio: "4/3",
        }}
      />
      <div className="px-5 pt-5 pb-6  flex flex-col justify-center items-center">
        <h3
          className="text-xl sm:text-3xl font-bold mb-1 tracking-tight"
          style={{ color: colors.text }}
        >
          {member.name}
        </h3>
        <p
          className="text-base font-medium mb-3"
          style={{ color: colors.textSubtle }}
        >
          {member.role}
        </p>
        <p
          className="text-base italic leading-snug"
          style={{ color: colors.textMuted }}
        >
          {member.description}
        </p>
      </div>
    </div>
  );
}

function CouncilModal({
  member,
  onClose,
  colors,
  isDark,
}: {
  member: CouncilMember;
  onClose: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
  isDark: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => setMounted(true));
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const tagBg = colors.tagBg;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: "rgba(10,14,40,0.72)",
        backdropFilter: "blur(6px)",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden"
        style={{
          background: isDark ? "#0d1340" : "#ffffff",
          transform: mounted
            ? "translateY(0) scale(1)"
            : "translateY(24px) scale(0.97)",
          transition: "transform 0.32s cubic-bezier(0.34,1.56,0.64,1)",
          maxHeight: "90vh",
          overflowY: "auto",
          scrollbarWidth: "none" as const,
          msOverflowStyle: "none" as const,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
          style={{
            background: isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(13,19,64,0.08)",
            color: colors.text,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div
          className="w-full"
          style={{
            background: isDark ? "#1e2870" : "#eef0fb",
            aspectRatio: "1 / 1.1",
          }}
        />
        {/* Info block */}
        <div className="px-6 pt-6 pb-8">
          <div className="grid grid-cols-[1fr_auto] gap-8 items-start">
            {/* LEFT COLUMN */}
            <div className="min-w-0">
              <h2
                className="text-2xl sm:text-3xl font-medium tracking-tight"
                style={{ color: colors.text }}
              >
                {member.name}
              </h2>

              <p
                className="text-sm sm:text-lg font-medium mt-1"
                style={{ color: colors.textSubtle }}
              >
                {member.role}
              </p>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col items-end shrink-0">
              {/* Social icons */}
              <div className="flex items-center gap-3 mb-6">
                {/* Portfolio link */}
                <a
                  href={member.portfolio || "https://nhtechhub.org"}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-opacity hover:opacity-60"
                  style={{ color: colors.text }}
                  aria-label="Portfolio"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={member.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-opacity hover:opacity-60"
                  style={{ color: colors.text }}
                  aria-label="LinkedIn"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href={member.twitter || "https://twitter.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-opacity hover:opacity-60"
                  style={{ color: colors.text }}
                  aria-label="Twitter / X"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
                  </svg>
                </a>
              </div>

              {/* Skills row */}
              <div className="flex flex-wrap justify-end gap-2 mb-3 max-w-[220px]">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap"
                    style={{
                      background: tagBg,
                      color: colors.text,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

            {/* Quote */}
            <p
              className="text-xs sm:text-sm italic mt-1 leading-relaxed"
              style={{ color: colors.textMuted }}
            >
              {member.quote !== undefined && <span>“{member.quote}”</span>}
            </p>
        </div>
      </div>
    </div>
  );
}

export function ExecutiveCouncilPage() {
  const { dark, setDark, colors } = useTheme();
  const [activeFilter, setActiveFilter] = useState<Filter>("Founding Council");
  const [selected, setSelected] = useState<CouncilMember | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.style.color = colors.text;
    window.scrollTo(0, 0);
    setTimeout(() => setHeaderVisible(true), 80);

    const loadData = async () => {
      const { data } = await supabase.from('executives').select('*').eq('visible', true);
      if (data) {
        const mapped: CouncilMember[] = data.map((exec: any) => ({
          id: exec.id,
          name: exec.name,
          role: exec.role_title || 'Executive',
          description: exec.quote || '',
          quote: exec.quote || '',
          avatar_url: exec.avatar_url,
          category: exec.category || [],
          skills: [],
          portfolio: '',
          linkedin: '',
          twitter: ''
        }));
        setCouncilMembers(mapped);
      }
      setLoading(false);
    };
    loadData();
  }, [colors]);

  const filtered = councilMembers.filter((m) =>
    m.category.includes(activeFilter),
  );
  const handleClick = useCallback((m: CouncilMember) => setSelected(m), []);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation
        colors={colors}
        dark={dark}
        onThemeToggle={() => setDark(!dark)}
      />
      <main className="flex-1 w-full">
        <PageMargin>
          {/* HERO */}
          <div
            className="text-center pt-16 pb-10"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-3"
              style={{ color: colors.text }}
            >
              Executive Council
            </h1>
            <div
              className="mx-auto h-[3px] mb-4"
              style={{
                width: headerVisible ? "360px" : "0px",
                transition: "width 0.7s ease 0.3s",
                background: "#A4D045",
              }}
            />
            <p
              className=" font-medium text-base sm:text-lg"
              style={{ color: colors.textMuted }}
            >
              Vision. Strategy. Execution.
            </p>
          </div>
          {/* FILTERS */}
          <div
            className="flex gap-2 sm:gap-3 mb-10 justify-center border p-[6px] rounded-sm w-fit items-center mx-auto"
            style={{
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 0.6s ease 0.2s",
            }}
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-5 py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-200 hover:scale-[1.04] border border-1 border-[#0F1B4D26]"
                style={{
                  background: activeFilter === f ? colors.text : "transparent",
                  color:
                    activeFilter === f
                      ? dark
                        ? "#0d1340"
                        : "#ffffff"
                      : colors.text,
                  border: `1px solid ${activeFilter === f ? "transparent" : colors.divider}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-24 min-h-[40vh]">
            {loading ? (
              <div className="col-span-1 sm:col-span-2 flex justify-center items-center">
                <p style={{ color: colors.textMuted }}>Loading executives...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 flex justify-center items-center">
                <p style={{ color: colors.textMuted }}>No executives found in this category.</p>
              </div>
            ) : (
              filtered.map((m, i) => (
                <CouncilCard
                  key={m.id}
                  member={m}
                  index={i}
                  onClick={handleClick}
                  colors={colors}
                  isDark={dark}
                />
              ))
            )}
          </div>
          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>
      <Footer colors={colors} />
      {selected && (
        <CouncilModal
          member={selected}
          onClose={handleClose}
          colors={colors}
          isDark={dark}
        />
      )}
    </div>
  );
}
