/**
 * MEMBERS SECTION
 * * Showcases team members with their roles and quotes.
 */

import { Link } from "react-router-dom";
import { Builder, ThemeColors } from "../domain/types";

interface MembersSectionProps {
  colors: ThemeColors;
}

const members: Builder[] = [
  {
    name: "John Appleseed",
    role: "Frontend Developer",
    quote: '"I build clean interfaces that just make sense."',
  },
  {
    name: "Avery Johnson",
    role: "Product Designer",
    quote: '"I love creating intuitive user-centered designs."',
  },
  {
    name: "Maria Gonzalez",
    role: "UX Designer",
    quote: '"Designing experiences that delight users."',
  },
  {
    name: "Liam Chen",
    role: "Backend Engineer",
    quote: '"Crafting scalable systems behind the scenes."',
  },
];

export function MembersSection({ colors }: MembersSectionProps) {
  return (
    <section className="pt-40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2
            className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight"
            style={{ color: colors.text }}
          >
            <span className="section-title-underline">Meet the Builders</span>
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mt-4 max-w-xl"
            style={{ color: colors.text }}
          >
            The engineers, designers, and innovators driving our culture.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {members.map((member) => (
            <div
              key={member.name}
              className="rounded-xl p-1 sm:p-2 flex flex-col items-center text-center transition-all duration-300 cursor-default border-2 border-transparent hover:border-[#3B5BDB] hover:scale-105 hover:shadow-lg hover:-translate-y-2 shadow-sm"
              style={{ background: colors.bgCard }}
            >
              {/* Avatar */}
              <div
                className="w-full max-h-80 aspect-square rounded-lg mb-6"
                style={{ background: colors.memberBg }}
              />

              {/* Info */}
              <h3
                className="text-xl sm:text-2xl font-medium mb-1 tracking-tight"
                style={{ color: colors.text }}
              >
                {member.name}
              </h3>
              <p
                className="text-xs sm:text-sm font-medium mb-5"
                style={{ color: colors.text }}
              >
                {member.role}
              </p>
              <p className="text-sm italic px-2" style={{ color: colors.text }}>
                {member.quote}
              </p>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link to="/members">
            <button
              className="px-6 py-2.5 rounded border text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:-translate-y-1 active:scale-95 inline-flex items-center gap-2"
              style={{
                background: "transparent",
                color: colors.text,
                borderColor: colors.text,
              }}
            >
              View All Members &rarr;
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
