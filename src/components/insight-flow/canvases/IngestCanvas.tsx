"use client";

import { useRef, useCallback } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";

interface Stream {
  x: number;
  y: number;
  vx: number;
  vy: number;
  sz: number;
  tc: string;
  dc: string;
  trail: { x: number; y: number }[];
}

const trailCols = [
  "rgba(200,255,0,0.25)",
  "rgba(138,179,0,0.2)",
  "rgba(200,255,0,0.2)",
  "rgba(235,235,235,0.12)",
];
const dotCols = ["#c8ff00", "#8ab300", "#c8ff00", "#ebebeb"];

function initStreams(): Stream[] {
  const streams: Stream[] = [];
  for (let i = 0; i < 14; i++) {
    streams.push({
      x: Math.random() * 500,
      y: Math.random() * 300,
      vx: 0,
      vy: 0,
      sz: Math.random() * 3 + 1.5,
      tc: trailCols[i % 4],
      dc: dotCols[i % 4],
      trail: [],
    });
  }
  return streams;
}

export default function IngestCanvas() {
  const streamsRef = useRef<Stream[]>(initStreams());

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, cw: number, ch: number) => {
      ctx.clearRect(0, 0, cw, ch);
      const cx = cw * 0.68;
      const cy = ch * 0.5;

      // Center glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 35);
      g.addColorStop(0, "rgba(200,255,0,0.12)");
      g.addColorStop(1, "rgba(200,255,0,0.0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cw, ch);
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#c8ff00";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(200,255,0,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      streamsRef.current.forEach((s) => {
        const dx = cx - s.x;
        const dy = cy - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 22) {
          s.vx += (dx / dist) * 0.06;
          s.vy += (dy / dist) * 0.06;
        } else {
          s.x = Math.random() < 0.5 ? 0 : cw;
          s.y = Math.random() * ch;
          s.vx = (Math.random() - 0.3) * 1.5;
          s.vy = Math.random() - 0.5;
          s.trail = [];
        }
        s.vx *= 0.97;
        s.vy *= 0.97;
        s.x += s.vx;
        s.y += s.vy;
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 18) s.trail.shift();
        if (s.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(s.trail[0].x, s.trail[0].y);
          s.trail.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.strokeStyle = s.tc;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.sz, 0, Math.PI * 2);
        ctx.fillStyle = s.dc;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    },
    []
  );

  const canvasRef = useCanvasLoop(draw);
  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}
