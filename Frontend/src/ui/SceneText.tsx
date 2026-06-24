import { useState } from "react";

interface SceneTextProps {
  text: string;
  callouts: Record<string, string>;
}

export function SceneText({ text, callouts }: SceneTextProps) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const parts = text.split(/(\[\[[^\]]+\]\])/g);

  return (
    <div style={{ position: "relative" }}>
      <p
        style={{
          fontSize: "1rem",
          lineHeight: 1.6,
          color: "#e8eef5",
          margin: 0,
          textShadow: "0 1px 8px rgba(0,0,0,0.8)",
        }}
      >
        {parts.map((part, i) => {
          const match = part.match(/^\[\[([^\]]+)\]\]$/);
          if (!match) return <span key={i}>{part}</span>;

          const term = match[1];
          const hasCallout = term in callouts;

          return (
            <span
              key={i}
              onClick={() => hasCallout && setActiveTerm(activeTerm === term ? null : term)}
              style={{
                color: hasCallout ? "#7dd3fc" : "#e8eef5",
                borderBottom: hasCallout ? "1px dotted #7dd3fc" : "none",
                cursor: hasCallout ? "pointer" : "default",
                fontWeight: 500,
              }}
            >
              {term}
            </span>
          );
        })}
      </p>

      {activeTerm && callouts[activeTerm] && (
        <div
          onClick={() => setActiveTerm(null)}
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem 0.9rem",
            background: "rgba(10, 14, 24, 0.92)",
            border: "1px solid rgba(125, 211, 252, 0.3)",
            borderRadius: "8px",
            fontSize: "0.85rem",
            lineHeight: 1.5,
            color: "#bcd4e8",
            backdropFilter: "blur(6px)",
          }}
        >
          <strong style={{ color: "#7dd3fc" }}>{activeTerm}</strong>
          <div style={{ marginTop: "0.25rem" }}>{callouts[activeTerm]}</div>
        </div>
      )}
    </div>
  );
}