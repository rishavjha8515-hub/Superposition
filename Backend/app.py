from flask import Flask,jsonify,request
from flask_cors import CORS 
import numpy as np
from scipy import integrate
import math
import uuid
import os

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",
    "https://superposition-alpha.vercel.app"
])

sessions = {}

#note: All the equations here refer to my YHSA Paper, which is unavailable for ip reasons and all are approximations, not derived from first princiles.
L1 = 2.1895e-4 #It is computed to error less than 3*10^(-14) 

A1 = math.cos(math.pi * math.sqrt(7/4)) ** 2

LKN = 9.211e-5 #It is the coefficient useed for extremal kerr newmann

def kappa_from_q(q:float) -> float:
    return 2.0 * math.sqrt(max(0.0, 1.0 - q * q))

def pt_transmission(u: float,A: float = A1) -> float:
    s = math.sinh(math.pi * u)
    return (s * s)/(s * s + A)

def compute_L(nu2: float = 2.0) -> float:
    A = math.cosh(math.pi * math.sqrt(nu2 - 0.25)) ** 2

    def integrand(u):
        if u < 1e-10:
            return math.pi * u / (2*A)
        if u > 30:
            return u * math.exp(-2 * math.pi *u)
        s = math.sinh(math.pi * u)
        Ttu = (s * s)/(s * s + A)
        bose = 1.0/(math.exp(2 * math.pi * u) -1)
        return u * Ttu * bose
    
    result, _ = integrate.quad(integrand, 0, np.inf, limit=200)
    return result

def nu2_from_q(q: float, alpha: float = 0.0) -> float:
    return 2.0 + 0.50 * alpha * alpha

def decoherence_time(q: float, alpha: float = 0.0) -> dict:
    kappa = kappa_from_q(q)
    nu2 = nu2_from_q(q, alpha)
    L = compute_L(nu2)
    Ck = L * kappa

    A = math.cosh(math.pi * math.sqrt(nu2 - 0.25)) ** 2
    Ttilde = pt_transmission(1.0, A)

    TH = kappa / (2 * math.pi) if kappa > 0 else 0.0

    return {
        "kappa": round(kappa, 6),
        "L": round(L,  8),
        "C_Kappa": round(Ck,  10),
        "T_tilde": round(Ttilde,  6),
        "T_Hawking": round(TH,  8),
         "nu2":round(nu2,   4),
         "q":round(q,   4),
         "alpha":round(alpha,  3),
    }

