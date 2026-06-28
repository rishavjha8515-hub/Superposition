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

function PageCurvePuzzle({ onSolve, onFail }: { onSolve: () => void; onFail: () => void }) {
  const [markerPos, setMarkerPos] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const correctRange = [42, 58];

  function handleSubmit() {
    setSubmitted(true);
    if (markerPos >= correctRange[0] && markerPos <= correctRange[1]) {
      setResult("correct");
      setTimeout(onSolve, 1200);
    } else {
      setResult("wrong");
      setTimeout(onFail, 1200);
    }
  }

  const width = 260;
  const height = 100;
  const points = Array.from({ length: 101}, (_, i) => {
    const t = i / 100;
    const s = t < 0.5 ? t * 2 * height * 0.8 : (1 - t) * 2 * height * 0.8;
    return `${i * (width / 100)}, ${height - s}`;
  }).join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
         <div style={{ fontSize: "0.7rem", color: "rgba(186,214,235,0.6)", textAlign: "center", maxWidth: "280px", lineHeight: 1.5 }}>
          This is the Page curve - entanglement entropy of Hawking radiation over time.
          Drag the marker to identify the Page time, where unitarity is restored.
         </div>

         <div style={{ position: "relative", width: `${width}px` }}>
          <svg width={width} height={height + 20} style={{ overflow: "visible"}}>
            <text x="0" y={height + 16} fontSize="9" fill="rgba(186,214,235,0.4)">0</text>
          <text x={width - 8} y={height + 16} fontSize="9" fill="rgba(186,214,235,0.4)">t</text>
          <text x="0" y="8" fontSize="9" fill="rgba(186,214,235,0.4)">S</text>
          <polyline points={points} fill="none" stroke="#7dd3fc" strokeWidth="2" />
          <line
            x1={markerPos * (width / 100)} y1="0"
            x2={markerPos * (width / 100)} y2={height}
            stroke={result === "correct" ? "#86efac" : result === "wrong" ? "#f87171" : "#ffe566"}
            strokeWidth="2" strokeDasharray="4,2"
          />
          </svg>
          <input type="range" min="0" max="100" value={markerPos}
          onChange={(e) => !submitted && setMarkerPos(parseInt(e.target.value, 10))}
          style={{
            width: "100%", marginTop: "0.3rem",
            appearance: "none" as const, height: "2px",
            background: "rgba(255,255,255,0.1)", borderRadius: "2px",
            outline: "none", cursor: submitted ? "default" : "pointer",
          }}
          />
         </div>

         {result && (
          <div style={{ fontSize: "0.75rem", color: result === "correct" ? "#86efac" : "#f87171", fontWeight: 600 }}>
                      {result === "correct" ? "✓ Correct — Page time identified. Unitarity holds." : "✗ Not quite. The Page time is near the midpoint."}
                      </div>
         )}

         {!submitted && (
          <button onClick={handleSubmit} style={{
            padding: "0.5rem 1.2rem",
            background: "rgba(125,211,252,0.12)",
            border: "1px solid rgba(125,211,252,0.3)",
            borderRadius: "999px", color: "#7dd3fc",
            fontSize: "0.78rem", cursor: "pointer",
          }}>
            Mark Page Time
          </button>
         )}
    </div>
  );
}

function SpinTunerPuzzle({ onSolve, onFail }: { onSolve: () => void; onFail: () => void}) {
 const [alpha, setAlpha] = useState(0.5);
 const [submitted, setSubmitted] = useState(false);
 const [result, setResult] = useState<"correct" | "wrong" | null>(null);
 const targetRange = [0.28, 0.42];

const stability = Math.max(0, 1 - Math.abs(alpha - 0.35) * 4);
const stabilityColor = stability > 0.7 ? "#86efac" : stability > 0.3 ? "#fbbf24" : "#f87171";
const LKN = (9.211e-5 * (1 - alpha * alpha * 0.5)).toFixed(7);

function handleSubmit() {
  setSubmitted(true);
  if (alpha >= targetRange[0] && alpha <= targetRange[1]) {
    setResult("correct");
    setTimeout(onSolve, 1200);
  } else {
    setResult("wrong");
    setTimeout(onFail, 1200);
  }
}

return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem" }}>
      <div style={{ fontSize: "0.7rem", color: "rgba(186,214,235,0.6)", textAlign: "center", maxWidth: "280px", lineHeight: 1.5 }}>
        The black hole is spinning. Tune the spin parameter α to stabilize
        your surface code. Too much spin destabilizes the code. Too little wastes protection.
      </div>

      <div style={{ width: "260px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <div style={{ fontSize: "0.65rem", color: "rgba(186,214,235,0.5)" }}>α = {alpha.toFixed(3)}</div>
          <div style={{ fontSize: "0.65rem", color: "rgba(186,214,235,0.5)" }}>ℒ_KN = {LKN}</div>
        </div>
        <input type="range" min="0" max="1" step="0.001" value={alpha}
          onChange={(e) => !submitted && setAlpha(parseFloat(e.target.value))}
          style={{
            width: "100%", height: "4px", appearance: "none" as const,
            background: `linear-gradient(to right, #f87171, #fbbf24, #86efac, #fbbf24, #f87171)`,
            borderRadius: "2px", outline: "none",
            cursor: submitted ? "default" : "pointer",
          }}
        />
        <div style={{ marginTop: "0.6rem" }}>
          <div style={{ fontSize: "0.6rem", color: "rgba(186,214,235,0.4)", marginBottom: "0.3rem" }}>Code stability</div>
          <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "3px",
              width: `${stability * 100}%`,
              background: stabilityColor,
              transition: "width 0.1 ease, background 0.1s ease",
            }} />
          </div>
        </div>
        </div>

        {result && (
           <div style={{ fontSize: "0.75rem", color: result === "correct" ? "#86efac" : "#f87171", fontWeight: 600 }}>
          {result === "correct" ? "✓ Stable. The Kerr-Newman suppression holds." : "✗ Unstable. The spin is too far from optimal."}
        </div>
        )}

        {!submitted && (
          <button onClick={handleSubmit} style={{
            padding: "0.5rem 1.2rem",
            background: "rgba(125,211,252,0.12)",
            border: "1px solid rgba(125,211,252,0.3)",
            borderRadius: "999px", color: "#7dd3fc",
            fontSize: "0.78rem", cursor: "pointer",
          }}>
            Lock Spin Parameter
          </button>
        )}
        </div>
);
}

type PuzzleType = "surface_code" | "page_curve" | "spin_turner";

interface MiniPuzzleProps {
  type: PuzzleType;
  onSolve: () => void;
  onFail: () => void;
  onSkip: () => void;
}

export function MiniPuzzle({ type, onSolve, onFail, onSkip }: MiniPuzzleProps) {
  const titles: Record<PuzzleType, string> = {
    surface_code: "Puzzle-Surface Code",
    page_curve: "Puzzle-Page Curve",
    spin_turner: "Puzzle-Spin Stabilizer",
  };

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
        {titles[type]}
      </div>

      {type === "surface_code" && <SurfaceCodePuzzle onSolve={onSolve} onFail={onFail} />}
      {type === "page_curve" && <PageCurvePuzzle onSolve={onSolve} onFail={onFail} />}
      {type === "spin_turner" && <SpinTunerPuzzle onSolve={onSolve} onFail={onFail} />}

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