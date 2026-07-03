import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

// fallow-ignore-next-line unused-export
export const ParticleFieldMaterial = shaderMaterial(
  { uDpr: 1, uMouse: new THREE.Vector2(), uTime: 0 },
  /* vertex */
  `
    attribute float size;
    attribute vec3 aColor;
    varying vec3 vC;
    varying float vA;
    uniform float uDpr, uTime;
    uniform vec2 uMouse;
    void main() {
      vC = aColor;
      vec3 p = position;
      float md = length(p.xy - uMouse * 3.5);
      float mi = smoothstep(2.5, 0., md);
      p.xy += normalize(p.xy - uMouse * 3.5 + .001) * mi * .6;
      p.x += sin(uTime * .4 + position.y * 1.8) * .025;
      p.y += cos(uTime * .35 + position.x * 1.8) * .025;
      vec4 mv = modelViewMatrix * vec4(p, 1.);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = max(size * uDpr * (280. / -mv.z) * (1. + mi * .7), 1.);
      vA = smoothstep(0., .5, size / 3.) * (.55 + mi * .45);
    }
  `,
  /* fragment */
  `
    varying vec3 vC;
    varying float vA;
    void main() {
      float d = length(gl_PointCoord - vec2(.5));
      if (d > .5) discard;
      float a = smoothstep(.5, .08, d) * vA;
      gl_FragColor = vec4(vC, a);
    }
  `
);

extend({ ParticleFieldMaterial });

declare module "@react-three/fiber" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThreeElements {
    particleFieldMaterial: Record<string, unknown>;
  }
}

declare module "three" {
  interface ShaderMaterial {
    uDpr: number;
    uTime: number;
    uMouse: THREE.Vector2;
  }
}
