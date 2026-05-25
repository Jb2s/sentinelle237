import { useEffect, useRef, useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL as string;

export type NotificationEvent =
  | { type: "connected";     message: string; userId: string; timestamp: string }
  | { type: "badge";         non_lues: number }
  | { type: "nouvel_article"; id_alerte: string; titre: string; source: string; url: string; vignette?: string; created_at: string }
  | { type: "note_generee";  id_alerte: string; titre: string; id_note: string; created_at: string };

type State = {
  badge:    number;
  events:   NotificationEvent[];
  connected: boolean;
};

export function useNotifications() {
  const [state, setState] = useState<State>({
    badge:     0,
    events:    [],
    connected: false,
  });

  const esRef      = useRef<EventSource | null>(null);
  const retryRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCount = useRef(0);

  const connect = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // EventSource ne supporte pas les headers custom — token en query param
    const url = `${API_URL}/api/notifications/stream?token=${encodeURIComponent(token)}`;
    const es  = new EventSource(url, { withCredentials: true });
    esRef.current = es;

    es.addEventListener("connected", (e) => {
      retryCount.current = 0;
      setState((prev) => ({ ...prev, connected: true }));
    });

    es.addEventListener("badge", (e) => {
      try {
        const data = JSON.parse(e.data);
        setState((prev) => ({ ...prev, badge: data.non_lues ?? 0 }));
      } catch {}
    });

    es.addEventListener("nouvel_article", (e) => {
      try {
        const data = JSON.parse(e.data);
        setState((prev) => ({
          ...prev,
          badge:  prev.badge + 1,
          events: [{ type: "nouvel_article", ...data }, ...prev.events].slice(0, 50),
        }));
      } catch {}
    });

    es.addEventListener("note_generee", (e) => {
      try {
        const data = JSON.parse(e.data);
        setState((prev) => ({
          ...prev,
          badge:  prev.badge + 1,
          events: [{ type: "note_generee", ...data }, ...prev.events].slice(0, 50),
        }));
      } catch {}
    });

    es.onerror = () => {
      es.close();
      setState((prev) => ({ ...prev, connected: false }));

      // Reconnexion exponentielle — max 60s
      const delay = Math.min(1_000 * 2 ** retryCount.current, 60_000);
      retryCount.current++;
      retryRef.current = setTimeout(connect, delay);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [connect]);

  const resetBadge = useCallback(() => {
    setState((prev) => ({ ...prev, badge: 0 }));
  }, []);

  return { ...state, resetBadge };
}
