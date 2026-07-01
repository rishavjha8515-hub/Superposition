interface SceneAudioConfig {
  droneFreq: number;
  droneGain: number;
  organGain: number;
  shimmerGain: number;
  shimmerFreq: number;
  pulseRate: number;
  filterCutoff: number;
}

const SCENE_AUDIO: Record<number, SceneAudioConfig> = {
  1:  { droneFreq: 80,  droneGain: 0.12, organGain: 0.03, shimmerGain: 0.008, shimmerFreq: 523, pulseRate: 0.4, filterCutoff: 400  },
  2:  { droneFreq: 76,  droneGain: 0.14, organGain: 0.04, shimmerGain: 0.01,  shimmerFreq: 587, pulseRate: 0.3, filterCutoff: 500  },
  3:  { droneFreq: 72,  droneGain: 0.18, organGain: 0.05, shimmerGain: 0.015, shimmerFreq: 440, pulseRate: 0.6, filterCutoff: 600  },

  4:  { droneFreq: 70,  droneGain: 0.16, organGain: 0.05, shimmerGain: 0.012, shimmerFreq: 659, pulseRate: 0.5, filterCutoff: 700  },
  5:  { droneFreq: 64,  droneGain: 0.20, organGain: 0.06, shimmerGain: 0.018, shimmerFreq: 698, pulseRate: 0.4, filterCutoff: 800  },
  6:  { droneFreq: 66,  droneGain: 0.15, organGain: 0.07, shimmerGain: 0.02,  shimmerFreq: 784, pulseRate: 0.8, filterCutoff: 900  },
  7:  { droneFreq: 60,  droneGain: 0.22, organGain: 0.03, shimmerGain: 0.005, shimmerFreq: 392, pulseRate: 0.2, filterCutoff: 300  },

  8:  { droneFreq: 56,  droneGain: 0.24, organGain: 0.08, shimmerGain: 0.025, shimmerFreq: 880, pulseRate: 1.0, filterCutoff: 1000 },
  9:  { droneFreq: 54,  droneGain: 0.26, organGain: 0.10, shimmerGain: 0.030, shimmerFreq: 987, pulseRate: 1.2, filterCutoff: 1200 },
  10: { droneFreq: 50,  droneGain: 0.28, organGain: 0.08, shimmerGain: 0.020, shimmerFreq: 523, pulseRate: 0.5, filterCutoff: 600  },
  11: { droneFreq: 58,  droneGain: 0.20, organGain: 0.09, shimmerGain: 0.028, shimmerFreq: 1046,pulseRate: 1.1, filterCutoff: 1100 },
  16: { droneFreq: 66,  droneGain: 0.18, organGain: 0.07, shimmerGain: 0.022, shimmerFreq: 740, pulseRate: 0.7, filterCutoff: 850  },
  17: { droneFreq: 62,  droneGain: 0.20, organGain: 0.06, shimmerGain: 0.018, shimmerFreq: 660, pulseRate: 0.6, filterCutoff: 750  },
  18: { droneFreq: 56,  droneGain: 0.22, organGain: 0.09, shimmerGain: 0.025, shimmerFreq: 880, pulseRate: 0.9, filterCutoff: 950  },
  19: { droneFreq: 52,  droneGain: 0.25, organGain: 0.10, shimmerGain: 0.030, shimmerFreq: 1100,pulseRate: 1.3, filterCutoff: 1300 },
  20: { droneFreq: 44,  droneGain: 0.30, organGain: 0.12, shimmerGain: 0.035, shimmerFreq: 1200,pulseRate: 1.5, filterCutoff: 1500 },
  21: { droneFreq: 52,  droneGain: 0.32, organGain: 0.11, shimmerGain: 0.032, shimmerFreq: 1320,pulseRate: 1.4, filterCutoff: 1400 },

  12: { droneFreq: 40,  droneGain: 0.08, organGain: 0.01, shimmerGain: 0.002, shimmerFreq: 220, pulseRate: 0.1, filterCutoff: 200  }, // classical — near silence
  13: { droneFreq: 88,  droneGain: 0.18, organGain: 0.10, shimmerGain: 0.030, shimmerFreq: 1046,pulseRate: 0.6, filterCutoff: 1200 }, // extended framework — triumphant
  14: { droneFreq: 110,  droneGain: 0.10, organGain: 0.06, shimmerGain: 0.040, shimmerFreq: 1318,pulseRate: 0.3, filterCutoff: 2000 }, // unitarity — airy, open
  15: { droneFreq: 60,  droneGain: 0.20, organGain: 0.04, shimmerGain: 0.008, shimmerFreq: 440, pulseRate: 0.0, filterCutoff: 350  }, // remnant — frozen, still
  22: { droneFreq: 100,  droneGain: 0.14, organGain: 0.08, shimmerGain: 0.035, shimmerFreq: 1174,pulseRate: 0.4, filterCutoff: 1600 }, // boundary — infinite
  23: { droneFreq: 96,  droneGain: 0.16, organGain: 0.09, shimmerGain: 0.038, shimmerFreq: 1244,pulseRate: 0.5, filterCutoff: 1800 }, // new universe — wonder
};

const DEFAULT_CONFIG: SceneAudioConfig = SCENE_AUDIO[1];

class AudioEngine {
  private ctx: AudioContext | null = null;

