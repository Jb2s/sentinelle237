import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, FileText, Rss, Loader2, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationsApi, type Alerte } from "@/api/notifications.api";

function formatDate(iso: string): string {
  try {
    const d     = new Date(iso);
    const diffH = Math.floor((Date.now() - d.getTime()) / 3_600_000);
    if (diffH < 1)  return "À l'instant";
    if (diffH < 24) return `Il y a ${diffH}h`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  } catch { return iso; }
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

function AlerteRow({
  alerte,
  onRead,
}: {
  alerte: Alerte;
  onRead: (id: string) => void;
}) {
  const isUnread = alerte.statut_envoi === false || alerte.statut_envoi === "false";
  const isNote   = alerte.type_alerte === "note_generee";
  const Icon     = isNote ? FileText : Rss;
  const url      = alerte.article_url ?? null;

  const handleClick = () => {
    if (isUnread) onRead(alerte.id_alerte);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors",
        isUnread
          ? "bg-blue-50 hover:bg-blue-100"
          : "hover:bg-gray-50",
        url ? "cursor-pointer" : "cursor-default"
      )}
      onClick={handleClick}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
        isNote
          ? "bg-violet-100 text-violet-600"
          : "bg-blue-100 text-blue-600"
      )}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "text-sm leading-snug text-gray-900 hover:text-blue-600 transition-colors group flex items-start gap-1",
              isUnread && "font-semibold"
            )}
          >
            <span className="line-clamp-2">
              {alerte.article_titre ?? "Nouvel article"}
            </span>
            <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity" />
          </a>
        ) : (
          <p className={cn(
            "text-sm leading-snug text-gray-900 line-clamp-2",
            isUnread && "font-semibold"
          )}>
            {alerte.article_titre ?? (isNote ? "Note de synthèse générée" : "Nouvel article")}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-0.5">
          {formatDate(alerte.created_at)}
        </p>
      </div>

      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
      )}
    </div>
  );
}

export function NotificationPanel() {
  const { badge, connected, resetBadge } = useNotifications();
  const prevBadge = useRef(0);

  const [open,    setOpen]    = useState(false);
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [nonLues, setNonLues] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef  = useRef<HTMLDivElement>(null);

  // Son + badge
  useEffect(() => {
    if (badge > prevBadge.current) playNotificationSound();
    prevBadge.current = badge;
    setNonLues(badge);
  }, [badge]);

  // Fermer en cliquant dehors
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const loadAlertes = async () => {
    setLoading(true);
    try {
      const res = await notificationsApi.list({ limit: 30 });
      setAlertes(res.alertes ?? []);
      setNonLues(res.non_lues ?? 0);
    } catch {}
    finally { setLoading(false); }
  };

  const handleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) loadAlertes();
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setAlertes((prev) => prev.map((a) => ({ ...a, statut_envoi: "lu" })));
      setNonLues(0);
      resetBadge();
    } catch {}
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await notificationsApi.markOneRead(id);
      setAlertes((prev) =>
        prev.map((a) => a.id_alerte === id ? { ...a, statut_envoi: "lu" } : a)
      );
      setNonLues((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bouton cloche */}
      <button
        onClick={handleOpen}
        title="Notifications"
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center transition-all relative",
          open
            ? "bg-white/20 text-white"
            : "text-white/80 hover:bg-white/15 hover:text-white"
        )}
      >
        <Bell className="w-4 h-4" />

        {nonLues > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center leading-none">
            {nonLues > 99 ? "99+" : nonLues}
          </span>
        )}

        <span className={cn(
          "absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full border-2 border-transparent",
          connected ? "bg-emerald-400" : "bg-gray-400"
        )} />
      </button>

      {/* Panneau — fixed pour éviter le clipping du rail */}
      {open && (
        <div
          className="fixed z-[200] w-80 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            bottom:  "3.5rem",
            left:    "3.75rem",
            backgroundColor: "white",
            border:  "1px solid #e5e7eb",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
              {nonLues > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-600 text-white">
                  {nonLues}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {nonLues > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Tout marquer comme lu"
                  className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="max-h-[420px] overflow-y-auto bg-white">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            ) : alertes.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Aucune notification
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {alertes.map((a) => (
                  <AlerteRow key={a.id_alerte} alerte={a} onRead={handleMarkOneRead} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {alertes.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 text-center bg-gray-50">
              <p className="text-xs text-gray-500">
                {alertes.length} notification{alertes.length > 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
