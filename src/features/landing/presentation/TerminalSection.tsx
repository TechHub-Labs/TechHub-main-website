/**
 * TERMINAL SECTION - Speed Test Game
 * * Interactive terminal simulation with speed typing game.
 */

import { useRef, useState } from 'react';
import { TerminalLine, ThemeColors } from '../domain/types';

interface TerminalSectionProps {
  colors: ThemeColors;
}

export function TerminalSection({ colors }: TerminalSectionProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [termLines, setTermLines] = useState<TerminalLine[]>([]);
  const [termInput, setTermInput] = useState("");
  const termRef = useRef<HTMLDivElement>(null);

  const handleTermKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = termInput.trim();
      let response = "";

      if (cmd === "help") {
        response = "Commands: help, speed, join, clear";
      } else if (cmd === "speed") {
        response = "⚡ 142 WPM — You type faster than 94% of developers!";
      } else if (cmd === "join") {
        response = "→ Redirecting to join.nhtechhub.com ...";
      } else if (cmd === "clear") {
        setTermLines([]);
        setTermInput("");
        return;
      } else {
        response = `Command not found: ${cmd}. Type 'help' for options.`;
      }

      setTermLines((prev) => [...prev, { in: cmd, out: response }]);
      setTermInput("");

      setTimeout(() => {
        if (termRef.current) {
          termRef.current.scrollTop = termRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setTermLines([
      {
        in: "",
        out: "Welcome to Speed Code! Type 'speed' to test, or 'help' for commands.",
      },
    ]);
  };

  return (
    <section className="relative pt-40 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h2
            className="text-4xl sm:text-6xl font-semibold mb-4 tracking-tight"
            style={{ color: colors.text }}
          >
            <span className="underline decoration-[3px] decoration-[#A3D045] underline-offset-[10px]">
              Test
            </span>{" "}
            Your Speed
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-xl"
            style={{ color: colors.text }}
          >
            Do you think you can type faster than a developer?
            <br />
            Try Speed Code and find out.
          </p>
        </div>

        {/* Terminal Window */}
        <div
          className="rounded-xl overflow-hidden shadow-xl"
          style={{ 
            background: colors.terminalBg
          }}
        >
          <div className="px-5 py-4 flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
          </div>

          {/* Terminal Content */}
          {!gameStarted ? (
            <div className="flex items-center justify-center h-[300px] sm:h-[400px]">
              <button
                className="px-8 py-3 rounded text-sm sm:text-base font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-sm"
                style={{
                  background: '#A3D045',
                  color: '#0F1524',
                }}
                onClick={startGame}
              >
                Play Now
              </button>
            </div>
          ) : (
            <div
              ref={termRef}
              className="p-5 sm:p-6 font-mono text-sm sm:text-base h-[300px] sm:h-[400px] overflow-y-auto"
              style={{ color: colors.textMuted }}
            >
              {termLines.map((line, i) => (
                <div key={i} className="mb-4">
                  {line.in && (
                    <div>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>
                        $ {" "}
                      </span>
                      <span style={{ color: '#A3D045' }}>{line.in}</span>
                    </div>
                  )}
                  <div className="mt-1.5 leading-relaxed">
                    {line.out}
                  </div>
                </div>
              ))}
              <div className="flex items-center mt-2" style={{ color: '#A3D045' }}>
                <span style={{ color: "rgba(255,255,255,0.4)", marginRight: 10 }}>
                  $
                </span>
                <input
                  className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base"
                  style={{ color: '#A3D045' }}
                  value={termInput}
                  onChange={(e) => setTermInput(e.target.value)}
                  onKeyDown={handleTermKey}
                  autoFocus
                  placeholder="type a command..."
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}