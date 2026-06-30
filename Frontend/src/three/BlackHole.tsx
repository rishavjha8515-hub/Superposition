import { useRef, useEffect } from "react";
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
  const innerRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);

  // Base warm palette each ring lerps toward — tinted by visual.diskColor
  const baseOuter = useRef(new THREE.Color("#ff4400"));
  const baseMid = useRef(new THREE.Color("#ff6600"));
  const baseInner = useRef(new THREE.Color("#ff8800"));
  const baseDisk = useRef(new THREE.Color("#ffe566"));
  const baseGlow = useRef(new THREE.Color("#ffffff"));

  const targetColor = useRef(new THREE.Color(visual.diskColor));

  useEffect(() => {
    targetColor.current = new THREE.Color(visual.diskColor);
  }, [visual.diskColor]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 0.6) * 0.015 * visual.ambientPulse;
      groupRef.current.scale.setScalar(pulse);
    }

    const lerpSpeed = Math.min(1, delta * 1.5);
    // Blend each ring's warm base color toward the scene's dynamic diskColor,
    // so palette shifts between scenes without losing the warm gradient look.
    const tint = (base: THREE.Color, weight: number) =>
      base.clone().lerp(targetColor.current, weight);

    if (outerRef.current) outerRef.current.color.lerp(tint(baseOuter.current, 0.4), lerpSpeed);
    if (midRef.current) midRef.current.color.lerp(tint(baseMid.current, 0.4), lerpSpeed);
    if (innerRef.current) innerRef.current.color.lerp(tint(baseInner.current, 0.4), lerpSpeed);
    if (diskRef.current) diskRef.current.color.lerp(tint(baseDisk.current, 0.3), lerpSpeed);

    // Glow pulses brightness independently of color shift
    if (glowRef.current) {
      const glowPulse = 0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.15 * visual.ambientPulse;
      glowRef.current.opacity = glowPulse * visual.diskBrightness;
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[1.3, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.5, 4.5, 128]} />
          <meshBasicMaterial ref={outerRef} color="#ff4400" side={THREE.DoubleSide} transparent opacity={0.05} />
        </mesh>
        <mesh>
          <ringGeometry args={[2.0, 3.2, 128]} />
          <meshBasicMaterial ref={midRef} color="#ff6600" side={THREE.DoubleSide} transparent opacity={0.18 * visual.diskBrightness} />
        </mesh>
        <mesh>
          <ringGeometry args={[1.7, 2.2, 128]} />
          <meshBasicMaterial ref={innerRef} color="#ff8800" side={THREE.DoubleSide} transparent opacity={0.55 * visual.diskBrightness} />
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

      {/* Glow halo around the photon ring */}
      <mesh>
        <ringGeometry args={[1.46, 1.56, 128]} />
        <meshBasicMaterial ref={glowRef} color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.56, 1.72, 128]} />
        <meshBasicMaterial color="#ffe8b0" side={THREE.DoubleSide} transparent opacity={0.25 * visual.diskBrightness} />
      </mesh>
      <mesh>
        <ringGeometry args={[1.72, 2.1, 128]} />
        <meshBasicMaterial color="#ffcc88" side={THREE.DoubleSide} transparent opacity={0.1 * visual.diskBrightness} />
      </mesh>

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