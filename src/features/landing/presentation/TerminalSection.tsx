/**
 * TERMINAL SECTION - Speed Test Game
 * * Interactive terminal simulation with speed typing game.
 */

import { ThemeColors } from "../domain/types";
import { Link } from "react-router-dom";

interface TerminalSectionProps {
  colors: ThemeColors;
}

export function TerminalSection({ colors }: TerminalSectionProps) {
  return (
    <section className="relative pt-40 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h2
            className="text-4xl sm:text-6xl font-semibold mb-4 tracking-tight"
            style={{ color: colors.text }}
          >
            <span className="section-title-underline">Test Your Speed</span>
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
            background: colors.terminalBg,
          }}
        >
          <div className="px-5 py-4 flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: colors.statusPaused }}
            />
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: colors.statusUpcoming }}
            />
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: colors.statusLive }}
            />
          </div>

          {/* Terminal Content */}
          <div className="flex items-center justify-center h-[300px] sm:h-[400px]">
            <Link to="/play">
              <button
                className="px-8 py-3 rounded text-sm sm:text-base font-bold transition-transform hover:scale-[1.02] active:scale-95 shadow-sm"
                style={{
                  background: colors.accent,
                  color: colors.accentText,
                }}
              >
                Play Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
