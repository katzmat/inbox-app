// @ts-nocheck
import { useState, useCallback } from "react";
import type { BriefingEmail } from "../data/briefing";

export function usePinnedEmails() {
  const [pinned, setPinned] = useState<BriefingEmail[]>([]);

  const isPinned = useCallback(
    (id: number) => pinned.some((e) => e.id === id),
    [pinned]
  );

  const togglePin = useCallback((email: BriefingEmail) => {
    setPinned((prev) =>
      prev.some((e) => e.id === email.id)
        ? prev.filter((e) => e.id !== email.id)
        : [...prev, email]
    );
  }, []);

  const removePin = useCallback((id: number) => {
    setPinned((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { pinned, isPinned, togglePin, removePin };
}
