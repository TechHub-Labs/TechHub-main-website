/**
 * PlayPage.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../landing/domain/useTheme";
import { Navigation } from "../../../shared/components/Navigation";
import { Footer } from "../../../shared/components/Footer";
import { CTASection } from "../../../shared/components/CTASection";
import { WebsiteBackground } from "../../../shared/components/WebsiteBackground";
import { PageMargin } from "../../../shared/components/PageMargin";
import { SectionTitle } from "../../../shared/components/SectionTitle";

const SENTENCE_BANK = [
  "Talk is cheap. Show me the code.",
  "Programs must be written for people to read, and only incidentally for machines to execute.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "In order to understand recursion, one must first understand recursion.",
  "There are only two hard things in Computer Science: cache invalidation and naming things.",
  "It's not a bug. It's an undocumented feature.",
  "Clean code always looks like it was written by someone who cares.",
  "Make it work, make it right, make it fast.",
  "Before software can be reusable it first has to be usable.",
  "Simplicity is the soul of efficiency.",
  "Optimism is an occupational hazard of programming.",
  "The best error message is the one that never shows up.",
  "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
  "Code is read much more often than it is written.",
  "Programming isn't about what you know; it's about what you can figure out.",
];

const generateWords = (targetWordCount = 100) => {
  let selectedWords: string[] = [];

  while (selectedWords.length < targetWordCount) {
    const randomSentence =
      SENTENCE_BANK[Math.floor(Math.random() * SENTENCE_BANK.length)];

    selectedWords.push(...randomSentence.split(" "));
  }

  return selectedWords.slice(0, targetWordCount);
};

export function PlayPage() {
  const { dark, setDark, colors } = useTheme();

  const [headerVisible, setHeaderVisible] = useState(false);
  useEffect(() => {
    document.documentElement.style.color = colors.text;
    window.scrollTo(0, 0);
    setTimeout(() => setHeaderVisible(true), 80);
  }, [colors]);

  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "finished">("idle");
  const [words, setWords] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0 });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "playing") {
      inputRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "playing" && timeLeft === 0) {
      handleFinish();
    }
  }, [timeLeft, status]);

  const handleStart = () => {
    setWords(generateWords(100));
    setTypedWords([]);
    setCurrentInput("");
    setTimeLeft(30);
    setStatus("playing");
  };

  const handlePause = () => setStatus("paused");

  const handleResume = () => {
    setStatus("playing");
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleFinish = () => {
    let correctChars = 0;
    let totalChars = 0;

    typedWords.forEach((word, i) => {
      const target = words[i] || "";
      totalChars += target.length + 1; // +1 for space
      if (word === target) correctChars += target.length + 1;
    });

    const currentTarget = words[typedWords.length] || "";
    totalChars += currentInput.length;

    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === currentTarget[i]) correctChars++;
    }

    const wpm = Math.round(correctChars / 5 / (30 / 60)); // Standard WPM formula (5 chars = 1 word)
    const accuracy =
      totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    setStats({ wpm, accuracy });
    setStatus("finished");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status !== "playing") return;
    const val = e.target.value;

    if (val.endsWith(" ")) {
      setTypedWords([...typedWords, val.trim()]);
      setCurrentInput("");
    } else {
      setCurrentInput(val.trim());
    }
  };

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

      <main className="flex-1 w-full">
        <PageMargin>
          <div
            className="text-center pt-16 pb-12"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <SectionTitle
              title="Test Your Speed"
              subtitle="Do you think you can type faster than a developer? Try Speed Code and find out."
              tag="h1"
              align="center"
              colors={colors}
              immediate={true}
            />
          </div>

          <div
            className="rounded-xl overflow-hidden mb-24 relative group"
            onClick={() => inputRef.current?.focus()}
            style={{
              background: "#0a0e1a",
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 0.6s ease 0.25s",
            }}
          >
            <div className="px-5 py-4 flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              className="absolute opacity-0 -z-10 pointer-events-none"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />

            {status === "idle" && (
              <div className="flex flex-col items-center justify-center h-[340px] sm:h-[420px]">
                <button
                  onClick={handleStart}
                  className="px-10 py-3.5 rounded text-base font-bold transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "#A3D045", color: "#0F1524" }}
                >
                  Start Game
                </button>
              </div>
            )}

            {status === "playing" && (
              <div className="px-5 sm:px-10 pb-10 flex flex-col h-[340px] sm:h-[420px]">
                <div
                  className="flex justify-between items-center mb-6 font-mono text-xl sm:text-2xl"
                  style={{ color: "#A3D045" }}
                >
                  <span>{timeLeft}s</span>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={handlePause}
                      className="text-sm opacity-50 hover:opacity-100 transition-opacity"
                    >
                      Pause ⏸
                    </button>
                    <button
                      onClick={handleStart}
                      className="text-sm opacity-50 hover:opacity-100 transition-opacity"
                    >
                      Restart ↻
                    </button>
                  </div>
                </div>

                <div className="font-mono text-lg sm:text-2xl leading-loose flex flex-wrap gap-x-3 gap-y-2 select-none overflow-hidden content-start h-full pb-4">
                  {words.map((word, wIdx) => {
                    if (wIdx < typedWords.length) {
                      const typed = typedWords[wIdx];
                      return (
                        <span key={wIdx} className="relative">
                          {word.split("").map((char, cIdx) => {
                            const isTyped = cIdx < typed.length;
                            const isCorrect = isTyped && typed[cIdx] === char;
                            const charColor = isTyped ? (isCorrect ? "#A3D045" : "#ef4444") : "#ef4444";
                            return (
                              <span key={cIdx} style={{ color: charColor }}>
                                {char}
                              </span>
                            );
                          })}
                          {typed.length > word.length && (
                            <span style={{ color: "#ef4444" }}>
                              {typed.slice(word.length)}
                            </span>
                          )}
                        </span>
                      );
                    }

                    if (wIdx === typedWords.length) {
                      return (
                        <span key={wIdx} className="relative">
                          {word.split("").map((char, cIdx) => {
                            let charColor = "rgba(255,255,255,0.2)"; // Untyped
                            if (cIdx < currentInput.length) {
                              charColor =
                                currentInput[cIdx] === char
                                  ? "#ffffff"
                                  : "#ef4444"; // Typed (Correct/Incorrect)
                            }
                            return (
                              <span key={cIdx} className="relative">
                                {cIdx === currentInput.length && (
                                  <span className="absolute -left-[2px] top-0.5 bottom-0.5 w-[2px] bg-[#A3D045] animate-pulse" />
                                )}
                                <span style={{ color: charColor }}>{char}</span>
                              </span>
                            );
                          })}

                          {currentInput.length >= word.length && (
                            <span className="relative">
                              <span style={{ color: "#ef4444" }}>
                                {currentInput.slice(word.length)}
                              </span>
                              <span className="absolute -right-[2px] top-0.5 bottom-0.5 w-[2px] bg-[#A3D045] animate-pulse" />
                            </span>
                          )}
                        </span>
                      );
                    }

                    return (
                      <span
                        key={wIdx}
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {status === "paused" && (
              <div className="flex flex-col items-center justify-center h-[340px] sm:h-[420px] animate-in fade-in zoom-in duration-300">
                <p className="text-gray-400 font-mono mb-6 tracking-widest uppercase text-sm">
                  Game Paused
                </p>
                <button
                  onClick={handleResume}
                  className="px-10 py-3.5 rounded text-base font-bold transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "#A3D045", color: "#0F1524" }}
                >
                  Resume Game
                </button>
              </div>
            )}

            {status === "finished" && (
              <div className="flex flex-col items-center justify-center h-[340px] sm:h-[420px] animate-in fade-in zoom-in duration-300">
                <p className="text-gray-400 font-mono mb-6 tracking-widest uppercase text-sm">
                  Test Complete
                </p>
                <div className="flex gap-12 sm:gap-16 text-center mb-10">
                  <div>
                    <p
                      className="text-6xl sm:text-7xl font-black mb-1"
                      style={{ color: "#A3D045" }}
                    >
                      {stats.wpm}
                    </p>
                    <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">
                      WPM
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-6xl sm:text-7xl font-black mb-1"
                      style={{ color: "#A3D045" }}
                    >
                      {stats.accuracy}%
                    </p>
                    <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">
                      Accuracy
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleStart}
                  className="px-10 py-3.5 rounded text-base font-bold transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "#A3D045", color: "#0F1524" }}
                >
                  Play Again
                </button>
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
