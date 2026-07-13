import { useEffect, useRef } from "react";

/**
 * Cinematic cyber background:
 *  - Aurora gradient blobs (CSS animated)
 *  - Rotating concentric orbit rings + faint globe meridians
 *  - Canvas network constellation with glowing nodes
 *  - Green "packet" pulses on active links
 *  - Radar sweep + threat ping shockwaves
 *  - Diagonal scan beam
 *  Respects prefers-reduced-motion.
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
    type Pulse = { a: number; b: number; t: number; speed: number };
    type Ping = { x: number; y: number; t: number };

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let pings: Ping[] = [];
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(110, Math.floor((width * height) / 14000));
      nodes = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.6,
        hue: Math.random() < 0.15 ? 150 : 200, // occasional green node among cyan
      }));
      pulses = [];
      pings = [];
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const MAX_DIST = 150;
    const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // move
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      // links
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_DIST_SQ) {
            const alpha = 1 - d2 / MAX_DIST_SQ;
            ctx.strokeStyle = `rgba(94, 200, 255, ${alpha * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            if (!reduced && alpha > 0.78 && Math.random() < 0.0008) {
              pulses.push({ a: i, b: j, t: 0, speed: 0.01 + Math.random() * 0.012 });
            }
          }
        }
      }

      // nodes with glow
      for (const n of nodes) {
        const color = n.hue === 150 ? "134, 239, 172" : "125, 211, 252";
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        g.addColorStop(0, `rgba(${color}, 0.9)`);
        g.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${color}, 1)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // pulses
      pulses = pulses.filter((p) => {
        p.t += p.speed;
        if (p.t >= 1) {
          const b = nodes[p.b];
          if (b) pings.push({ x: b.x, y: b.y, t: 0 });
          return false;
        }
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) return false;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 10);
        grad.addColorStop(0, "rgba(74, 222, 128, 1)");
        grad.addColorStop(1, "rgba(74, 222, 128, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // pings (shockwaves)
      pings = pings.filter((p) => {
        p.t += 0.02;
        if (p.t >= 1) return false;
        const r = p.t * 60;
        ctx.strokeStyle = `rgba(74, 222, 128, ${(1 - p.t) * 0.55})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        return true;
      });

      // occasional random threat ping
      if (!reduced && frame % 220 === 0) {
        pings.push({
          x: Math.random() * width,
          y: Math.random() * height,
          t: 0,
        });
      }

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
      {/* deep base wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 15% 0%, color-mix(in oklab, var(--primary) 28%, transparent), transparent 60%), radial-gradient(900px 600px at 90% 100%, color-mix(in oklab, var(--ok) 18%, transparent), transparent 55%), radial-gradient(600px 400px at 60% 40%, color-mix(in oklab, var(--high) 10%, transparent), transparent 70%)",
        }}
      />

      {/* aurora blobs */}
      <div className="aurora-a absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full blur-[110px] opacity-60"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 55%, transparent), transparent 65%)" }} />
      <div className="aurora-b absolute right-[-15%] top-[20%] h-[600px] w-[600px] rounded-full blur-[120px] opacity-50"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--ok) 50%, transparent), transparent 65%)" }} />
      <div className="aurora-c absolute left-[30%] bottom-[-20%] h-[500px] w-[500px] rounded-full blur-[110px] opacity-40"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--high) 45%, transparent), transparent 65%)" }} />

      {/* grid */}
      <div className="absolute inset-0 grid-bg opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />

      {/* orbital rings (right side globe hint) */}
      <div className="absolute right-[-180px] top-1/2 -translate-y-1/2 h-[720px] w-[720px] opacity-40">
        <div className="orbit-slow absolute inset-0 rounded-full border border-primary/25" />
        <div className="orbit-mid absolute inset-8 rounded-full border border-primary/20" />
        <div className="orbit-fast absolute inset-16 rounded-full border border-ok/25 border-dashed" />
        <div className="absolute inset-24 rounded-full border border-primary/10" />
      </div>

      {/* animated network */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* diagonal scan beam */}
      <div className="scan-beam absolute -inset-x-1/2 top-0 h-[200%] w-[200%] opacity-[0.07]"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0 40px, color-mix(in oklab, var(--primary) 80%, transparent) 40px 41px)",
        }} />

      {/* horizontal scanline sweep */}
      <div className="scanline absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      {/* vignette */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, color-mix(in oklab, var(--background) 85%, transparent) 100%)" }} />
    </div>
  );
}
