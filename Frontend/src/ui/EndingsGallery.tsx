import { useState, useEffect } from "react";

const ALL_ENDINGS = [
  {
    id: "classical",
    title: "The Classical Path",
    description: "You chose certainty over coherence. The universe remembers you as a statistic.",
    hint: "Let go and become classical early in the journey.",
    color: "#9a9a9a",
  },
  {
    id: "extended_framework",
    title: "The Extended Framework",
    description: "You pushed the physics further. The Meissner Gap holds, and you hold with it.",
    hint: "Find the missing decoherence channel and integrate it.",
    color: "#ffe6a8",
  },
  {
    id: "unitarity",
    title: "Unitarity Preserved",
    description: "Information is conserved. You escaped as entropy.",
    hint: "Trust that information must escape somehow.",
    color: "#9fd8ff",
  },
  {
    id: "remnant",
    title: "The Horizon Remnant",
    description: "Extremality is eternal. The Meissner Gap protected you forever.",
    hint: "Remain at the horizon. Neither lost nor free.",
    color: "#b98bff",
  },
];

interface EndingsGalleryProps {
  currentEndingId: string | null;
  onClose: () => void;
  onRestart: () => void;
}

export function EndingsGallery({ currentEndingId, onClose, onRestart }: EndingsGalleryProps) {
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("superposition_endings") || "[]");
      const updated = currentEndingId && !stored.includes(currentEndingId)
        ? [...stored, currentEndingId]
        : stored;
      setUnlocked(updated);
      localStorage.setItem("superposition_endings", JSON.stringify(updated));
    } catch {
      if (currentEndingId) setUnlocked([currentEndingId]);
    }
  }, [currentEndingId]);

  const unlockedCount = unlocked.length;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 20,
      background: "rgba(2, 4, 10, 0.95)",
      backdropFilter: "blur(12px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "1.5rem",
      overflowY: "auto",
    }}>

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{
          fontSize: "0.65rem", letterSpacing: "0.2em",
          color: "rgba(125,211,252,0.6)", textTransform: "uppercase",
          marginBottom: "0.4rem",
        }}>
          Discoveries
        </div>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f0f4f8" }}>
          Endings Found
        </div>
        <div style={{
          marginTop: "0.3rem", fontSize: "0.8rem",
          color: "rgba(186,214,235,0.5)",
        }}>
          {unlockedCount} of {ALL_ENDINGS.length} discovered
        </div>

        <div style={{
          marginTop: "0.8rem", width: "200px",
          height: "3px", background: "rgba(255,255,255,0.08)",
          borderRadius: "2px", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: "2px",
            width: `${(unlockedCount / ALL_ENDINGS.length) * 100}%`,
            background: "linear-gradient(to right, #7dd3fc, #b98bff)",
            transition: "width 0.8s ease",
          }} />
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "0.8rem", width: "100%", maxWidth: "560px",
      }}>
        {ALL_ENDINGS.map((ending) => {
          const isUnlocked = unlocked.includes(ending.id);
          const isCurrent = ending.id === currentEndingId;

          return (
            <div key={ending.id} style={{
              padding: "1rem 1.1rem",
              background: isUnlocked
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.02)",
              border: `1px solid ${isUnlocked
                ? isCurrent ? ending.color : "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.05)"}`,
              borderRadius: "12px",
              transition: "all 0.3s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: isUnlocked ? ending.color : "rgba(255,255,255,0.15)",
                  boxShadow: isUnlocked ? `0 0 8px ${ending.color}` : "none",
                  transition: "all 0.3s ease",
                }} />
                <div style={{
                  fontSize: "0.6rem", letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isUnlocked ? "rgba(186,214,235,0.6)" : "rgba(186,214,235,0.2)",
                }}>
                  {isUnlocked ? (isCurrent ? "Just reached" : "Discovered") : "Locked"}
                </div>
              </div>

            <div style={{
                fontSize: "0.9rem", fontWeight: 600,
                color: isUnlocked ? "#f0f4f8" : "rgba(255,255,255,0.2)",
                marginBottom: "0.4rem",
            }}>
                {isUnlocked ? ending.title : "???"}
            </div>

            <div style={{
                fontSize: "0.75rem", lineHeight: 1.5,
                color: isUnlocked 
                ? "rgba(186,214,235,0.6)"
                : "rgba(186,214,235,0.2)"
            }}>
                {isUnlocked ? ending.description : `Hint: ${ending.hint}`}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={onRestart}
          style={{
            padding: "0.7rem 1.4rem",
            background: "rgba(125,211,252,0.12)",
            border: "1px solid rgba(125,211,252,0.3)",
            borderRadius: "999px", color: "#7dd3fc",
            fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
          }}
        >
          Play Again
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "0.7rem 1.4rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "999px", color: "rgba(186,214,235,0.6)",
            fontSize: "0.82rem", cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>

      {unlockedCount === ALL_ENDINGS.length && (
        <div style={{
          marginTop: "1rem", fontSize: "0.75rem",
          color: "#ffe6a8", textAlign: "center",
          letterSpacing: "0.05em",
        }}>
          ✦ All endings discovered. The quantum particle arc is complete. ✦
        </div>
      )}
    </div>
  );
}