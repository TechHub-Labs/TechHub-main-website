import { useState, useEffect } from "react";
import { useTheme } from "../../landing/domain/useTheme";
import { Navigation } from "../../../shared/components/Navigation";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";

export function JoinUsPage() {
  const { dark, setDark, colors } = useTheme();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");

  useEffect(() => {
    document.documentElement.style.color = colors.text;
    window.scrollTo(0, 0);
  }, [colors]);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <WebsiteBackground isDark={dark} bgColor={colors.bg} />
      <Navigation
        colors={colors}
        dark={dark}
        onThemeToggle={() => setDark(!dark)}
      />

      <main className="flex-1 flex items-center justify-center py-12">
        <PageMargin className="flex justify-center w-full">
          <div
            className="w-full max-w-2xl p-8 sm:p-12 rounded-3xl shadow-xl transition-all duration-500 border"
            style={{ background: colors.bgCard, borderColor: colors.divider }}
          >
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-12">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? "bg-[#A3D045]" : "bg-gray-200"}`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-[#A3D045]" : "bg-gray-200"}`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 3 ? "bg-[#A3D045]" : "bg-gray-200"}`}
              />
            </div>

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h1
                  className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
                  style={{ color: colors.text }}
                >
                  How do you want to contribute?
                </h1>
                <p
                  className="text-base font-medium mb-10"
                  style={{ color: colors.textMuted }}
                >
                  Select your primary domain of expertise.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  {[
                    "Developer",
                    "Designer",
                    "Product Manager",
                    "Marketing/Growth",
                  ].map((r) => (
                    <div
                      key={r}
                      onClick={() => setRole(r)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all font-bold ${role === r ? "border-[#3B5BDB] bg-[#3B5BDB]/5 text-[#3B5BDB]" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      {r}
                    </div>
                  ))}
                </div>
                <button
                  disabled={!role}
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#0F1524" }}
                >
                  Continue &rarr;
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h1
                  className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
                  style={{ color: colors.text }}
                >
                  Tell us about yourself
                </h1>
                <p
                  className="text-base font-medium mb-10"
                  style={{ color: colors.textMuted }}
                >
                  We're excited to have a {role} join us.
                </p>

                <div className="space-y-5 mb-10">
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: colors.text }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-[#3B5BDB]"
                      style={{ borderColor: colors.divider }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: colors.text }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-[#3B5BDB]"
                      style={{ borderColor: colors.divider }}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: colors.text }}
                    >
                      Portfolio / GitHub URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-[#3B5BDB]"
                      style={{ borderColor: colors.divider }}
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-xl font-bold border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: colors.divider, color: colors.text }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 rounded-xl font-bold text-[#0F1524] transition-all"
                    style={{ background: "#A3D045" }}
                  >
                    Submit Application
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center animate-in zoom-in-95 duration-500 py-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h1
                  className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
                  style={{ color: colors.text }}
                >
                  Application Received!
                </h1>
                <p
                  className="text-base font-medium mb-10"
                  style={{ color: colors.textMuted }}
                >
                  Keep an eye on your inbox. We will review your profile and get
                  back to you within 48 hours.
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-8 py-4 rounded-xl font-bold text-white transition-all"
                  style={{ background: "#0F1524" }}
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        </PageMargin>
      </main>
    </div>
  );
}
