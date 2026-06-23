export interface SceneVisualConfig {
    cameraDistance: number;
    cameraHeight: number;
    lensStrength: number;
    diskColor: string;
    particleDensity: number;
    particleColor: string;
    vignetteColor: string;
    diskBrightness: number;
    bloomStrength: number;
    chromaticAberation: number;
    fov: number;
    ambientPulse: number;
    cameraDrift: number;
}

const base: SceneVisualConfig = {
    cameraDistance: 14,
    cameraHeight: 0.6,
    diskColor: "#ff8a3d",
    diskBrightness: 1.0,
    particleDensity: 0.4,
    particleColor: "#9fd8ff",
    vignetteColor: "#000000",
    bloomStrength: 1.2,
    chromaticAberation: 0.0,
    fov: 55,
    ambientPulse: 0.3,
    cameraDrift: 0.3,
};

export const SCENE_VISUALS: Record<number, SceneVisualConfig> = {
  // ACT I — THE APPROACH
  1: { ...base, cameraDistance: 18, lensStrength: 0.5, diskBrightness: 0.8, particleDensity: 0.3, vignetteColor: "#04060c", cameraDrift: 0.4 },
  2: { ...base, cameraDistance: 11, lensStrength: 0.75, diskBrightness: 0.5, particleDensity: 0.55, diskColor: "#5ec8ff", particleColor: "#bfe9ff", ambientPulse: 0.6, cameraDrift: 0.15, vignetteColor: "#020812" },
  3: { ...base, cameraDistance: 7, lensStrength: 0.9, diskBrightness: 1.4, particleDensity: 0.7, chromaticAberration: 0.25, bloomStrength: 1.6, cameraDrift: 0.6, vignetteColor: "#0a0202" },

  // ACT II
  4: { ...base, cameraDistance: 9, lensStrength: 0.8, diskColor: "#ffd27a", diskBrightness: 1.1, particleDensity: 0.6, particleColor: "#ffe9b0", ambientPulse: 0.4 },
  5: { ...base, cameraDistance: 6, lensStrength: 0.95, diskBrightness: 0.7, particleDensity: 0.3, diskColor: "#b98bff", particleColor: "#d9c2ff", fov: 65, ambientPulse: 0.5, cameraDrift: 0.1 },
  6: { ...base, cameraDistance: 8.5, lensStrength: 0.7, diskColor: "#7affc7", diskBrightness: 0.9, particleDensity: 0.85, particleColor: "#bdffe0", ambientPulse: 0.2, cameraDrift: 0.25 },
  7: { ...base, cameraDistance: 5.5, lensStrength: 0.85, diskBrightness: 0.4, particleDensity: 0.15, diskColor: "#777777", particleColor: "#9a9a9a", chromaticAberration: 0.4, bloomStrength: 0.6, cameraDrift: 0.05, vignetteColor: "#000000" },

  // ACT III
  8: { ...base, cameraDistance: 7.5, lensStrength: 0.9, diskColor: "#ff7a5c", diskBrightness: 1.3, particleDensity: 0.65, particleColor: "#ffb89e", chromaticAberration: 0.15, bloomStrength: 1.5 },
  9: { ...base, cameraDistance: 6, lensStrength: 1.0, diskColor: "#ffffff", diskBrightness: 1.6, particleDensity: 0.5, particleColor: "#ffffff", bloomStrength: 2.0, ambientPulse: 0.7, cameraDrift: 0.1 },
  10: { ...base, cameraDistance: 3.5, lensStrength: 1.0, diskBrightness: 0.5, particleDensity: 0.2, diskColor: "#6f6bff", particleColor: "#cfcaff", fov: 75, ambientPulse: 0.6, cameraDrift: 0.05, vignetteColor: "#05030f" },
  11: { ...base, cameraDistance: 10, lensStrength: 0.85, diskColor: "#7affe0", diskBrightness: 1.2, particleDensity: 0.75, particleColor: "#aaffe8", bloomStrength: 1.7, cameraDrift: 0.5 },

  // ACT IV — ENDINGS
  12: { ...base, cameraDistance: 2.5, lensStrength: 1.0, diskBrightness: 0.2, particleDensity: 0.05, diskColor: "#444444", particleColor: "#555555", bloomStrength: 0.4, ambientPulse: 0.0, cameraDrift: 0.02, vignetteColor: "#000000", fov: 60 },
  13: { ...base, cameraDistance: 12, lensStrength: 0.7, diskColor: "#ffe6a8", diskBrightness: 1.3, particleDensity: 0.6, particleColor: "#fff3d6", bloomStrength: 1.8, ambientPulse: 0.5, cameraDrift: 0.3 },
  14: { ...base, cameraDistance: 22, lensStrength: 0.4, diskBrightness: 0.6, particleDensity: 0.9, diskColor: "#9fd8ff", particleColor: "#e6f6ff", bloomStrength: 1.4, ambientPulse: 0.4, cameraDrift: 0.6, fov: 50 },
  15: { ...base, cameraDistance: 8, lensStrength: 0.9, diskBrightness: 0.85, particleDensity: 0.1, diskColor: "#b98bff", particleColor: "#d9c2ff", bloomStrength: 1.0, ambientPulse: 0.15, cameraDrift: 0.0 },
};

export function getSceneVisual(sceneId: number): SceneVisualConfig {
  return SCENE_VISUALS[sceneId] ?? base;
}