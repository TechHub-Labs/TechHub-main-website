/**
 * JoinStep2 — Track selection + motivation
 */

import { CSSProperties } from 'react';
import { ThemeColors } from '../../../../features/landing/domain/types';

const TRACKS = [
  { label: 'Engineering', sub: '{Logic, Code, Systems}' },
  { label: 'Product',     sub: '{Strategy, UX, Management}' },
  { label: 'Creative',    sub: '{Visuals, Branding, Motion}' },
];

interface JoinStep2Props {
  track: string;
  reason: string;
  errors: Record<string, string>;
  submitting: boolean;
  colors: ThemeColors;
  isDark: boolean;
  cardBg: string;
  borderColor: string;
  inputBorderColor: string;
  inputStyle: CSSProperties;
  onTrackChange: (t: string) => void;
  onReasonChange: (r: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function JoinStep2({
  track, reason, errors, submitting, colors, isDark, cardBg, borderColor,
  inputBorderColor, inputStyle, onTrackChange, onReasonChange, onBack, onSubmit,
}: JoinStep2Props) {
  const labelColor = colors.textMuted;
  const trackBorderActive   = '#A3D045';
  const trackBorderInactive = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(13,19,64,0.12)';

  return (
    <div className="rounded-2xl border px-8 sm:px-10 py-10" style={{ background: cardBg, borderColor }}>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: colors.text }}>Pick your track</h1>
      <p className="text-sm mb-8" style={{ color: labelColor }}>What are you interested in?</p>

      {/* Track selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {TRACKS.map(t => (
          <button
            key={t.label}
            onClick={() => onTrackChange(t.label)}
            className="rounded-lg border px-4 py-4 text-left transition-all duration-200 hover:scale-[1.02]"
            style={{
              borderColor: track === t.label ? trackBorderActive : trackBorderInactive,
              background:  track === t.label ? (isDark ? 'rgba(163,208,69,0.08)' : 'rgba(163,208,69,0.06)') : 'transparent',
              boxShadow:   track === t.label ? '0 0 0 2px rgba(163,208,69,0.3)' : 'none',
            }}
          >
            <div className="text-base font-bold mb-0.5" style={{ color: colors.text }}>{t.label}</div>
            <div className="text-xs" style={{ color: colors.textMuted }}>{t.sub}</div>
          </button>
        ))}
      </div>
      {errors.track && <p className="text-xs mb-4 -mt-4" style={{ color: '#ef4444' }}>{errors.track}</p>}

      {/* Reason */}
      <div className="mb-10 relative">
        <label className="block text-sm mb-1" style={{ color: labelColor }}>
          Why do you want to join TechHub? <span style={{ color: colors.textSubtle }}>(min. 100 characters)</span>
        </label>
        <textarea
          value={reason}
          onChange={e => onReasonChange(e.target.value)}
          onFocus={e => (e.currentTarget.style.borderBottomColor = '#3B5BDB')}
          onBlur={e => (e.currentTarget.style.borderBottomColor = inputBorderColor)}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
          rows={4}
          placeholder="Tell us about your goals and what you hope to achieve..."
        />
        <div className="text-xs mt-1 flex justify-between">
          <span style={{ color: errors.reason ? '#ef4444' : 'transparent' }}>
            {errors.reason || '‎'}
          </span>
          <span style={{ color: reason.trim().length >= 100 ? '#A3D045' : labelColor }}>
            {reason.trim().length} / 100+
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          disabled={submitting}
          onClick={onBack}
          className="flex-1 py-4 rounded-lg text-base font-semibold border transition-all hover:opacity-70 disabled:opacity-50"
          style={{ background: 'transparent', color: colors.text, borderColor }}
        >
          ← Back
        </button>
        <button
          disabled={submitting}
          onClick={onSubmit}
          className="flex-[2] py-4 rounded-lg text-base font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          style={{ background: '#0d1340', color: '#ffffff' }}
        >
          {submitting ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Submitting…
            </>
          ) : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}
