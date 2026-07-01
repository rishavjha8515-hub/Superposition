import { useState, useEffect } from "react";

interface CodexEntry {
    term: string;
    definition: string;
    scene: number;
}

const ALL_ENTRIES: CodexEntry[] = [
  { term: "Surface gravity κ", definition: "κ = 2√(1 - q²). As q → 1 (extremal), κ → 0. The black hole's gravitational temperature vanishes.", scene: 1 },
  { term: "Meissner Gap", definition: "C(κ) = ℒ·κ with ℒ = 2.1895×10⁻⁴. Near extremality, decoherence is linearly suppressed. The horizon acts like a superconductor.", scene: 1 },
  { term: "Hawking Radiation", definition: "T_H = κ/2π. At extremality κ → 0, so T_H → 0. The black hole stops radiating. Information is frozen at the horizon.", scene: 2 },
  { term: "Decoherence Rate", definition: "C(κ) = ℒ·κ. Away from extremality κ grows, and your quantum state leaks into the environment.", scene: 3 },
  { term: "Soft Hair", definition: "Soft photons and gravitons near the horizon carry quantum information as conserved charges (Hawking-Perry-Strominger). The horizon's memory.", scene: 4 },
  { term: "Page Time", definition: "After ~half the black hole's lifetime, Hawking radiation begins carrying more information out than it leaves behind. Unitarity is restored in principle.", scene: 4 },
  { term: "Stretched Horizon", definition: "A membrane one Planck length outside the true horizon that encodes all infalling information as thermal fluctuations (Susskind et al.).", scene: 5 },
  { term: "Near-Horizon Geometry", definition: "Extremal RN has a near-horizon limit of AdS₂ × S². This throat geometry is the arena for Meissner suppression.", scene: 5 },
  { term: "Stabiliser Code", definition: "Surface codes encode one logical qubit in a 2D array of physical qubits. Errors on individual qubits are detectable without disturbing the logical state.", scene: 6 },
  { term: "Code Distance", definition: "d = minimum errors to corrupt the logical qubit. Decoherence time scales as (p_error)^(d/2). Larger d = longer coherence.", scene: 6 },
  { term: "Pointer Basis", definition: "The basis selected by decoherence — the one that survives environmental monitoring. Why cats are alive or dead, not both.", scene: 7 },
  { term: "Quantum Vacuum Fluctuations", definition: "Zero-point fluctuations contribute to decoherence even at T=0. Near extremality, thermal channel shuts off, making vacuum contributions dominant.", scene: 8 },
  { term: "Unitarity", definition: "Quantum mechanics demands total information in a closed system is conserved. The S-matrix must be unitary. Hawking radiation must secretly carry information.", scene: 9 },
  { term: "JT Gravity", definition: "Jackiw-Teitelboim gravity: a 2D dilaton theory exactly describing near-horizon dynamics of extremal black holes. Exactly solvable, dual to a 1D random matrix model.", scene: 10 },
  { term: "Kerr-Newman", definition: "The most general charged rotating black hole. M² = Q² + (J/M)². Near-horizon geometry is still AdS₂ × S², but warped by spin. ℒ_KN = 9.211×10⁻⁵.", scene: 11 },
  { term: "Entanglement", definition: "Two particles share a wavefunction regardless of distance. Measuring one instantly determines the other. Einstein called it spooky action at a distance.", scene: 16 },
  { term: "Scrambling Time", definition: "t_scr ~ (r_s/c) * log(S). Black holes are the fastest scramblers in nature — they mix information across all degrees of freedom in minimum time.", scene: 17 },
  { term: "Hayden-Preskill Decoder", definition: "After the Page time, information thrown into a black hole can be recovered from just a few additional Hawking quanta — if you have the earlier radiation.", scene: 19 },
  { term: "No-Cloning Theorem", definition: "An unknown quantum state cannot be perfectly copied. If cloning were possible, it would allow faster-than-light communication.", scene: 19 },
  { term: "AMPS Firewall", definition: "Unitarity + monogamy of entanglement + equivalence principle cannot all be simultaneously true. No consensus resolution exists.", scene: 20 },
  { term: "Cauchy Horizon", definition: "The inner horizon of RN — a surface beyond which the future is not uniquely determined by the past. Near extremality, its instability is suppressed.", scene: 21 },
];

interface CodexProps {
    unlockedScenes: number[];
    onClose: () => void;
}

export function Codex({ unlockedScenes, onClose }: CodexProps) {
    const [searchTerms, setSearchTerms] = useState<string>('');
    const [filteredEntries, setFilteredEntries ] = useState<CodexEntry | null>(null);

  const unlocked = ALL_ENTRIES.filter(e => unlockedScenes.includes(e.scene));
  const locked = ALL_ENTRIES.filter(e => !unlockedScenes.includes(e.scene));

  const filtered = unlocked.filter(e =>
    e.term.toLowerCase().includes(searchTerms.toLowerCase())
  );

   return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 20,
      background: "rgba(2,4,10,0.96)",
      backdropFilter: "blur(12px)",
      display: "flex", flexDirection: "column",
      padding: "1.5rem",
      overflowY: "auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(125,211,252,0.6)", textTransform: "uppercase" }}>
            Physics Codex
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f0f4f8" }}>
            {unlocked.length} / {ALL_ENTRIES.length} terms unlocked
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "999px", color: "rgba(186,214,235,0.5)",
          padding: "0.4rem 0.9rem", fontSize: "0.75rem", cursor: "pointer",
        }}>
          Close
        </button>
      </div>
    </div>
   )
}
