/**
 * JOIN US PAGE — 3-step form
 * Step 1: Name, Email, Level, Portfolio → Next
 * Step 2: Pick track (Engineering / Product / Creative) + Why join → Submit
 * Step 3: Success confirmation with party popper emoji
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../landing/domain/useTheme';
import { Navigation } from '../../../shared/components/Navigation';
import { Footer } from '../../../shared/components/Footer';
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';
import { PageMargin } from '../../../shared/components/PageMargin';

const TRACKS = [
  { label: 'Engineering', sub: '{Logic, Code, Systems}' },
  { label: 'Product', sub: '{Strategy, UX, Management}' },
  { label: 'Creative', sub: '{Visuals, Branding, Motion}' },
];

export function JoinUsPage() {
  const { dark, setDark, colors } = useTheme();
  const isDark = dark;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stepDir, setStepDir] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', level: '', portfolio: '' });
  const [track, setTrack] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { document.documentElement.style.color = colors.text; window.scrollTo(0, 0); setTimeout(() => setVisible(true), 80); }, [colors]);

  const transitionStep = (nextStep: 1 | 2 | 3, dir: 'forward' | 'back') => {
    setStepDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 260);
  };

  const cardBg = isDark ? '#1a2160' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(13,19,64,0.1)';
  const inputBorderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(13,19,64,0.2)';
  const labelColor = colors.textMuted;
  const trackBorderActive = '#A3D045';
  const trackBorderInactive = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(13,19,64,0.12)';

  const inputStyle = {
    background: 'transparent',
    borderBottom: `1px solid ${inputBorderColor}`,
    color: colors.text,
    outline: 'none',
    width: '100%',
    padding: '8px 0',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
  };

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.level.trim()) e.level = 'Level is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e: Record<string, string> = {};
    if (!track) e.track = 'Please pick a track';
    if (!reason.trim()) e.reason = 'Please tell us why you want to join';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate1()) { setErrors({}); transitionStep(2, 'forward'); window.scrollTo(0, 0); } };
  const handleSubmit = () => { if (validate2()) { setErrors({}); transitionStep(3, 'forward'); window.scrollTo(0, 0); } };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />

      <main className="flex-1 w-full flex flex-col items-center">
        <PageMargin className="w-full flex flex-col items-center">
          <div
            className="w-full max-w-xl mt-12 mb-16"
            style={{
              opacity: visible && !animating ? 1 : 0,
              transform: visible && !animating
                ? 'translateY(0) translateX(0)'
                : animating
                  ? stepDir === 'forward' ? 'translateY(0) translateX(-40px)' : 'translateY(0) translateX(40px)'
                  : 'translateY(20px)',
              transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="rounded-2xl border px-8 sm:px-10 py-10" style={{ background: cardBg, borderColor }}>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: colors.text }}>Become a Member</h1>
                <p className="text-sm mb-10" style={{ color: labelColor }}>Start your journey in the ecosystem.</p>

                <div className="space-y-8">
                  {[
                    { key: 'name', label: 'Name', type: 'text', placeholder: '' },
                    { key: 'email', label: 'Email', type: 'email', placeholder: '' },
                    { key: 'level', label: 'Level', type: 'text', placeholder: '' },
                    { key: 'portfolio', label: 'Portfolio (Github/LinkedIn/Behance)', type: 'text', placeholder: '' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm mb-1" style={{ color: labelColor }}>{field.label}</label>
                      <input
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = '#3B5BDB')}
                        onBlur={e => (e.currentTarget.style.borderBottomColor = inputBorderColor)}
                        style={inputStyle}
                      />
                      {errors[field.key] && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors[field.key]}</p>}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full mt-10 py-4 rounded-lg text-base font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                  style={{ background: '#0d1340', color: '#ffffff' }}
                >
                  Next
                </button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="rounded-2xl border px-8 sm:px-10 py-10" style={{ background: cardBg, borderColor }}>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: colors.text }}>Pick your track</h1>
                <p className="text-sm mb-8" style={{ color: labelColor }}>What are you interested in?</p>

                {/* Track selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {TRACKS.map(t => (
                    <button
                      key={t.label}
                      onClick={() => setTrack(t.label)}
                      className="rounded-lg border px-4 py-4 text-left transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        borderColor: track === t.label ? trackBorderActive : trackBorderInactive,
                        background: track === t.label ? (isDark ? 'rgba(163,208,69,0.08)' : 'rgba(163,208,69,0.06)') : 'transparent',
                        boxShadow: track === t.label ? '0 0 0 2px rgba(163,208,69,0.3)' : 'none',
                      }}
                    >
                      <div className="text-base font-bold mb-0.5" style={{ color: colors.text }}>{t.label}</div>
                      <div className="text-xs" style={{ color: colors.textMuted }}>{t.sub}</div>
                    </button>
                  ))}
                </div>
                {errors.track && <p className="text-xs mb-4 -mt-4" style={{ color: '#ef4444' }}>{errors.track}</p>}

                {/* Reason */}
                <div className="mb-10">
                  <label className="block text-sm mb-1" style={{ color: labelColor }}>Why do you want to join TechHub?</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = '#3B5BDB')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = inputBorderColor)}
                    style={inputStyle}
                  />
                  {errors.reason && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.reason}</p>}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { transitionStep(1, 'back'); setErrors({}); }} className="flex-1 py-4 rounded-lg text-base font-semibold border transition-all hover:opacity-70" style={{ background: 'transparent', color: colors.text, borderColor }}>Back</button>
                  <button onClick={handleSubmit} className="flex-[2] py-4 rounded-lg text-base font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]" style={{ background: '#0d1340', color: '#ffffff' }}>Submit Application</button>
                </div>
              </div>
            )}

            {/* ── STEP 3 — Success ── */}
            {step === 3 && (
              <div
                className="rounded-2xl border px-8 sm:px-10 py-14 text-center"
                style={{ background: cardBg, borderColor }}
              >
                {/* Party popper */}
                <div className="text-6xl mb-6" role="img" aria-label="Party popper">🎉</div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: colors.text }}>Application Sent!</h2>
                <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: colors.textMuted }}>
                  We've received your application. Our track leads<br />will review your portfolio and get back to you soon!
                </p>
                <Link to="/" className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity" style={{ color: '#3B5BDB' }}>
                  Return to home
                </Link>
              </div>
            )}
          </div>
        </PageMargin>
      </main>

      <Footer colors={colors} />
    </div>
  );
}