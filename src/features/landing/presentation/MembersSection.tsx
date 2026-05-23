/**
 * MEMBERS SECTION — Landing Page
 * ─────────────────────────────────────────────────────────────────────────────
 * - SectionTitle with green curtain reveal
 * - AnimatedCard with alternating left/right slide
 * - Avatar shimmer gradient placeholder
 * - Hover: border color-shift + text slide up
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeColors } from '../domain/types';
import { DEMO_BUILDERS } from '../../../core/data/demoData';
import { AnimatedCard } from '../../../shared/components/AnimatedCard';
import { SectionTitle } from '../../../shared/components/SectionTitle';

interface MembersSectionProps {
  colors: ThemeColors;
}

function MemberCard({
  member,
  index,
  colors,
}: {
  member: (typeof DEMO_BUILDERS)[0];
  index: number;
  colors: ThemeColors;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatedCard
      index={index}
      stepMs={130}
      direction={index % 2 === 0 ? 'rotate-left' : 'rotate-right'}
      distance={28}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-2xl overflow-hidden cursor-default relative"
        style={{
          background: colors.bgCard,
          border: `2px solid ${hovered ? '#A3D045' : colors.cardBorder}`,
          boxShadow: hovered
            ? '0 20px 60px rgba(163,208,69,0.15)'
            : '0 1px 8px rgba(0,0,0,0.06)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        }}
      >
        {/* Avatar shimmer placeholder */}
        <div
          className="w-full aspect-[4/3] relative overflow-hidden"
          style={{ background: colors.memberBg }}
        >
          {/* Shimmer sweep */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)`,
              animation: 'shimmer 2.5s ease-in-out infinite',
            }}
          />
          {/* Quote bubble on hover */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 text-sm italic font-medium"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              color: '#ffffff',
              transform: hovered ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {member.quote}
          </div>
        </div>

        {/* Info */}
        <div className="p-5 sm:p-6">
          <h3
            className="text-xl font-bold tracking-tight mb-1"
            style={{ color: colors.text }}
          >
            {member.name}
          </h3>
          <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
            {member.role}
          </p>

          {/* Green accent line that grows on hover */}
          <div
            style={{
              marginTop: '12px',
              height: '2px',
              borderRadius: '2px',
              background: '#A3D045',
              width: hovered ? '100%' : '32px',
              transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        </div>
      </div>
    </AnimatedCard>
  );
}

export function MembersSection({ colors }: MembersSectionProps) {
  return (
    <section className="pt-40 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <SectionTitle
            title="Meet the Builders"
            subtitle="The engineers, designers, and innovators driving our culture."
            colors={colors}
          />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {DEMO_BUILDERS.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} colors={colors} />
          ))}
        </div>

        {/* View All */}
        <AnimatedCard index={0} delay={600} direction="up">
          <div className="text-center">
            <Link to="/members">
              <button
                className="px-8 py-3 rounded border text-sm font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg active:scale-95"
                style={{
                  background: 'transparent',
                  color: colors.text,
                  borderColor: colors.btnSecondaryBorder,
                }}
              >
                View All Members →
              </button>
            </Link>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