SCENES = [
    {
        "id": 1,
        "label": "Scene 1 - The Approach",
        "text": (
            "You are a photon falling toward a near-extremal Reissner-Nordström Blackhole."
            "The Universe grows very quiet here.Surface gravity(k) goes to zero."
            "Your decoherence, your loss of quantum self, is suppressed."
            "The horizon is a perfect shield.This is the [[Meissner Gap]]"
        ),
        "physics_callouts":{
            "Surface Gravity k": "k = 2[1-q^2]^(1/2).As q approaches 1,k approaches zero.The black hole's graviataional 'Temperature' vanishes''",
            "Meissner Gap": "Near Extremality,decoherence rate C(K)=L*Kappa with L=2.1895*10^(-4).Quantum coherence is preserved close to the horizon."
        },
        "choices": [
            {"id": "approach_slow", "label":"Slow your descent.Stay coherent as long as possible.","next_scene":2},
            {"id":"approach_fast", "label":"Dive in.Embrace the horizon.", "next_scene":3},
        ],
    },

    {
        "id":2,
        "label":"Scene 2A-The Quiet Zone ",
        "act":1,
        "text":(
            "You hover at the edge of the [[ergosphere analogue]],where time itself seems to pause."
            "[[Hawking radiation]] whispers past you-but at near zero temperature."
            "The quanta around you remians entangled.You are still whole."
        ),
        "physics_callouts": {
            "ergosphere analogue": (
                "In RN spacetime,there is no ergosphere,but near-extremal charge creates an analogue"
                "trapping zone where outgoing radiation is heavily suppressed."
            ),
            "Hawking radiation": (
                "T_H = k/2pi.At extremality,k approaches zero, so T_H approaches zero."
                "The black hole stops radiating.Quantum Information is frozen at the horizon."
            ),
        },
          "choices": [
                {"id": "observe_radiation", "label":"Observe the faint Hawking quanta escaping.", "next_scene":4},
                {"id": "probe_horizon", "label":"Probe the structure of the horizon itself.", "next_scene": 5},
            ],
        },
        {
            "id":3,
            "label":"Scene 2B - Freefall",
            "act": 1,
            "text": (
                "The Horizon rushes toward you. In your refrence frame,nothing dramatic happens -"
                "the [[equivalence principle]] holds.But your [[decoherence rate]] C(k) is climbing."
                "The further from extremality your trajectory takes you,the more the environment reads you."
        ),
        "physics_callouts": {
            "equivalence principle": (
                "A freely falling observer experiences no local gravity."
                "The horizon crossing is smooth,NO FIREWALL(in the classical picture)."
            ),
            "decoherence rate": (
                "C(k) = L * kappa. Away from extremality kappa grows, and with it the rate at which"
                "your quantum state leaks into the environment."
            ),
        },
        "choices": [
            {"id": "resist_decoherence", "label":"Fight to maintain coherence.Encode yourself in a surface code.", "next_scene":6},
            {"id": "embrace_decoherence","label":"Let go.Become classical.", "next_scene":7},
            {"id": "sense_firewall", "label": "Something feels wrong at the horizon. Investigate.", "next_scene": 20},
        ],
        },
        {
            "id":4,
            "label":"Scene 3A - The Radiation Archive",
             "act": 2,
             "text": (
                 "The Hawking quanta carry faint imprints- [[soft hair]] on the horizon."
                 "Each escaping photon is entangled with a partner trapped inside."
                 "You begin to read the archive.The information all here, encoded in [[Page time]] correlations."
                 "But something is off.One channel is missing."
             ),
              "physics_callouts": {
            "soft hair": (
                "Soft photons and gravitons near the horizon carry quantum information as conserved charges "
                "(Hawking-Perry-Strominger). They are the horizon's memory."
            ),
            "Page time": (
                "After the Page time (~half the black hole's lifetime), the Hawking radiation begins to carry out "
                "more information than it leaves behind. Unitarity is restored — in principle."
            ),
        },
        "choices": [
            {"id": "find_channel",  "label": "Search for the missing decoherence channel.", "next_scene": 8},
            {"id": "trust_archive", "label": "Trust the archive. Information is conserved.", "next_scene": 9},
        ],
    },
 
    {
        "id": 5,
        "label": "Scene 3B — Horizon Geometry",
        "act": 2,
        "text": (
            "The horizon is not a surface — it is a [[stretched horizon]], a membrane of quantum degrees of freedom. "
            "You feel the [[near-horizon geometry]]: AdS₂ × S². "
            "In this throat, time is redshifted almost to a stop. "
            "Your wavefunction spreads across the entire membrane."
        ),
        "physics_callouts": {
            "stretched horizon": (
                "The stretched horizon (Susskind et al.) is a membrane one Planck length outside the true horizon "
                "that encodes all infalling information as thermal fluctuations."
            ),
            "near-horizon geometry": (
                "Extremal RN has a near-horizon limit of AdS₂ × S². This throat geometry is the arena for the "
                "Meissner suppression — the AdS₂ factor freezes low-frequency modes."
            ),
        },
        "choices": [
            {"id": "enter_throat", "label": "Descend into the AdS₂ throat.","next_scene": 16},
            {"id": "pull_back",    "label": "Retreat before the geometry traps you.", "next_scene": 4},
        ],
    },
 
    {
        "id": 6,
        "label": "Scene 3C — The Surface Code",
        "act": 2,
        "text": (
            "You encode your quantum state into a [[stabiliser code]] — logical qubits spread across the horizon's "
            "Planck-scale tiles. The environment can measure individual tiles, but the logical information survives. "
            "For now. The [[code distance]] d buys you time, not immortality."
        ),
        "physics_callouts": {
            "stabiliser code": (
                "Surface codes encode one logical qubit in a 2D array of physical qubits. Errors on individual "
                "qubits are detectable without disturbing the logical state — the basis of fault-tolerant quantum computing."
            ),
            "code distance": (
                "d = minimum number of errors needed to corrupt the logical qubit. "
                "Decoherence time scales as (p_error)^(d/2). Larger d = longer coherence, but more qubits needed."
            ),
        },
        "choices": [
            {"id": "increase_distance", "label": "Expand the code. Increase d at the cost of spreading thinner.", "next_scene": 11},
            {"id": "hold_distance",     "label": "Hold at current d. Conserve your resources.",                   "next_scene": 8},
        ],
    },
 
    {
        "id": 7,
        "label": "Scene 3D — Classical Dissolution",
        "act": 2,
        "text": (
            "Your off-diagonal density matrix elements — your [[coherences]] — decay to zero. "
            "You are now a probability distribution, not a wavefunction. "
            "The [[pointer basis]] has been selected. You know which path you took. "
            "But you have lost the ability to interfere with yourself. "
            "Is this death, or just a change of description?"
        ),
        "physics_callouts": {
            "coherences": (
                "The off-diagonal elements ρ_ij (i≠j) of the density matrix encode quantum superposition. "
                "Decoherence drives them to zero, leaving a classical probability distribution on the diagonal."
            ),
            "pointer basis": (
                "The basis selected by decoherence — the one that survives environmental monitoring. "
                "Macroscopic objects decohere into position eigenstates; this is why cats are alive or dead, not both."
            ),
            "quantum Zeno effect": (
                "Frequent measurement of a quantum system can freeze its evolution. "
                "If you 'look at yourself' fast enough, decoherence slows — but each measurement has a cost."
            ),
        },
        "choices": [
            {"id": "accept_classical", "label": "Accept the classical description. Follow your definite path.",  "next_scene": 12},
            {"id": "fight_back",       "label": "Reject it. Invoke the [[quantum Zeno effect]].",                "next_scene": 6},
        ],
    },
    {
       "id": 8,
       "label": "Scene 4A - The Missing Channel",
       "act": 3,
       "text": (
           "You find it.A third decoherence channel- neither gravitational nor electromagnetic -"
           "arising from [[quantum vaccum fluctuations]] in the AdS Throat."
           "Your paper only considered two.This one is smaller,but at extremality it dominates."
           "The [[Meissner suppression]] is even stronger than I calculated."
       ),
       "physics_callouts":{
           "quantum vaccum fluctuations":(
               "Zero-point fluctuations of quantum fields contribute to decohernce even at T=0."
               "Near extremality,the thermal channel shuts off,making vaccum contributions relatively dominant."
           ),
           "Meissner supression": (
               "C(k): L*kappa with L= 2.1895*10^(-4).The suppression is linear in k near extremality-"
               "the horizon acts like a superconductor expelling decohernce."
           ),
       },
       "choices":[
           {"id": "integrate_channel", "label": "Integrate the new channel into your framework.", "next_scene":13},
             {"id": "ignore_channel",    "label": "The correction is small. Press on.","next_scene":9},
       ],
    },
    {
        "id":9,
        "label": "Scene 4B - Information Paradox",
        "act": 3,
        "text": (
            "You reach the crux.The black hole is evaporating.Your infomation -your quantum state-"
            "is either destroyed ([[Hawking's original claim]]) or encoded in the radiation([[unitarity]])."
            "The Meissner Gap changes the calculation.Near extremality, evaporation nearly stops."
            "Your information lingers at the horizon,neither lost or retrieved."
            "A third option.A quantum purgatory."
        ),
        "physics_callouts":{
            "Hawking's original claim": (
                "In Hawking's 1975 calculation,black hole evaporationis exactly thermal i.e no inormation escapes."
                "This violates quantum unitarity:pure states cannot evolve into mixed states."
            ),
            "unitarity":(
                "Quantum mechanics demands that the total information in a closed system is preserved."
                "The S-matrix must be unitary.Hawking radiation must secretly carry information-"
                "the mechanism is still debated."
            ),
        },
        "choices": [
            {"id": "trust_unitarity", "label":"Trust unitarity.The information must escape somehow", "next_scene":14},
            {"id": "embrace_purgatory","label":"Remain at the horizon.Neither lost nor free.", "next_scene":15},
        ],
    },
    {
        "id": 10,
        "label": "Scene 4C — The AdS₂ Throat",
        "act": 3,
        "text": (
            "Inside the throat, time is a dimension of space. "
            "The [[JT gravity]] description takes over — your degrees of freedom are a boundary quantum mechanics. "
            "You are no longer a particle. You are a [[hologram]]: "
            "all your information lives on a one-dimensional boundary, "
            "yet you experience a two-dimensional bulk. "
            "The information paradox dissolves here. There was never a paradox — only a wrong description."
        ),
        "physics_callouts": {
            "JT gravity": (
                "Jackiw-Teitelboim gravity is a 2D dilaton gravity theory that exactly describes the near-horizon "
                "dynamics of extremal black holes. It is exactly solvable and dual to a 1D random matrix model."
            ),
            "hologram": (
                "AdS/CFT: a gravitational theory in d+1 dimensions is equivalent to a conformal field theory on the "
                "d-dimensional boundary. Information is not lost — it never entered the bulk in the way we imagined."
            ),
        },
        "choices": [
            {"id": "become_boundary", "label": "Accept the holographic description. Become the boundary.", "next_scene": 14},
            {"id": "resist_hologram", "label": "Insist on bulk existence. Fight the re-description.","next_scene": 9},
        ],
    },

    {
        "id": 11,
        "label": "Scene 4D - Kerr-Newmann Transition",
        "act":3,
        "text": (
            "As your spread your code across the horizon,you notice the black hole is spinning."
            "This is not Reissner-Nordström.It is [[Kerr-Newman]]."
            "The spin parameter a couples to your code's logical operators."
            "L_KN = 9.211*10^(-5).A different co-efficient.Smaller."
            "The Meissner suppression is even stronger for a spinning extremal black hole."
            "Your code is more protected here than anywhere in the universe."
        ),
        "physics_callouts":{
            "Kerr-Newman":(
              "The most general charged,rotating black hole solution.Described by mass M,charge Q,angular"
              "momentum J.Extremality: M^(2) = Q^(2)+(J/M)^2.The near-horizon geometry is still Ads * s^(2),"
              "but warped by spin."  
            ),
        },
        "choices": [
            {"id": "exploit_spin", "label": "Use the spin-orbit coupling to further protect your code.", "next_scene":13},
            {"id": "return_to_rn", "label":"The spin is destablising.Return to the RN geometry.", "next_scene":8},
        ],
    },

    {
        "id":12,
        "label": "Scene 5-Ending; The Classical Path",
        "act":4,
        "ending":True,
        "ending_id": "classical",
        "text": (
            "You follow the classical geodesic to its end."
            "The singularity. r=0."
            "Your wavefunction collapses to a point."
            "The density matrix is diagonal.The off-diagonals are zero."
            "You have become information about a definite history."
            "Somewhere,in the Hawking Radiation,a faint correlation carries the memory of your shape."
            "Not you.But not nothing."
            "[ ENDING: The classical Path - You chose certainty over coherence.]"
            "The universe remembers you as a statistic. ]"
        ),
        "physics_callouts": {},
        "choices": [],
    },

    {
        "id":13,
        "label": "Scene 5 - Ending: The Extended Framework",
        "act": 4,
        "ending": True,
        "ending_id": "extended_framework",
        "text": (
            "You have found the third channel, integrated the Kerr-Newman correction,"
            "and extended the Meissner Gap framework beyond its original scope."
            "The result: a unified decoherence suppression coefficient valid for all extremal black holes."
            "You are still coherent. Spread across the horizon like a message in a bottle"
            "that the universe has agreed to protect."
            "[ENDING: The Extended Framework - You pushed the physics further. "
            "The Meissner Gap holds, and you hold with it.]"
        ),
        "physics_callouts": {},
        "choices": [],
    },

    {
        "id": 14,
        "label": "Scene 5 - Ending: Unitarity Preserved",
        "act": 4,
        "ending": True,
        "ending_id": "unitarity",
        "text": (
            "The Hawking Radiation carries you out - slowly,scrambled,but intact."
            "[[Page's theorem]] guarantees it: after the Page time, the radiation is your mirror."
            "You are not in the black hole anymore."
            "You are in the sky,encoded in correlations between photons"
            "that no single observer will ever collect."
            "[ ENDING: Unitarity Preserved-Information is conserved."
            "You escaped as entropy.]"
        ),
        "physics_callouts":{
            "Page's theorem": (
                "Don Page (1993) showed that for a random unitary evaporation, the entanglement entropy of the "
                "radiation follows the 'Page curve' — rising then falling — preserving unitarity."
            ),
        },
        "choices":[],
    },

    {
        "id": 15,
        "label": "Scene 5 -Ending: The Horizon Remnant",
        "act": 4,
        "ending": True,
        "ending_id": "remnant",
        "text": (
            "You chose neither escape nor dissolution."
            "The extremal horizon is a perfect insulator of time."
            "K=0. T_H=0.The black hole does not evaporate."
            "You remain a quantum state frozen at the boundary of everything,"
            "neither inside nor outside,neither past nor future."
            "The universe ages around you.Stars die."
            "You are still here."
            "[ENDING: The Horizon Remnant - Extremality is eternal."
            "The Meissner Gap protected you forever at the cost of forever.]"
        ),
        "physics_callouts":{},
        "choices": [],
    },
    {
        "id": 16,
        "label": "Scene 3E - The Entanglement Web",
        "act": 2,
        "text": (
            "Inside the  AdS₂ throat, you see it. Every Hawking quantum that ever escaped "
            "is [[entangled]] with a partner still inside.The web stretches across the entire horizon."
            "You are not alone here.You are a part of a [[quantum network]]-"
            "trillions of qubits, all correlated, all protecting each other."
            "The decoherence rate drops to almost nothing.You feel it - the Meissner Gap, from inside."
        ),
        "physics_callouts": {
            "entangled": (
                "Quantum entanglement: two particles share a wavefunction regardless of distance."
                "Measuring one instantly determines the other. Einstein called it 'spooky action at a distance.'"
                "Here, it's what preserves your information."          
                ),
                "quantum network": (
                    "The Horizon encodes information in a quantum error-correcting code-"
                    "each qubit redundantly stored across many horizon tiles."
                    "No local measurement can read you out. You are protected by distribution."
                ),
        },
        "choices": [
            {"id": "read_network", "label": "Try to read the entanglement structure.", "next_scene": 17},
            {"id": "become_network", "label": "Dissolve into the network. Become part of it.", "next_scene":18},
        ],
    },

    {
        "id": 17,
        "label": "Scene 3F - The Scrambling",
        "act": 2,
        "text": (
            "You attempt to read the entanglement structure.But the informtaion is [[scrambled]]-",
            "spread across so many qubits that no subsystem contains anything meaningful."
            "To read you, someone would need to collect more than half the Hawking radiation ever emitted."
            "The [[scrambling time]] for this black hole: longer than the age of the universe."
            "You are perfectly hidden.Perfectly preserved."
        ),
        "physics_callouts": {
            "scrambled": (
                "Black holes are the fastest scramblers in nature, they mix information across all their"
                "degrees of freedom in the minimum possible time(the scrambling time -M log M in the Planck units)."
                "This makes information practically inaccessible without violating causality."
            ),
            "scrambling time": (
                "t_scr ~ (r_s / c) * log(S), where S is the black hole entropy. "
                "For a stellar black hole, this is ~milliseconds.For a supermassive one, ~years."
                "But recovering the information requires solving an experimentally hard decoding problem."
            ),
        },
        "choices": [
            {"id": "wait_page_time", "label": "Wait. After the Page time, the radiation will decode you.", "next_scene": 9},
            {"id": "find_decoder", "label": "Search for a quantum decoder inside the throat.", "next_scene": 19},
        ],
    },

    {
        "id": 18,
        "label": "Scene 3G - The Holographic Self",
        "act": 2,
        "text": (
            "You let go.Your quantum state spreads across every horizon title simultaneously."
            "You are no longer a particle - you are a [[boundary CFT state]]."
            "From outside, an observer sees only thermal radiation."
            "But you experience the full [[bulk geometry]] — the AdS₂ throat, infinite and still. "
            "The information paradox never existed from here.It was always a question of perspective."
        ),
        "physics_callouts": {
            "boundary CFT state": (
                "In Ads/CFT duality, any state in the bulk gravitational theory corresponds exactly"
                "to a state in the boundary conformal field theory.Your experience as a particle"
                "in the bulk is dual to a thermal state on the boundary - same physics, different descriptin."
            ),
            "bulk geometry": (
                "The 'bulk' is the insider of Ads space - the gravitational region where you experience"
                "geometry, distance and time.The 'boundary' is the lower-dimensional theory that encodes"
                "all the same information.Neither is more real than the other."
            ),
        },
        "choices": [
            {"id": "return_to_bulk", "label": "Reconstruct yourself in the bulk.Return as a particle.", "next_scene": 10},
                       {"id": "stay_boundary",  "label": "Stay on the boundary. Become the CFT.", "next_scene": 14},
        ],
    },

    
    {
        "id": 19,
        "label": "Scene 4E — The Quantum Decoder",
        "act": 3,
        "text": (
            "You find it — a natural [[Hayden-Preskill decoder]] in the throat geometry. "
            "A small region where the entanglement structure forms a perfect quantum error-correcting code. "
            "If you encode yourself here, future observers collecting enough Hawking radiation "
            "could reconstruct you exactly. Not a copy — you. "
            "But the [[no-cloning theorem]] means only one version can exist. "
            "The original must be destroyed to complete the transfer."
        ),
        "physics_callouts": {
            "Hayden-Preskill decoder": (
                "Hayden & Preskill (2007) showed that after the Page time, information thrown into a black hole "
                "can be recovered from just a few additional Hawking quanta — if you already have the earlier radiation. "
                "The black hole acts as a perfect mirror after Page time."
            ),
            "no-cloning theorem": (
                "An unknown quantum state cannot be perfectly copied. This is fundamental — "
                "if cloning were possible, it would allow faster-than-light communication. "
                "In black hole physics, this means the original infalling observer and their Hawking-radiation "
                "copy cannot both exist simultaneously (black hole complementarity)."
            ),
        },
        "choices": [
            {"id": "accept_transfer", "label": "Accept it. Encode and transfer. The copy will be you.", "next_scene": 14},
            {"id": "refuse_transfer", "label": "Refuse. You will not destroy the original for a copy.", "next_scene": 15},
        ],
    },

    {
        "id": 20,
        "label": "Scene 4F - The Firewall",
        "act": 3,
        "text": (
            "Something is wrong. As you approach the horizon, you feel it-"
            "a [[firewall]].A wall of Planck-energy radiation exact at the horizon."
            "AMPS (Almheiri, Marolf, Polchinski, Sully) predicted this in 2012. "
            "If Hawking radiation is perfectly entangled with early radiation (preserving unitarity),"
            "it cannot also be entangled with the interior (preserving smooth horizon)."
            "One must be wrong. The horizon burns."
            "Your [[equivalence principle]] fails here."
        ),
        "physics_callouts": {
            "firewall": (
                "The AMPS firewall paradox (2012): unitarity + monogamy of entanglement + equivalence principle"
                "cannot all be simultaneously true.Either information is lost (violating unitarity),"
                "the horizon is smooth (violating unitarity), or the equivalence priciple breaks down (firewall)."
                "No consensus resolution exists."
            ),
             "equivalence principle": (
                "Einstein's equivalence principle states a freely falling observer feels no local gravity. "
                "A smooth horizon should be undetectable from the inside. "
                "The firewall conjecture says this is wrong — the horizon is a high-energy surface "
                "that destroys infalling observers."
            ),
        },
        "choices": [
            {"id": "burn_through",    "label": "Burn through. Accept the firewall. What is on the other side?", "next_scene": 21},
            {"id": "reject_firewall", "label": "The firewall cannot be real. Find another way.", "next_scene": 8},
        ],
    },
 
    {
        "id": 21,
        "label": "Scene 4G — Beyond the Singularity",
        "act": 3,
        "text": (
            "Past the firewall, past r = 0, something unexpected. "
            "The singularity is not an end — it is a [[Cauchy horizon]] instability. "
            "In Reissner-Nordström spacetime, the inner horizon is unstable — "
            "but near extremality, the [[mass inflation]] effect is suppressed. "
            "You pass through. Into a region where time and space exchange roles again. "
            "A new exterior. A new universe. "
            "The information did not end. It [[tunnelled]]."
        ),
        "physics_callouts": {
            "Cauchy horizon": (
                "The inner horizon of a Reissner-Nordström black hole is a Cauchy horizon — "
                "a surface beyond which the future is not uniquely determined by the past. "
                "Classical GR predicts infinite blueshift instability here. "
                "Near extremality, this instability is parametrically suppressed."
            ),
            "mass inflation": (
                "The Poisson-Israel mass inflation instability: even small perturbations cause the "
                "Cauchy horizon mass parameter to diverge. In extremal RN, the surface gravity κ → 0 "
                "suppresses this — the Meissner Gap protects the Cauchy horizon too."
            ),
            "tunnelled": (
                "In quantum gravity, topology change and baby universe creation may allow information "
                "to pass through what classically looks like a singularity. "
                "Maldacena's eternal black hole (2001) suggests the interior is connected to another exterior "
                "via an Einstein-Rosen bridge — the ER=EPR conjecture."
            ),
        },
        "choices": [
            {"id": "new_universe", "label": "Enter the new universe. Start again.", "next_scene": 13},
            {"id": "return_home",  "label": "Find the Einstein-Rosen bridge. Go back.", "next_scene": 14}
        ],
    }
]

