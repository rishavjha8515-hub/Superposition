import { useEffect,useState } from "react";
import { Scene3D } from "./three/Scene3D";
import { SceneText } from "./ui/SceneText";
import { ChoiceList } from "./ui/ChoiceList";
import { PhysicsHUD } from "./ui/PhysicsHUD";
import { EndingScreen } from "./ui/EndingScreen";
import { TitleCard } from "./ui/TitleCard";
import { useGameStore } from "./store/gameStore";
import { LandingPage } from "./ui/LandingPage";
import { PhysicsSlider } from "./ui/PhysicsSlider"

export default function App() {
const [launched, setLaunched] = useState(false);
  const { sessionId, scene, ended, endingId, physics, loading, error, startGame, choose, restart } =
    useGameStore();

  useEffect(() => {
    if (launched && !sessionId) startGame();
  }, [launched, sessionId, startGame]);


    if (!launched) {
      return <LandingPage onEnter={() => 
        setLaunched(true)
      } />;
    }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>

      <Scene3D sceneId={scene?.id ?? 1} />

      <PhysicsHUD physics={physics} />

      <TitleCard show={(scene?.id ?? 0) === 1} />

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
            <EndingScreen endingId={endingId} onRestart={restart} />
          ) : (
            scene && (
              <ChoiceList
                choices={scene.choices}
                disabled={loading}
                onChoose={choose}
              />
            )
          )}

          <PhysicsSlider />

        </div>
      </div>

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