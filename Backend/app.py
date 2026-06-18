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
                "The Horizon rushes toward you. In your refrence frame,nothing dramatic happens."
        }
]