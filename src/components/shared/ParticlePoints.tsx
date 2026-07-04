"use client";

import { forwardRef, type ReactNode } from "react";
import * as THREE from "three";

interface ParticlePointsProps {
  positions: Float32Array;
  sizes: Float32Array;
  colors: Float32Array;
  children: ReactNode;
}

export const ParticlePoints = forwardRef<THREE.Points, ParticlePointsProps>(
  ({ positions, sizes, colors, children }, ref) => {
    return (
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        </bufferGeometry>
        {children}
      </points>
    );
  }
);
ParticlePoints.displayName = "ParticlePoints";
