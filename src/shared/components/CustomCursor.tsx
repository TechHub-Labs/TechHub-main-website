/**
 * CustomCursor.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../features/landing/domain/useTheme";

const TRAIL_LENGTH = 6;

export function CustomCursor() {
  const { dark } = useTheme();

  const dotRef = useRef<HTMLDivElement>(null);
  const orbit1Ref = useRef<HTMLDivElement>(null);
  const orbit2Ref = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mouse = useRef({ x: -300, y: -300 });
  const trailing = useRef({ x: -300, y: -300 });
  const spotlight = useRef({ x: -300, y: -300 });

  const trailPositions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -300, y: -300 })),
  );

  const rotation1 = useRef(0);
  const rotation2 = useRef(0);

  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setIsHovering(
        t.closest("a") !== null ||
          t.closest("button") !== null ||
          window.getComputedStyle(t).cursor === "pointer",
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    let raf: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;

      trailing.current.x += (mouse.current.x - trailing.current.x) * 0.25;
      trailing.current.y += (mouse.current.y - trailing.current.y) * 0.25;

      spotlight.current.x += (mouse.current.x - spotlight.current.x) * 0.06;
      spotlight.current.y += (mouse.current.y - spotlight.current.y) * 0.06;

      if (frameCount % 2 === 0) {
        const tp = trailPositions.current;
        for (let i = tp.length - 1; i > 0; i--) {
          tp[i].x = tp[i - 1].x;
          tp[i].y = tp[i - 1].y;
        }
        tp[0].x = mouse.current.x;
        tp[0].y = mouse.current.y;
      }

      rotation1.current += isHoveringRef.current ? 4 : 1.5;
      rotation2.current -= isHoveringRef.current ? 5 : 2;

      if (dotRef.current) {
        const scale = isHoveringRef.current ? 0 : 1;
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px,${mouse.current.y}px,0) translate(-50%,-50%) scale(${scale})`;
      }

      if (orbit1Ref.current) {
        const scale = isHoveringRef.current ? 1.8 : 1;
        orbit1Ref.current.style.transform = `translate3d(${trailing.current.x}px,${trailing.current.y}px,0) translate(-50%,-50%) scale(${scale}) rotate(${rotation1.current}deg)`;
      }

      if (orbit2Ref.current) {
        const scale = isHoveringRef.current ? 1.2 : 0;
        orbit2Ref.current.style.transform = `translate3d(${trailing.current.x}px,${trailing.current.y}px,0) translate(-50%,-50%) scale(${scale}) rotate(${rotation2.current}deg)`;
        orbit2Ref.current.style.opacity = isHoveringRef.current ? "1" : "0";
      }

      if (spotlightRef.current) {
        const sx = spotlight.current.x - 275; // center the 550px element
        const sy = spotlight.current.y - 275;
        spotlightRef.current.style.transform = `translate3d(${sx}px,${sy}px,0)`;
      }

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = trailPositions.current[i];
        const progress = (i + 1) / TRAIL_LENGTH; // 0.16 … 1.0
        const size = 4 * (1 - progress * 0.7); // shrinks toward tail
        const opacity = (1 - progress) * 0.5; // fades toward tail
        el.style.transform = `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%)`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.opacity = opacity.toString();
      });

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (window.matchMedia("(pointer: coarse)").matches) return null;

  const cursorColor = dark ? "#A3D045" : "#2563EB";
  const glowColor = dark ? "rgba(163,208,69,0.6)" : "rgba(37,99,235,0.4)";

  const spotGradient = dark
    ? "radial-gradient(circle, rgba(163,208,69,0.07) 0%, rgba(163,208,69,0.03) 40%, transparent 70%)"
    : "radial-gradient(circle, rgba(13,19,64,0.05) 0%, rgba(13,19,64,0.02) 40%, transparent 70%)";

  return (
    <>
      <style>{`
        @media (pointer: fine) { * { cursor: none !important; } }
      `}</style>

      <div
        ref={spotlightRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          background: spotGradient,
          mixBlendMode: dark ? "screen" : "multiply",
          willChange: "transform",
        }}
      />

      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "4px",
            height: "4px",
            borderRadius: "0.5px", // square with tiny radius — matches bg nodes
            background: cursorColor,
            pointerEvents: "none",
            zIndex: 9996,
            willChange: "transform",
          }}
        />
      ))}

      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: cursorColor,
          boxShadow: `0 0 10px 2px ${glowColor}`,
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />

      <div
        ref={orbit1Ref}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: `1.5px solid ${cursorColor}`,
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
        }}
      />

      <div
        ref={orbit2Ref}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          border: `2px dashed ${cursorColor}`,
          filter: `drop-shadow(0 0 4px ${glowColor})`,
          pointerEvents: "none",
          zIndex: 9997,
          willChange: "transform",
        }}
      />
    </>
  );
}
