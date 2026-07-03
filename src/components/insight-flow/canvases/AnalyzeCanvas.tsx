"use client";

import { useRef, useCallback } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";

const eps = 0.0001;
const layers = [4, 6, 8, 6, 3];

interface Node {
  x: number;
  y: number;
  layer: number;
  act: number;
  tAct: number;
}

interface Conn {
  from: Node;
  to: Node;
  sig: number;
  tSig: number;
}

export default function AnalyzeCanvas() {
  const nodesRef = useRef<Node[]>([]);
  const connsRef = useRef<Conn[]>([]);
  const builtRef = useRef(false);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, cw: number, ch: number) => {
      ctx.clearRect(0, 0, cw, ch);

      // Build nodes/connections on first frame or resize
      if (!builtRef.current || nodesRef.current.length === 0) {
        nodesRef.current = [];
        connsRef.current = [];
        layers.forEach((cnt, li) => {
          const x = (cw / (layers.length + 1)) * (li + 1);
          for (let i = 0; i < cnt; i++) {
            nodesRef.current.push({
              x,
              y: (ch / (cnt + 1)) * (i + 1),
              layer: li,
              act: 0,
              tAct: 0,
            });
          }
        });
        for (let l = 0; l < layers.length - 1; l++) {
          const from = nodesRef.current.filter((n) => n.layer === l);
          const to = nodesRef.current.filter((n) => n.layer === l + 1);
          from.forEach((f) =>
            to.forEach((t) => {
              if (Math.random() > 0.25)
                connsRef.current.push({
                  from: f,
                  to: t,
                  sig: 0,
                  tSig: 0,
                });
            })
          );
        }
        builtRef.current = true;
      }

      // Stochastic signal firing
      if (Math.random() < 0.06) {
        const c =
          connsRef.current[
            (Math.random() * connsRef.current.length) | 0
          ];
        if (c) c.tSig = 1;
      }

      // Propagate signals
      connsRef.current.forEach((c) => {
        c.sig += (c.tSig - c.sig) * 0.1;
        if (c.sig > 0.9) c.tSig = 0;
        if (c.sig > 0.5) c.to.tAct = 1;
      });

      // Propagate node activations
      nodesRef.current.forEach((n) => {
        n.act += (n.tAct - n.act) * 0.08;
        if (n.act > 0.9) n.tAct = 0;
      });

      // Draw connections
      connsRef.current.forEach((c) => {
        ctx.beginPath();
        ctx.moveTo(c.from.x, c.from.y);
        ctx.lineTo(c.to.x, c.to.y);
        ctx.strokeStyle = `rgba(200,255,0,${0.04 + c.sig * 0.3})`;
        ctx.lineWidth = 0.4 + c.sig * 1.4;
        ctx.stroke();
      });

      // Draw nodes
      nodesRef.current.forEach((n) => {
        const r = 3.5 + n.act * 3;
        if (n.act > 0.1) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
          g.addColorStop(0, `rgba(200,255,0,${n.act * 0.18})`);
          g.addColorStop(1, "rgba(200,255,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(n.x - r * 3, n.y - r * 3, r * 6, r * 6);
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(r, eps), 0, Math.PI * 2);
        ctx.fillStyle =
          n.act > 0.3
            ? `rgba(200,255,0,${0.35 + n.act * 0.65})`
            : "rgba(110,110,122,0.35)";
        ctx.fill();
      });
    },
    []
  );

  const canvasRef = useCanvasLoop(draw);
  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden />;
}
