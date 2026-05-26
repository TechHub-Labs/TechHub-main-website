import { useTheme } from '../../../landing/domain/useTheme';
import { AnimatedCard } from '../../../../shared/components/AnimatedCard';
import { DemoMember as Member } from '../../../../core/data/demoData';

interface MemberCardProps {
  member: Member;
  index: number;
  onClick: (m: Member) => void;
  colors: ReturnType<typeof useTheme>['colors'];
  isDark: boolean;
}

export function MemberCard({
  member,
  index,
  onClick,
  colors,
  isDark,
}: MemberCardProps) {
  const cardBg = isDark ? "#1a2160" : "#ffffff";
  const imgBg = isDark ? "#1e2870" : "#eef0fb";

  return (
    <AnimatedCard
      index={index}
      stepMs={80}
      direction="up"
      distance={20}
      className="w-full"
    >
      <div
        onClick={() => onClick(member)}
        className="flex flex-col justify-between overflow-hidden cursor-pointer group border border-1 border-[#0F1B4D26] rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-95"
        style={{
          background: cardBg,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          height: '100%',
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
          {/* Portrait Square Photo */}
          <div
            className="w-full transition-transform duration-500 rounded-t-2xl"
            style={{
              background: (member.avatar_url || member.portfolio) ? `url(${member.avatar_url || member.portfolio}) center / cover no-repeat` : imgBg, // Fallback placeholder if no avatar
              aspectRatio: "1 / 1", // Perfect square aspect ratio for consistent profile alignment
            }}
          />

          {/* Info */}
          <div className="px-6 pt-6 pb-5 flex flex-col justify-center items-center text-center">
            <h3
              className="text-xl sm:text-2xl font-bold mb-1 tracking-tight"
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
            {member.quote && (
              <p
                className="text-xs sm:text-sm italic leading-relaxed max-w-xs"
                style={{ color: colors.textMuted }}
              >
                {member.quote}
              </p>
            )}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
