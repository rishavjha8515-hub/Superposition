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

    vec3 col = vec3(0.0);
    if (r < 0.3) col = vec3(1.0,0.0,0.0);
    else if (r < 0.6) col = vec3(0.0,1.0,0.0);
    else if (r < 0.9) col = vec3(0.0,0.0,1.0);
    else discard;

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