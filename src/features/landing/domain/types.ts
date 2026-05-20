export interface Builder {
  name: string;
  role: string;
  quote: string;
}

export interface Project {
  status: 'LIVE' | 'UPCOMING' | 'IN-DEV';
  name: string;
  desc: string;
  tags: string[];
  statusColor: 'text-green-400' | 'text-yellow-400' | 'text-blue-400';
}

export interface TerminalLine {
  in: string;
  out: string;
}

export interface ThemeColors {
  bg: string;
  bgCard: string;
  bgCardHover: string;
  bgHero: string;
  nav: string;
  navBorder: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentText: string;
  teal: string;           // ADDED
  tealText: string;       // ADDED
  btnPrimary: string;
  btnPrimaryText: string;
  btnSecondary: string;
  btnSecondaryBorder: string;
  btnSecondaryText: string;
  tagBg: string;
  tagText: string;
  statCard: string;
  terminalBg: string;
  footerBg: string;
  footerText: string;
  divider: string;
  liveGreen: string;
  liveYellow: string;
  memberBg: string;
  statusPaused: string;   // ADDED
  statusInDev: string;    // ADDED
  statusUpcoming: string; // ADDED
  statusLive: string;     // ADDED
}