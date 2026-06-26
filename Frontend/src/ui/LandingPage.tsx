import { useState, useEffect, useRef } from "react";

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [visible, setVisible] = useState(false);
  const [entering, setEntering] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  function startAudio() {
    const ctx = new AudioContext();
    audioRef.current = ctx;

    const drone1 = ctx.createOscillator();
    const drone1Gain = ctx.createGain();
    drone1.type = "sine";
    drone1.frequency.setValueAtTime(40, ctx.currentTime);
    drone1.frequency.linearRampToValueAtTime(43, ctx.currentTime + 8);
    drone1.frequency.linearRampToValueAtTime(40, ctx.currentTime + 16);
    drone1Gain.gain.setValueAtTime(0, ctx.currentTime);
    drone1Gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3);
    drone1.connect(drone1Gain);
    drone1Gain.connect(ctx.destination);
    drone1.start();

    const drone2 = ctx.createOscillator();
    const drone2Gain = ctx.createGain();
    drone2.type = "sine";
    drone2.frequency.setValueAtTime(80, ctx.currentTime);
    drone2.frequency.linearRampToValueAtTime(84, ctx.currentTime + 12);
    drone2.frequency.linearRampToValueAtTime(80, ctx.currentTime + 24);
    drone2Gain.gain.setValueAtTime(0, ctx.currentTime);
    drone2Gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 4);
    drone2.connect(drone2Gain);
    drone2Gain.connect(ctx.destination);
    drone2.start();

    const organ1 = ctx.createOscillator();
    const organ1Gain = ctx.createGain();
    organ1.type = "triangle";
    organ1.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
    organ1Gain.gain.setValueAtTime(0, ctx.currentTime);
    organ1Gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 5);
    organ1Gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 10);
    organ1.connect(organ1Gain);
    organ1Gain.connect(ctx.destination);
    organ1.start();

    const organ2 = ctx.createOscillator();
    const organ2Gain = ctx.createGain();
    organ2.type = "triangle";
    organ2.frequency.setValueAtTime(196.0, ctx.currentTime); // G3
    organ2Gain.gain.setValueAtTime(0, ctx.currentTime);
    organ2Gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 6);
    organ2.connect(organ2Gain);
    organ2Gain.connect(ctx.destination);
    organ2.start();

    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    const shimmerFilter = ctx.createBiquadFilter();
    shimmer.type = "sawtooth";
    shimmer.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    shimmerFilter.type = "lowpass";
    shimmerFilter.frequency.setValueAtTime(600, ctx.currentTime);
    shimmerGain.gain.setValueAtTime(0, ctx.currentTime);
    shimmerGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 7);
    shimmer.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.start();

    // Store on window so App.tsx can access it later
    (window as any).__audioCtx = ctx;
  }

  function handleEnter() {
    setEntering(true);
    startAudio();
    setTimeout(() => onEnter(), 800);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        opacity: entering ? 0 : 1,
        transition: entering ? "opacity 0.8s ease" : "opacity 1.2s ease",
        pointerEvents: entering ? "none" : "auto",
      }}
    >
      {/* Subtle star texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000000 70%)",
      }} />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 1.5s ease, transform 1.5s ease",
        }}
      >
        <div style={{
          fontSize: "0.6rem",
          letterSpacing: "0.25em",
          color: "rgba(125, 211, 252, 0.5)",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}>
          Based on ISEF 2026 Research · PHYS062
        </div>

        <div style={{
          fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: "#f0f4f8",
          textShadow: "0 0 40px rgba(125, 211, 252, 0.3)",
        }}>
          SUPERPOSITION
        </div>

        <div style={{
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          color: "rgba(186, 214, 235, 0.6)",
          textTransform: "uppercase",
        }}>
          The Meissner Gap
        </div>

        <div style={{
          marginTop: "1.5rem",
          fontSize: "0.9rem",
          color: "rgba(186, 214, 235, 0.7)",
          textAlign: "center",
          maxWidth: "320px",
          lineHeight: 1.7,
          fontStyle: "italic",
        }}>
          "You are a photon falling toward an extremal black hole.
          Your decoherence is suppressed.
          The horizon is a perfect shield."
        </div>

        <div style={{
          marginTop: "1rem",
          padding: "0.4rem 0.9rem",
          border: "1px solid rgba(125, 211, 252, 0.2)",
          borderRadius: "999px",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "rgba(125, 211, 252, 0.6)",
        }}>
          C(κ) = L·κ &nbsp;·&nbsp; L = 2.1895×10⁻⁴
        </div>

        <button
          onClick={handleEnter}
          style={{
            marginTop: "2.5rem",
            padding: "0.9rem 2.5rem",
            background: "transparent",
            border: "1px solid rgba(125, 211, 252, 0.4)",
            borderRadius: "999px",
            color: "#7dd3fc",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(125, 211, 252, 0.1)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(125, 211, 252, 0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(125, 211, 252, 0.4)";
          }}
        >
          Enter the Field
        </button>

        <div style={{
          marginTop: "0.8rem",
          fontSize: "0.6rem",
          color: "rgba(186, 214, 235, 0.25)",
          letterSpacing: "0.08em",
        }}>
          First load may take ~30 seconds · Free tier hosting
        </div>
      </div>
    </div>
  );
}