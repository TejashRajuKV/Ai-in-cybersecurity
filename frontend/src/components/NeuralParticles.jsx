import { useEffect, useRef } from "react";

export default function NeuralParticles({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const isDark = !document.body.classList.contains("light-theme");
    const NODE_COLOR  = isDark ? "rgba(0,242,255," : "rgba(2,132,199,";
    const LINE_COLOR  = isDark ? "rgba(0,242,255," : "rgba(2,132,199,";
    const PULSE_COLOR = isDark ? "rgba(0,255,136," : "rgba(22,163,74,";

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Build nodes ──────────────────────────
    const NUM = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 70);
    const CONNECT_DIST = 160;

    const nodes = Array.from({ length: NUM }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 2 + 1.5,
      // pulse state
      pulse: Math.random() > 0.85, // ~15% nodes are "active"
      pulseT: Math.random() * Math.PI * 2,
    }));

    // ── Data-packet dots traveling edges ─────
    const packets = [];
    const spawnPacket = () => {
      const a = Math.floor(Math.random() * nodes.length);
      const b = Math.floor(Math.random() * nodes.length);
      if (a === b) return;
      const dx = nodes[b].x - nodes[a].x;
      const dy = nodes[b].y - nodes[a].y;
      if (Math.hypot(dx, dy) > CONNECT_DIST) return;
      packets.push({ a, b, t: 0, speed: 0.008 + Math.random() * 0.012 });
    };

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Spawn a new packet occasionally
      if (frame % 40 === 0) spawnPacket();

      // ── Move nodes ──
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        if (n.pulse) n.pulseT += 0.04;
      });

      // ── Draw edges ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[j].x - nodes[i].x;
          const dy   = nodes[j].y - nodes[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = `${LINE_COLOR}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // ── Draw nodes ──
      nodes.forEach(n => {
        const glow = n.pulse ? 0.5 + 0.5 * Math.sin(n.pulseT) : 0.6;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `${NODE_COLOR}${glow})`;
        ctx.fill();

        if (n.pulse) {
          // Outer pulse ring
          const ringR = n.r + 4 + 4 * Math.sin(n.pulseT);
          const ringAlpha = 0.2 * (0.5 + 0.5 * Math.sin(n.pulseT));
          ctx.beginPath();
          ctx.arc(n.x, n.y, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `${PULSE_COLOR}${ringAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // ── Draw traveling data packets ──
      packets.forEach((p, idx) => {
        p.t += p.speed;
        if (p.t >= 1) {
          packets.splice(idx, 1);
          return;
        }
        const ax = nodes[p.a].x, ay = nodes[p.a].y;
        const bx = nodes[p.b].x, by = nodes[p.b].y;
        const px = ax + (bx - ax) * p.t;
        const py = ay + (by - ay) * p.t;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${PULSE_COLOR}0.9)`;
        ctx.fill();

        // trail
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = `${PULSE_COLOR}0.2)`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:  "absolute",
        inset:     0,
        width:     "100%",
        height:    "100%",
        zIndex:    1,
        pointerEvents: "none",
      }}
    />
  );
}
