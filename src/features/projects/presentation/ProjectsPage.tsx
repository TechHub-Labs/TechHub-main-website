/**
 * PROJECTS PAGE
 * Tailwind-only styling version
 * Matches NH TechHub design with scroll animations, staggered rows
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../landing/domain/useTheme";
import { Navigation } from "../../../shared/components/Navigation";
import { Footer } from "../../../shared/components/Footer";
import { CTASection } from "../../../shared/components/CTASection";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { DEMO_ALL_PROJECTS } from "../../../core/data/demoData";

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

// Cast demo data to match the local Project interface
export const allProjects: Project[] = DEMO_ALL_PROJECTS as Project[];

const PAGE_SIZE = 9;

function ProjectRow({
  project,
  index,
  colors,
}: {
  project: Project;
  index: number;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 70);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, [index]);

  const getStatusColor = () => {
    switch (project.status) {
      case "LIVE":
        return colors.statusLive;
      case "BETA":
        return "#a8cf45";
      case "PAUSED":
        return colors.statusPaused;
      case "IN DEVELOPMENT":
        return colors.statusInDev;
      case "UPCOMING":
        return colors.statusUpcoming;
      default:
        return colors.statusLive;
    }
  };

  return (
    <Link to={`/projects/${project.id}`} className="block no-underline">
      <div
        ref={ref}
        className="group flex items-center gap-5 lg:gap-7 border-b px-5 sm:px-7 py-6"
        style={{
          borderColor: colors.divider,
          background: colors.bgCard,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0px) translateX(0px)"
            : index % 2 === 0
              ? "translateY(18px) translateX(-8px)"
              : "translateY(18px) translateX(8px)",
          transition: `opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)`,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.008) translateX(4px)';
          (e.currentTarget as HTMLDivElement).style.background = colors.bgCardHover || colors.bgCard;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) translateX(0)';
          (e.currentTarget as HTMLDivElement).style.background = colors.bgCard;
        }}
      >
        {/* ICON */}
        <div
          className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{
            background: colors.memberBg,
          }}
        />

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <h3
            className="mb-2 text-2xl sm:text-[2rem] font-bold leading-none tracking-tight"
            style={{
              color: colors.text,
            }}
          >
            {project.name}
          </h3>

          <p
            className="mb-3 text-sm sm:text-base leading-relaxed"
            style={{
              color: colors.textMuted,
            }}
          >
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-xs font-semibold sm:text-sm transition-transform duration-200 hover:scale-105"
                style={{
                  background: colors.tagBg,
                  color: colors.text,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* STATUS */}
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="h-[10px] w-[10px] rounded-full"
            style={{
              background: getStatusColor(),
              animation: project.status === 'LIVE' ? 'pulseGlow 2s ease-in-out infinite' : 'none',
            }}
          />

          <span
            className="text-xs sm:text-sm font-bold tracking-wide"
            style={{
              color: getStatusColor(),
            }}
          >
            {project.status}
          </span>
        </div>

        {/* Arrow indicator */}
        <span
          className="text-xl shrink-0 transition-transform duration-300 group-hover:translate-x-2 opacity-0 group-hover:opacity-100"
          style={{ color: colors.textMuted }}
        >
          →
        </span>
      </div>
    </Link>
  );
}

export function ProjectsPage() {
  const { dark, setDark, colors } = useTheme();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Category");
  const [statusFilter, setStatusFilter] =
    useState("Filter by Status");

  const [showCatDrop, setShowCatDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] =
    useState(false);

  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  const categories = [
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
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "Category" ||
      category === "All" ||
      p.category === category;

    const matchesStatus =
      statusFilter === "Filter by Status" ||
      statusFilter === "All" ||
      p.status === statusFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );
  });

  const totalPages = Math.ceil(
    filtered.length / PAGE_SIZE
  );

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="flex min-h-screen flex-col">
      <WebsiteBackground
        isDark={dark}
        bgColor={colors.bg}
      />

      <Navigation
        colors={colors}
        dark={dark}
        onThemeToggle={() => setDark(!dark)}
      />

      <main className="w-full flex-1 overflow-x-hidden">
        <PageMargin>
          {/* HERO */}
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

          {/* FILTERS */}
          <section className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* SEARCH */}
            <div
              className="flex h-16 w-full items-center gap-3 rounded-2xl border px-5 lg:max-w-[720px]"
              style={{
                background: colors.bgCard,
                borderColor: colors.divider,
              }}
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
                style={{
                  color: colors.textMuted,
                  flexShrink: 0,
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                />
              </svg>

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="flex-1 min-w-0 bg-transparent text-base outline-none"
                style={{
                  color: colors.text,
                }}
              />

              {/* CATEGORY */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCatDrop(!showCatDrop);
                    setShowStatusDrop(false);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
                  style={{
                    color: colors.text,
                  }}
                >
                  {category}

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                      transform: showCatDrop ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <path
                      d="M2 4l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {showCatDrop && (
                  <div
                    className="absolute left-0 top-full z-50 mt-3 min-w-[180px] rounded-2xl border py-2 shadow-xl"
                    style={{
                      background: colors.bgCard,
                      borderColor: colors.divider,
                      animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
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
                        style={{
                          color: colors.text,
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* STATUS */}
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
                {statusFilter}

                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{
                    transform: showStatusDrop ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <path
                    d="M2 4l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {showStatusDrop && (
                <div
                  className="absolute right-0 top-full z-50 mt-3 min-w-[220px] rounded-2xl border py-2 shadow-xl"
                  style={{
                    background: colors.bgCard,
                    borderColor: colors.divider,
                    animation: 'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
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
                      style={{
                        color: colors.text,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* PROJECT LIST */}
          <section
            className="overflow-hidden rounded-3xl border"
            style={{
              borderColor: colors.divider,
            }}
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

          {/* PAGINATION */}
          <section className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:pb-24">
            <p
              className="text-sm sm:text-base"
              style={{
                color: colors.textMuted,
              }}
            >
              Page {page} of {totalPages}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-110"
                  style={{
                    background:
                      page === n
                        ? colors.tagBg
                        : "transparent",
                    color: colors.text,
                    transform: page === n ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {n}
                </button>
              ))}

              {page < totalPages && (
                <button
                  onClick={() =>
                    setPage((prev) => prev + 1)
                  }
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