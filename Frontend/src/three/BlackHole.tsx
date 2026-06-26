import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createBlackHoleMaterial } from "./blackHoleShader";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";

interface BlackHoleProps {
    visual: SceneVisualConfig;
}

export function BlackHole({ visual }: BlackHoleProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const { camera } = useThree();

    const material = useMemo(() => createBlackHoleMaterial(), []);

    const targets = useRef({
        lensStrength: visual.lensStrength,
        diskColor: new THREE.Color(visual.diskColor),
        diskBrightness: visual.diskBrightness,
        ambientPulse: visual.ambientPulse,
    });

    useEffect(() => {
        targets.current.lensStrength = visual.lensStrength;
        targets.current.diskColor = new THREE.Color(visual.diskColor);
        targets.current.diskBrightness = visual.diskBrightness;
        targets.current.ambientPulse = visual.ambientPulse;
    }, [visual]);

    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.material = material;
        }
    })

useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    if (!mat || !mat.uniforms || !mat.uniforms.uTime) return;

    const u = mat.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uCameraPos.value.copy(camera.position);

    const lerpSpeed = Math.min(1, delta * 1.2);
    u.uLensStrength.value = THREE.MathUtils.lerp(u.uLensStrength.value, targets.current.lensStrength, lerpSpeed);
    u.uDiskBrightness.value = THREE.MathUtils.lerp(u.uDiskBrightness.value, targets.current.diskBrightness, lerpSpeed);
    u.uAmbientPulse.value = THREE.MathUtils.lerp(u.uAmbientPulse.value, targets.current.ambientPulse, lerpSpeed);
    (u.uDiskColor.value as THREE.Color).lerp(targets.current.diskColor, lerpSpeed);
});

    return (
        <mesh>
            <sphereGeometry args={[80, 32, 32]} />
            </mesh>
    );
}
