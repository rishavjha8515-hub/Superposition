import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";

interface BlackHoleProps {
  visual: SceneVisualConfig;
}

export function BlackHole({ visual }: BlackHoleProps) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03 * visual.ambientPulse;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh>
        <ringGeometry args={[2.5, 3.8, 128]} />
        <meshBasicMaterial color="#ff4400" side={THREE.DoubleSide} transparent opacity={0.04} />
      </mesh>

      <mesh ref={glowRef}>
        <ringGeometry args={[1.9, 2.8, 128]} />
        <meshBasicMaterial color="#ff6600" side={THREE.DoubleSide} transparent opacity={0.15 * visual.diskBrightness} />
      </mesh>

      <mesh>
        <ringGeometry args={[1.65, 2.0, 128]} />
        <meshBasicMaterial color="#ff8800" side={THREE.DoubleSide} transparent opacity={0.5 * visual.diskBrightness} />
      </mesh>

      <mesh>
        <ringGeometry args={[1.52, 1.68, 128]} />
        <meshBasicMaterial color="#ffe566" side={THREE.DoubleSide} transparent opacity={0.95 * visual.diskBrightness} />
      </mesh>

      <mesh>
        <ringGeometry args={[1.49, 1.54, 128]} />
        <meshBasicMaterial color="#fff8e0" side={THREE.DoubleSide} transparent opacity={1.0} />
      </mesh>

      <mesh>
        <ringGeometry args={[1.46, 1.50, 128]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>

      <mesh>
        <circleGeometry args={[1.46, 128]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}