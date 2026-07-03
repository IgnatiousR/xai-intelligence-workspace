import type { RootState } from "@react-three/fiber";
import type { RefObject } from "react";

interface ParticleMaterial {
  uDpr: number;
  uTime: number;
  uMouse: { set(x: number, y: number): void };
}

interface UpdateOptions {
  materialRef: RefObject<ParticleMaterial | null>;
  pointsRef: RefObject<{ rotation: { y: number; x: number } } | null>;
  state: RootState;
  t: number;
  pointerX: number;
  pointerY: number;
  rotationSpeedY?: number;
  pointerInfluenceY?: number;
  pointerInfluenceX?: number;
}

export function updateParticleMaterial({
  materialRef,
  pointsRef,
  state,
  t,
  pointerX,
  pointerY,
  rotationSpeedY = 0.04,
  pointerInfluenceY = 0.12,
  pointerInfluenceX = 0.06,
}: UpdateOptions) {
  if (materialRef.current) {
    materialRef.current.uDpr = Math.min(state.gl.getPixelRatio(), 2);
    materialRef.current.uTime = t;
    materialRef.current.uMouse.set(pointerX, pointerY);
  }

  if (pointsRef.current) {
    pointsRef.current.rotation.y = t * rotationSpeedY + pointerX * pointerInfluenceY;
    pointsRef.current.rotation.x = pointerY * pointerInfluenceX;
  }
}
