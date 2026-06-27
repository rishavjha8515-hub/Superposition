import { useState, useEffect } from "react";

function SurfaceCodePuzzle({ onSolve, onFail }: { onSolve: () => void; onFail: () => void }) {
  const SIZE = 4;
  const [grid, setGrid] = useState<boolean[][]>(() =>
    Array.from({ length: SIZE }, () =>
      Array.from({ length: SIZE }, () => Math.random() < 0.25)
    )
  );
  const [timeLeft, setTimeLeft] = useState(20);

  const totalErrors = grid.flat().filter(Boolean).length;

  useEffect(() => {
    if (timeLeft <= 0) { onFail(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  useEffect(() => {
    if (totalErrors === 0) onSolve();
  }, [totalErrors]);

  function toggleCell(r: number, c: number) {
    setGrid(prev => prev.map((row, ri) =>
      row.map((cell, ci) => ri === r && ci === c ? !cell : cell)
    ));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
      <div style={{ fontSize: "0.7rem", color: "rgba(186,214,235,0.6)", textAlign: "center", maxWidth: "280px", lineHeight: 1.5 }}>
        Your quantum state is encoded across a 4×4 surface code.
        Red cells are error qubits — tap to correct them before decoherence wins.
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "220px" }}>
        <div style={{ fontSize: "0.65rem", color: "rgba(186,214,235,0.5)" }}>Errors: {totalErrors}</div>
        <div style={{ fontSize: "0.65rem", color: timeLeft <= 5 ? "#f87171" : "rgba(186,214,235,0.5)" }}>{timeLeft}s</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "6px" }}>
        {grid.map((row, r) =>
          row.map((isError, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => toggleCell(r, c)}
              style={{
                width: "48px", height: "48px",
                borderRadius: "8px",
                background: isError ? "rgba(248,113,113,0.3)" : "rgba(134,239,172,0.15)",
                border: `1px solid ${isError ? "rgba(248,113,113,0.6)" : "rgba(134,239,172,0.3)"}`,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
                transition: "all 0.15s ease",
              }}
            >
              {isError ? "✕" : "·"}
            </div>
          ))
        )}
      </div>

      <div style={{ width: "220px", height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
        <div style={{
          height: "100%", borderRadius: "2px",
          width: `${(timeLeft / 20) * 100}%`,
          background: timeLeft <= 5 ? "#f87171" : "#7dd3fc",
          transition: "width 1s linear, background 0.3s ease",
        }} />
      </div>
    </div>
  );
}

type PuzzleType = "surface_code";

interface MiniPuzzleProps {
  type: PuzzleType;
  onSolve: () => void;
  onFail: () => void;
  onSkip: () => void;
}

export function MiniPuzzle({ type, onSolve, onFail, onSkip }: MiniPuzzleProps) {
  return (
    <div style={{
      margin: "1rem 0",
      padding: "1rem",
      background: "rgba(8,12,24,0.8)",
      border: "1px solid rgba(125,211,252,0.15)",
      borderRadius: "12px",
      backdropFilter: "blur(6px)",
    }}>
      <div style={{
        fontSize: "0.6rem", letterSpacing: "0.12em",
        textTransform: "uppercase", color: "#7dd3fc",
        marginBottom: "0.8rem",
      }}>
        Puzzle — Surface Code
      </div>

      <SurfaceCodePuzzle onSolve={onSolve} onFail={onFail} />

      <button onClick={onSkip} style={{
        marginTop: "0.8rem", width: "100%",
        padding: "0.4rem", background: "transparent",
        border: "none", color: "rgba(186,214,235,0.3)",
        fontSize: "0.65rem", cursor: "pointer",
      }}>
        Skip puzzle
      </button>
    </div>
  );
}