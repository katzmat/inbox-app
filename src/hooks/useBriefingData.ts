import { useState, useEffect, useCallback } from "react";
import {
  morningBriefing,
  emailsByTier,
  briefingStats,
  createBriefingFromGmail,
  type Briefing,
  type BriefingEmail,
  type BriefingTier,
  type BriefingStats,
} from "../data/briefing";
import { checkSession, fetchEmails, disconnect } from "../services/gmail";
import { classifyEmails } from "../services/classify";

type ConnectionState = "loading" | "disconnected" | "connected";

export function useBriefingData() {
  const [connState, setConnState] = useState<ConnectionState>("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [liveBriefing, setLiveBriefing] = useState<Briefing | null>(null);
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
        const messages = await fetchEmails(30);
        if (cancelled) return;
        const classified = classifyEmails(messages);
        setLiveBriefing(createBriefingFromGmail(classified));
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
    setLiveBriefing(null);
  }, []);

  // Only fall back to mock data when confirmed disconnected
  const activeBriefing =
    connState === "disconnected" && !liveBriefing
      ? morningBriefing
      : liveBriefing;
  const emptyBriefing: Briefing = {
    id: "empty",
    label: "",
    time: "",
    isActive: false,
    isFuture: false,
    emails: [],
  };
  const briefing = activeBriefing ?? emptyBriefing;
  const tiers = emailsByTier(briefing);
  const stats = briefingStats(briefing);

  return {
    connState,
    userEmail,
    briefing,
    tiers,
    stats,
    handleLoginSuccess,
    handleDisconnect,
  };
}
