import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../features/landing/domain/useTheme";

export function CustomCursor() {
  const { dark } = useTheme();
  
  // DOM Refs for direct 60fps manipulation
  const dotRef = useRef<HTMLDivElement>(null);
  const orbit1Ref = useRef<HTMLDivElement>(null);
  const orbit2Ref = useRef<HTMLDivElement>(null);

  // Physics & Animation Tracking Refs
  const mouse = useRef({ x: -100, y: -100 });
  const trailing = useRef({ x: -100, y: -100 });
  const rotation1 = useRef(0); // Main ring continuous rotation
  const rotation2 = useRef(0); // Inner ring continuous rotation
  
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);

  useEffect(() => {
    // Disable gracefully on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    let animationFrameId: number;

    const render = () => {
      // 1. Smooth Trailing Physics (Lerp)
      trailing.current.x += (mouse.current.x - trailing.current.x) * 0.25;
      trailing.current.y += (mouse.current.y - trailing.current.y) * 0.25;

      // 2. CONTINUOUS ROTATION LOGIC
      // The broken ring spins constantly, and accelerates when hovering
      rotation1.current += isHoveringRef.current ? 4 : 1.5; 
      // The inner dashed ring spins in the opposite direction
      rotation2.current -= isHoveringRef.current ? 5 : 2; 

      // 3. Apply Transforms to DOM Elements
      if (dotRef.current) {
        const scale = isHoveringRef.current ? 0 : 1;
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      }

      if (orbit1Ref.current) {
        // Expand the main broken orbit when hovering over a button
        const scale = isHoveringRef.current ? 1.8 : 1;
        orbit1Ref.current.style.transform = `translate3d(${trailing.current.x}px, ${trailing.current.y}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation1.current}deg)`;
      }

      if (orbit2Ref.current) {
        // Inner mechanical ring only appears on hover
        const scale = isHoveringRef.current ? 1.2 : 0;
        const opacity = isHoveringRef.current ? 1 : 0;
        orbit2Ref.current.style.transform = `translate3d(${trailing.current.x}px, ${trailing.current.y}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation2.current}deg)`;
        orbit2Ref.current.style.opacity = opacity.toString();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  // --- Theme Dependent Colors (Sharp & Obvious) ---
  // Dark Mode: Glowing Neon Lime
  // Light Mode: Vibrant, deep Electric Blue for max contrast against white/grey
  const cursorColor = dark ? "#A3D045" : "#2563EB"; 
  const glowColor = dark ? "rgba(163, 208, 69, 0.6)" : "rgba(37, 99, 235, 0.4)";

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>

      {/* Inner Dot - Zero latency tracking */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9999] transition-[transform] duration-200 ease-out"
        style={{
          backgroundColor: cursorColor,
          boxShadow: `0 0 10px 2px ${glowColor}`,
          willChange: "transform",
        }}
      />

      {/* Main Orbit Ring - Continually spinning BROKEN circle */}
      <div
        ref={orbit1Ref}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] transition-transform duration-300 ease-out"
        style={{
          border: `1.5px solid ${cursorColor}`,
          // Making top and bottom transparent creates the dual "bracket" spinning effect
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          willChange: "transform",
        }}
      />

      {/* Secondary Inner Orbit - Dashed lock-on ring (Only appears on hover) */}
      <div
        ref={orbit2Ref}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9997] transition-all duration-300 ease-out"
        style={{
          border: `2px dashed ${cursorColor}`,
          filter: `drop-shadow(0 0 4px ${glowColor})`,
          willChange: "transform",
        }}
      />
    </>
  );
}