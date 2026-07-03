"use client";

import { useRef, useCallback } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import { insightCards } from "@/data/insightCards";

interface InsightState {
  text: string;
  type: "critical" | "insight" | "auto";
  x: number;
  y: number;
  a: number;
  ta: number;
}

const typeColors: Record<string, string> = {
  critical: "#ff5f57",
  insight: "#c8ff00",
  auto: "#5ba8ff",
};

export default function InsightCanvas() {
  const stateRef = useRef({
    cur: 0,
    timer: 0,
    first: true,
    items: insightCards.map(
      (c): InsightState => ({ ...c, x: 0, y: 0, a: 0, ta: 0 })
    ),
  });

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, cw: number, ch: number) => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, cw, ch);
      state.timer += 0.014;

      if (state.first) {
        state.items[0].x = cw * 0.15;
        state.items[0].y = ch * 0.35;
        state.items[0].ta = 1;
        state.first = false;
      }
      if (state.timer > 2.2) {
        state.timer = 0;
        state.items[state.cur].ta = 0;
        state.cur = (state.cur + 1) % state.items.length;
        state.items[state.cur].x = cw * 0.1 + Math.random() * cw * 0.45;
        state.items[state.cur].y = ch * 0.15 + Math.random() * ch * 0.5;
        state.items[state.cur].ta = 1;
      }

      // Grid
      ctx.strokeStyle = "rgba(28,28,40,.45)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < cw; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
      }
      for (let y = 0; y < ch; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.stroke();
      }

      // Insight cards
      state.items.forEach((item) => {
        item.a += (item.ta - item.a) * 0.05;
        if (item.a < 0.01) return;
        const col = typeColors[item.type];
        ctx.globalAlpha = item.a * 0.85;
        ctx.font = "11px DM Sans";
        const tw = Math.min(
          ctx.measureText(item.text).width + 28,
          cw * 0.72
        );
        const rx = item.x;
        const ry = item.y;
        const rd = 5;
        ctx.beginPath();
        ctx.moveTo(rx + rd, ry);
        ctx.lineTo(rx + tw - rd, ry);
        ctx.quadraticCurveTo(rx + tw, ry, rx + tw, ry + rd);
        ctx.lineTo(rx + tw, ry + 26 - rd);
        ctx.quadraticCurveTo(rx + tw, ry + 26, rx + tw - rd, ry + 26);
        ctx.lineTo(rx + rd, ry + 26);
        ctx.quadraticCurveTo(rx, ry + 26, rx, ry + 26 - rd);
        ctx.lineTo(rx, ry + rd);
        ctx.quadraticCurveTo(rx, ry, rx + rd, ry);
        ctx.closePath();
        ctx.fillStyle = "#111118";
        ctx.fill();
        ctx.strokeStyle = col;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rx + 10, ry + 13, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.fillStyle = "#ebebeb";
        ctx.textBaseline = "middle";
        ctx.fillText(item.text, rx + 19, ry + 14);
        ctx.globalAlpha = 1;
      });

      // Output icon
      const ix = cw * 0.85;
      const iy = ch * 0.78;
      const ps = 1 + Math.sin(state.timer * Math.PI) * 0.08;
      ctx.save();
      ctx.translate(ix, iy);
      ctx.scale(ps, ps);
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(200,255,0,0.25)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(200,255,0,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#c8ff00";
      ctx.fill();
      ctx.restore();
    },
    []
  );

  const canvasRef = useCanvasLoop(draw);
  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}
