import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ENDING_META: Record<string, {title: string; color: string} > ={
     classical:{ title: "The Classical Path",      color: "#9a9a9a" },
  extended_framework: { title: "The Extended Framework",  color: "#ffe6a8" },
  unitarity: { title: "Unitarity Preserved",     color: "#9fd8ff" },
  remnant:{ title: "The Horizon Remnant",     color: "#b98bff" },
  boundary:{ title: "The Boundary State",      color: "#6f6bff" },
  new_universe:{ title: "The New Universe",        color: "#7affe0" },
};

interface LeaderboardProps {
    onClose: () => void;
}

export function Leaderboard({ onClose }: LeaderboardProps) {
    const [data, setData] = useState<Record<string, number> | null>(null);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
     fetch(`${API_BASE}/api/leaderboard`)
     .then(r => r.json())
     .then(d => { setData(d); setLoading(false); })
     .catch(() => setLoading(false));
   }, []);

   const total = data ? Object.values(data).reduce((a, b) => a + b, 0) : 0; 

   const sorted = data
   ? Object.entries(data).sort((a, b) => b[1] - a[1])
   : [];

   return (
      <div style={{
        position: "fixed",inset: 0, zIndex: 20,
      background: "rgba(2,4,10,0.96)",
      backdropFilter: "blur(12px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", padding: "1.5rem",
      overflowY: "auto",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(125,211,252,0.6)", textTransform: "uppercase" }}>
              Global
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f0f4f8" }}>
              Leaderboard
            </div>
            {!loading && (
              <div style={{ fontSize: "0.75rem", color: "rgba(186,214,235,0.4)", marginTop: "0.2rem" }}>
                {total} total runs
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "999px", color: "rgba(186,214,235,0.5)",
            padding: "0.4rem 0.9rem", fontSize: "0.75rem", cursor: "pointer",
          }}>
            Close
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", color: "rgba(186,214,235,0.4)", fontSize: "0.85rem" }}>
            Loading...
          </div>
        )}


        {!loading && sorted.map(([id, count], index) => {
          const meta = ENDING_META[id];
          if (!meta) return null;
          const pct = total > 0 ? (count / total) * 100 : 0;
         
          return (
            <div key={id} style={{
              marginBottom: "0.8rem",
              padding: "0.9rem 1rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "0.5rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{
                    fontSize: "0.7rem", fontWeight: 700,
                    color: index === 0 ? "#ffe6a8" : "rgba(186,214,235,0.3)",
                    width: "16px",
                  }}>
                    #{index + 1}
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: meta.color}}>
                    {meta.title}
                  </div>
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(186,214,235,0.6)", fontFamily: "monospace" }}>
              {count} {count === 1 ? "run" : "runs"}
            </div>
            </div>

            <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "2px",
                width: `${pct}%`, background: meta.color,
                transition: "width 0.3s ease",
                boxShadow: `0 0 6px ${meta.color}`,
              }} />
            </div>

          <div style={{ fontSize: "0.6rem", color: "rgba(186,214,235,0.3)", marginTop: "0.3rem" }}>
                {pct.toFixed(1)}% of all runs
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}