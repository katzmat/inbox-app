import { useState, useEffect, useCallback } from "react";
import {
  mockBriefingResponse,
  type BriefingResponse,
  type BriefingEmail,
  type BriefingStats,
  type Briefing,
} from "../data/briefing";
import { checkSession, disconnect } from "../services/gmail";

type ConnectionState = "loading" | "disconnected" | "connected";

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

async function fetchBriefing(): Promise<BriefingResponse> {
  const res = await fetch(`${API_BASE}/api/briefing?maxResults=50`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`fetchBriefing failed: ${res.status}`);
  return res.json();
}

export function useBriefingData() {
  const [connState, setConnState] = useState<ConnectionState>("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [briefingData, setBriefingData] = useState<BriefingResponse | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await checkSession();
        if (cancelled) return;
        if (!session.connected) {
          setConnState("disconnected");
          return;
        }
        setUserEmail(session.userEmail);
        const data = await fetchBriefing();
        if (cancelled) return;
        setBriefingData(data);
        setConnState("connected");
      } catch (err) {
        console.error("[useBriefingData] fetch error:", err);
        if (!cancelled) setConnState("disconnected");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleLoginSuccess = useCallback(() => {
    setConnState("loading");
    setRefreshKey((k) => k + 1);
  }, []);

  const handleDisconnect = useCallback(async () => {
    await disconnect();
    setConnState("disconnected");
    setUserEmail(null);
    setBriefingData(null);
  }, []);

  // Use mock data when disconnected, real data when connected
  const response: BriefingResponse =
    connState === "disconnected" && !briefingData
      ? mockBriefingResponse
      : briefingData ?? {
          generatedAt: "",
          backend: "empty",
          profileStatus: "none",
          summary: { total: 0, needsAttention: 0, glance: 0, low: 0 },
          sections: { needsAttention: [], glance: {}, low: [] },
        };

  const stats: BriefingStats = {
    needsAttention: response.summary.needsAttention,
    glance: response.summary.glance,
    low: response.summary.low,
    total: response.summary.total,
    priority: response.summary.needsAttention,
    uncertain: response.summary.glance,
  };

  // Legacy: build flat email list + tiers object for inactive screens
  const allEmails: BriefingEmail[] = [
    ...response.sections.needsAttention,
    ...Object.values(response.sections.glance).flat(),
    ...response.sections.low,
  ];

  const briefing: Briefing = {
    id: "live",
    label: "Morning Briefing",
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    isActive: true,
    isFuture: false,
    emails: allEmails,
  };

  const tiers = {
    priority: response.sections.needsAttention,
    uncertain: Object.values(response.sections.glance).flat(),
    low: response.sections.low,
  };

  return {
    connState,
    userEmail,
    profileStatus: response.profileStatus,
    sections: response.sections,
    stats,
    briefing,
    tiers,
    handleLoginSuccess,
    handleDisconnect,
  };
}
