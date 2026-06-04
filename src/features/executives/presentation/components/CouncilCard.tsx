/**
 * CouncilCard.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useTheme } from "../../../landing/domain/useTheme";
import { AnimatedCard } from "../../../../shared/components/AnimatedCard";

export interface CouncilMember {
  id: string;
  name: string;
  role: string;
  description: string;
  quote?: string;
  avatar_url?: string;
  category: string[];
  skills: string[];
  projects: string[];
  portfolio?: string;
  linkedin?: string;
  twitter?: string;
}

interface CouncilCardProps {
  member: CouncilMember;
  index: number;
  onClick: (m: CouncilMember) => void;
  colors: ReturnType<typeof useTheme>["colors"];
}

export function CouncilCard({
  member,
  index,
  onClick,
  colors,
}: CouncilCardProps) {
  return (
    <AnimatedCard
      index={index}
      stepMs={100}
      direction="up"
      distance={22}
      className="w-full"
    >
      <div
        onClick={() => onClick(member)}
        className="rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer border border-transparent transition-all duration-300 hover:scale-[1.01] active:scale-95"
        style={{
          background: colors.bgCard,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = colors.accent;
          el.style.boxShadow = "0 12px 36px rgba(0,0,0,0.1)";
          el.style.transform = "translateY(-6px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "transparent";
          el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
          el.style.transform = "translateY(0)";
        }}
      >
        <div className="w-full flex flex-col">
          <div
            className="w-full transition-transform duration-500 rounded-t-2xl"
            style={{
              background: member.avatar_url
                ? `url(${member.avatar_url}) top center / cover no-repeat`
                : colors.bgCardHover,
              aspectRatio: "1 / 1", // Perfect square ratio for natural facial framing
            }}
          />
          <div className="px-6 pt-6 pb-4 flex flex-col justify-center items-center text-center">
            <h3
              className="text-lg sm:text-xl font-bold mb-1 tracking-tight"
              style={{ color: colors.text }}
            >
              {member.name}
            </h3>
            <p
              className="text-xs sm:text-sm font-semibold mb-3"
              style={{ color: colors.accent }}
            >
              {member.role}
            </p>
            <p
              className="text-xs sm:text-sm italic leading-relaxed max-w-xs"
              style={{ color: colors.textMuted }}
            >
              {member.description}
            </p>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
