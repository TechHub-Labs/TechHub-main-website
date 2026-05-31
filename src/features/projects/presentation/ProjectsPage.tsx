/**
 * ProjectsPage.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useState } from "react";
import { useTheme } from "../../landing/domain/useTheme";
import { Navigation } from "../../../shared/components/Navigation";
import { Footer } from "../../../shared/components/Footer";
import { CTASection } from "../../../shared/components/CTASection";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { supabase } from "../../../core/supabase/client";
import { ProjectRow } from "./components/ProjectRow";

export interface Project {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  status: "LIVE" | "BETA" | "PAUSED" | "IN DEVELOPMENT" | "UPCOMING";
  category: string;
  teamSize: string;
  tech: string;
  launchDate: string;
  website: string;
  about: string;
  about2: string;
}

const PAGE_SIZE = 9;

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 12 12"
    fill="none"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s ease",
    }}
  >
    <path
      d="M2 4l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export function ProjectsPage() {
  const { dark, setDark, colors } = useTheme();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Category");
  const [statusFilter, setStatusFilter] = useState("Filter by Status");
  const [showCatDrop, setShowCatDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  const [allProjects, setAllProjects] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setMounted(true));

    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setAllProjects(data);
    };
    fetchProjects();
  }, []);

  const categories: string[] = [
    "All",
    ...Array.from(new Set(allProjects.map((p) => p.category))),
  ];
  const statuses: (Project["status"] | "All")[] = [
    "All",
    "LIVE",
    "BETA",
    "PAUSED",
    "IN DEVELOPMENT",
    "UPCOMING",
  ];

  const filtered = allProjects.filter((p) => {
    const matchesSearch =
      (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.short_description || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "Category" || category === "All" || p.category === category;
    const matchesStatus =
      statusFilter === "Filter by Status" ||
      statusFilter === "All" ||
      p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-screen flex-col">
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation
        colors={colors}
        dark={dark}
        onThemeToggle={() => setDark(!dark)}
      />

      <main className="w-full flex-1 overflow-x-hidden">
        <PageMargin>
          <section
            className="pb-12 pt-20"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0px)" : "translateY(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <SectionTitle
              title="Projects"
              tag="h1"
              subtitle="Building real products. Solving real problems."
              colors={colors}
              immediate
              delay={100}
            />
          </section>

          <section className="relative z-50 mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="flex h-16 w-full items-center gap-3 rounded-2xl border px-5 lg:max-w-[720px]"
              style={{ background: colors.bgCard, borderColor: colors.divider }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: colors.textMuted, flexShrink: 0 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="flex-1 min-w-0 bg-transparent text-base outline-none"
                style={{ color: colors.text }}
              />

              <div className="relative">
                <button
                  onClick={() => {
                    setShowCatDrop(!showCatDrop);
                    setShowStatusDrop(false);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
                  style={{ color: colors.text }}
                >
                  {category} <ChevronIcon open={showCatDrop} />
                </button>

                {showCatDrop && (
                  <div
                    className="absolute left-0 top-full z-50 mt-3 min-w-[180px] rounded-2xl border py-2 shadow-xl"
                    style={{
                      background: colors.bgCard,
                      borderColor: colors.divider,
                      animation:
                        "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
                    }}
                  >
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCategory(c);
                          setShowCatDrop(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm transition-opacity hover:opacity-70"
                        style={{ color: colors.text }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusDrop(!showStatusDrop);
                  setShowCatDrop(false);
                }}
                className="flex h-16 items-center gap-3 rounded-2xl border px-6 text-sm font-semibold w-full lg:w-auto"
                style={{
                  background: colors.bgCard,
                  borderColor: colors.divider,
                  color: colors.text,
                }}
              >
                {statusFilter} <ChevronIcon open={showStatusDrop} />
              </button>

              {showStatusDrop && (
                <div
                  className="absolute right-0 top-full z-50 mt-3 min-w-[220px] rounded-2xl border py-2 shadow-xl"
                  style={{
                    background: colors.bgCard,
                    borderColor: colors.divider,
                    animation: "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
                  }}
                >
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatusFilter(s);
                        setShowStatusDrop(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm transition-opacity hover:opacity-70"
                      style={{ color: colors.text }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section
            className="overflow-hidden rounded-3xl border"
            style={{ borderColor: colors.divider }}
          >
            {paginated.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
                colors={colors}
              />
            ))}
          </section>

          <section className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:pb-24">
            <p
              className="text-sm sm:text-base"
              style={{ color: colors.textMuted }}
            >
              Page {page} of {totalPages}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-110"
                  style={{
                    background: page === n ? colors.tagBg : "transparent",
                    color: colors.text,
                    transform: page === n ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {n}
                </button>
              ))}
              {page < totalPages && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="ml-2 flex h-10 items-center rounded-lg border px-5 text-sm font-semibold transition-all hover:scale-105 hover:opacity-70"
                  style={{
                    background: colors.bgCard,
                    color: colors.text,
                    borderColor: colors.divider,
                  }}
                >
                  Next
                </button>
              )}
            </div>
          </section>

          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>

      <Footer colors={colors} />
    </div>
  );
}
