import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";

interface CameraRigProps {
  visual: SceneVisualConfig;
}

export function CameraRig({ visual }: CameraRigProps) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const targetDistance = useRef(visual.cameraDistance);
  const targetHeight = useRef(visual.cameraHeight);
  const targetFov = useRef(visual.fov);

  useEffect(() => {
    targetDistance.current = visual.cameraDistance;
    targetHeight.current = visual.cameraHeight;
    targetFov.current = visual.fov;
  }, [visual]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const lerp = Math.min(1, delta * 0.8);

    const dir = new THREE.Vector3()
      .subVectors(camera.position, controls.target)
      .normalize();
    const currentDist = camera.position.distanceTo(controls.target);
    const newDist = THREE.MathUtils.lerp(currentDist, targetDistance.current, lerp);
    camera.position.copy(controls.target).addScaledVector(dir, newDist);

    if (visual.cameraDrift > 0.001) {
      controls.target.y = THREE.MathUtils.lerp(
        controls.target.y,
        targetHeight.current * 0.2,
        lerp
      );
    }

    const persCam = camera as THREE.PerspectiveCamera;
    if (persCam.fov !== undefined) {
      persCam.fov = THREE.MathUtils.lerp(persCam.fov, targetFov.current, lerp);
      persCam.updateProjectionMatrix();
    }

    controls.update();
});

return (
    <OrbitControls
    ref={controlsRef}
    enablePan={false}
    enableZoom={true}
    minDistance={2}
    maxDistance={30}
    autoRotate={visual.cameraDrift > 0.001}
    autoRotateSpeed={visual.cameraDrift * 0.6}
    enableDamping
    dampingFactor={0.08}
    rotateSpeed={0.5}
    />
  );
}