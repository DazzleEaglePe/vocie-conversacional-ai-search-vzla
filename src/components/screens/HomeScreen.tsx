'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import BentoCell from '@/components/atoms/BentoCell';
import type { AppTab } from '@/components/organisms/BottomNav';
import { Search, AlertCircle, MapPin, Heart, ArrowRight, Clock, Mic } from 'lucide-react';
import ThemeToggle from '@/components/atoms/ThemeToggle';

interface HomeScreenProps {
  onNavigate: (tab: AppTab, prefill?: string) => void;
}

// ── Quick actions ──────────────────────────────────────────────────────────
const ACTIONS = [
  {
    label: 'Buscar persona',
    sublabel: 'Por nombre o cédula',
    icon: Search,
    prefill: 'Quiero buscar a una persona desaparecida.',
    variant: 'green' as const,
  },
  {
    label: 'Reportar',
    sublabel: 'Registrar desaparecido',
    icon: AlertCircle,
    prefill: 'Quiero reportar a una persona desaparecida.',
    variant: 'red' as const,
  },
  {
    label: 'Refugios',
    sublabel: 'Localizar albergue',
    icon: MapPin,
    prefill: '¿Dónde puedo encontrar un refugio activo?',
    variant: 'blue' as const,
  },
  {
    label: 'Voluntariado',
    sublabel: 'Cómo colaborar',
    icon: Heart,
    prefill: '¿Cómo puedo ayudar o ser voluntario?',
    variant: 'amber' as const,
  },
];

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.55 }
      );
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto pb-28 no-scrollbar">

      {/* ── Header ──────────────────────────────────────────── */}
      <div ref={headerRef} className="px-5 pt-5 pb-3 shrink-0" style={{ opacity: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--app-text-3)' }}
              >
                Venezuela · Emergencia activa
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20">
                <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
                En vivo
              </span>
            </div>
            <h1
              className="text-[1.85rem] font-black leading-[1.15] tracking-tight"
              style={{ color: 'var(--app-text)' }}
            >
              Estamos aquí para<br />
              <span className="text-[#CF142B]">ayudarte.</span>
            </h1>
          </div>
          <div className="md:hidden mt-0.5">
            <ThemeToggle compact />
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2 text-[10px]" style={{ color: 'var(--app-text-3)' }}>
          <Clock className="w-3 h-3 shrink-0" />
          <span>Actualizado hace 5 min · build4venezuela.com</span>
        </div>
      </div>

      {/* ── Bento grid — stats ──────────────────────────────── */}
      {/*
        3-column Apple bento layout:
        Row 1:  [Desaparecidos — 2 cols] [Encontrados — 1 col]
        Row 2:  [Refugios — 1 col]       [Voluntarios — 2 cols]
      */}
      <div className="px-5 grid grid-cols-3 gap-2.5 shrink-0">

        {/* A — Reportados desaparecidos (hero cell, 2/3 ancho) */}
        <BentoCell
          value={46891}
          label="Reportados desaparecidos"
          sublabel="Total acumulado desde el 24 jun"
          badge="Crítico"
          variant="red"
          delay={0.08}
          className="col-span-2"
          style={{ minHeight: 148 } as React.CSSProperties}
        />

        {/* B — Encontrados (1/3) */}
        <BentoCell
          value={1247}
          label="Personas encontradas"
          sublabel="Últimas 24h"
          badge="Activo"
          variant="green"
          delay={0.16}
          className="col-span-1"
          style={{ minHeight: 148 } as React.CSSProperties}
        />

        {/* C — Refugios (1/3) */}
        <BentoCell
          value={24}
          label="Refugios activos"
          sublabel="Con capacidad disponible"
          variant="blue"
          delay={0.24}
          className="col-span-1"
          style={{ minHeight: 128 } as React.CSSProperties}
        />

        {/* D — Voluntarios (2/3) */}
        <BentoCell
          value={4200}
          suffix="+"
          label="Voluntarios registrados"
          sublabel="En toda Venezuela"
          variant="amber"
          delay={0.32}
          className="col-span-2"
          style={{ minHeight: 128 } as React.CSSProperties}
        />
      </div>

      {/* ── CTA principal ───────────────────────────────────── */}
      <div ref={ctaRef} className="px-5 mt-3 shrink-0" style={{ opacity: 0 }}>
        <button
          onClick={() => onNavigate('chat')}
          className="w-full ios-glass relative overflow-hidden rounded-[22px] flex items-center gap-4 px-5 py-4 active:scale-[0.98] transition-transform duration-150 cursor-pointer group"
        >
          {/* Red gradient sweep on hover */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(207,20,43,0.08)' }} />
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(90deg, rgba(207,20,43,0.12) 0%, transparent 60%)' }} />

          <div
            className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: '#CF142B', boxShadow: '0 0 16px rgba(207,20,43,0.4)' }}
          >
            <Mic className="w-5 h-5 text-white" />
          </div>

          <div className="relative z-10 flex-1 text-left">
            <p className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
              Hablar con Valentina
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--app-text-2)' }}>
              Asistente humanitaria con IA de voz
            </p>
          </div>

          <ArrowRight
            className="relative z-10 w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
            style={{ color: 'var(--app-text-3)' }}
          />
        </button>
      </div>

      {/* ── Bento grid — acciones rápidas ───────────────────── */}
      <div className="px-5 mt-3 pb-4 shrink-0">
        <p className="text-[9px] font-bold uppercase tracking-widest mb-2.5" style={{ color: 'var(--app-text-3)' }}>
          Acciones rápidas
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {ACTIONS.map(({ label, sublabel, icon: Icon, prefill, variant }, i) => (
            <BentoCell
              key={label}
              variant={variant}
              delay={0.6 + i * 0.07}
              onClick={() => onNavigate('chat', prefill)}
              style={{ minHeight: 88 } as React.CSSProperties}
            >
              {/* Custom inner layout for action cells */}
              <div className="flex flex-col h-full gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border-color)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: 'var(--app-text-2)' }} />
                </div>
                <div className="mt-auto">
                  <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--app-text)' }}>
                    {label}
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: 'var(--app-text-3)' }}>
                    {sublabel}
                  </p>
                </div>
              </div>
            </BentoCell>
          ))}
        </div>
      </div>
    </div>
  );
}
