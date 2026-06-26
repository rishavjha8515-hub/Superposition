import { useState, useCallback } from "react";
import { useGameStore } from "../store/gameStore";

export function PhysicsSlider() {
  const { scene, choose, physics } = useGameStore();
  const [q, setQ] = useState(0.99);
  const [isDragging, setIsDragging] = useState(false);

  const physicsScenes = [1, 2, 3, 8, 9, 11];
  if (!scene || !physicsScenes.includes(scene.id)) return null;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQ = parseFloat(e.target.value);
    setQ(newQ);
  }, []);

  const extremality = q >= 0.99 ? "Extremal" : q >= 0.9 ? "Near-extremal" : q >= 0.7 ? "Sub-extremal" : "Far from extremal";
  const extremalityColor = q >= 0.99 ? "#7dd3fc" : q >= 0.9 ? "#86efac" : q >= 0.7 ? "#fbbf24" : "#f87171";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "max(env(safe-area-inset-bottom), 12px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 6,
        width: "min(340px, 90vw)",
        padding: "0.7rem 1rem",
        background: "rgba(8, 12, 20, 0.75)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(186,214,235,0.6)" }}>
          CHARGE RATIO q
        </div>
        <div style={{ fontSize: "0.65rem", color: extremalityColor, fontWeight: 600 }}>
          {extremality} · q = {q.toFixed(3)}
        </div>
      </div>

      <input
        type="range"
        min="0.1"
        max="0.999"
        step="0.001"
        value={q}
        onChange={handleChange}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        style={{
          width: "100%",
          height: "4px",
          appearance: "none",
          background: `linear-gradient(to right, #f87171 0%, #fbbf24 40%, #86efac 70%, #7dd3fc ${q * 100}%, rgba(255,255,255,0.1) ${q * 100}%)`,
          borderRadius: "2px",
          outline: "none",
          cursor: "pointer",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
        {physics && (
          <>
            <div style={{ fontSize: "0.6rem", color: "rgba(186,214,235,0.5)", fontFamily: "monospace" }}>
              κ = {(2 * Math.sqrt(Math.max(0, 1 - q * q))).toFixed(4)}
            </div>
            <div style={{ fontSize: "0.6rem", color: "rgba(186,214,235,0.5)", fontFamily: "monospace" }}>
              T_H = {(2 * Math.sqrt(Math.max(0, 1 - q * q)) / (2 * Math.PI)).toFixed(4)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}