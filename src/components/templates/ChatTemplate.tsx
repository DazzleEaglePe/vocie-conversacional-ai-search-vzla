'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import type { Message, QuickReply } from '@/lib/conversation/types';
import type { BotStatus } from '@/components/atoms/StatusBadge';
import type { OrbStatus } from '@/components/atoms/VoiceOrb';
import MessageList from '@/components/organisms/MessageList';
import InputBar from '@/components/organisms/InputBar';
import QuickReplies from '@/components/molecules/QuickReplies';
import WaveformBars from '@/components/atoms/WaveformBars';
import StatusBadge from '@/components/atoms/StatusBadge';
import DebugPanel from '@/components/molecules/DebugPanel';
import { Shield, Brain } from 'lucide-react';

const VoiceOrb = dynamic(() => import('@/components/atoms/VoiceOrb'), { ssr: false });

interface ChatTemplateProps {
  messages: Message[];
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  status: BotStatus;
  onSend: (text: string) => void;
  onVoiceToggle: () => void;
  quickReplies: QuickReply[];
  onSelectQuickReply: (value: string) => void;
}

export default function ChatTemplate({
  messages, isLoading, isListening, isSpeaking,
  status, onSend, onVoiceToggle, quickReplies, onSelectQuickReply,
}: ChatTemplateProps) {
  const [debugOpen, setDebugOpen] = useState(false);
  const pageRef   = useRef<HTMLDivElement>(null);
  const idleRef   = useRef<HTMLDivElement>(null);
  const chatRef   = useRef<HTMLDivElement>(null);

  // true once user sends first real message
  const isChatMode = messages.length > 1;
  const orbStatus  = status as OrbStatus;

  // Page entrance
  useEffect(() => {
    if (!pageRef.current) return;
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, []);

  // Idle → Chat transition
  useEffect(() => {
    if (!isChatMode) return;
    if (idleRef.current) {
      gsap.to(idleRef.current, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in',
        onComplete: () => { if (idleRef.current) idleRef.current.style.display = 'none'; }
      });
    }
    if (chatRef.current) {
      gsap.fromTo(chatRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.2 }
      );
    }
  }, [isChatMode]);

  return (
    <div
      ref={pageRef}
      className="relative flex flex-col h-svh w-full overflow-hidden text-white font-sans"
      style={{
        opacity: 0,
        background: '#08080A',
      }}
    >
      {/* Radial glow — emanates from orb position */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-all duration-1000"
        style={{
          background: isListening
            ? 'radial-gradient(ellipse 70% 50% at 50% 25%, rgba(207,20,43,0.22) 0%, transparent 65%)'
            : isSpeaking
            ? 'radial-gradient(ellipse 70% 50% at 50% 25%, rgba(239,192,80,0.18) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 60% 45% at 50% 25%, rgba(207,20,43,0.10) 0%, transparent 60%)',
        }}
      />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Mini orb in header — only visible in chat mode */}
          <div
            className="transition-all duration-500 overflow-hidden"
            style={{ width: isChatMode ? 36 : 0, opacity: isChatMode ? 1 : 0 }}
          >
            <VoiceOrb status={orbStatus} size={36} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight">Valentina</span>
              <Shield className="w-3 h-3 text-[#EFC050]" />
            </div>
            {isChatMode && (
              <StatusBadge status={status} className="mt-0.5 scale-90 origin-left" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isChatMode && <StatusBadge status={status} />}
          {/* Debug toggle — only in dev */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => setDebugOpen(v => !v)}
              className="p-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#EFC050]/70 hover:text-[#EFC050] transition-colors"
              aria-label="Consola de diseño"
            >
              <Brain className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* ── IDLE MODE: orb + tagline + quick replies ───────────────────────── */}
      {!isChatMode && (
        <div
          ref={idleRef}
          className="relative z-10 flex flex-col flex-1 items-center justify-center gap-6 px-6 pb-4"
        >
          {/* Orb or waveform */}
          <div className="relative flex items-center justify-center" style={{ height: 260 }}>
            {isListening ? (
              <div className="flex flex-col items-center gap-4">
                <WaveformBars />
                <p className="text-sm text-white/40 tracking-wide">Escuchando...</p>
              </div>
            ) : (
              <VoiceOrb status={orbStatus} size={220} />
            )}
          </div>

          {/* Tagline */}
          {!isListening && (
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight leading-snug">
                ¿En qué puedo<br />
                <span className="text-[#CF142B]">ayudarte</span> hoy?
              </h1>
              <p className="text-xs text-white/35 max-w-[260px]">
                Busca personas, reporta casos o localiza refugios activos
              </p>
            </div>
          )}

          {/* Quick replies */}
          {!isListening && (
            <QuickReplies replies={quickReplies} onSelect={onSelectQuickReply} />
          )}

          {/* Welcome message */}
          {messages.length === 1 && !isListening && (
            <div className="px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.07] max-w-[320px] text-center">
              <p className="text-sm text-white/70 leading-relaxed">{messages[0].content}</p>
            </div>
          )}
        </div>
      )}

      {/* ── CHAT MODE: message list ────────────────────────────────────────── */}
      {isChatMode && (
        <div
          ref={chatRef}
          className="relative z-10 flex flex-col flex-1 min-h-0"
          style={{ opacity: 0 }}
        >
          {/* Listening overlay */}
          {isListening && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#08080A]/80 backdrop-blur-sm">
              <WaveformBars />
              <p className="text-sm text-white/50 tracking-wide">Escuchando...</p>
            </div>
          )}
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
      )}

      {/* ── INPUT BAR ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 shrink-0 pb-4">
        <InputBar
          onSend={onSend}
          isLoading={isLoading}
          isListening={isListening}
          onVoiceToggle={onVoiceToggle}
        />
      </div>

      {/* ── DEBUG DRAWER (dev only) ────────────────────────────────────────── */}
      {debugOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 shadow-2xl animate-slide-left">
          <DebugPanel messages={messages} isSpeaking={isSpeaking} isListening={isListening} />
          <button
            onClick={() => setDebugOpen(false)}
            className="absolute top-4 left-[-36px] w-9 h-9 flex items-center justify-center rounded-l-lg bg-[#1A1A1A] border border-r-0 border-white/[0.08] text-white/40 hover:text-white transition-colors"
            aria-label="Cerrar consola"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