@app.route("/api/physics", methods=["POST"])
def physics():
    """Return decoherence data for a given charge ratio q (and optimal alpha)."""
    data = request.get_json(force=True, silent=True) or {}
    q = float(data.get("q", 0.99))
    alpha = float(data.get("alpha", 0.0))

    if not (0.0 <= q <= 1.0):
        return jsonify({"error": "q must be in [0,1]"}), 400
    
    return jsonify(decoherence_time(q, alpha))

@app.route("/api/scenes", methods=["GET"])
def get_scenes():
    "Return all scene definitions."
    return jsonify(SCENES)

@app.route("/api/scenes/<int:scene_id>", methods=["GET"])
def get_scene(scene_id):
    scene = next((s for s in SCENES if s["id"] == scene_id), None)
    if scene is None:
        return jsonify({"error": "Scene not found"}), 404
    return jsonify(scene)

@app.route("/api/session", methods=["POST"])
def create_session():
    """Start a new game session."""
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "current_scene": 1,
        "history": [],
        "q": 0.99,
        "alpha": 0.0,
        "ended": False,
        "ending_id": None,
    }
    scene = next((s for s in SCENES if s["id"] == 1), None)
    return jsonify({"session_id": session_id, "scene": scene})

@app.route("/api/session/<session_id>", methods=["GET"])
def get_session(session_id):
    """Return current session state plus the active scene and live physics."""
    session = sessions.get(session_id)
    if session is None:
        return jsonify({"error": "Session not found"}), 404
    scene = next((s for s in SCENES if s["id"] == session["current_scene"]), None)
    return jsonify({
        "session_id": session_id,
        "scene": scene,
        "history": session["history"],
        "ended": session["ended"],
        "ending_id": session["ending_id"],
        "physics": decoherence_time(session["q"], session["alpha"]),
    })

