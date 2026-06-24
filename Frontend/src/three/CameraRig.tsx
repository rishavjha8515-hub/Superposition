import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControl } from "@react-three/drei";
import * as THREE from "three";
import type { SceneVisualConfig } from "../scenes/sceneVisuals";