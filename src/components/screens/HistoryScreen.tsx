'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MessageCircle, Trash2, Clock, ChevronRight, History } from 'lucide-react';
import type { StoredConversation } from '@/hooks/useChat';
import type { AppTab } from '@/components/organisms/BottomNav';

// ── Helpers ───────────────────────────────────────────────────────────────────
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 1)  return 'ahora mismo';
  if (m < 60) return `hace ${m}m`;
  if (h < 24) return `hace ${h}h`;
  if (d === 1) return 'ayer';
  return `hace ${d}d`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-8 text-center">
      <div
        className="w-14 h-14 rounded-[18px] flex items-center justify-center"
        style={{ background: 'rgba(207,20,43,0.08)', border: '1px solid rgba(207,20,43,0.14)' }}
      >
        <History className="w-6 h-6 text-[#CF142B]/60" />
      </div>
      <p className="text-sm font-semibold" style={{ color: 'var(--app-text-2)' }}>
        Sin historial aún
      </p>
      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--app-text-3)' }}>
        Tus conversaciones con Valentina aparecerán aquí cuando inicies una nueva sesión.
      </p>
    </div>
  );
}

interface ConvCardProps {
  conv:     StoredConversation;
  onLoad:   (id: string) => void;
  onDelete: (id: string) => void;
  delay:    number;
}

function ConvCard({ conv, onLoad, onDelete, delay }: ConvCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 16, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'power3.out', delay }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      className="ios-glass rounded-[20px] overflow-hidden"
      style={{ opacity: 0 }}
    >
      <button
        onClick={() => onLoad(conv.id)}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] active:scale-[0.99] transition-all duration-150 cursor-pointer"
      >
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'rgba(207,20,43,0.10)', border: '1px solid rgba(207,20,43,0.18)' }}
        >
          <MessageCircle className="w-4 h-4 text-[#CF142B]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className="text-[13px] font-semibold leading-snug truncate"
            style={{ color: 'var(--app-text)' }}
          >
            {conv.title}
          </p>
          <p
            className="text-[11px] mt-0.5 leading-relaxed line-clamp-2"
            style={{ color: 'var(--app-text-3)' }}
          >
            {conv.preview}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <Clock className="w-3 h-3 shrink-0" style={{ color: 'var(--app-text-3)' }} />
            <span className="text-[10px]" style={{ color: 'var(--app-text-3)' }}>
              {relativeTime(conv.updatedAt)}
            </span>
            <span className="text-[10px] opacity-40" style={{ color: 'var(--app-text-3)' }}>·</span>
            <span className="text-[10px]" style={{ color: 'var(--app-text-3)' }}>
              {conv.msgCount} mensajes
            </span>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 shrink-0 mt-1" style={{ color: 'var(--app-text-3)' }} />
      </button>

      {/* Delete strip */}
      <div
        className="flex items-center justify-end px-4 py-2 border-t"
        style={{ borderColor: 'var(--app-glass-border)' }}
      >
        <button
          onClick={() => onDelete(conv.id)}
          className="flex items-center gap-1.5 text-[11px] text-red-400/60 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eliminar
        </button>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
interface HistoryScreenProps {
  history:          StoredConversation[];
  onLoadConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNavigate:       (tab: AppTab) => void;
}

export default function HistoryScreen({
  history,
  onLoadConversation,
  onDeleteConversation,
  onNavigate,
}: HistoryScreenProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    );
  }, []);

  const handleLoad = (id: string) => {
    onLoadConversation(id);
    onNavigate('chat');
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div ref={headerRef} className="px-5 pt-5 pb-3 shrink-0" style={{ opacity: 0 }}>
        <h1
          className="text-[1.65rem] font-black leading-[1.15] tracking-tight"
          style={{ color: 'var(--app-text)' }}
        >
          Historial
        </h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--app-text-3)' }}>
          {history.length > 0
            ? `${history.length} conversación${history.length > 1 ? 'es' : ''} guardada${history.length > 1 ? 's' : ''}`
            : 'Sin conversaciones previas'}
        </p>
      </div>

      {/* Content */}
      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-28 flex flex-col gap-2.5">
          {history.map((conv, i) => (
            <ConvCard
              key={conv.id}
              conv={conv}
              onLoad={handleLoad}
              onDelete={onDeleteConversation}
              delay={i * 0.05}
            />
          ))}
        </div>
      )}
    </div>
  );
}
