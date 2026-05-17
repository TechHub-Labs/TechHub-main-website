/**
 * PLAY PAGE — "Test Your Speed"
 * Design: heading + subtitle, dark terminal window with Play Now button,
 * interactive terminal after game starts. CTA + Footer below.
 */

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../landing/domain/useTheme';
import { Navigation } from '../../../shared/components/Navigation';
import { Footer } from '../../../shared/components/Footer';
import { CTASection } from '../../../shared/components/CTASection';
import { WebsiteBackground } from '../../../shared/components/WebsiteBackground';
import { PageMargin } from '../../../shared/components/PageMargin';

interface TerminalLine { input: string; output: string; }

const COMMANDS: Record<string, string> = {
  help: 'Commands: help | speed | join | clear | whoami | status',
  speed: '⚡ 142 WPM — You type faster than 94% of developers!',
  join: '→ Redirecting to join.nhtechhub.com ...',
  whoami: 'You are a builder. Welcome to TechHub.',
  status: '✅ TechHub systems operational. 250+ members online.',
};

export function PlayPage() {
  const { dark, setDark, colors } = useTheme();

  const [started, setStarted] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [headerVisible, setHeaderVisible] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { document.documentElement.style.color = colors.text; window.scrollTo(0, 0); setTimeout(() => setHeaderVisible(true), 80); }, [colors]);

  const handleStart = () => {
    setStarted(true);
    setLines([{ input: '', output: "Welcome to Speed Code! Type 'speed' to test, or 'help' for commands." }]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let output = '';
    if (cmd === 'clear') { setLines([]); setInput(''); return; }
    output = COMMANDS[cmd] || `Command not found: '${cmd}'. Type 'help' for options.`;

    setLines(prev => [...prev, { input: cmd, output }]);
    setInput('');
    setTimeout(() => { if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight; }, 50);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation colors={colors} dark={dark} onThemeToggle={() => setDark(!dark)} />

      <main className="flex-1 w-full">
        <PageMargin>

          {/* HERO */}
          <div
            className="pt-14 pb-8"
            style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? 'translateY(0)' : 'translateY(18px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3" style={{ color: colors.text }}>
              Test Your Speed
            </h1>
            <div className="h-[3px] bg-[#A3D045] mb-5" style={{ width: headerVisible ? '56px' : '0px', transition: 'width 0.7s ease 0.3s' }} />
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: colors.textMuted }}>
              Do you think you can type faster than a developer?<br />
              Try Speed Code and find out.
            </p>
          </div>

          {/* TERMINAL */}
          <div
            className="rounded-xl overflow-hidden mb-24"
            style={{
              background: '#0a0e1a',
              opacity: headerVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 0.25s',
            }}
          >
            {/* Traffic lights */}
            <div className="px-5 py-4 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
            </div>

            {!started ? (
              /* Pre-game screen */
              <div className="flex items-center justify-center h-[340px] sm:h-[420px]">
                <button
                  onClick={handleStart}
                  className="px-10 py-3.5 rounded text-base font-bold transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
                  style={{ background: '#A3D045', color: '#0F1524' }}
                >
                  Play Now
                </button>
              </div>
            ) : (
              /* Active terminal */
              <div
                ref={termRef}
                className="px-5 sm:px-7 pb-6 font-mono text-sm sm:text-base h-[340px] sm:h-[420px] overflow-y-auto"
                onClick={() => inputRef.current?.focus()}
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {lines.map((line, i) => (
                  <div key={i} className="mb-4">
                    {line.input && (
                      <div>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>$ </span>
                        <span style={{ color: '#A3D045' }}>{line.input}</span>
                      </div>
                    )}
                    <div className="mt-1 leading-relaxed">{line.output}</div>
                  </div>
                ))}

                {/* Input row */}
                <div className="flex items-center gap-2 mt-2">
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base"
                    style={{ color: '#A3D045', caretColor: '#A3D045' }}
                    placeholder="type a command..."
                    spellCheck={false}
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>

          <CTASection dark={dark} colors={colors} />
        </PageMargin>
      </main>

      <Footer colors={colors} />
    </div>
  );
}