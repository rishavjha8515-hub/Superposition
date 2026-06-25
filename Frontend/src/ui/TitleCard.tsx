import { useEffect, useState } from "react";

interface TitleCardProps {
  show: boolean;
}

export function TitleCard({ show }: TitleCardProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "18%",
        left: 0,
        right: 0,
        zIndex: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.1s ease",
      }}
    >
      <div
        style={{
          fontSize: "2.1rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "#f0f4f8",
          textShadow: "0 0 24px rgba(125, 211, 252, 0.5), 0 2px 16px rgba(0,0,0,0.8)",
        }}
      >
        SUPERPOSITION
      </div>
      <div
        style={{
          marginTop: "0.5rem",
          fontSize: "0.72rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(186, 214, 235, 0.65)",
        }}
      >
        The Meissner Gap
      </div>
    </div>
  );
}