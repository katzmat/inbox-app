import { useState, useEffect } from "react";
import { Platform, Linking } from "react-native";
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
import { checkSession, getAuthUrl, fetchEmails } from "../services/gmail";
import { classifyEmails } from "../services/classify";

type ConnectionState = "loading" | "disconnected" | "connected";

export function useBriefingData() {
  const [connState, setConnState] = useState<ConnectionState>("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [liveBriefing, setLiveBriefing] = useState<Briefing | null>(null);

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
      } catch {
        if (!cancelled) setConnState("disconnected");
      }
    })();
    return () => {
      cancelled = true;
    };
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

  const handleConnectGmail = () => {
    const url = getAuthUrl();
    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      Linking.openURL(url);
    }
  };

  return { connState, userEmail, briefing, tiers, stats, handleConnectGmail };
}
