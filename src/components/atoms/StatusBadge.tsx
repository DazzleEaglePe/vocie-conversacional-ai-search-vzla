import React from 'react';
import { cn } from '@/lib/utils';

export type BotStatus = 'online' | 'typing' | 'speaking';

interface StatusBadgeProps {
  status: BotStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    online: {
      label: 'En línea',
      dotClass: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
      textClass: 'text-emerald-500/80',
    },
    typing: {
      label: 'Escribiendo...',
      dotClass: 'bg-[#EFC050] animate-bounce shadow-[0_0_8px_#efc050]',
      textClass: 'text-[#EFC050]/80',
    },
    speaking: {
      label: 'Hablando...',
      dotClass: 'bg-[#CF142B] animate-pulse shadow-[0_0_8px_#cf142b]',
      textClass: 'text-[#CF142B]/80',
    },
  };

  const current = config[status] || config.online;

  return (
    <div className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1A1A1A] border border-[#333333] text-xs font-medium", className)}>
      <span className={cn("w-2 h-2 rounded-full", current.dotClass)} />
      <span className={cn("transition-colors duration-300", current.textClass)}>
        {current.label}
      </span>
    </div>
  );
}