  private drone1: OscillatorNode | null = null;
  private drone2: OscillatorNode | null = null;
  private organ1: OscillatorNode | null = null;
  private organ2: OscillatorNode | null = null;
  private shimmer: OscillatorNode | null = null;

  private drone1Gain: GainNode | null = null;
  private drone2Gain: GainNode | null = null;
  private organGain: GainNode | null = null;
  private shimmerGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private shimmerFilter: BiquadFilterNode | null = null;

  private muted = false;
  private started = false;
  private currentScene = 1;
  private lerpInterval: number | null = null;

  start() {
    if (this.started) return;
    this.started = true;

    this.ctx = new AudioContext();
    const ctx = this.ctx;

    // Master gain
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(1.0, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    const cfg = DEFAULT_CONFIG;

    this.drone1 = ctx.createOscillator();
    this.drone1Gain = ctx.createGain();
    this.drone1.type = "sine";
    this.drone1.frequency.setValueAtTime(cfg.droneFreq, ctx.currentTime);
    this.drone1Gain.gain.setValueAtTime(0, ctx.currentTime);
    this.drone1Gain.gain.linearRampToValueAtTime(cfg.droneGain, ctx.currentTime + 4);
    this.drone1.connect(this.drone1Gain);
    this.drone1Gain.connect(this.masterGain);
    this.drone1.start();

    this.drone2 = ctx.createOscillator();
    this.drone2Gain = ctx.createGain();
    this.drone2.type = "sine";
    this.drone2.frequency.setValueAtTime(cfg.droneFreq * 2.01, ctx.currentTime);
    this.drone2Gain.gain.setValueAtTime(0, ctx.currentTime);
    this.drone2Gain.gain.linearRampToValueAtTime(cfg.droneGain * 0.5, ctx.currentTime + 5);
    this.drone2.connect(this.drone2Gain);
    this.drone2Gain.connect(this.masterGain);
    this.drone2.start();

    this.organ1 = ctx.createOscillator();
    this.organGain = ctx.createGain();
    this.organ1.type = "triangle";
    this.organ1.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
    this.organGain.gain.setValueAtTime(0, ctx.currentTime);
    this.organGain.gain.linearRampToValueAtTime(cfg.organGain, ctx.currentTime + 6);
    this.organ1.connect(this.organGain);
    this.organGain.connect(this.masterGain);
    this.organ1.start();

    this.organ2 = ctx.createOscillator();
    this.organ2.type = "triangle";
    this.organ2.frequency.setValueAtTime(196.0, ctx.currentTime); // G3
    this.organ2.connect(this.organGain);
    this.organ2.start();

    this.shimmer = ctx.createOscillator();
    const presence = this.ctx.createOscillator();
    const presenceGain = this.ctx.createGain();
    presence.type = "triangle";
    presence.frequency.setValueAtTime(220, ctx.currentTime);
    presenceGain.gain.setValueAtTime(0, ctx.currentTime);
    presenceGain.gain.linearRampToValueAtTime(0.06,               ctx.currentTime + 3);
    presence.connect(presenceGain);
    presenceGain.connect(this.masterGain);
    presence.start();
    this.shimmerGain = ctx.createGain();
    this.shimmerFilter = ctx.createBiquadFilter();
    this.shimmer.type = "sawtooth";
    this.shimmer.frequency.setValueAtTime(cfg.shimmerFreq, ctx.currentTime);
    this.shimmerFilter.type = "lowpass";
    this.shimmerFilter.frequency.setValueAtTime(cfg.filterCutoff, ctx.currentTime);
    this.shimmerGain.gain.setValueAtTime(0, ctx.currentTime);
    this.shimmerGain.gain.linearRampToValueAtTime(cfg.shimmerGain, ctx.currentTime + 8);
    this.shimmer.connect(this.shimmerFilter);
    this.shimmerFilter.connect(this.shimmerGain);
    this.shimmerGain.connect(this.masterGain);
    this.shimmer.start();

    (window as any).__audioEngine = this;

    this.lerpInterval = window.setInterval(() => this.lerpToTarget(), 100);
  }

  private lerpToTarget() {
    if (!this.ctx || !this.started) return;
    const cfg = SCENE_AUDIO[this.currentScene] ?? DEFAULT_CONFIG;
    const now = this.ctx.currentTime;
    const t = 0.1;

    this.drone1?.frequency.linearRampToValueAtTime(cfg.droneFreq, now + t);
    this.drone2?.frequency.linearRampToValueAtTime(cfg.droneFreq * 2.01, now + t);
    this.drone1Gain?.gain.linearRampToValueAtTime(this.muted ? 0 : cfg.droneGain, now + t);
    this.drone2Gain?.gain.linearRampToValueAtTime(this.muted ? 0 : cfg.droneGain * 0.5, now + t);
    this.organGain?.gain.linearRampToValueAtTime(this.muted ? 0 : cfg.organGain, now + t);
    this.shimmer?.frequency.linearRampToValueAtTime(cfg.shimmerFreq, now + t);
    this.shimmerGain?.gain.linearRampToValueAtTime(this.muted ? 0 : cfg.shimmerGain, now + t);
    this.shimmerFilter?.frequency.linearRampToValueAtTime(cfg.filterCutoff, now + t);
  }

  setScene(sceneId: number) {
    this.currentScene = sceneId;
  }

  toggleMute() {
    this.muted = !this.muted;
    this.lerpToTarget();
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  isStarted() {
    return this.started;
  }
}

export const audioEngine = new AudioEngine();