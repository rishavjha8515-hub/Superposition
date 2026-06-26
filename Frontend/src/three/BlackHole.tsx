import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";

interface BlackHoleProps {
  visual: SceneVisualConfig;
}

export function BlackHole({ visual }: BlackHoleProps) {
  const diskRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.4;
    if (glowRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05 * visual.ambientPulse;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const diskColor = new THREE.Color(visual.diskColor);

  return (
    <group>
      <mesh>
        <ringGeometry args={[2.2, 4.0, 64]} />
        <meshBasicMaterial
          color={diskColor}
          side={THREE.DoubleSide}
          transparent
          opacity={0.08 * visual.diskBrightness}
        />
      </mesh>

      <mesh ref={glowRef}>
        <ringGeometry args={[1.9, 2.8, 64]} />
        <meshBasicMaterial
          color={diskColor}
          side={THREE.DoubleSide}
          transparent
          opacity={0.25 * visual.diskBrightness}
        />
      </mesh>

      <mesh ref={diskRef}>
        <ringGeometry args={[1.55, 2.1, 64]} />
        <meshBasicMaterial
          color={diskColor}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9 * visual.diskBrightness}
        />
      </mesh>

      <mesh>
        <ringGeometry args={[1.48, 1.58, 64]} />
        <meshBasicMaterial
          color="#ffe8b0"
          side={THREE.DoubleSide}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh>
        <circleGeometry args={[1.48, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}