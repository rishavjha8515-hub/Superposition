import * as THREE from "three";

export const blackHoleVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const blackHoleFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3 uDiskColor;
  uniform float uDiskBrightness;
  uniform float uAmbientPulse;
  uniform float uLensStrength;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float angle = atan(p.y, p.x);

    if (r > 1.0) discard;

    vec3 col = vec3(0.0);

    float disk = smoothstep(0.55, 0.7, r) * (1.0 - smoothstep(0.7, 0.95, r));
    float streak = 0.5 + 0.5 * sin(angle * 6.0 - uTime * 2.0);
    float pulse = 1.0 + uAmbientPulse * 0.3 * sin(uTime * 0.8);
    col += uDiskColor * disk * streak * uDiskBrightness * pulse;

    float photonRing = smoothstep(0.88, 0.94, r) * (1.0 - smoothstep(0.94, 1.0, r));
    col += vec3(1.0, 0.92, 0.7) * photonRing * 1.2;

    float rim = pow(r, 8.0) * 0.4;
    col += uDiskColor * rim;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export interface BlackHoleUniforms {
  uTime: { value: number };
  uLensStrength: { value: number };
  uDiskColor: { value: THREE.Color };
  uDiskBrightness: { value: number };
  uAmbientPulse: { value: number };
  uHorizonRadius: { value: number };
  uCameraPos: { value: THREE.Vector3 };
}

export function createBlackHoleMaterial(): THREE.ShaderMaterial {
  const uniforms: BlackHoleUniforms = {
    uTime: { value: 0 },
    uLensStrength: { value: 0.6 },
    uDiskColor: { value: new THREE.Color("#ff8a3d") },
    uDiskBrightness: { value: 1.0 },
    uAmbientPulse: { value: 0.3 },
    uHorizonRadius: { value: 1.0 },
    uCameraPos: { value: new THREE.Vector3() },
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as Record<string, THREE.IUniform>,
    vertexShader: blackHoleVertexShader,
    fragmentShader: blackHoleFragmentShader,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false,
  });
}