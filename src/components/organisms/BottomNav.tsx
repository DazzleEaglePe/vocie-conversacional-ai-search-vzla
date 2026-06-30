'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Home, MessageCircle, Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AppTab = 'home' | 'chat';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab, prefill?: string) => void;
}

const TABS = [
  { id: 'home', label: 'Inicio', Icon: Home },
  { id: 'search', label: 'Buscar', Icon: Search },
  { id: 'chat', label: 'Asistente', Icon: MessageCircle },
  { id: 'info', label: 'Ayuda', Icon: Info },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    // Premium entry animation: slide up from bottom and fade in
    gsap.fromTo(navRef.current,
      { y: 80, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power4.out', delay: 0.2 }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] h-16 rounded-full backdrop-blur-xl flex items-center justify-around px-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.3)] z-40 md:hidden"
      style={{ background: 'var(--nav-bg)', border: '1px solid var(--app-glass-border)', opacity: 0 }}
    >
      {TABS.map(({ id, label, Icon }) => {
        // Active visual state is true for Home if activeTab is home
        // and true for Chat/Valentina if activeTab is chat
        const isCurrentlyActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => {
              if (id === 'home') {
                onTabChange('home');
              } else if (id === 'chat') {
                onTabChange('chat');
              } else if (id === 'search') {
                onTabChange('chat', 'Quiero buscar a una persona desaparecida.');
              } else if (id === 'info') {
                onTabChange('chat', '¿Cómo funciona Valentina y qué puede hacer?');
              }
            }}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 active:scale-90"
            title={label}
          >
            <div
              className={cn(
                'relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300',
                isCurrentlyActive
                  ? 'bg-[#CF142B] text-white shadow-[0_0_16px_rgba(207,20,43,0.5)] scale-110'
                  : 'text-white/40 group-hover:text-white/70 bg-transparent'
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            {/* Soft tooltips on hover */}
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#16161A] border border-white/[0.06] text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
