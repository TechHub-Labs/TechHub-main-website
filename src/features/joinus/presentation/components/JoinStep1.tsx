/**
 * JoinStep1.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { CSSProperties } from "react";
import { ThemeColors } from "../../../../features/landing/domain/types";

interface JoinStep1Props {
  form: { name: string; email: string; level: string; portfolio: string };
  errors: Record<string, string>;
  colors: ThemeColors;
  cardBg: string;
  borderColor: string;
  inputBorderColor: string;
  inputStyle: CSSProperties;
  onChange: (key: string, value: string) => void;
  onNext: () => void;
}

const LEVELS = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "Graduate",
  "Postgraduate",
];

export function JoinStep1({
  form,
  errors,
  colors,
  cardBg,
  borderColor,
  inputBorderColor,
  inputStyle,
  onChange,
  onNext,
}: JoinStep1Props) {
  const labelColor = colors.textMuted;

  return (
    <div
      className="rounded-2xl border px-8 sm:px-10 py-10"
      style={{ background: cardBg, borderColor }}
    >
      <h1
        className="text-2xl sm:text-3xl font-bold mb-1"
        style={{ color: colors.text }}
      >
        Become a Member
      </h1>
      <p className="text-sm mb-10" style={{ color: labelColor }}>
        Start your journey in the ecosystem.
      </p>

      <div className="space-y-8">
        <div>
          <label className="block text-sm mb-1" style={{ color: labelColor }}>
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            onFocus={(e) =>
              (e.currentTarget.style.borderBottomColor = "#3B5BDB")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderBottomColor = inputBorderColor)
            }
            style={inputStyle}
          />
          {errors.name && (
            <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: labelColor }}>
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            onFocus={(e) =>
              (e.currentTarget.style.borderBottomColor = "#3B5BDB")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderBottomColor = inputBorderColor)
            }
            style={inputStyle}
          />
          {errors.email && (
            <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: labelColor }}>
            Level
          </label>
          <div className="relative">
            <select
              value={form.level}
              onChange={(e) => onChange("level", e.target.value)}
              onFocus={(e) =>
                (e.currentTarget.style.borderBottomColor = "#3B5BDB")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderBottomColor = inputBorderColor)
              }
              style={{
                ...inputStyle,
                cursor: "pointer",
                appearance: "none",
                background: "transparent",
                paddingRight: "30px",
              }}
            >
              <option
                value=""
                disabled
                style={{ color: "#999", background: cardBg }}
              >
                Select your level
              </option>
              {LEVELS.map((lvl) => (
                <option
                  key={lvl}
                  value={lvl}
                  style={{ color: colors.text, background: cardBg }}
                >
                  {lvl}
                </option>
              ))}
            </select>

            <div
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: labelColor }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          {errors.level && (
            <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
              {errors.level}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: labelColor }}>
            Portfolio (Github / LinkedIn / Behance)
          </label>
          <input
            type="text"
            value={form.portfolio}
            onChange={(e) => onChange("portfolio", e.target.value)}
            onFocus={(e) =>
              (e.currentTarget.style.borderBottomColor = "#3B5BDB")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderBottomColor = inputBorderColor)
            }
            style={inputStyle}
          />
          {errors.portfolio && (
            <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
              {errors.portfolio}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full mt-10 py-4 rounded-lg text-base font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
        style={{ background: "#0d1340", color: "#ffffff" }}
      >
        Next →
      </button>
    </div>
  );
}
