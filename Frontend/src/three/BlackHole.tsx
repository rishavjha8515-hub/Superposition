import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";

interface BlackHoleProps {
  visual: SceneVisualConfig;
}

export function BlackHole({ visual }: BlackHoleProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z += delta * 0.3;
  });

  return (
    <group>
      {/* Black center */}
      <mesh>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Accretion disk ring */}
      <mesh ref={meshRef}>
        <ringGeometry args={[1.5, 2.8, 64]} />
        <meshBasicMaterial
          color={visual.diskColor}
          side={THREE.DoubleSide}
          transparent
          opacity={visual.diskBrightness * 0.8}
        />
      </mesh>

      {/* Photon ring glow */}
      <mesh>
        <ringGeometry args={[2.8, 3.1, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}