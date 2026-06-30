'use client';

import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function VoiceButton({ isListening, onClick, disabled }: VoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#CF142B] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]",
        isListening
          ? "bg-[#CF142B] text-[#F5F5F5] ring-2 ring-[#CF142B]/50 animate-pulse"
          : "bg-[#2A2A2A] hover:bg-[#3A3A3A] text-[#F5F5F5] border border-[#333333] hover:border-[#CF142B]/30",
        disabled && "opacity-50 cursor-not-allowed hover:bg-[#2A2A2A] border-[#333333]"
      )}
      aria-label={isListening ? "Detener entrada de voz" : "Iniciar entrada de voz"}
    >
      {isListening && (
        <span className="absolute -inset-1 rounded-full bg-[#CF142B]/30 animate-ping pointer-events-none" />
      )}
      <Mic className={cn("w-5 h-5 transition-transform", isListening && "scale-110")} />
    </button>
  );
}
