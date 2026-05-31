/**
 * SocialLinks.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { ThemeColors } from "../../features/landing/domain/types";

interface SocialLinksProps {
  portfolio?: string;
  linkedin?: string;
  twitter?: string;
  colors: ThemeColors;
}

const formatExternalLink = (url?: string) => {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export function SocialLinks({
  portfolio,
  linkedin,
  twitter,
  colors,
}: SocialLinksProps) {
  const hasPortfolio =
    portfolio &&
    portfolio.trim() !== "" &&
    portfolio !== "https://nhtechhub.org";
  const hasLinkedin =
    linkedin && linkedin.trim() !== "" && linkedin !== "https://linkedin.com";
  const hasTwitter =
    twitter && twitter.trim() !== "" && twitter !== "https://twitter.com";

  if (!hasPortfolio && !hasLinkedin && !hasTwitter) return null;

  return (
    <div className="flex items-center gap-3">
      {hasPortfolio && (
        <a
          href={formatExternalLink(portfolio)}
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:opacity-60 hover:scale-110"
          style={{ color: colors.text }}
          aria-label="Portfolio"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </a>
      )}

      {hasLinkedin && (
        <a
          href={formatExternalLink(linkedin)}
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:opacity-60 hover:scale-110"
          style={{ color: colors.text }}
          aria-label="LinkedIn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
      )}

      {hasTwitter && (
        <a
          href={formatExternalLink(twitter)}
          target="_blank"
          rel="noreferrer"
          className="transition-all duration-300 hover:opacity-60 hover:scale-110"
          style={{ color: colors.text }}
          aria-label="Twitter / X"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
          </svg>
        </a>
      )}
    </div>
  );
}
