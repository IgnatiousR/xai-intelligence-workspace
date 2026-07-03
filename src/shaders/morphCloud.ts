import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const MorphCloudMaterial = shaderMaterial(
  { uDpr: 1, uTime: 0, uMouse: new THREE.Vector2() },
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
      float md = length(p.xy - uMouse * 3.);
      float push = smoothstep(2.8, 0., md) * .5;
      p.xy += normalize(p.xy - uMouse * 3. + .001) * push;
      p += normalize(p + .001) * sin(uTime * .7 + length(p) * 2.) * .03;
      vec4 mv = modelViewMatrix * vec4(p, 1.);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = max(size * uDpr * (220. / -mv.z), 1.);
      vA = .65 + push * .35;
    }
  `,
  /* fragment */
  `
    varying vec3 vC;
    varying float vA;
    void main() {
      float d = length(gl_PointCoord - vec2(.5));
      if (d > .5) discard;
      float glow = exp(-d * 4.5);
      float core = smoothstep(.5, .04, d);
      vec3 col = mix(vC, vec3(1.), core * .35);
      gl_FragColor = vec4(col, (glow * .45 + core * .55) * vA);
    }
  `
);

extend({ MorphCloudMaterial });

declare module "@react-three/fiber" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThreeElements {
    morphCloudMaterial: Record<string, unknown>;
  }
}
