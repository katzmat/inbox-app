import { useEffect } from "react";
import { useSessionStore } from "../stores/session";
import { useBriefingStore } from "../stores/briefing";
import type {
  BriefingStats,
  Briefing,
  BriefingEmail,
} from "../data/briefing";

type ConnectionState = "loading" | "disconnected" | "connected";

/**
 * Orchestration hook — bridges the Zustand stores into the shape
 * that MorningBrief.tsx and InboxScreen.tsx already expect.
 */
export function useBriefingData() {
  const sessionStatus = useSessionStore((s) => s.status);
  const userEmail = useSessionStore((s) => s.userEmail);

  const loading = useBriefingStore((s) => s.loading);
  const response = useBriefingStore((s) => s.response);
  const fetchBriefing = useBriefingStore((s) => s.fetchBriefing);
  const getResponse = useBriefingStore((s) => s.getResponse);
  const getAllEmails = useBriefingStore((s) => s.getAllEmails);
  const getStats = useBriefingStore((s) => s.getStats);

  // Fetch briefing when session connects
  useEffect(() => {
    if (sessionStatus === "connected" && !response && !loading) {
      fetchBriefing();
    }
  }, [sessionStatus, response, loading]);

  // Map to the connection state shape screens expect
  const connState: ConnectionState =
    sessionStatus === "loading" || loading
      ? "loading"
      : sessionStatus === "disconnected"
      ? "disconnected"
      : "connected";

  const r = getResponse();
  const stats: BriefingStats = {
    ...getStats(),
    priority: r.summary.needsAttention,
    uncertain: r.summary.glance,
  };

  const allEmails: BriefingEmail[] = getAllEmails();

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
    priority: r.sections.needsAttention,
    uncertain: Object.values(r.sections.glance).flat(),
    low: r.sections.low,
  };

  return {
    connState,
    userEmail,
    profileStatus: r.profileStatus,
    sections: r.sections,
    stats,
    briefing,
    tiers,
  };
}
