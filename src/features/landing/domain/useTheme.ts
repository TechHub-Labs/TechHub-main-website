import { useState, useMemo, useEffect } from 'react';
import { ThemeColors } from './types';

export function useTheme() {
  const getInitial = () => {
    try {
      const saved = localStorage.getItem('nh_techhub_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch (e) {}
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const [dark, setDark] = useState<boolean>(getInitial);

  useEffect(() => {
    try {
      localStorage.setItem('nh_techhub_theme', dark ? 'dark' : 'light');
    } catch (e) {}
  }, [dark]);

  const colors: ThemeColors = useMemo(() => {
    return dark ? {
      // ─── DARK MODE ───────────────────────────────────────────────────────
      bg:              '#0d1340',
      bgCard:          '#1c2461',        // slightly lighter — cards pop on dark bg
      bgCardHover:     '#232d78',        // visible hover state
      bgHero:          '#0d1340',
      nav:             'rgba(13,19,64,0.75)', // frosted base colour
      navBorder:       'rgba(255,255,255,0.07)',
      text:            '#ffffff',
      textMuted:       '#9BA3C2',        // was #7F7F7F — invisible on dark navy
      textSubtle:      'rgba(200,210,255,0.5)',
      accent:          '#A3D045',
      accentText:      '#0F1524',
      teal:            '#1a4a56',        // more visible teal
      tealText:        '#ffffff',
      btnPrimary:      '#A3D045',
      btnPrimaryText:  '#0F1524',
      btnSecondary:    'transparent',
      btnSecondaryText:'#ffffff',
      btnSecondaryBorder: 'rgba(255,255,255,0.35)',
      tagBg:           'rgba(255,255,255,0.12)',  // was 0.1 — more visible
      tagText:         'rgba(220,228,255,0.8)',
      statCard:        '#1c2461',
      terminalBg:      '#0a0e1a',
      footerBg:        '#070c2e',
      footerText:      'rgba(200,210,255,0.55)',
      memberBg:        '#2e3888',        // was #2a3275 — more contrast
      liveGreen:       '#22c55e',
      liveYellow:      '#f59e0b',
      statusPaused:    '#ef4444',
      statusInDev:     '#60a5fa',        // was #3B5BDB — more visible on dark
      statusUpcoming:  '#fbbf24',
      statusLive:      '#4ade80',        // was #22c55e — brighter on dark
      divider:         'rgba(255,255,255,0.08)', // was 0.05 — barely visible
      cardBorder:      'rgba(255,255,255,0.08)',
    } : {
      // ─── LIGHT MODE ──────────────────────────────────────────────────────
      bg:              '#f4f5fa',
      bgCard:          '#ffffff',
      bgCardHover:     '#eef0ff',        // was #14363E (jarring dark teal!) — fixed
      bgHero:          '#f4f5fa',
      nav:             'rgba(255,255,255,0.8)', // frosted base colour
      navBorder:       'rgba(13,19,64,0.06)',
      text:            '#0d1340',
      textMuted:       '#4a5180',        // was rgba(13,19,64,0.7) — now more readable
      textSubtle:      'rgba(13,19,64,0.4)',
      accent:          '#0d1340',
      accentText:      '#A3D045',
      teal:            '#14363E',
      tealText:        '#ffffff',
      btnPrimary:      '#0d1340',
      btnPrimaryText:  '#ffffff',
      btnSecondary:    'transparent',
      btnSecondaryText:'#0d1340',
      btnSecondaryBorder: 'rgba(13,19,64,0.35)',
      tagBg:           'rgba(13,19,64,0.07)',
      tagText:         '#4a5180',
      statCard:        '#ffffff',
      terminalBg:      '#1a1a2e',
      footerBg:        '#e8eaf5',
      footerText:      'rgba(13,19,64,0.5)',
      memberBg:        '#e0e4f5',
      liveGreen:       '#16a34a',
      liveYellow:      '#d97706',
      statusPaused:    '#dc2626',
      statusInDev:     '#2563eb',
      statusUpcoming:  '#d97706',
      statusLive:      '#16a34a',
      divider:         'rgba(13,19,64,0.06)',
      cardBorder:      'rgba(13,19,64,0.08)',
    };
  }, [dark]);

  return { dark, setDark, colors };
}