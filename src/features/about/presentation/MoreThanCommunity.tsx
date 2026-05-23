/**
 * MORE THAN A COMMUNITY — About Page Section
 * - SectionTitle with curtain reveal
 * - AnimatedCard with alternating rotate entry
 * - Icon circles float continuously
 * - Hover: scale + shadow glow
 */

import { ThemeColors } from "../../landing/domain/types";
import { SectionTitle } from "../../../shared/components/SectionTitle";
import { AnimatedCard } from "../../../shared/components/AnimatedCard";
import { useState } from "react";

const offerings = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "The Builder Community",
    desc: "A network of engineers, designers, and technical leads collaborating in a cross-functional environment.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3l8 4-8 4-8-4 8-4zm0 7l8 4-8 4-8-4 8-4zm0 7l8 4-8 4-8-4 8-4z" />
      </svg>
    ),
    title: "The Project Ecosystem",
    desc: "A sandbox for building real-world products. We move beyond tutorials to maintain and ship live systems.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    title: "The Talent Pipeline",
    desc: "Bridging the gap between theory and industry. We vet potential through actual execution and results.",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 21h6v-1H9v1zm3-20C8.69 1 6 3.69 6 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h4a1 1 0 001-1v-4.26c1.81-1.27 3-3.36 3-5.74 0-3.31-2.69-6-6-6z" />
      </svg>
    ),
    title: "The Execution Culture",
    desc: "A structured space for rapid prototyping. Moving ideas from a blank file to a live deployment.",
  },
];

function OfferingCard({ item, index, colors }: { item: typeof offerings[0]; index: number; colors: ThemeColors }) {
  const [hovered, setHovered] = useState(false);
  return (
    <AnimatedCard index={index} stepMs={120} direction={index % 2 === 0 ? 'rotate-left' : 'rotate-right'} threshold={0.1}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-2xl border p-8 sm:p-10 text-center min-h-[260px] cursor-default flex flex-col items-center"
        style={{
          background: colors.bgCard,
          borderColor: colors.cardBorder,
          boxShadow: hovered ? '0 20px 56px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
          transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
        }}
      >
        {/* Icon circle — floats */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-7"
          style={{
            background: colors.memberBg,
            color: colors.text,
            animation: `floatY ${5 + index * 0.8}s ease-in-out ${index * 0.4}s infinite`,
            transform: hovered ? 'scale(1.12)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {item.icon}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2" style={{ color: colors.text }}>
          {item.title}
        </h3>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.textMuted }}>
          {item.desc}
        </p>
        {/* green accent line that expands on hover */}
        <div
          style={{
            marginTop: '16px',
            height: '2px',
            borderRadius: '2px',
            background: '#A3D045',
            width: hovered ? '60px' : '28px',
            transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </div>
    </AnimatedCard>
  );
}

export function MoreThanCommunity({ colors }: { colors: ThemeColors }) {
  return (
    <section className="py-12 sm:py-20 -mx-4 lg:-mx-[99px]">
      <div className="px-6 sm:px-8 lg:px-[99px] max-w-7xl mx-auto">
        <div className="mb-16">
          <SectionTitle
            title="More Than a Community."
            subtitle="TechHub is a project-driven infrastructure designed to turn technical potential into tangible products."
            colors={colors}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {offerings.map((item, i) => (
            <OfferingCard key={i} item={item} index={i} colors={colors} />
          ))}
        </div>
      </div>
    </section>
  );
}
