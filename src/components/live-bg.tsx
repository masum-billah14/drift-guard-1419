import { useEffect, useRef } from "react";

/**
 * Animated cybersecurity network background.
 * - Floating nodes with connecting lines (constellation)
 * - Occasional "packet" pulses travelling along the strongest links
 * - Respects prefers-reduced-motion
 */
export function LiveBg({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    type Pulse = { a: number; b: number; t: number; speed: number };

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(90, Math.floor((width * height) / 16000));
      nodes = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
      }));
      pulses = [];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const MAX_DIST = 140;
    const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // move
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_DIST_SQ) {
            const alpha = 1 - d2 / MAX_DIST_SQ;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // occasionally spawn a pulse on tight links
            if (!reduced && alpha > 0.75 && Math.random() < 0.0006) {
              pulses.push({ a: i, b: j, t: 0, speed: 0.008 + Math.random() * 0.01 });
            }
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.fillStyle = "rgba(125, 211, 252, 0.9)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // pulses
      pulses = pulses.filter((p) => {
        p.t += p.speed;
        if (p.t >= 1) return false;
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) return false;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
        grad.addColorStop(0, "rgba(74, 222, 128, 0.9)");
        grad.addColorStop(1, "rgba(74, 222, 128, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 20% 10%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%), radial-gradient(900px 500px at 85% 90%, color-mix(in oklab, var(--ok) 14%, transparent), transparent 55%)",
        }}
      />
      {/* grid */}
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />
      {/* animated network */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* scanline sweep */}
      <div className="scanline absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </div>
  );
}
