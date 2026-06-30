'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { useVoice } from '@/hooks/useVoice';
import HomeScreen from '@/components/screens/HomeScreen';
import ChatScreen from '@/components/screens/ChatScreen';
import HistoryScreen from '@/components/screens/HistoryScreen';
import BottomNav, { type AppTab } from '@/components/organisms/BottomNav';
import type { QuickReply } from '@/lib/conversation/types';
import { cn } from '@/lib/utils';
import { Home as HomeIcon, MessageCircle, History } from 'lucide-react';
import ThemeToggle from '@/components/atoms/ThemeToggle';
import OnboardingScreen from '@/components/organisms/OnboardingScreen';

const QUICK_REPLIES: QuickReply[] = [
  { id: 'buscar',   label: 'Buscar persona',        value: 'Quiero buscar a una persona desaparecida.',   icon: '🔍' },
  { id: 'reportar', label: 'Reportar desaparecido', value: 'Quiero reportar a una persona desaparecida.', icon: '📝' },
  { id: 'refugio',  label: 'Encontrar refugio',     value: '¿Dónde puedo encontrar un refugio activo?',   icon: '🏠' },
  { id: 'ayuda',    label: 'Donar / Voluntariado',  value: '¿Cómo puedo ayudar o ser voluntario?',        icon: '🤝' },
];

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [activeTab, setActiveTab]     = useState<AppTab>('home');
  const pendingMessageRef             = useRef<string | null>(null);

  const {
    messages, isLoading, sendMessage, clearChat,
    history, loadConversation, deleteFromHistory,
  } = useChat();

  const { isListening, isSpeaking, startListening, stopListening, speak } = useVoice();

  const status = isLoading ? 'typing' : isSpeaking ? 'speaking' : 'online';

  const handleSend = async (text: string) => {
    const response = await sendMessage(text);
    if (response) speak(response);
  };

  const handleVoiceToggle = () => {
    if (isListening) { stopListening(); return; }
    startListening((transcript) => handleSend(transcript));
  };

  const handleNavigate = (tab: AppTab, prefill?: string) => {
    setActiveTab(tab);
    if (prefill) pendingMessageRef.current = prefill;
  };

  // Load onboarding state on client
  useEffect(() => {
    setIsOnboarded(localStorage.getItem('vozbusca_onboarded') === 'true');
  }, []);

  // Send pending message after tab switch renders
  useEffect(() => {
    if (activeTab === 'chat' && pendingMessageRef.current) {
      const msg = pendingMessageRef.current;
      pendingMessageRef.current = null;
      setTimeout(() => handleSend(msg), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Sidebar nav items
  const SIDEBAR_NAV = [
    { id: 'home'    as AppTab, label: 'Inicio',        Icon: HomeIcon     },
    { id: 'chat'    as AppTab, label: 'Asistente',     Icon: MessageCircle },
    { id: 'history' as AppTab, label: 'Historial',     Icon: History      },
  ];

  return (
    <div
      className="flex flex-row h-svh w-full max-w-6xl mx-auto md:my-6 md:h-[calc(100vh-3rem)] md:rounded-[32px] md:border md:border-[var(--app-glass-border)] md:shadow-[0_32px_80px_rgba(0,0,0,0.55)] overflow-hidden font-sans relative"
      style={{ background: 'var(--app-bg-gradient)', color: 'var(--app-text)' }}
      suppressHydrationWarning
    >
      {/* ── Sidebar (Desktop Only) ──────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-64 border-r border-[var(--app-glass-border)] backdrop-blur-xl shrink-0 justify-between p-6 z-20"
        style={{ background: 'var(--sidebar-bg)' }}
        suppressHydrationWarning
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-black tracking-wider text-sm bg-[linear-gradient(135deg,#FFF_30%,#CF142B_100%)] bg-clip-text text-transparent">
              VOZBUSCA
            </span>
            <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/[0.06]">
              v0.1
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1.5">
            {SIDEBAR_NAV.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => handleNavigate(id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer w-full text-left active:scale-95',
                  activeTab === id
                    ? 'bg-[#CF142B] text-white shadow-[0_4px_12px_rgba(207,20,43,0.35)]'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                {id === 'history' && history.length > 0 && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 font-bold">
                    {history.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[10px] text-white/40 leading-relaxed">
            <p className="font-semibold text-white/60 mb-1">Estado del Sistema</p>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>Canal de Voz: Activo</span>
            </div>
            <p>Conectado a Google Gemini 2.5 Flash & ElevenLabs TTS.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ThemeToggle />
            <span className="text-[10px] text-[var(--app-text-3)]">build4venezuela · 2026</span>
          </div>
        </div>
      </aside>

      {/* ── Content Panel ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-h-0 relative" suppressHydrationWarning>
        <div className="flex flex-col flex-1 min-h-0 relative" suppressHydrationWarning>
          {activeTab === 'home' && (
            <HomeScreen onNavigate={handleNavigate} />
          )}
          {activeTab === 'chat' && (
            <ChatScreen
              messages={messages}
              isLoading={isLoading}
              isListening={isListening}
              isSpeaking={isSpeaking}
              status={status}
              onSend={handleSend}
              onVoiceToggle={handleVoiceToggle}
              quickReplies={QUICK_REPLIES}
              onSelectQuickReply={handleSend}
              onBack={() => setActiveTab('home')}
              onClearChat={clearChat}
            />
          )}
          {activeTab === 'history' && (
            <HistoryScreen
              history={history}
              onLoadConversation={loadConversation}
              onDeleteConversation={deleteFromHistory}
              onNavigate={handleNavigate}
            />
          )}
        </div>

        {/* Bottom Nav — visible on all tabs on mobile */}
        <BottomNav activeTab={activeTab} onTabChange={handleNavigate} />
      </div>

      {/* Onboarding Overlay */}
      {isOnboarded === false && (
        <OnboardingScreen
          onComplete={() => {
            setIsOnboarded(true);
            localStorage.setItem('vozbusca_onboarded', 'true');
          }}
        />
      )}
    </div>
  );
}
