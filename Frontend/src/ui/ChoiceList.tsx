import { HtmlHTMLAttributes } from "react";
import type { SceneChoice } from "../api/client";

interface ChoiceListProps {
    choices: SceneChoice[];
    disabled: boolean;
    onChoose: (choiceId: string) => void;
}

export function ChoiceList({ choices, disabled, onChoose }: ChoiceListProps) {
  if (choices.length === 0) return null;
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1rem"}}>
        {choices.map((choice) => (
            <button 
            key={choice.id}
            disabled={disabled}
            onClick={() => onChoose(choice.id)}
            style={{
                textAlign: "left",
                padding: "0.85rem 1rem",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "10px",
                color: "#f0f4f8",
                fontSize: "0.92rem",
                lineHeight: 1.4,
                cursor:disabled ? "default" : "pointer",
                opacity: disabled ? 0.5 : 1,
                transition: "background 0.15s, border-color 0.15s",
                backdropFilter: "blur(4px)",
            }}
            onTouchCancel={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(125, 211, 252 0.15)";
            }}
            onTouchEnd={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
            }}
            >
                {choice.label}
            </button>
            ))}
    </div>
  );
}