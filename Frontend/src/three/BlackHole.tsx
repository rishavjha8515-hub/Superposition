import { useRef,useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";

interface BlackHoleProps {
  visual: SceneVisualConfig;
}

export function BlackHole({ visual }: BlackHoleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const diskRef = useRef<THREE.MeshBasicMaterial>(null);
  const midRef = useRef<THREE.MeshBasicMaterial>(null);
  const outerRef = useRef<THREE.MeshBasicMaterial>(null);

  const targetColor = useRef(new THREE.Color(visual.diskColor));

  useEffect(() => {
    targetColor.current = new THREE.Color(visual.diskColor);
  }, [visual.diskColor]);

  useFrame((state,delta ) => {
    if (groupRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 0.6) * 0.015 * visual.ambientPulse;
      groupRef.current.scale.setScalar(pulse);
    }
    const lerpSpeed = Math.min(1, delta * 1.5);
    if (diskRef.current) diskRef.current.color.lerp(targetColor.current, lerpSpeed);
    if (midRef.current) midRef.current.color.lerp(targetColor.current, lerpSpeed);
    if (outerRef.current) outerRef.current.color.lerp(targetColor.current, lerpSpeed);
  });

  return (
    <group ref={groupRef}>
      <group rotation={[1.3, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.5, 4.5, 128]} />
          <meshBasicMaterial ref={outerRef} color={visual.diskColor} side={THREE.DoubleSide} transparent opacity={0.05} />
        </mesh>
        <mesh>
          <ringGeometry args={[2.0, 3.2, 128]} />
          <meshBasicMaterial ref={midRef} color={visual.diskColor} side={THREE.DoubleSide} transparent opacity={0.18 * visual.diskBrightness} />
        </mesh>
        <mesh>
          <ringGeometry args={[1.7, 2.2, 128]} />
          <meshBasicMaterial color={visual.diskColor} side={THREE.DoubleSide} transparent opacity={0.55 * visual.diskBrightness} />
        </mesh>
        <mesh>
          <ringGeometry args={[1.54, 1.72, 128]} />
          <meshBasicMaterial ref={diskRef} color="#ffe566" side={THREE.DoubleSide} transparent opacity={0.95 * visual.diskBrightness} />
        </mesh>
        <mesh>
          <ringGeometry args={[1.50, 1.56, 128]} />
          <meshBasicMaterial color="#fff8e0" side={THREE.DoubleSide} transparent opacity={1.0} />
        </mesh>
      </group>

      <mesh>
        <ringGeometry args={[1.44, 1.62, 128]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.15} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.40, 1.48, 128]} />
        <meshBasicMaterial color="#e8f0ff" side={THREE.DoubleSide} transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI]}>
        <ringGeometry args={[1.35, 1.45, 128]} />
        <meshBasicMaterial color="#fff5e0" side={THREE.DoubleSide} transparent opacity={0.25} />
      </mesh>

      <mesh>
        <circleGeometry args={[1.35, 128]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}