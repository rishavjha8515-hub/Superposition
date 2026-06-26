import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";

interface BlackHoleProps {
  visual: SceneVisualConfig;
}

export function BlackHole({ visual }: BlackHoleProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 0.6) * 0.015;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[1.3, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.5, 4.5, 128]} />
          <meshBasicMaterial color="#ff4400" side={THREE.DoubleSide} transparent opacity={0.05} />
        </mesh>

        <mesh>
          <ringGeometry args={[2.0, 3.2, 128]} />
          <meshBasicMaterial color="#ff6600" side={THREE.DoubleSide} transparent opacity={0.18 * visual.diskBrightness} />
        </mesh>

        <mesh>
          <ringGeometry args={[1.7, 2.2, 128]} />
          <meshBasicMaterial color="#ff8800" side={THREE.DoubleSide} transparent opacity={0.55 * visual.diskBrightness} />
        </mesh>

        <mesh>
          <ringGeometry args={[1.54, 1.72, 128]} />
          <meshBasicMaterial color="#ffe566" side={THREE.DoubleSide} transparent opacity={0.95 * visual.diskBrightness} />
        </mesh>

        <mesh>
          <ringGeometry args={[1.50, 1.56, 128]} />
          <meshBasicMaterial color="#fff8e0" side={THREE.DoubleSide} transparent opacity={1.0} />
        </mesh>
      </group>

      <mesh>
        <ringGeometry args={[1.46, 1.56, 128]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>

      <mesh>
        <ringGeometry args={[1.56, 1.72, 128]} />
        <meshBasicMaterial color="#ffe8b0" side={THREE.DoubleSide} transparent opacity={0.25} />
      </mesh>

      <mesh>
        <ringGeometry args={[1.72, 2.1, 128]} />
        <meshBasicMaterial color="#ffcc88" side={THREE.DoubleSide} transparent opacity={0.1} />
      </mesh>

      <mesh>
        <circleGeometry args={[1.46, 128]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}