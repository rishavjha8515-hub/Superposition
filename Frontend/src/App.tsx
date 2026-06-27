import { useEffect, useState } from "react";
import { Scene3D } from "./three/Scene3D";
import { SceneText } from "./ui/SceneText";
import { ChoiceList } from "./ui/ChoiceList";
import { PhysicsHUD } from "./ui/PhysicsHUD";
import { EndingScreen } from "./ui/EndingScreen";
import { TitleCard } from "./ui/TitleCard";
import { useGameStore } from "./store/gameStore";
import { LandingPage } from "./ui/LandingPage";
import { EndingsGallery } from "./ui/EndingsGallery";

function PhysicsSliderInline() {
  const { scene, physics } = useGameStore();
  const [q, setQ] = useState(0.99);

  if (!scene || ![2, 3, 8, 9, 11].includes(scene.id)) return null;

  const extremality = q >= 0.99 ? "Extremal" : q >= 0.9 ? "Near-extremal" : q >= 0.7 ? "Sub-extremal" : "Far from extremal";
  const extremalityColor = q >= 0.99 ? "#7dd3fc" : q >= 0.9 ? "#86efac" : q >= 0.7 ? "#fbbf24" : "#f87171";

  return (
    <div style={{
      position: "fixed", top: "max(env(safe-area-inset-top), 75px)",
      left: "50%", transform: "translateX(-50%)", zIndex: 6,
      width: "min(340px, 90vw)", padding: "0.7rem 1rem",
      background: "rgba(8,12,20,0.75)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px", backdropFilter: "blur(8px)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "rgba(186,214,235,0.6)" }}>CHARGE RATIO q</div>
        <div style={{ fontSize: "0.65rem", color: extremalityColor, fontWeight: 600 }}>{extremality} · q = {q.toFixed(3)}</div>
      </div>
      <input type="range" min="0.1" max="0.999" step="0.001" value={q}
        onChange={(e) => setQ(parseFloat(e.target.value))}
        style={{
          width: "100%", height: "4px", appearance: "none" as const,
          background: `linear-gradient(to right, #f87171 0%, #fbbf24 40%, #86efac 70%, #7dd3fc ${q * 100}%, rgba(255,255,255,0.1) ${q * 100}%)`,
          borderRadius: "2px", outline: "none", cursor: "pointer",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
        <div style={{ fontSize: "0.6rem", color: "rgba(186,214,235,0.5)", fontFamily: "monospace" }}>
          κ = {(2 * Math.sqrt(Math.max(0, 1 - q * q))).toFixed(4)}
        </div>
        <div style={{ fontSize: "0.6rem", color: "rgba(186,214,235,0.5)", fontFamily: "monospace" }}>
          T_H = {(2 * Math.sqrt(Math.max(0, 1 - q * q)) / (2 * Math.PI)).toFixed(4)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [launched, setLaunched] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const { sessionId, scene, ended, endingId, physics, loading, error, startGame, choose, restart } =
    useGameStore();

  useEffect(() => {
    if (launched && !sessionId) startGame();
  }, [launched, sessionId, startGame]);

  if (!launched) {
    return <LandingPage onEnter={() => setLaunched(true)} />;
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>

      <Scene3D sceneId={scene?.id ?? 1} />

      <PhysicsHUD physics={physics} />

      <TitleCard show={(scene?.id ?? 0) === 1} />

      <PhysicsSliderInline />

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 5,
          padding: "1.1rem 1.1rem max(env(safe-area-inset-bottom), 1.1rem)",
          background: "linear-gradient(to top, rgba(4,6,10,0.92) 40%, rgba(4,6,10,0.55) 75%, transparent)",
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto", maxWidth: "560px", margin: "0 auto" }}>

          {scene?.label && (
            <div
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(186, 214, 235, 0.6)",
                marginBottom: "0.5rem",
              }}
            >
              {scene.label}
            </div>
          )}

          {scene && (
            <SceneText
              text={scene.text}
              callouts={scene.physics_callouts ?? {}}
            />
          )}

          {error && (
            <div style={{ color: "#ff8a8a", fontSize: "0.8rem", marginTop: "0.6rem" }}>
              {error}
            </div>
          )}

          {ended ? (
            <>
              <EndingScreen endingId={endingId} onRestart={restart} />
              <button
                onClick={() => setShowGallery(true)}
                style={{
                  marginTop: "0.6rem", width: "100%",
                  padding: "0.6rem",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", color: "rgba(186,214,235,0.5)",
                  fontSize: "0.75rem", cursor: "pointer",
                }}
              >
                View all endings →
              </button>
            </>
          ) : (
            scene && (
              <ChoiceList
                choices={scene.choices}
                disabled={loading}
                onChoose={choose}
              />
            )
          )}

        </div>
      </div>

      {showGallery && (
        <EndingsGallery
          currentEndingId={endingId}
          onClose={() => setShowGallery(false)}
          onRestart={() => { setShowGallery(false); restart(); }}
        />
      )}

      {loading && !scene && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7dd3fc",
            fontSize: "0.85rem",
            letterSpacing: "0.08em",
            zIndex: 10,
          }}
        >
          ENTERING THE FIELD…
        </div>
      )}

    </div>
  );
}