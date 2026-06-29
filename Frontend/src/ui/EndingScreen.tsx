interface EndingScreenProps {
    endingId: string | null;
    onRestart: () => void;
}

const ENDING_TITLES: Record<string, string> = {
    classical: "The Classical Path",
    extended_framework: "The Extended Framework",
    unitarity: "Unitarity Preserved",
    remnant: "The Horizon Remnant",
};

export function EndingScreen({ endingId, onRestart }: EndingScreenProps) {
    const title = endingId ? ENDING_TITLES[endingId] ?? "Ending" : "Ending";

    return (
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            marginTop: "1.25rem",
        }}
        >
            <div 
            style={{
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#7dd3fc",
                opacity: 0.85
            }}
            >
                Ending Reached
            </div>
            <div style={{ fontSize: "1.1.rem", fontWeight: 600, color: "#f0f4f8"}}>
                {title}
            </div>
            <button
            onClick={onRestart}
            style={{
                marginTop: "0.8rem",
                padding: "0.7em 1.4em",
                background: "rgba(125, 211, 252, 0.15)",
                border: "1px solid rgba(125, 211, 252, 0.4)",
                borderRadius: "999px",
                color: "#7dd3fc",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer"
            }}
            >
                Begin Again
            </button>
            <button
            onClick={() => {
                const text = `I just reached "${title}" in Superposition - a physics game based on real black hole research.Play it:https://superposition-alpha.vercel.app`;
                if (navigator.share) {
                    navigator.share({ title: "Superposition", text});
                } else {
                    navigator.clipboard.writeText(text);
                    alert("Copied to clipboard!");
                }
            }}
            style={{
                marginTop: "0.5rem",
                padding: "0.7rem 1.4rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "999px",
                color: "rgba(186,214,235,0.6)",
                fontSize: "0.85rem",
                cursor: "pointer",
            }}
            >
                Share Ending
            </button>
        </div>
    );
}