/**
 * JoinUsPage.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useState } from "react";
import { useTheme } from "../../landing/domain/useTheme";
import { Navigation } from "../../../shared/components/Navigation";
import { Footer } from "../../../shared/components/Footer";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";
import { JoinStep1 } from "./components/JoinStep1";
import { JoinStep2 } from "./components/JoinStep2";
import { JoinStep3 } from "./components/JoinStep3";

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string;

type FormData = {
  name: string;
  email: string;
  level: string;
  portfolio: string;
};

export function JoinUsPage() {
  const { dark, setDark, colors } = useTheme();
  const isDark = dark;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stepDir, setStepDir] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    level: "",
    portfolio: "",
  });
  const [track, setTrack] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.documentElement.style.color = colors.text;
    window.scrollTo(0, 0);
    setTimeout(() => setVisible(true), 80);
  }, [colors]);

  const transitionStep = (nextStep: 1 | 2 | 3, dir: "forward" | "back") => {
    setStepDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 260);
  };

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.level.trim()) e.level = "Level is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e: Record<string, string> = {};
    if (!track) e.track = "Please pick a track";
    if (!reason.trim()) {
      e.reason = "Please tell us why you want to join";
    } else if (reason.trim().length < 100) {
      e.reason = `Please write at least 100 characters (currently ${reason.trim().length})`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate1()) {
      setErrors({});
      transitionStep(2, "forward");
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validate2()) return;
    setErrors({});
    setSubmitting(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, track, reason }),
      });
    } catch (err) {
      console.error("Submission error:", err);
    }
    setSubmitting(false);
    transitionStep(3, "forward");
    window.scrollTo(0, 0);
  };

  const cardBg = isDark ? "#1a2160" : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(13,19,64,0.1)";
  const inputBorderColor = isDark
    ? "rgba(255,255,255,0.15)"
    : "rgba(13,19,64,0.2)";
  const inputStyle = {
    background: "transparent",
    borderBottom: `1px solid ${inputBorderColor}`,
    color: colors.text,
    outline: "none",
    width: "100%",
    padding: "8px 0",
    fontSize: "1rem",
    transition: "border-color 0.2s",
  } as const;

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

      <main className="flex-1 w-full flex flex-col items-center">
        <PageMargin className="w-full flex flex-col items-center">
          <div
            className="w-full max-w-xl mt-12 mb-16"
            style={{
              opacity: visible && !animating ? 1 : 0,
              transform:
                visible && !animating
                  ? "translateY(0) translateX(0)"
                  : animating
                    ? stepDir === "forward"
                      ? "translateY(0) translateX(-40px)"
                      : "translateY(0) translateX(40px)"
                    : "translateY(20px)",
              transition:
                "opacity 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {step === 1 && (
              <JoinStep1
                form={form}
                errors={errors}
                colors={colors}
                cardBg={cardBg}
                borderColor={borderColor}
                inputBorderColor={inputBorderColor}
                inputStyle={inputStyle}
                onChange={(key, val) => setForm((f) => ({ ...f, [key]: val }))}
                onNext={handleNext}
              />
            )}

            {step === 2 && (
              <JoinStep2
                track={track}
                reason={reason}
                errors={errors}
                submitting={submitting}
                colors={colors}
                isDark={isDark}
                cardBg={cardBg}
                borderColor={borderColor}
                inputBorderColor={inputBorderColor}
                inputStyle={inputStyle}
                onTrackChange={setTrack}
                onReasonChange={setReason}
                onBack={() => {
                  transitionStep(1, "back");
                  setErrors({});
                }}
                onSubmit={handleSubmit}
              />
            )}

            {step === 3 && (
              <JoinStep3
                colors={colors}
                cardBg={cardBg}
                borderColor={borderColor}
              />
            )}
          </div>
        </PageMargin>
      </main>

      <Footer colors={colors} />
    </div>
  );
}
