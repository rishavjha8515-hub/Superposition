import { useState } from "react";

interface ShareButtonProps {
  endingId: string | null;
}

const ENDING_TITLES: Record<string, string> = {
  classical: "The Classical Path",
  extended_framework: "The Extended Framework",
  unitarity: "Unitarity Preserved",
  remnant: "The Horizon Remnant",
};

export function ShareButton({ endingId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  if (!endingId) return null;

  const title = ENDING_TITLES[endingId] ?? "An Ending";
  const text = `I reached "${title}" in Superposition — a physics game built on real black hole research. C(κ) = ℒ·κ, ℒ = 2.1895×10⁻⁴\n\nhttps://superposition-alpha.vercel.app`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Superposition — The Meissner Gap",
          text,
          url: "https://superposition-alpha.vercel.app",
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      style={{
        marginTop: "0.5rem", width: "100%",
        padding: "0.6rem",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        color: "rgba(186,214,235,0.4)",
        fontSize: "0.75rem", cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {copied ? "✓ Copied to clipboard" : "Share this ending ↗"}
    </button>
  );
}