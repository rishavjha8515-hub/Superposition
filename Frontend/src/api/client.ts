const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface SceneChoice {
    id: string;
    label: string;
    next_scene: string;
}

export interface SceneData {
    id: number;
    label: string;
    act?: number;
    text: string;
    physics_callouts: Record<string, string>;
    choices: SceneChoice[];
    ending?: boolean;
    ending_id?: string; 
}

export interface PhysicsData {
    kappa: number,
    L: number;
    C_Kappa: number;
    T_tilde: number;
    T_hawking: number;
    nu2: number;
    q: number;
    alpha: number;
}

interface SessionResponse {
    session_id: string;
    scene: SceneData;
}

interface ChooseResponse {
    session_id: string;
    scene: SceneData;
    history: number[];
    ended: boolean;
    ending_id: string | null;
    physics: PhysicsData;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-type": "application/json" },
        ...options,
    });

    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const body = await res.json();
            if (body?.error) message = body.error;
        } catch {
        
        }
        throw new Error(message);
    }

    return res.json() as Promise<T>;
}

export function createSession(): Promise<SessionResponse> {
    return request("/api/session", { method: "POST" })
}

export function getSession(sessionId: string): Promise<ChooseResponse> {
    return request(`/api/session/${sessionId}`, { method: "GET" });
}

export function chooseOption(
    sessionId: string,
    choiceId: string,
    q?: number,
    alpha?: number
): Promise<ChooseResponse> {
    const body: Record<string, unknown> = { choice_id: choiceId };
    if (q !== undefined) body.q = q;
    if (alpha !== undefined) body.alpha = alpha;

    return request(`/api/session/${sessionId}/choose`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function resetSession(sessionId: string): Promise<SessionResponse> {
    return request(`/api/session/${sessionId}/reset`, { method: "POST" });
}

export function getPhysics(q: number, alpha = 0): Promise<PhysicsData> {
    return request("/api/physics", {
        method: "POST",
        body: JSON.stringify({ q, alpha }),
    });
}
