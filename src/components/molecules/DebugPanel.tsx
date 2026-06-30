import React from 'react';
import type { Message } from '@/lib/conversation/types';
import { Bot, User, Brain, AlertCircle, FileJson, CheckCircle2 } from 'lucide-react';

interface DebugPanelProps {
  messages: Message[];
  isSpeaking: boolean;
  isListening: boolean;
}

export default function DebugPanel({ messages, isSpeaking, isListening }: DebugPanelProps) {
  // Find the last user message to extract intents and entities
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1];

  const currentIntent = lastUserMessage?.intent || 'Ninguno detectado';
  const currentEntities = lastUserMessage?.entities || {};

  // Count active stats
  const fallbacksCount = messages.filter(m => m.role === 'assistant' && 
    (m.content.includes('Eso queda fuera de lo que puedo') || 
     m.content.includes('No encontré ese nombre') ||
     m.content.includes('¿Podés contarme un poco más'))
  ).length;

  const hasHandoff = messages.some(m => m.isHandoff);

  return (
    <aside className="w-full lg:w-80 bg-[#1A1A1A] border-t lg:border-t-0 lg:border-l border-[#333333] flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-[#333333] flex items-center gap-2 bg-[#2A2A2A]/30">
        <Brain className="w-5 h-5 text-[#EFC050]" />
        <h2 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider">
          Consola de Diseño
        </h2>
      </div>

      <div className="p-4 flex-1 space-y-6 text-xs text-[#F5F5F5]/80">
        {/* Intent Section */}
        <div className="space-y-2">
          <h3 className="font-semibold text-[#EFC050] flex items-center gap-1.5 uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" /> Intención (Intent)
          </h3>
          <div className="bg-[#2A2A2A] border border-[#333333] p-3 rounded-lg flex items-center justify-between">
            <span className="font-mono text-[#F5F5F5]">{currentIntent}</span>
            {lastUserMessage && (
              <span className="text-[10px] bg-[#CF142B]/10 text-[#CF142B] border border-[#CF142B]/20 px-1.5 py-0.5 rounded">
                Detectado
              </span>
            )}
          </div>
        </div>

        {/* Entities Section */}
        <div className="space-y-2">
          <h3 className="font-semibold text-[#EFC050] flex items-center gap-1.5 uppercase tracking-wide">
            <FileJson className="w-3.5 h-3.5" /> Entidades (Entities)
          </h3>
          <div className="bg-[#2A2A2A] border border-[#333333] p-3 rounded-lg space-y-2 font-mono">
            {Object.keys(currentEntities).length === 0 ? (
              <p className="text-stone-500 italic">No hay entidades extraídas.</p>
            ) : (
              <ul className="space-y-1.5">
                {Object.entries(currentEntities).map(([key, value]) => (
                  <li key={key} className="flex justify-between border-b border-[#333333]/50 pb-1 last:border-b-0 last:pb-0">
                    <span className="text-stone-400">{key}:</span>
                    <span className="text-[#F5F5F5] font-semibold">{value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* State Machine Variables */}
        <div className="space-y-2">
          <h3 className="font-semibold text-[#EFC050] flex items-center gap-1.5 uppercase tracking-wide">
            <AlertCircle className="w-3.5 h-3.5" /> Variables del Contexto
          </h3>
          <div className="bg-[#2A2A2A] border border-[#333333] p-3 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span>Fallbacks Activos:</span>
              <span className="bg-[#2A2A2A] border border-[#333333] px-2 py-0.5 rounded font-mono font-semibold">
                {fallbacksCount} / 2
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Handoff Activado:</span>
              <span className={`px-2 py-0.5 rounded font-mono font-semibold ${hasHandoff ? 'bg-[#CF142B]/10 text-[#CF142B]' : 'bg-[#2A2A2A] border border-[#333333]'}`}>
                {hasHandoff ? 'SÍ' : 'NO'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Reproduciendo Audio:</span>
              <span className={`px-2 py-0.5 rounded font-mono font-semibold ${isSpeaking ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#2A2A2A] border border-[#333333]'}`}>
                {isSpeaking ? 'SÍ' : 'NO'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Escucha Activa:</span>
              <span className={`px-2 py-0.5 rounded font-mono font-semibold ${isListening ? 'bg-[#CF142B]/10 text-[#CF142B] animate-pulse' : 'bg-[#2A2A2A] border border-[#333333]'}`}>
                {isListening ? 'SÍ' : 'NO'}
              </span>
            </div>
          </div>
        </div>

        {/* Persona Info */}
        <div className="bg-[#2A2A2A]/50 border border-[#333333] p-3 rounded-lg space-y-1.5">
          <h4 className="font-semibold text-[#F5F5F5] flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-[#CF142B]" /> Valentina Persona
          </h4>
          <p className="text-[10px] text-[#F5F5F5]/60 leading-relaxed">
            Asistente empática, calmada, directa. Turnos breves (2-4 oraciones). Redirecciona si es fuera de dominio y escala tras 2 fallbacks o frustración.
          </p>
        </div>
      </div>
    </aside>
  );
}