@app.route("/api/session/<session_id>/choose", methods=["POST"])
def make_choice(session_id):
    """Advance the session based on a choice id."""
    if session_id not in sessions:
        return jsonify({"error": "Session not found"}), 404

    session = sessions[session_id]

    if session["ended"]:
        return jsonify({"error": "Session has already reached an ending. Start a new session."}), 400

    data = request.get_json(force=True, silent=True) or {}
    choice_id = data.get("choice_id")
    current = next((s for s in SCENES if s["id"] == session["current_scene"]), None)

    if current is None:
        return jsonify({"error": "Invalid scene state"}), 500

    choice = next((c for c in current["choices"] if c["id"] == choice_id), None)
    if choice is None:
        return jsonify({"error": f"Unknown choice '{choice_id}'"}), 400

    if "q" in data:
        try:
            q = float(data["q"])
            if 0.0 <= q <= 1.0:
                session["q"] = q
        except (TypeError, ValueError):
            pass

    if "alpha" in data:
        try:
            session["alpha"] = float(data["alpha"])
        except (TypeError, ValueError):
            pass

    session["history"].append(session["current_scene"])
    next_scene_id = choice.get("next_scene", session["current_scene"])
    session["current_scene"] = next_scene_id

    next_scene = next((s for s in SCENES if s["id"] == next_scene_id), None)
    if next_scene and next_scene.get("ending"):
        session["ended"] = True
        session["ending_id"] = next_scene.get("ending_id")

    return jsonify({
        "session_id": session_id,
        "scene": next_scene,
        "history": session["history"],
        "ended": session["ended"],
        "ending_id": session["ending_id"],
        "physics": decoherence_time(session["q"], session["alpha"]),
    })

@app.route("/api/session/<session_id>/reset", methods=["POST"])
def reset_session(session_id):
    """Reset an existing session back to scene 1."""
    if session_id not in sessions:
        return jsonify({"error": "Session not found"}), 404
    sessions[session_id] = {
        "current_scene": 1,
        "history": [],
        "q": 0.99,
        "alpha": 0.0,
        "ended": False,
        "ending_id": None,
    }
    scene = next((s for s in SCENES if s["id"] == 1), None)
    return jsonify({"session_id": session_id, "scene": scene})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)
