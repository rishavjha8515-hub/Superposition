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