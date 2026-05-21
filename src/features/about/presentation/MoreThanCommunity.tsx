/**
 * MORE THAN A COMMUNITY — Section
 * Final version:
 * - Uses Tailwind ONLY for layout/spacing/responsiveness
 * - Uses ThemeColors ONLY for colors
 * - Matches provided UI reference
 * - Smooth reveal animations
 * - Clean centered card layout
 */

import { useEffect, useRef, useState } from "react";
import { ThemeColors } from "../../landing/domain/types";

const offerings = [
  {
    icon: (
      <svg
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "The Builder Community",
    desc: "A network of engineers, designers, and technical leads collaborating in a cross functional environment.",
  },

  {
    icon: (
      <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3l8 4-8 4-8-4 8-4zm0 7l8 4-8 4-8-4 8-4zm0 7l8 4-8 4-8-4 8-4z" />
      </svg>
    ),
    title: "The Project Ecosystem",
    desc: "A sandbox for building real-world products. We move beyond tutorials to maintain and ship live systems.",
  },

  {
    icon: (
      <svg
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    title: "The Talent Pipeline",
    desc: "Bridging the gap between theory and industry. We vet potential through actual execution and results.",
  },

  {
    icon: (
      <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 21h6v-1H9v1zm3-20C8.69 1 6 3.69 6 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h4a1 1 0 001-1v-4.26c1.81-1.27 3-3.36 3-5.74 0-3.31-2.69-6-6-6z" />
      </svg>
    ),
    title: "The Execution Culture",
    desc: "A structured space for rapid prototyping. Moving ideas from a blank file to a live deployment.",
  },
];

export function MoreThanCommunity({ colors }: { colors: ThemeColors }) {
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);

  const [cardsVisible, setCardsVisible] = useState<boolean[]>(
    new Array(offerings.length).fill(false),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          offerings.forEach((_, i) => {
            setTimeout(() => {
              setCardsVisible((prev) => {
                const updated = [...prev];
                updated[i] = true;
                return updated;
              });
            }, i * 120);
          });

          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-15 -mx-4 lg:-mx-[99px]">
      <div className="px-6 sm:px-8 lg:px-[99px] max-w-7xl mx-auto">
        {/* HEADER */}
        <div
          className={`
            mb-16
            transition-all
            duration-700
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
        >
          <h2
            className="
              text-4xl
              sm:text-5xl
              font-bold
              leading-tight
              tracking-tight
              mb-3
            "
            style={{
              color: colors.text,
            }}
          >
            More Than a Community.
          </h2>

          {/* GREEN ACCENT LINE */}
          <div
            className="
              h-1
              rounded-full
              mb-6
              transition-all
              duration-700
              delay-200
            "
            style={{
              width: visible ? "56px" : "0px",
              background: "#A4D045",
            }}
          />

          <p
            className="
              text-base
              sm:text-xl
              leading-8
            "
            style={{
              color: colors.textMuted,
            }}
          >
            TechHub is a project-driven infrastructure designed to turn
            technical potential into tangible products. We provide the
            structure, the teams, and the execution culture that traditional
            classrooms miss.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 max-w-5xl mx-auto">
          {offerings.map((item, i) => (
            <div
              key={i}
              className="
                rounded-xl
                border
                p-10
                text-center
                min-h-[260px]
                transition-all
                duration-500
                group
                hover:-translate-y-1
              "
              style={{
                background: colors.bgCard,
                borderColor: "#0F1B4D33",
                borderWidth: "1.5px",

                opacity: cardsVisible[i] ? 1 : 0,

                transform: cardsVisible[i]
                  ? "translateY(0px)"
                  : "translateY(20px)",
              }}
            >
              {/* ICON CONTAINER */}
              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-20
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
                style={{
                  background: colors.memberBg,
                  color: colors.text,
                }}
              >
                {item.icon}
              </div>

              {/* TITLE */}
              <h3
                className="
                  text-2xl
                  font-medium
                  tracking-tight
                  mb-1
                "
                style={{
                  color: colors.text,
                }}
              >
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p
                className="
                  text-lg
                  leading-7
                "
                style={{
                  color: colors.textMuted,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
