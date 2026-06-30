import React from 'react';
import { Shield } from 'lucide-react';
import StatusBadge, { BotStatus } from '@/components/atoms/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatHeaderProps {
  status: BotStatus;
}

export default function ChatHeader({ status }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between w-full px-4 py-3 bg-[#1A1A1A] border-b border-[#333333] shadow-md z-10">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-[#CF142B]/30 bg-[#2A2A2A]">
          <AvatarFallback className="bg-[#CF142B] text-[#F5F5F5] font-bold text-base flex items-center justify-center">
            V
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <h1 className="text-sm font-semibold text-[#F5F5F5]">Valentina</h1>
            <span title="Asistente Oficial Rescate">
              <Shield className="w-3.5 h-3.5 text-[#EFC050]" />
            </span>
          </div>
          <span className="text-[10px] text-[#F5F5F5]/60">
            Asistencia Humanitaria Terremoto
          </span>
        </div>
      </div>
      
      <StatusBadge status={status} />
    </header>
  );
}
