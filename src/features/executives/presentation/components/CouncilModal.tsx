/**
 * CouncilModal.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../landing/domain/useTheme";
import { CouncilMember } from "./CouncilCard";
import { ModalCloseButton } from "../../../../shared/components/ModalCloseButton";
import { SocialLinks } from "../../../../shared/components/SocialLinks";

interface CouncilModalProps {
  member: CouncilMember;
  onClose: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
  isDark: boolean;
}

export function CouncilModal({
  member,
  onClose,
  colors,
  isDark,
}: CouncilModalProps) {
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const modalBg = isDark ? "#0d1340" : "#ffffff";
  const imgBg = isDark ? "#1e2870" : "#eef0fb";
  const tagBg = isDark ? "rgba(255,255,255,0.08)" : "#f0f2fb";

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
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12"
        style={{
          background: modalBg,
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
        <div
          className="md:col-span-5 w-full h-64 md:h-full min-h-[260px] md:min-h-[460px] bg-cover bg-center shrink-0"
          style={{
            backgroundImage: member.avatar_url
              ? `url(${member.avatar_url})`
              : "none",
            backgroundPosition: "center 15%", // Keeps chins and faces centered perfectly
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundColor: imgBg,
          }}
        />

        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative min-h-[300px]">
          <ModalCloseButton onClose={onClose} colors={colors} isDark={isDark} />

          <div className="flex flex-col gap-6 pr-6">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight mb-1"
                style={{ color: colors.text }}
              >
                {member.name}
              </h2>
              <p
                className="text-sm sm:text-base font-semibold"
                style={{ color: colors.accent }}
              >
                {member.role}
              </p>
            </div>

            {member.quote && (
              <blockquote
                className="pl-4 italic text-sm sm:text-base leading-relaxed border-l-2"
                style={{ color: colors.textMuted, borderColor: colors.accent }}
              >
                “{member.quote}”
              </blockquote>
            )}

            {member.skills && member.skills.length > 0 && (
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-2.5"
                  style={{ color: colors.textSubtle }}
                >
                  Area of Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
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
            )}

            {member.projects &&
              member.projects.filter((p) => p && p.trim() !== "").length >
                0 && (
                <div>
                  <h4
                    className="text-xs font-bold uppercase tracking-wider mb-2.5"
                    style={{ color: colors.textSubtle }}
                  >
                    Featured Projects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.projects
                      .filter((p) => p && p.trim() !== "")
                      .map((project) => (
                        <span
                          key={project}
                          className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          style={{
                            background: tagBg,
                            color: colors.text,
                          }}
                        >
                          {project}
                        </span>
                      ))}
                  </div>
                </div>
              )}
          </div>

          {member.portfolio?.trim() ||
          member.linkedin?.trim() ||
          member.twitter?.trim() ? (
            <div
              className="mt-8 pt-5 border-t"
              style={{
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
              }}
            >
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: colors.textSubtle }}
              >
                Connect
              </h4>
              <SocialLinks
                portfolio={member.portfolio}
                linkedin={member.linkedin}
                twitter={member.twitter}
                colors={colors}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
