/**
 * WebsiteBackground.tsx
 * 
 * Core component/utility for the TechHub application.
 */

interface WebsiteBackgroundProps {
  isDark?: boolean;
  bgColor: string;
  opacity?: number;
}

export function WebsiteBackground({
  isDark = false,
  bgColor,
  opacity = 1,
}: WebsiteBackgroundProps) {
  const lightPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect x='0' y='0' width='2' height='2' rx='0.4' fill='%23d8dae8'/%3E%3Crect x='5' y='5' width='2' height='2' rx='0.4' fill='%23d8dae8'/%3E%3C/svg%3E")`;
  const darkPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect x='0' y='0' width='2' height='2' rx='0.4' fill='rgba(255%2C255%2C255%2C0.07)'/%3E%3Crect x='5' y='5' width='2' height='2' rx='0.4' fill='rgba(255%2C255%2C255%2C0.07)'/%3E%3C/svg%3E")`;

  const bgImage = isDark ? darkPattern : lightPattern;

  const cursorSvg = encodeURIComponent(
    `%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Ccircle cx='11' cy='11' r='6' fill='%2314363E'/%3E%3C/svg%3E`,
  );

  return (
    <style>{`
      :root { --site-bg: ${bgColor}; }
      html, body, #root { height: 100%; }

      @keyframes nodesDrift {
        0%   { background-position: 0px 0px; }
        100% { background-position: 10px 10px; }
      }

      body {
        background-color: var(--site-bg) !important;
        transition: background-color 0.3s ease;
      }
      body::before {
        content: '';
        position: fixed;
        inset: 0;
        z-index: -1;
        background-image: ${bgImage};
        background-repeat: repeat;
        background-size: 10px 10px;
        animation: nodesDrift 3s linear infinite;
        opacity: ${opacity};
        pointer-events: none;
      }

      .fun-cursor, button, a {
        cursor: url("data:image/svg+xml,${cursorSvg}") 11 11, auto;
      }
    `}</style>
  );
}
