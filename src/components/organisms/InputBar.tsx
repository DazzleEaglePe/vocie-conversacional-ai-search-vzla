'use client';

import { useState, FormEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import VoiceButton from '@/components/atoms/VoiceButton';
import { cn } from '@/lib/utils';

interface InputBarProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  isListening: boolean;
  onVoiceToggle: () => void;
}

export default function InputBar({ onSend, isLoading, isListening, onVoiceToggle }: InputBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 mx-3 mb-3 rounded-2xl bg-[#1A1A1A]/70 backdrop-blur-md border border-white/[0.08] shadow-xl"
    >
      <VoiceButton isListening={isListening} onClick={onVoiceToggle} disabled={isLoading} />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isLoading}
        placeholder={isListening ? 'Escuchando tu voz...' : 'Escribe un mensaje o habla...'}
        className={cn(
          'flex-1 bg-transparent text-sm text-[#F5F5F5] placeholder-[#F5F5F5]/30 focus:outline-none px-2',
          isLoading && 'opacity-40 cursor-not-allowed',
          isListening && 'text-[#CF142B] placeholder-[#CF142B]/50'
        )}
      />

      <button
        type="submit"
        disabled={!value.trim() || isLoading}
        aria-label="Enviar mensaje"
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200',
          value.trim() && !isLoading
            ? 'bg-[#CF142B] hover:bg-[#B31023] text-white shadow-[0_0_16px_rgba(207,20,43,0.4)]'
            : 'bg-[#2A2A2A] text-[#F5F5F5]/20 cursor-not-allowed'
        )}
      >
        <SendHorizontal className="w-4 h-4" />
      </button>
    </form>
  );
}
