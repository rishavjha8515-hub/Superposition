import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface UsernameModalProps {
    onSave: ( username: string ) => void;
    onSkip: () => void;
}

export function UsernameModal({ onSave, onSkip }: UsernameModalProps) {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSave() {
        if (!value.trim()) { setError("Please give yourself a lovely name!"); return;  }
        if (value.length > 30) { setError("Lovely names are mostly short! Please keep it under 30 characters."); return; }
        setLoading(true);
        try {
             await fetch(`${API_BASE}/api/username`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ username: value.trim() }),
        });
        localStorage.setItem("superposition_username", value.trim());
        onSave(value.trim());   
    } catch {
        setError("This doesn't suits you!.Please try again.");
    }
    setLoading(false);
}

 return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 25,
      background: "rgba(2,4,10,0.92)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{
        width: "100%", maxWidth: "360px",
        padding: "1.5rem",
        background: "rgba(8,12,24,0.9)",
        border: "1px solid rgba(125,211,252,0.15)",
        borderRadius: "16px",
      }}>
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(125,211,252,0.6)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
          Before you enter this complex field
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0f4f8", marginBottom: "0.3rem" }}>
          Choose a lovely username
        </div>
        <div style={{ fontSize: "0.78rem", color: "rgba(186,214,235,0.5)", marginBottom: "1.2rem", lineHeight: 1.5 }}>
          Your runs will appear on the global leaderboard.It doesn't means you are a physicist, but it will be fun to see how you perform!
        </div>

        <input 
        type="text"
        value={value}
        placeholder="No examples, because you are unique!"
        onChange={(e) => { setValue(e.target.value); setError(""); }}
        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
        maxLength={30}
        style={{
            width: 100%, padding: "0.7rem 0.9rem", 
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(125,211,252,0.2)",
            borderRadius: "8px", color: "#f0f4f8", fontSize: "0.9rem",outline: "none", marginBottom: "0.5rem",
        }}
        />

        {error && (
            <div style={{ fontSize: "0.7rem", color: "#f87171", marginBottom: "0.5rem" }}>{error}</div>
        )}

         <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: "100%", padding: "0.75rem",
            background: "rgba(125,211,252,0.15)",
            border: "1px solid rgba(125,211,252,0.35)",
            borderRadius: "10px", color: "#7dd3fc",
            fontSize: "0.85rem", fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            marginBottom: "0.5rem",
          }}
        >
          {loading ? "NGL, But it sounds good! So we're saving..." : "Enter the Field"}
        </button>

        <button 
          onClick={onSkip}
           style={{
            width: "100%", padding: "0.5rem",
            background: "transparent",
            border: "none",
            color: "rgba(186,214,235,0.3)",
            fontSize: "0.75rem", cursor: "pointer",
           }}
           >
            Nope, I want to stay anonymous and mysterious.We don't judge you, but you will not be on the leaderboard.
           </button>
           </div>
           </div>
       );
    }