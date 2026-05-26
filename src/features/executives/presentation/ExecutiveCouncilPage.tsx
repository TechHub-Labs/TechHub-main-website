/**
 * EXECUTIVE COUNCIL PAGE
 * Design: "Executive Council" hero, 2 filter tabs (Founding Council / '27),
 * 2-column card grid, click-to-open modal identical to Members modal style.
 * Animations: spring card pop-in, hover tilt, modal scale-in
 */

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../landing/domain/useTheme";
import { Navigation } from "../../../shared/components/Navigation";
import { Footer } from "../../../shared/components/Footer";
import { CTASection } from "../../../shared/components/CTASection";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { supabase } from "../../../core/supabase/client";

// Import modular subcomponents
import { CouncilCard, CouncilMember } from "./components/CouncilCard";
import { CouncilModal } from "./components/CouncilModal";

const FILTERS = ["Founding Council", "'27"] as const;
type Filter = (typeof FILTERS)[number];

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
          skills: exec.skills || [],
          portfolio: exec.portfolio || '',
          linkedin: exec.linkedin || '',
          twitter: exec.twitter || ''
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
            {/* Standardized and animated SectionTitle */}
            <SectionTitle
              title="Executive Council"
              subtitle="Vision. Strategy. Execution."
              tag="h1"
              align="center"
              colors={colors}
              immediate={true}
            />
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
