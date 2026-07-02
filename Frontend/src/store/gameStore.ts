import { create } from "zustand";
import { createSession, chooseOption, resetSession, type SceneData, type PhysicsData } from "../api/client";

interface GameState {
  sessionId: string | null;
  scene: SceneData | null;
  history: number[];
  ended: boolean;
  endingId: string | null;
  physics: PhysicsData | null;
  loading: boolean;
  error: string | null;

  startGame: () => Promise<void>;
  choose: (choiceId: string, q?: number, alpha?: number) => Promise<void>;
  restart: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  sessionId: null,
  scene: null,
  history: [],
  ended: false,
  endingId: null,
  physics: null,
  loading: false,
  error: null,

  startGame: async () => {
    set({ loading: true, error: null });
    try {
      const res = await createSession();
      set({
        sessionId: res.session_id,
        scene: res.scene,
        history: [],
        ended: false,
        endingId: null,
        loading: false,
      });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to start game", loading: false });
    }
  },

  choose: async (choiceId: string, q?: number, alpha?: number) => {
    const { sessionId } = get();
    if (!sessionId) return;
    set({ loading: true, error: null });
    try {
      const res = await chooseOption(sessionId, choiceId, q, alpha);
      set({
        scene: res.scene,
        history: res.history,
        ended: res.ended,
        endingId: res.ending_id,
        physics: res.physics,
        loading: false,
      });

              if (res.ended && res.ending_id) {
          fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/leaderboard/${res.ending_id}`, {
            method: "POST",
          }).catch(() => {});
        }
        
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to advance", loading: false });
    }
  },

  restart: async () => {
    const { sessionId } = get();
    set({ loading: true, error: null });
    try {
      if (sessionId) {
        const res = await resetSession(sessionId);
        set({ scene: res.scene, history: [], ended: false, endingId: null, loading: false });
      } else {
        await get().startGame();
      }
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to restart", loading: false });
    }
  },
}));