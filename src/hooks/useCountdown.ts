import { useState, useEffect, useRef, useCallback } from "react";

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [pulled, setPulled] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pulled || seconds <= 0) return;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pulled, seconds <= 0]);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const formatted = h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;

  const pullEarly = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSeconds(0);
    setPulled(true);
  }, []);

  return { seconds, formatted, pulled, pullEarly };
}
