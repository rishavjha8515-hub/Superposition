import type { PhysicsData } from "../api/client";

interface PhysicsHUDProps {
  physics: PhysicsData | null;
}

export function PhysicsHUD({ physics }: PhysicsHUDProps) {
  if (!physics) return null;

  const rows: [string, number | string][] = [
    ["κ", physics.kappa],
    ["ℒ", physics.L],
    ["C(κ)", physics.C_Kappa],
    ["T_H", physics.T_Hawking],
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: "max(env(safe-area-inset-top), 14px)",
        right: "14px",
        zIndex: 5,
        padding: "0.5rem 0.7rem",
        background: "rgba(8, 12, 20, 0.55)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        fontSize: "0.68rem",
        color: "rgba(186, 214, 235, 0.85)",
        backdropFilter: "blur(6px)",
        lineHeight: 1.5,
        pointerEvents: "none",
      }}
    >
      {rows.map(([label, value]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem" }}>
          <span style={{ opacity: 0.7 }}>{label}</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}