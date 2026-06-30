'use client';

import { useEffect, useRef } from 'react';
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
import { Shield, Brain, ChevronLeft, Camera, Mic, Video, MessageSquare, Volume2, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import DebugPanel from '@/components/molecules/DebugPanel';
import { cn } from '@/lib/utils';

const VoiceOrb = dynamic(() => import('@/components/atoms/VoiceOrb'), { ssr: false });

interface ChatScreenProps {
  messages: Message[];
  isLoading: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  status: BotStatus;
  onSend: (text: string) => void;
  onVoiceToggle: () => void;
  quickReplies: QuickReply[];
  onSelectQuickReply: (value: string) => void;
  onBack: () => void;
  onClearChat: () => void;
}

export default function ChatScreen({
  messages, isLoading, isListening, isSpeaking,
  status, onSend, onVoiceToggle, quickReplies, onSelectQuickReply, onBack, onClearChat,
}: ChatScreenProps) {
  const [debugOpen, setDebugOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'voice' | 'text'>('voice');
  const idleRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const isChatMode = messages.length > 1;
  const orbStatus  = status as OrbStatus;

  // Idle → Chat transition
  useEffect(() => {
    if (!isChatMode) return;
    if (idleRef.current) {
      gsap.to(idleRef.current, {
        opacity: 0, y: -20, duration: 0.3, ease: 'power2.in',
        onComplete: () => { if (idleRef.current) idleRef.current.style.display = 'none'; },
      });
    }
    if (chatRef.current) {
      gsap.fromTo(chatRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out', delay: 0.18 }
      );
    }
  }, [isChatMode]);

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-all duration-1000"
        style={{
          background: isListening
            ? 'radial-gradient(ellipse 70% 45% at 50% 20%, rgba(207,20,43,0.22) 0%, transparent 65%)'
            : isSpeaking
            ? 'radial-gradient(ellipse 70% 45% at 50% 20%, rgba(239,192,80,0.16) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(207,20,43,0.09) 0%, transparent 60%)',
        }}
      />

      {/* ── Header ───────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors active:scale-95 cursor-pointer md:hidden"
            aria-label="Volver"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            className="transition-all duration-500 overflow-hidden"
            style={{ width: viewMode === 'text' ? 34 : 0, opacity: viewMode === 'text' ? 1 : 0 }}
          >
            <VoiceOrb status={orbStatus} size={34} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold">Valentina</span>
              <Shield className="w-3 h-3 text-[#EFC050]" />
            </div>
            {viewMode === 'text' && <StatusBadge status={status} className="mt-0.5 scale-90 origin-left" />}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'voice' && <StatusBadge status={status} />}
          
          {/* Nueva conversación */}
          {messages.length > 1 && (
            <button
              onClick={onClearChat}
              className="p-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-colors cursor-pointer"
              title="Nueva conversación"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Voice/Text View Mode Toggle */}
          <button
            onClick={() => setViewMode(m => m === 'voice' ? 'text' : 'voice')}
            className="p-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={viewMode === 'voice' ? 'Ver chat de texto' : 'Ver asistente de voz'}
          >
            {viewMode === 'voice' ? (
              <MessageSquare className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => setDebugOpen(v => !v)}
              className="p-2 rounded-full bg-white/[0.06] border border-white/[0.07] text-[#EFC050]/60 hover:text-[#EFC050] transition-colors cursor-pointer"
              aria-label="Consola"
            >
              <Brain className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* ── VOICE MODE: 3D Orb Card + Active Turn Bubbles (iOS Glassmorphism) ── */}
      {viewMode === 'voice' && (
        <div className="flex flex-col flex-1 min-h-0 w-full max-w-4xl mx-auto px-5 justify-between pb-4 overflow-y-auto no-scrollbar">
          <div className="flex flex-col lg:flex-row items-center lg:justify-center gap-6 lg:gap-12 w-full mt-2">
            {/* Left Column: Voice Orb Blue Card */}
            <div className="w-full lg:w-[45%] max-w-sm lg:max-w-none">
              {/* Card Container for the Voice Orb — Venezuelan palette */}
              <div
                className="w-full rounded-[32px] p-5 flex flex-col items-center justify-between relative overflow-hidden"
                style={{
                  height: 300,
                  background: 'var(--orb-card-bg)',
                  border: '1px solid var(--orb-card-border)',
                  boxShadow: 'var(--orb-card-shadow)',
                }}
              >
                {/* Radial red glow at top */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_10%,rgba(207,20,43,0.18),transparent_65%)] pointer-events-none" />
                {/* Gold shimmer at bottom-right */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_90%,rgba(239,192,80,0.08),transparent_50%)] pointer-events-none" />

                {/* Header info inside card */}
                <div className="flex justify-between items-center w-full z-10 px-1">
                  <span className="text-[10px] font-bold tracking-widest text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
                    Canal de voz activo
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-white/60 font-semibold tracking-wider">
                      {isSpeaking ? 'Hablando' : isListening ? 'Escuchando' : 'Conectado'}
                    </span>
                  </div>
                </div>

                {/* Orb / wave area */}
                <div className="flex items-center justify-center z-10" style={{ height: 150 }}>
                  <VoiceOrb status={isSpeaking ? 'speaking' : isListening ? 'typing' : 'online'} size={135} />
                </div>

                {/* Bottom floating micro actions */}
                <div className="flex items-center justify-between w-full px-4 z-10">
                  <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
                    title="Cámara (Demo)"
                    onClick={() => alert('La cámara es una función de demostración.')}
                  >
                    <Camera className="w-4 h-4 text-white/80" />
                  </button>

                  <button
                    type="button"
                    onClick={onVoiceToggle}
                    className={cn(
                      'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 cursor-pointer',
                      isListening
                        ? 'bg-[#CF142B] text-white animate-pulse shadow-[0_8px_24px_rgba(207,20,43,0.45)]'
                        : 'bg-white text-[#CF142B] hover:scale-105 shadow-[0_8px_24px_rgba(255,255,255,0.20)]'
                    )}
                    title={isListening ? 'Silenciar' : 'Hablar'}
                  >
                    <Mic className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
                    title="Video (Demo)"
                    onClick={() => alert('El video es una función de demostración.')}
                  >
                    <Video className="w-4 h-4 text-white/80" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Transcript / Active Turn */}
            <div className="w-full lg:w-[55%] flex flex-col justify-center gap-4">
              <div className="space-y-3 w-full">
                {/* User last message bubble */}
                {(() => {
                  const userMessages = messages.filter(m => m.role === 'user');
                  const lastUserMsg = userMessages[userMessages.length - 1];
                  if (!lastUserMsg) return null;
                  return (
                    <div className="flex flex-col items-end w-full animate-fade-in">
                      <span className="text-[9px] text-white/30 tracking-widest font-semibold mb-1 px-1">Tú</span>
                      <div className="backdrop-blur-md rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs max-w-[90%] shadow-md" style={{ background: 'var(--bubble-user-bg)', border: '1px solid var(--bubble-user-border)', color: 'var(--app-text-2)' }}>
                        {lastUserMsg.content}
                      </div>
                    </div>
                  );
                })()}

                {/* Assistant response bubble */}
                {(() => {
                  const assistantMessages = messages.filter(m => m.role === 'assistant');
                  const lastAssistantMsg = assistantMessages[assistantMessages.length - 1] || messages[0];
                  if (!lastAssistantMsg) return null;
                  return (
                    <div className="flex flex-col items-start w-full animate-fade-in">
                      <span className="text-[9px] text-white/30  tracking-widest font-semibold mb-1 px-1">Valentina</span>
                      <div className="backdrop-blur-md rounded-2xl rounded-tl-sm px-4 py-3 text-xs max-w-[90%] shadow-lg leading-relaxed" style={{ background: 'var(--bubble-bot-bg)', border: '1px solid var(--bubble-bot-border)', color: 'var(--bubble-bot-text)' }}>
                        {lastAssistantMsg.content}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Quick replies in voice mode */}
              {!isLoading && !isSpeaking && !isListening && (
                <div className="mt-2 w-full">
                  <QuickReplies replies={quickReplies} onSelect={onSelectQuickReply} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TEXT CHAT MODE: Scrollable Message List ───────── */}
      {viewMode === 'text' && (
        <div ref={chatRef} className="relative z-10 flex flex-col flex-1 min-h-0 w-full max-w-3xl mx-auto" style={{ opacity: 1 }}>
          {isListening && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#08080A]/85 backdrop-blur-sm">
              <WaveformBars />
              <p className="text-xs text-white/40">Escuchando...</p>
            </div>
          )}
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
      )}

      {/* ── Input ─────────────────────────────────────────── */}
      <div className="relative z-10 shrink-0 pb-2 w-full max-w-3xl mx-auto">
        <InputBar onSend={onSend} isLoading={isLoading} isListening={isListening} onVoiceToggle={onVoiceToggle} />
      </div>

      {/* Debug drawer */}
      {debugOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 shadow-2xl animate-slide-left">
          <DebugPanel messages={messages} isSpeaking={isSpeaking} isListening={isListening} />
          <button
            onClick={() => setDebugOpen(false)}
            className="absolute top-4 left-[-36px] w-9 h-9 flex items-center justify-center rounded-l-lg bg-[#1A1A1A] border border-r-0 border-white/[0.08] text-white/40 hover:text-white transition-colors"
          >✕</button>
        </div>
      )}
    </div>
  );
}
