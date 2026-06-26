import * as THREE from "three";
import { normalize } from "three/src/math/MathUtils.js";
import { varying } from "three/tsl";

export const blackHoleVertexShader = /* glsl */ `
varying vec3 vWorldDir;
varying vec2 viewportUV;

void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(positionGeometry, 1.0);
    vWorldDir = normalize(worldPos.xyz - cameraPosition);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const blackHoleFragmentShader = /* glsl */`
 precision highp float;

  uniform vec3 uCameraPos;
  uniform float uTime;
  uniform float uLensStrength;
  uniform vec3 uDiskColor;
  uniform float uDiskBrightness;
  uniform float uAmbientPulse;
  uniform float uHorizonRadius;

  varying vec3 vWorldDir;
  varying vec2 vUv;

  #define STEPS 10

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float starField(vec3 dir) {
    vec3 p = dir * 60.0;
    vec3 cell = floor(p);
    float h = hash(cell);
    float star = step(0.9935, h);
    float tw = 0.6 + 0.4 * sin(uTime * (2.0 + h * 4.0) + h * 50.0);
    return star * tw;
  }

  vec3 accretionDisk(vec3 pos, float r) {
    float diskMask = smoothstep(0.0, 0.15, 0.18 - abs(pos.y));
    float radial = smoothstep(uHorizonRadius * 0.95, uHorizonRadius * 1.05, r)
                  * (1.0 - smoothstep(uHorizonRadius * 1.0, uHorizonRadius * 4.0, r));
    float angle = atan(pos.z, pos.x);
    float streak = 0.6 + 0.4 * sin(angle * 10.0 - uTime * 1.5 + r * 2.0);
    float intensity = diskMask * radial * streak;
    return uDiskColor * intensity * uDiskBrightness * 2.2;
  }

  void main() {
  vec3 rd = normalize(vWorldDir);
  vec3 ro = uCameraPos;
  
  vec3 toCenter = -ro;
  float tca = dot(toCenter, rd);
  vec3 closestPoint = ro + rd * max(tca, 0.0);
  float b = length(closestPoint);
  
  vec3 col = vec3(0.0);
  
  float bendAmount = uLensStrength * 1.6 / max (b*b, 0.05);
  vec3 bendDir = nromalize(mix(rd, normalize(-closestPoint), clamp(bendAmount, 0.0, 0.9)));
    col += vec3(0.55, 0.65, 0.85) * starField(bendDir) * (1.0 + uAmbientPulse * 0.3 * sin(uTime * 0.6));

    float photonRing = uHorizonRadius * 1.5;
    float ringDist = abs(b - photonRing);
    float ring = exp(-ringDist * ringDist * 8.0) * step(b, photonRing * 1.8);
    col += vec3(1.0, 0.9, 0.7) * ring * 1.5;
    
    float horizonMask = step(b, uHorizonRadius) * step(0.0, tca);
    col = mix(col, vec3(0.0), horizonMask);
    
    float dist = 0.0;
    float stepSize = 40.0 / float(STEPS);
    for (int i = 0; i < STEPS; i++) {
    vec3  p = ro + rd * dist;
    float r = length(p);
    if (r > uHorizonRadius * 0.98 && r < 40.0) {
    col += accertionDisk(p, r ) * stepSize * 0.05;
    }
     dist += stepSize;
    }
     
    gl_FragColor = vec4(col, 1.0);
    }
`;

export interface BlackHoleUniforms {
    uCameraPos: { value: THREE.Vector3 };
    uTime: { value: number };
    uLensStrength: { value: number };
    uDiskColor: { value: THREE.Color };
    uDiskBrightness: { value: number };
    uAmbientPulse: { value: number };
    uHorizonRadius: { value: number };
}

export function createBlackHoleMaterial(): THREE.ShaderMaterial {
    const uniforms: BlackHoleUniforms = {
        uCameraPos: { value: new THREE.Vector3(0, 2, 14 ) },
        uTime: { value: 0 },
    uLensStrength: { value: 0.6 },
    uDiskColor: { value: new THREE.Color("#ff8a3d") },
    uDiskBrightness: { value: 1.0 },
    uAmbientPulse: { value: 0.3 },
    uHorizonRadius: { value: 1.0 },
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as Record<string, THREE.IUniform>,
    vertexShader: blackHoleVertexShader,
    fragmentShader: blackHoleFragmentShader,
    side: THREE.FrontSide,
    depthWrite: false,
  });
}
