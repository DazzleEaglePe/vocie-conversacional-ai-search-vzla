'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Message } from '@/lib/conversation/types';
import { cn } from '@/lib/utils';
import { UserCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const wrapRef = useRef<HTMLDivElement>(null);

  // GSAP entrance: slide up + fade in on mount
  useEffect(() => {
    if (!wrapRef.current) return;
    gsap.fromTo(
      wrapRef.current,
      { opacity: 0, y: 18, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'power3.out' }
    );
  }, []);

  return (
    <div ref={wrapRef} className="flex flex-col w-full" style={{ opacity: 0 }}>
      <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
        <div
          className={cn(
            'relative max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg',
            isUser
              ? 'bg-[#CF142B] text-white rounded-tr-none border border-[#CF142B]/40'
              : 'bg-[#1E1E1E]/80 backdrop-blur-sm text-[#F5F5F5] rounded-tl-none border border-white/[0.07]'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          <span
            className={cn(
              'block text-[10px] mt-1.5 text-right opacity-50',
              isUser ? 'text-white' : 'text-[#F5F5F5]'
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* HANDOFF banner */}
      {message.isHandoff && (
        <HandoffBanner />
      )}
    </div>
  );
}

function HandoffBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div ref={ref} className="flex justify-center w-full mt-3" style={{ opacity: 0 }}>
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1A1A1A]/80 backdrop-blur-sm border-l-4 border-[#EFC050] border-y border-r border-white/[0.07] rounded-r-xl max-w-[88%] shadow-lg">
        <div className="p-1.5 rounded-full bg-[#EFC050]/15 text-[#EFC050] shrink-0">
          <UserCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-[#EFC050] uppercase tracking-wider">
            Derivación a Humano
          </p>
          <p className="text-xs text-[#F5F5F5]/80 mt-0.5">
            Conectando con un coordinador del equipo de rescate...
          </p>
        </div>
      </div>
    </div>
  );
}
