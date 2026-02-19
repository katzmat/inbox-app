import { create } from "zustand";
import { checkSession, disconnect as apiDisconnect } from "../services/gmail";

type SessionState = {
  status: "loading" | "connected" | "disconnected";
  userEmail: string | null;
  provider: string | null;

  /** Check session on app start */
  init: () => Promise<void>;
  /** Mark as connected after login */
  onLoginSuccess: () => Promise<void>;
  /** Disconnect and clear state */
  disconnect: () => Promise<void>;
};

export const useSessionStore = create<SessionState>((set) => ({
  status: "loading",
  userEmail: null,
  provider: null,

  init: async () => {
    try {
      const s = await checkSession();
      set({
        status: s.connected ? "connected" : "disconnected",
        userEmail: s.userEmail ?? null,
        provider: s.provider ?? null,
      });
    } catch {
      set({ status: "disconnected", userEmail: null, provider: null });
    }
  },

  onLoginSuccess: async () => {
    set({ status: "loading" });
    try {
      const s = await checkSession();
      set({
        status: s.connected ? "connected" : "disconnected",
        userEmail: s.userEmail ?? null,
        provider: s.provider ?? null,
      });
    } catch {
      set({ status: "disconnected" });
    }
  },

  disconnect: async () => {
    await apiDisconnect();
    set({ status: "disconnected", userEmail: null, provider: null });
  },
}));
