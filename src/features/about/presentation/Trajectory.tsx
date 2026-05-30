import { useEffect, useRef, useState } from "react";
import { ThemeColors } from "../../landing/domain/types";
import { DEMO_TIMELINE as timeline } from "../../../core/data/demoData";

export function Trajectory({ colors }: { colors: ThemeColors }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [nodesVisible, setNodesVisible] = useState<boolean[]>(
    new Array(timeline.length).fill(false),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        timeline.forEach((_, index) => {
          setTimeout(
            () => {
              setNodesVisible((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            },
            200 + index * 250,
          );
        });
        observer.disconnect();
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-15 sm:py-28 -mx-4 lg:-mx-[99px]">
      <div className="px-4 lg:px-[99px]">
        {/* HEADER */}
        <div
          className="mb-20 lg:mb-32 max-w-full"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all .7s ease",
          }}
        >
          <h2
            className="w-full text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
            style={{ color: colors.text }}
          >
            The Trajectory of a Movement.
          </h2>
          <div
            className="h-[3px] bg-[#A3D045] mb-5 mt-6"
            style={{
              width: visible ? "117px" : "0px",
              transition: "width 0.7s ease 0.35s",
            }}
          />
          <p
            className="mt-6 text-base leading-relaxed sm:text-2xl font-medium w-full"
            style={{ color: colors.textMuted }}
          >
            Since 2024, TechHub has evolved from a small collective into a
            structured ecosystem for African builders.
          </p>
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="relative flex flex-col w-full max-w-5xl mx-auto">
          {/* CENTER VERTICAL LINE */}
          <div
            className="absolute left-[20px] top-0 h-full w-[4px] rounded-full md:left-1/2 md:-translate-x-1/2"
            style={{ background: colors.divider }}
          />

          {timeline.map((item, index) => {
            const isLeft = item.side === "left";

            return (
              <div
                key={index}
                className="relative grid grid-cols-[40px_1fr] gap-6 pb-20 md:grid-cols-[1fr_80px_1fr] w-full items-start"
              >
                {/* --- DESKTOP LEFT SIDE --- */}
                <div
                  className={`hidden md:flex w-full ${isLeft ? "justify-end pr-8" : ""}`}
                >
                  {isLeft && (
                    <TimelineCard
                      item={item}
                      visible={nodesVisible[index]}
                      align="left"
                      colors={colors}
                    />
                  )}
                </div>

                {/* --- CENTER DIVIDER (NODE & ARROWS) --- */}
                <div className="relative flex justify-center mt-2">
                  {/* ARROW (Only visible on Desktop) */}
                  <div
                    className={`
                      absolute -top-0.5 hidden md:block
                      ${isLeft ? "-left-6" : "-right-6"}
                    `}
                    style={{
                      opacity: nodesVisible[index] ? 1 : 0,
                      transition: ".4s ease",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 10 10">
                      {isLeft ? (
                        <path d="M1 1L9 5L1 9Z" fill="#DCE4FF" />
                      ) : (
                        <path d="M9 1L1 5L9 9Z" fill="#DCE4FF" />
                      )}
                    </svg>
                  </div>

                  {/* THE DOT NODE */}
                  <div
                    className="relative z-10 h-3.5 w-3.5 rounded-full"
                    style={{
                      background: colors.text,
                      boxShadow: `0 0 0 4px ${colors.bg}`,
                      opacity: nodesVisible[index] ? 1 : 0,
                      transform: nodesVisible[index] ? "scale(1)" : "scale(0)",
                      transition: "all .45s cubic-bezier(.34,1.56,.64,1)",
                    }}
                  />
                </div>

                {/* --- RIGHT SIDE (MOBILE & DESKTOP) --- */}
                <div className={`flex w-full ${!isLeft ? "md:pl-8" : ""}`}>
                  {/* MOBILE ALWAYS SHOWS ON RIGHT */}
                  <div className="md:hidden w-full">
                    <TimelineCard
                      item={item}
                      visible={nodesVisible[index]}
                      align="right"
                      colors={colors}
                    />
                  </div>

                  {/* DESKTOP RIGHT CARD */}
                  {!isLeft && (
                    <div className="hidden md:block w-full">
                      <TimelineCard
                        item={item}
                        visible={nodesVisible[index]}
                        align="right"
                        colors={colors}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ----------------------
// TIMELINE CARD SUB-COMPONENT
// ----------------------
function TimelineCard({
  item,
  visible,
  align,
  colors,
}: {
  item: {
    year: string;
    desc: string;
  };
  visible: boolean;
  align: "left" | "right";
  colors: ThemeColors;
}) {
  return (
    <div
      className="w-full max-w-[400px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : align === "left"
            ? "translateX(-50px)"
            : "translateX(50px)",
        transition: "opacity .6s ease, transform .6s ease",
      }}
    >
      <h4
        className="text-xl sm:text-2xl font-medium leading-snug w-full tracking-tight"
        style={{ color: colors.text }}
      >
        {item.year}
      </h4>

      <p
        className="mt-4 text-base sm:text-xl font-medium leading-relaxed w-full"
        style={{ color: colors.textMuted }}
      >
        {item.desc}
      </p>
    </div>
  );
}
