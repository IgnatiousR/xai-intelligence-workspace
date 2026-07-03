"use client";

import { useRef, useEffect, useCallback } from "react";

interface LineChartProps {
  data: number[];
  labels: string[];
  min: number;
  max: number;
  height: number;
  formatY: (v: number) => string;
}

function curve(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[]
) {
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    ctx.bezierCurveTo((p.x + c.x) / 2, p.y, (p.x + c.x) / 2, c.y, c.x, c.y);
  }
}

export default function LineChart({
  data,
  labels,
  min,
  max,
  height,
  formatY,
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const r = cv.getBoundingClientRect();
    const d = window.devicePixelRatio || 1;
    cv.width = r.width * d;
    cv.height = height * d;
    ctx.scale(d, d);
    cv.style.height = `${height}px`;

    const w = r.width;
    const pad = { t: 8, r: 8, b: 22, l: 36 };
    const cw = w - pad.l - pad.r;
    const ch = height - pad.t - pad.b;
    const range = max - min;
    const gridLines = 4;

    // Grid lines + Y labels
    ctx.strokeStyle = "rgba(28,28,42,.7)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridLines; i++) {
      const y = pad.t + (ch / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
      ctx.fillStyle = "#6e6e7a";
      ctx.font = "10px DM Sans";
      ctx.textAlign = "right";
      ctx.fillText(formatY(max - (range / gridLines) * i), pad.l - 6, y + 3);
    }

    // X labels
    ctx.textAlign = "center";
    data.forEach((_, i) => {
      ctx.fillText(
        labels[i],
        pad.l + (cw / (data.length - 1)) * i,
        height - 4
      );
    });

    // Points
    const pts = data.map((v, i) => ({
      x: pad.l + (cw / (data.length - 1)) * i,
      y: pad.t + ch - ((v - min) / range) * ch,
    }));

    // Gradient fill
    const grd = ctx.createLinearGradient(0, pad.t, 0, height - pad.b);
    grd.addColorStop(0, "rgba(200,255,0,0.12)");
    grd.addColorStop(1, "rgba(200,255,0,0.0)");
    ctx.beginPath();
    curve(ctx, pts);
    ctx.lineTo(pts[pts.length - 1].x, height - pad.b);
    ctx.lineTo(pts[0].x, height - pad.b);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();

    // Line
    ctx.beginPath();
    curve(ctx, pts);
    ctx.strokeStyle = "#c8ff00";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dots
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#06060a";
      ctx.fill();
      ctx.strokeStyle = "#c8ff00";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }, [data, labels, min, max, height, formatY]);

  useEffect(() => {
    draw();
    const ro = new ResizeObserver(draw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full" />;
}
