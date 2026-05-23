/* =========================================
   PROJECT DETAILS PAGE
   Updated:
   - Dynamic breadcrumb based on URL
   - Dynamic project data loading
   - Tailwind-first styling
   - Premium animations
   - Better typography hierarchy
========================================= */

import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
} from 'react-icons/fa6';

import { useTheme } from '../../landing/domain/useTheme';
import { allProjects } from '../../../core/data/mockData';
import { DEMO_PROJECT_BUILDERS as builders } from '../../../core/data/demoData';
import { Navigation } from '../../../shared/components/Navigation';
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';
import { PageMargin } from '../../../shared/components/PageMargin';
import { Footer } from '../../../shared/components/Footer';
import { CTASection } from '../../../shared/components/CTASection';

export function ProjectDetailsPage() {
  const { dark, setDark, colors } = useTheme();

  const [mounted, setMounted] = useState(false);

  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    window.scrollTo(0, 0);
  }, []);

  const project = useMemo(() => {
    return allProjects.find(p => p.id === id);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1
          className="text-4xl font-bold"
          style={{ color: colors.text }}
        >
          Project not found
        </h1>
      </div>
    );
  }

  const breadcrumbItems = location.pathname
    .split('/')
    .filter(Boolean);

  const getStatusColor = () => {
    switch (project.status) {
      case 'LIVE':
        return '#A3D045';
      case 'BETA':
        return '#A3D045';
      case 'PAUSED':
        return '#E53935';
      case 'IN DEVELOPMENT':
        return '#4A7DFF';
      case 'UPCOMING':
        return '#D9C63F';
      default:
        return '#A3D045';
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="transition-colors duration-300">
      
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      
      <Navigation
        colors={colors}
        dark={dark}
        onThemeToggle={() => setDark(!dark)}
      />

      <main className="w-full flex-1">
        <PageMargin>
          <div className="max-w-[1400px] mx-auto pt-14 pb-24">
            
            {/* ================= BREADCRUMB ================= */}
            <div
              className={`flex items-center gap-2 text-sm lg:text-[15px] mb-10 transition-all duration-700 ${
                mounted
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-5'
              }`}
              style={{ color: colors.textMuted }}
            >
              {breadcrumbItems.map((item, index) => {
                const path = '/' + breadcrumbItems.slice(0, index + 1).join('/');
                const isLast = index === breadcrumbItems.length - 1;
                const label = item.charAt(0).toUpperCase() + item.slice(1);

                return (
                  <div key={path} className="flex items-center gap-2">
                    {!isLast ? (
                      <Link
                        to={path}
                        className="transition-opacity duration-300 hover:opacity-70"
                      >
                        {label}
                      </Link>
                    ) : (
                      <span
                        className="font-medium"
                        style={{ color: colors.text }}
                      >
                        {project.name}
                      </span>
                    )}

                    {!isLast && <span>›</span>}
                  </div>
                );
              })}
            </div>

            {/* ================= TOP SECTION ================= */}
            <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-start">
              {/* LEFT */}
              <div
                className={`transition-all duration-700 ${
                  mounted
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row items-start gap-7 mb-8">
                  <div
                    className="w-24 h-24 rounded-full shrink-0"
                    style={{
                      background: dark ? colors.bgCard : '#ECEFF7',
                    }}
                  />

                  <div>
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h1
                        className="text-5xl lg:text-6xl font-bold tracking-tight"
                        style={{ color: colors.text }}
                      >
                        {project.name}
                      </h1>

                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            background: getStatusColor(),
                          }}
                        />

                        <span
                          className="text-[15px] font-semibold"
                          style={{ color: colors.text }}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <p
                      className="text-lg lg:text-[20px] leading-relaxed mb-5 max-w-3xl"
                      style={{ color: colors.textMuted }}
                    >
                      {project.desc}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-4 py-2 rounded-full text-sm font-semibold"
                          style={{
                            background: dark
                              ? 'rgba(255,255,255,0.06)'
                              : '#EEF2FF',
                            color: colors.text,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* WEBSITE */}
                <div
                  className="flex items-center justify-between py-6 border-y mb-10"
                  style={{ borderColor: colors.divider }}
                >
                  <span
                    className="text-lg font-semibold"
                    style={{ color: colors.text }}
                  >
                    Website
                  </span>

                  {/* @ts-ignore */}
                  <a
                    href={`https://${project.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-base transition-opacity duration-300 hover:opacity-70"
                    style={{ color: '#3B5BDB' }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    {/* @ts-ignore */}
                    {project.website || "View Project"}
                  </a>
                </div>

                {/* DESCRIPTION */}
                <div
                  className="space-y-10 text-[17px] lg:text-[18px] leading-[2]"
                  style={{ color: colors.textMuted }}
                >
                  {/* @ts-ignore */}
                  <p>{project.about || "Detailed description coming soon."}</p>
                  {/* @ts-ignore */}
                  {project.about2 && <p>{project.about2}</p>}
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div
                className={`rounded-3xl border p-7 transition-all duration-700 hover:-translate-y-1 ${
                  mounted
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  background: colors.bgCard,
                  borderColor: colors.divider,
                }}
              >
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-8"
                  style={{
                    background: dark ? '#202868' : '#ECEFF7',
                  }}
                />

                <div className="space-y-5 mb-10">
                  {[
                    ['Status', project.status],
                    // @ts-ignore
                    ['Category', project.category || "Tech"],
                    // @ts-ignore
                    ['Team size', project.teamSize || "Loading..."],
                    // @ts-ignore
                    ['Tech', project.tech || project.tags.join(', ')],
                    // @ts-ignore
                    ['Launch date', project.launchDate || "TBA"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between text-[15px]"
                    >
                      <span style={{ color: colors.textMuted }}>
                        {label}:
                      </span>

                      <span
                        className="font-medium text-right"
                        style={{ color: colors.text }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-5">
                  {[FaTiktok, FaLinkedinIn, FaXTwitter].map((Icon, index) => (
                    <button
                      key={index}
                      className="text-2xl transition-all duration-300 hover:scale-110"
                      style={{ color: colors.text }}
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= ACTIVE BUILDERS ================= */}
            <div className="mt-28">
              <h2
                className="text-5xl lg:text-6xl font-bold mb-14 tracking-tight"
                style={{ color: colors.text }}
              >
                Active Builders
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {builders.map((builder, i) => (
                  <div
                    key={builder.name + i}
                    className={`rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group ${
                      mounted
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}
                    style={{
                      transitionDelay: `${i * 120}ms`,
                      background: colors.bgCard,
                      borderColor: colors.divider,
                    }}
                  >
                    <div
                      className="h-[260px] transition-transform duration-500 group-hover:scale-105"
                      style={{
                        background: dark ? '#1f2768' : '#EEF0F8',
                      }}
                    />

                    <div className="p-7 text-center">
                      <h3
                        className="text-3xl font-bold mb-2 tracking-tight"
                        style={{ color: colors.text }}
                      >
                        {builder.name}
                      </h3>

                      <p
                        className="text-base mb-5"
                        style={{ color: colors.textMuted }}
                      >
                        {builder.role}
                      </p>

                      <p
                        className="italic text-base"
                        style={{ color: colors.textSubtle }}
                      >
                        {builder.quote}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= FOOTER SOCIAL ================= */}
            <div className="flex items-center justify-end gap-5 mt-24">
              {[FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter].map(
                (Icon, index) => (
                  <button
                    key={index}
                    className="text-xl transition-all duration-300 hover:scale-110"
                    style={{ color: colors.text }}
                  >
                    <Icon />
                  </button>
                )
              )}
            </div>

          </div>
          
          {/* CTA Section */}
          <CTASection dark={dark} colors={colors} />
          
        </PageMargin>
      </main>

      <Footer colors={colors} />
    </div>
  );
}