import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { BlackHole } from "./Blackhole";
import { ParticleField } from "./ParticleField";
import { CameraRig } from "./CameraRig";
import { PostFX } from "./PostFX";
import { getSceneVisual } from "../scenes/sceneVisuals";

interface Scene3DProps {
    sceneId: number;
}

export function Scene3D({ sceneId}: Scene3DProps) {
    const visual = getSceneVisual(sceneId);

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 0}}>
            <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "high-performance"}}
            camera={{
                position: [0, visual.cameraHeight, visual.cameraDistance],
                fov: visual.fov,
                near: 0.1,
                far: 200
            }}
            >
                <Suspense fallback={null}>
                    <BlackHole visual={visual} />
                    <ParticleField visual={visual} />
                    <CameraRig visual={visual} />
                    <PostFX visual={visual} />
                </Suspense>
            </Canvas>
        </div>
    )
}