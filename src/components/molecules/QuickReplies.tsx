'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { QuickReply } from '@/lib/conversation/types';

interface QuickRepliesProps {
  replies: QuickReply[];
  onSelect: (value: string) => void;
}

export default function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP stagger: each button appears with cascade delay
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 12, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.32, ease: 'back.out(1.6)' }
    );
  }, []);

  if (!replies?.length) return null;

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap gap-2 px-1 py-2"
    >
      {replies.map((reply) => (
        <button
          key={reply.id}
          type="button"
          onClick={() => onSelect(reply.value)}
          style={{ opacity: 0 }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-full bg-[#1E1E1E]/80 backdrop-blur-sm border border-white/[0.09] text-[#F5F5F5]/80 hover:border-[#CF142B]/50 hover:text-white hover:bg-[#CF142B]/10 transition-all duration-200 active:scale-95 whitespace-nowrap"
        >
          {reply.icon && <span className="text-sm leading-none">{reply.icon}</span>}
          <span>{reply.label}</span>
        </button>
      ))}
    </div>
  );
}
