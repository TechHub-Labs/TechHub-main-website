/**
 * NodeCanvas — Animated background node network
 * ─────────────────────────────────────────────────────────────────────────────
 * Replaces the static SVG dot pattern with a live canvas:
 * - Square nodes drift slowly in random directions, bouncing off edges
 * - Nodes connect with lines when within proximity — like a neural net
 * - Line opacity fades with distance (closer = stronger connection)
 * - Nodes pulse in size on a staggered cycle
 * - On mouse move, nearby nodes are attracted slightly toward the cursor
 * - Green accent node appears randomly and pulses brightly
 *
 * Runs in a fixed full-screen canvas behind all content (z-index: 0).
 */

import { useEffect, useRef } from 'react';

interface NodeCanvasProps {
  isDark: boolean;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  phase: number;          // phase offset for size pulse
  speed: number;
  accent: boolean;        // green accent node
  accentPhase: number;
}

const NODE_COUNT        = 65;
const CONNECTION_DIST   = 160;
const MOUSE_ATTRACT_R   = 120;
const MOUSE_ATTRACT_F   = 0.012;
const PULSE_SPEED       = 0.018;
const BASE_SPEED        = 0.28;

export function NodeCanvas({ isDark }: NodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef  = useRef<Node[]>([]);
  const mouseRef  = useRef({ x: -999, y: -999 });
  const rafRef    = useRef<number>(0);

  // Init nodes
  const initNodes = (w: number, h: number) => {
    nodesRef.current = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x:          Math.random() * w,
      y:          Math.random() * h,
      vx:         (Math.random() - 0.5) * BASE_SPEED * 2,
      vy:         (Math.random() - 0.5) * BASE_SPEED * 2,
      baseSize:   Math.random() * 1.8 + 1.2,
      size:       2,
      phase:      Math.random() * Math.PI * 2,
      speed:      Math.random() * 0.008 + 0.004,
      accent:     i < 4,          // first 4 nodes are green
      accentPhase: Math.random() * Math.PI * 2,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sizing
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      if (nodesRef.current.length === 0) {
        initNodes(canvas.width, canvas.height);
      }
    };
    resize();

    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(document.documentElement);

    // Mouse tracking
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // ─── Draw loop ─────────────────────────────────────────────────────────
    let frame = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      frame++;

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      // Colors
      const nodeColor  = isDark ? 'rgba(200,210,255,0.22)' : 'rgba(13,19,64,0.12)';
      const accentColor = '#A3D045';
      const lineBase   = isDark ? '163,208,69'    : '13,19,64';

      for (const node of nodes) {
        // ── Size pulse ──────────────────────────────────────────────────────
        node.phase += node.speed;
        const pulse = Math.sin(node.phase) * 0.6 + 1;    // 0.4 → 1.6
        node.size   = node.baseSize * pulse;

        // ── Accent node glow pulse ──────────────────────────────────────────
        node.accentPhase += PULSE_SPEED;

        // ── Mouse attraction ────────────────────────────────────────────────
        const scrollY = window.scrollY;
        const mx = mouse.x;
        const my = mouse.y - scrollY + canvas.getBoundingClientRect().top;   // canvas-relative
        const dx = mx - node.x;
        const dy = my - node.y;
        const distMouse = Math.sqrt(dx * dx + dy * dy);
        if (distMouse < MOUSE_ATTRACT_R) {
          node.vx += (dx / distMouse) * MOUSE_ATTRACT_F;
          node.vy += (dy / distMouse) * MOUSE_ATTRACT_F;
        }

        // ── Speed damping (prevent runaway) ─────────────────────────────────
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > BASE_SPEED * 2.5) {
          node.vx = (node.vx / speed) * BASE_SPEED * 2.5;
          node.vy = (node.vy / speed) * BASE_SPEED * 2.5;
        }

        // ── Move ────────────────────────────────────────────────────────────
        node.x += node.vx;
        node.y += node.vy;

        // ── Bounce off walls ────────────────────────────────────────────────
        if (node.x < 0)  { node.x = 0;  node.vx = Math.abs(node.vx); }
        if (node.x > w)  { node.x = w;  node.vx = -Math.abs(node.vx); }
        if (node.y < 0)  { node.y = 0;  node.vy = Math.abs(node.vy); }
        if (node.y > h)  { node.y = h;  node.vy = -Math.abs(node.vy); }

        // ── Draw node (square) ──────────────────────────────────────────────
        const s = node.size;

        if (node.accent) {
          // Glowing green square
          const glow = Math.sin(node.accentPhase) * 0.5 + 0.5;   // 0 → 1
          ctx.save();
          ctx.shadowBlur  = 10 + glow * 12;
          ctx.shadowColor = accentColor;
          ctx.fillStyle   = accentColor;
          ctx.globalAlpha = 0.55 + glow * 0.35;
          ctx.fillRect(node.x - s, node.y - s, s * 2, s * 2);
          ctx.restore();
        } else {
          ctx.fillStyle   = nodeColor;
          ctx.globalAlpha = 1;
          ctx.fillRect(node.x - s / 2, node.y - s / 2, s, s);
        }
      }

      // ── Draw connections ─────────────────────────────────────────────────
      ctx.globalAlpha = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
            const isAccentLine = a.accent || b.accent;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = isAccentLine
              ? `rgba(163,208,69,${alpha * 1.4})`
              : `rgba(${lineBase},${alpha})`;
            ctx.lineWidth = isAccentLine ? 1 : 0.6;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObs.disconnect();
      window.removeEventListener('mousemove', onMouse);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isDark ? 1 : 0.7,
      }}
    />
  );
}
