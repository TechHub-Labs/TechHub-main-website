import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Track mouse movement
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Track if the mouse is over a clickable element
    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Look up the DOM tree to see if we are hovering over a link or button
      const isClickable =
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", updateHoverState);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", updateHoverState);
    };
  }, []);

  // Hide the custom cursor on touch devices (mobile/tablets)
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return null;
  }

  return (
    <>
      {/* Inner Dot - Fast tracking */}
      <div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#A3D045] rounded-full pointer-events-none z-[9999] transition-transform duration-75 ease-out shadow-sm"
        style={{
          transform: `translate3d(${position.x - 5}px, ${position.y - 5}px, 0) scale(${isHovering ? 0 : 1})`,
          opacity: isHovering ? 0 : 1,
        }}
      />

      {/* Outer Ring - Smooth trailing and expanding */}
      <div
        className="fixed top-0 left-0 w-8 h-8 border-[1.5px] border-[#A3D045] rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out"
        style={{
          transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0) scale(${isHovering ? 1.5 : 1})`,
          backgroundColor: isHovering
            ? "rgba(163, 208, 69, 0.1)"
            : "transparent",
        }}
      />
    </>
  );
}
