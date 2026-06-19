from flask import Flask,jsonify,request
from flask_cors import CORS 
import numpy as np
from scipy import integrate
from uuid,math

app = Flask(__name__)
CORS(app)

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

def nu2_from_q(q: float) -> float:
    return 2.0 + 0.50 * alpha *alpha

def decoherence_time(q: float) -> float:
    kapp = kappa_from_q(q)
    nu2 = nu2_from_q(q)
    L = compute_L(nu2)
    Ck = L * kappa

    A = math.cosh(math.pi * math.sqrt(nu2 - 0.25)) ** 2
    Ttilde = pt_transmission(1.0, A)

    TH = kappa / (2 * math.pi) if kappa > 0 else 0.0

    return {
        "kappa": round(kappa, 6),
        "L": round(L,  8),
        "C_Kappa": round(Ck,  10),
        "T_tilde": round(Ttilde  6),
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
            "Your decohernce, your loss of quantum self, is suppressed."
            "The horizon is a perfect shield.This is the [[Meissner Gap]]"
        ),
        "physics_callouts":{
            "Surface Gravity k": "k = 2[1-q^2]^(1/2).As q approaches 1,k approaches zero.The black hole's graviataional 'Temperature' vanishes'',
            "Meissner Gap": "Near Extremality,decoherence rate C(K)=L*Kappa with L=2.1895*10^(-4).Quantum cohernce is prserved close to the horizon."
        },
        "choices": [
            {"id": "approach_slow", "label":"Slow your descent.Stay coherent as long as possible."."next_scene":2},
            {"id":"approach_fast", "label":"Dive in.Embrace the horizon.", "next scene":3},
        ],
    },

    {
        "id":2,
        "label":"Scene 2A-The Quiet Zone ",
        "act":1,
        "text":(
            "You Hover at the edge of the [[ergosphere analogue]],where time itself seems to pause."
            "[[Hawking radiation]] whispers past you-but at near zero temperature."
            "The quanta around you remians entangled.You are still whole."
        ),
        "physics callouts": {
            "ergosphere analogue": (
                "In RN spacetime,there is no ergosphere,but near-extremal charge creates an analogue"
                "trappng zone where outgoing radiation is heavily suppressed."
            ),
            "Hawking radiation": (
                "T_H = k/2pi.At extremality,k approaches zero, so T_H approaches zero."
                "The black hole stops radiating.Quantum Information is frozen at the horizon."
            ),
        },
            [
                {"id": "observe_radiation", "label":"Observe the faint Hawking quanta escaping.", "next_scene":4},
                {"id": "probe_horizon", "label":"Probe the structure of the horizon itself.", "next_scene":5},
            ],
        },
        {
            "id":3,
            "label":"Scene 2B - Freefall",
            "act": 1,
            "text": (
                "The Horizon rushes toward you. In your refrence frame,nothing dramatic happens -"
                "the [[equivalence principle]] holds.But your [[decohernce rate]] C(k) is climbing."
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
            {"id": "resist_decohernce", "label":"Fight to maintain coherence.Encode yourself in a surface code.", "next_scene":6},
            {"id": "embrace_decohernce","label":"Let go.Become classical." "next_scene":7},
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
            {"id": "enter_throat", "label": "Descend into the AdS₂ throat.",         "next_scene": 10},
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
           "You find it.A third decohernce channel- neither gravitational nor electromagnetic -"
           "arising from [[quantum vaccum fluctuations]] in the AdS Throat."
           "My paper only considered two.This one is smaller,but at extremality it dominates."
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
            "The Meissner Gap cahnges the calculation.Near extremality, evaporation nearly stops."
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
            {"id": "embarce_purgatory","label":"Remain at the horizon.Neither lost nor free.", "next_scene":15},
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
]