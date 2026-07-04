// import * as THREE from "three";

function findClosestPair(
  sourcePositions: Float32Array,
  particleCount: number,
  samples: number,
  maxDist: number
): { a: number; b: number } | null {
  let bestA = -1;
  let bestB = -1;
  let bestDist = maxDist;

  for (let t = 0; t < samples; t++) {
    const a = (Math.random() * particleCount) | 0;
    const b = (Math.random() * particleCount) | 0;
    if (a === b) continue;

    const dx = sourcePositions[a * 3] - sourcePositions[b * 3];
    const dy = sourcePositions[a * 3 + 1] - sourcePositions[b * 3 + 1];
    const dz = sourcePositions[a * 3 + 2] - sourcePositions[b * 3 + 2];
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (d < bestDist) {
      bestDist = d;
      bestA = a;
      bestB = b;
    }
  }

  if (bestA === -1) return null;
  return { a: bestA, b: bestB };
}

/**
 * Updates the line positions buffer by randomly sampling pairs of particles
 * and connecting those that are closest together.
 */
export function updateConnections(
  linePositions: Float32Array,
  sourcePositions: Float32Array,
  lineCount: number,
  particleCount: number,
  samples: number,
  maxDist: number
) {
  for (let i = 0; i < lineCount; i++) {
    const pair = findClosestPair(sourcePositions, particleCount, samples, maxDist);
    if (!pair) continue;

    const { a, b } = pair;
    linePositions[i * 6] = sourcePositions[a * 3];
    linePositions[i * 6 + 1] = sourcePositions[a * 3 + 1];
    linePositions[i * 6 + 2] = sourcePositions[a * 3 + 2];
    linePositions[i * 6 + 3] = sourcePositions[b * 3];
    linePositions[i * 6 + 4] = sourcePositions[b * 3 + 1];
    linePositions[i * 6 + 5] = sourcePositions[b * 3 + 2];
  }
}
