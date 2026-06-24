import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";
import { cos } from "three/tsl";

const MAX_PARTICLES = 800;

interface ParticleFieldProps {
    visual: SceneVisualConfig;
}

export function ParticleField({ visual }: ParticleFieldProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const colorRef = useRef(new THREE.Color(visual.particleColor));

    const { positions, speeds, radii } = useMemo(() => {
        const positions = new Float32Array(MAX_PARTICLES * 3);
        const speeds = new Float32Array(MAX_PARTICLES);
        const radii = new Float32Array(MAX_PARTICLES);

        for (let i = 0; i < MAX_PARTICLES; i++) {
            const r = 3 + Math.random() * 18;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3+1] = r * Math.cos(phi) * 0.6;
            positions[i * 3+2] = r * Math.sin(phi) * Math.sin(theta);
            speeds[i] = 0.05 + Math.random() * 0.15;
            radii[i] = r;
        }
        return { positions, speeds, radii };
    }, []);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [positions]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;
        colorRef.current.lerp(new THREE.Color(visual.particleColor), Math.min(1, delta * 1.5));
    
         const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.color.copy(colorRef.current);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, visual.particleDensity, Math.min(1, delta * 1.2));

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const activeCount = Math.floor(MAX_PARTICLES * Math.max(0.05, visual.particleDensity));
    
    for (let i = 0; i < activeCount; i++) {
        radii[i] -= speeds[i] * delta * 0.6;
        if (radii[i] < 1.2) radii[i] = 18 + Math.random() * 4;

        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);
        const angle = Math.atan2(z, x) + delta * speeds[i] * 0.3;
        posAttr.setX(i, radii[i] * Math.cos(angle));
        posAttr.setZ(i, radii[i] * Math.sin(angle));
    }
    posAttr.needsUpdate = true;
    });

     return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        transparent
        opacity={visual.particleDensity}
        color={visual.particleColor}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}