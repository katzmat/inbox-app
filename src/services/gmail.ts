// Email API client — talks to the Express backend
// In local dev: http://localhost:3000
// With ngrok: pass ?api=https://XXXX.ngrok-free.app in the frontend URL

function getApiBase(): string {
  if (typeof window !== "undefined") {
    // Explicit override via query param
    const params = new URLSearchParams(window.location.search);
    const api = params.get("api");
    if (api) return api;
    // When served from the backend (e.g. /app on ngrok), use same origin
    if (window.location.pathname.startsWith("/app")) {
      return window.location.origin;
    }
  }
  return "http://localhost:3000";
}

const API_BASE = getApiBase();

export type GmailMessage = {
  id: string;
  threadId: string;
  snippet: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  labelIds: string[];
  isUnread: boolean;
  isStarred: boolean;
  webLink?: string;
};

export type SessionInfo = {
  connected: boolean;
  userEmail: string | null;
  provider?: string;
};

export async function checkSession(): Promise<SessionInfo> {
  const res = await fetch(`${API_BASE}/api/session`, {
    credentials: "include",
  });
  if (!res.ok) return { connected: false, userEmail: null };
  const data = await res.json();
  return {
    connected: !!data.connected,
    userEmail: data.userEmail ?? null,
    provider: data.provider ?? undefined,
  };
}

export async function loginYahooToken(token: string): Promise<{ success: boolean; email?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/auth/yahoo-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function loginGmailPassword(
  email: string,
  appPassword: string
): Promise<{ success: boolean; email?: string; error?: string }> {
  const res = await fetch(`${API_BASE}/auth/gmail-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, appPassword }),
  });
  return res.json();
}

export function getYahooOAuthUrl(): string {
  const redirect = typeof window !== "undefined" ? window.location.href : "http://localhost:8083";
  return `${API_BASE}/auth/yahoo?redirect=${encodeURIComponent(redirect)}`;
}

export async function disconnect(): Promise<void> {
  await fetch(`${API_BASE}/auth/disconnect`, {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchEmails(
  maxResults = 30
): Promise<GmailMessage[]> {
  const res = await fetch(
    `${API_BASE}/api/emails?maxResults=${maxResults}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error(`fetchEmails failed: ${res.status}`);
  const data = await res.json();
  return data.messages ?? [];
}
