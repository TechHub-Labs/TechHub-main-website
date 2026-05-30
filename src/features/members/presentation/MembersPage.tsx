/**
 * MEMBERS PAGE
 * Design: "Our Members" hero, filter tabs (All / Undergrad / Alumni / '25 / '26),
 * 3-column card grid, click-to-open modal with photo, name, role, quote, socials, skills, projects.
 */

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../../landing/domain/useTheme";
import { Navigation } from "../../../shared/components/Navigation";
import { Footer } from "../../../shared/components/Footer";
import { CTASection } from "../../../shared/components/CTASection";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { DemoMember as Member } from "../../../core/data/demoData";
import { supabase } from "../../../core/supabase/client";

// Import modular subcomponents
import { MemberCard } from "./components/MemberCard";
import { MemberModal } from "./components/MemberModal";

const FILTERS = ["All", "Undergrad", "Alumni"] as const;
type Filter = (typeof FILTERS)[number];

export function MembersPage() {
  const { dark, setDark, colors } = useTheme();
  const isDark = dark;

  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.style.color = colors.text;
    window.scrollTo(0, 0);
    setTimeout(() => setHeaderVisible(true), 80);

    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('visible', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.warn("Failed to load members from Supabase:", error.message);
        } else if (data) {
          const mapped: Member[] = data.map((m: any) => ({
            id: m.id,
            name: m.name,
            role: m.role_title || 'Member',
            quote: m.quote || '',
            avatar_url: m.avatar_url,
            category: m.category || [],
            skills: m.skills || [],
            projects: m.projects || [],
            linkedin: m.linkedin || '',
            twitter: m.twitter || '',
            portfolio: m.github || '', // github column holds portfolio link
          }));
          setMembersList(mapped);
        }
      } catch (err) {
        console.warn("Failed to load members from Supabase:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [colors]);

  const filtered = membersList.filter((m) =>
    activeFilter === "All" || m.category.includes(activeFilter as any)
  );

  const handleCardClick = useCallback((m: Member) => setSelectedMember(m), []);
  const handleClose = useCallback(() => setSelectedMember(null), []);

  const filterBtnStyle = (f: Filter) => ({
    background: activeFilter === f ? colors.text : "transparent",
    color: activeFilter === f ? (isDark ? "#0d1340" : "#ffffff") : colors.text,
    border: `1px solid ${activeFilter === f ? "transparent" : colors.divider}`,
    transition:
      "background 0.2s, color 0.2s, border-color 0.2s, transform 0.15s",
  });

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
          {/* ── HERO ── */}
          <div
            className="text-center pt-16 pb-24"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {/* Standardized and animated SectionTitle */}
            <SectionTitle
              title="Our Members"
              subtitle="Builders. Designers. Developers."
              tag="h1"
              align="center"
              colors={colors}
              immediate={true}
            />
          </div>

          {/* ── FILTER TABS ── */}
          <div
            className="flex flex-wrap gap-2 sm:gap-3 mb-10 justify-center border p-[6px] rounded-sm w-fit items-center mx-auto"
            style={{
              borderWidth: "1px",
              borderColor: "#0F1B4D26",
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 0.6s ease 0.2s",
            }}
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-4 sm:px-5 py-2 rounded-md text-base sm:text-lg font-normal border border-1 border-[#0F1B4D26] cursor-pointer"
                style={filterBtnStyle(f)}
                onMouseEnter={(e) => {
                  if (activeFilter !== f)
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ── CATEGORY LABEL ── */}
          <div className="mb-6">
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{ color: colors.text }}
            >
              {activeFilter}
            </h2>
            <div className="mt-1 h-[3px] w-10 bg-[#A3D045]" />
          </div>

          {/* ── GRID ── */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <span className="text-xl font-semibold animate-pulse" style={{ color: colors.textMuted }}>
                Loading members...
              </span>
            </div>
          ) : (
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
          )}

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
