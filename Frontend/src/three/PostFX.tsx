import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { useRef, useEffect } from "react";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";

interface PostFXProps {
    visual: SceneVisualConfig;
}

export function PostFX({ visual }: PostFXProps) {
    const chroma0ffset = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        const amt = visual.chromaticAberation * 0.003;
        chroma0ffset.current.set(amt, amt);
    }, [visual.chromaticAberation]);

    return (
        <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom 
            intensity={0.4}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.4}
            mipmapBlur
            />
            <ChromaticAberration
            offset={chroma0ffset.current}
            blendFunction={BlendFunction.NORMAL}
            radialModulation={false}
            modulationOffset={0}
            />
            <Vignette
            eskil={false}
            offset={0.25}
            darkness={0.9}
            blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    );
}