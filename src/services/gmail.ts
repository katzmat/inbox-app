// Gmail API client — talks to the Express backend at :3000

const API_BASE = "http://localhost:3000";

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
};

export type SessionInfo = {
  connected: boolean;
  userEmail: string | null;
};

export async function checkSession(): Promise<SessionInfo> {
  const res = await fetch(`${API_BASE}/api/session`, {
    credentials: "include",
  });
  if (!res.ok) return { connected: false, userEmail: null };
  const data = await res.json();
  return { connected: !!data.connected, userEmail: data.userEmail ?? null };
}

export function getAuthUrl(): string {
  return `${API_BASE}/auth/google?redirect=${encodeURIComponent("http://localhost:8083")}`;
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
