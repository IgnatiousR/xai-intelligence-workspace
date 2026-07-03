"use client";

import { useRef, useEffect, useCallback } from "react";

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  dt: number
) => void;

export function useCanvasLoop(draw: DrawFn) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let cw = 0;
    let ch = 0;
    let raf: number;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const d = window.devicePixelRatio || 1;
      if (Math.abs(r.width - cw) < 1 && Math.abs(r.height - ch) < 1) return;
      cw = r.width;
      ch = r.height;
      canvas.width = cw * d;
      canvas.height = ch * d;
      ctx.scale(d, d);
    };

    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      resize();
      if (!cw) return;
      drawRef.current(ctx, cw, ch, (now - last) / 1000);
      last = now;
    };
    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return canvasRef;
}
