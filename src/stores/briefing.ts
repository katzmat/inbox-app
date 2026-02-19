import { create } from "zustand";
import {
  mockBriefingResponse,
  type BriefingResponse,
  type BriefingEmail,
  type BriefingStats,
} from "../data/briefing";

function getApiBase(): string {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const api = params.get("api");
    if (api) return api;
    if (window.location.pathname.startsWith("/app")) {
      return window.location.origin;
    }
  }
  return "http://localhost:3000";
}

const API_BASE = getApiBase();

type BriefingState = {
  /** Raw response from /api/briefing */
  response: BriefingResponse | null;
  /** Loading state for fetch */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;

  /** Fetch briefing from backend */
  fetchBriefing: () => Promise<void>;
  /** Clear briefing (on disconnect) */
  clear: () => void;

  // ── Derived selectors ──
  /** Get the active response (real data, or mock fallback) */
  getResponse: () => BriefingResponse;
  /** Flat list of all emails across tiers */
  getAllEmails: () => BriefingEmail[];
  /** Summary stats */
  getStats: () => BriefingStats;
};

export const useBriefingStore = create<BriefingState>((set, get) => ({
  response: null,
  loading: false,
  error: null,

  fetchBriefing: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/briefing?maxResults=50`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data: BriefingResponse = await res.json();
      set({ response: data, loading: false });
    } catch (err) {
      console.error("[briefingStore] fetch error:", err);
      set({ loading: false, error: String(err) });
    }
  },

  clear: () => set({ response: null, loading: false, error: null }),

  getResponse: () => {
    const { response } = get();
    return (
      response ?? mockBriefingResponse
    );
  },

  getAllEmails: () => {
    const r = get().getResponse();
    return [
      ...r.sections.needsAttention,
      ...Object.values(r.sections.glance).flat(),
      ...r.sections.low,
    ];
  },

  getStats: () => {
    const r = get().getResponse();
    return {
      needsAttention: r.summary.needsAttention,
      glance: r.summary.glance,
      low: r.summary.low,
      total: r.summary.total,
    };
  },
}));
