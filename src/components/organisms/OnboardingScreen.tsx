'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Search, Mic, Users, ChevronRight, ShieldAlert, Check } from 'lucide-react';

// ── Liquid glass mockup visuals ──────────────────────────────────────────────

function SearchVisual() {
  const PEOPLE = [
    { name:'Ana García Mendoza', loc:'Barquisimeto, Lara',     badge:'Encontrada', color:'#34D399', op:1    },
    { name:'Carlos Pérez',        loc:'Caracas, Dtto. Capital', badge:'Buscando',   color:'#FCD34D', op:0.58 },
    { name:'María Rivas Otero',   loc:'Valencia, Carabobo',     badge:'Buscando',   color:'#FCD34D', op:0.28 },
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute liquid-glass rounded-[22px]"
        style={{ width:'84%', height:'80%', transform:'rotate(-5deg) translateY(14px)', opacity:0.18 }} />
      <div className="absolute liquid-glass rounded-[22px]"
        style={{ width:'85%', height:'81%', transform:'rotate(-2deg) translateY(7px)', opacity:0.42 }} />
      <div className="relative liquid-glass rounded-[22px] p-4" style={{ width:'87%' }}>
        <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-white/[0.07]">
          <Search className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[11px] text-white/30">Buscar persona...</span>
        </div>
        {PEOPLE.map(p => (
          <div key={p.name}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-1.5 last:mb-0"
            style={{ background:'rgba(255,255,255,0.038)', opacity:p.op }}>
            <div className="w-7 h-7 rounded-full bg-white/[0.08] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white truncate">{p.name}</p>
              <p className="text-[9px] text-white/30 truncate">{p.loc}</p>
            </div>
            <span className="text-[9px] font-bold shrink-0" style={{ color:p.color }}>{p.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VoiceVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute rounded-full"
        style={{ width:230, height:230, background:'radial-gradient(circle, rgba(207,20,43,0.13) 0%, transparent 70%)' }} />
      <div className="absolute rounded-full"
        style={{ width:140, height:140, background:'radial-gradient(circle, rgba(207,20,43,0.20) 0%, transparent 70%)' }} />
      <div className="relative z-10 liquid-glass rounded-full flex items-center justify-center"
        style={{ width:100, height:100 }}>
        <Mic className="w-9 h-9 text-white/75" />
      </div>
      <div className="liquid-glass absolute rounded-2xl rounded-tl-none px-3.5 py-2 text-[11px] text-white/70 font-medium"
        style={{ top:'14%', right:'3%', maxWidth:'58%' }}>
        ¿Dónde hay refugios cercanos?
      </div>
      <div className="absolute rounded-2xl rounded-bl-none px-3.5 py-2 text-[11px] font-medium"
        style={{
          bottom:'10%', left:'3%', maxWidth:'62%',
          background:'rgba(207,20,43,0.12)', border:'1px solid rgba(207,20,43,0.22)',
          color:'#EFC050', backdropFilter:'blur(28px)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 32px rgba(0,0,0,0.5)',
        }}>
        Hay 3 albergues activos a menos de 5km...
      </div>
    </div>
  );
}

function StatsVisual() {
  const STATS = [
    { label:'Reportados desaparecidos', value:'46,891', color:'#F87171', angle:'-2deg',   y:'-8px' },
    { label:'Personas encontradas',     value:'1,247',  color:'#34D399', angle:'1.5deg',  y:'3px'  },
    { label:'Refugios activos',         value:'24',     color:'#38BDF8', angle:'-0.5deg', y:'10px' },
  ];
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 px-5">
      {STATS.map(s => (
        <div key={s.label}
          className="liquid-glass rounded-[18px] px-5 py-3.5 flex items-center gap-3.5 w-full"
          style={{ transform:`rotate(${s.angle}) translateY(${s.y})` }}>
          <span className="text-2xl font-black tabular-nums" style={{ color:s.color }}>{s.value}</span>
          <span className="text-[11px] text-white/40 font-medium flex-1">{s.label}</span>
          <div className="w-2 h-2 rounded-full shrink-0"
            style={{ background:s.color, boxShadow:`0 0 8px ${s.color}` }} />
        </div>
      ))}
    </div>
  );
}

function ReportVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute liquid-glass rounded-[22px] opacity-25"
        style={{ width:'82%', height:'76%', transform:'rotate(-3.5deg)' }} />
      <div className="relative liquid-glass rounded-[22px] p-4" style={{ width:'86%' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background:'rgba(207,20,43,0.18)' }}>
            <Users className="w-3.5 h-3.5 text-[#CF142B]" />
          </div>
          <span className="text-[11px] font-semibold text-white">Nuevo reporte</span>
          <span className="ml-auto text-[9px] font-bold text-[#34D399]">✓ Guardado</span>
        </div>
        {[
          { f:'Nombre completo',  v:'Luisa Fernández Rojas' },
          { f:'Edad aproximada',  v:'45 años' },
          { f:'Última ubicación', v:'Maturín, Monagas' },
        ].map(({ f, v }) => (
          <div key={f} className="px-3 py-2 rounded-xl mb-2 last:mb-0"
            style={{ background:'rgba(255,255,255,0.038)' }}>
            <p className="text-[9px] text-white/28 mb-0.5">{f}</p>
            <p className="text-[11px] text-white/80 font-medium">{v}</p>
          </div>
        ))}
        <div className="mt-3 py-2.5 rounded-xl text-center text-[11px] font-bold text-white"
          style={{ background:'#CF142B' }}>
          Enviar reporte
        </div>
      </div>
    </div>
  );
}

// ── Slides config ─────────────────────────────────────────────────────────────

const SLIDES = [
  { title:'Busca a tus\nseres queridos.',  sub:'Encuentra personas por nombre, cédula o descripción al instante.', Visual:SearchVisual },
  { title:'Tu voz es\ntu herramienta.',    sub:'Valentina entiende lo que dices y te guía paso a paso.',           Visual:VoiceVisual  },
  { title:'Datos en tiempo\nreal.',        sub:'Refugios activos, voluntarios y casos actualizados cada hora.',    Visual:StatsVisual  },
  { title:'Reporta casos\nen segundos.',   sub:'Registra desaparecidos con tu voz. Sin formularios, sin espera.',  Visual:ReportVisual },
];

// ── Main component ────────────────────────────────────────────────────────────

interface OnboardingScreenProps { onComplete: () => void; }

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [phase, setPhase]       = useState<'splash' | 'slides' | 'terms'>('splash');
  const [slide, setSlide]       = useState(0);
  const [accepted, setAccepted] = useState(false);

  const rootRef    = useRef<HTMLDivElement>(null);
  const splashRef  = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const slidesRef  = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const termsRef   = useRef<HTMLDivElement>(null);

  // Splash entrance + auto-advance
  useEffect(() => {
    if (!logoRef.current) return;
    gsap.fromTo(logoRef.current,
      { opacity:0, scale:0.8, y:16 },
      { opacity:1, scale:1, y:0, duration:1, ease:'power3.out', delay:0.3 }
    );
    const t = setTimeout(() => {
      gsap.to(splashRef.current, {
        opacity:0, scale:1.05, duration:0.5, ease:'power2.in',
        onComplete:() => setPhase('slides'),
      });
    }, 1900);
    return () => clearTimeout(t);
  }, []);

  // Slides fade-in
  useEffect(() => {
    if (phase !== 'slides' || !slidesRef.current) return;
    gsap.fromTo(slidesRef.current, { opacity:0 }, { opacity:1, duration:0.5, ease:'power2.out' });
  }, [phase]);

  // Terms fade-in
  useEffect(() => {
    if (phase !== 'terms' || !termsRef.current) return;
    gsap.fromTo(termsRef.current, { opacity:0, y:20 }, { opacity:1, y:0, duration:0.45, ease:'power3.out' });
  }, [phase]);

  const goNext = () => {
    if (slide === SLIDES.length - 1) {
      if (slidesRef.current) {
        gsap.to(slidesRef.current, {
          opacity:0, x:-24, duration:0.25, ease:'power2.in',
          onComplete:() => setPhase('terms'),
        });
      }
      return;
    }
    const el = contentRef.current;
    if (!el) { setSlide(s => s + 1); return; }
    gsap.to(el, {
      opacity:0, x:-24, duration:0.2, ease:'power2.in',
      onComplete:() => {
        setSlide(s => s + 1);
        gsap.fromTo(el, { opacity:0, x:24 }, { opacity:1, x:0, duration:0.28, ease:'power2.out' });
      },
    });
  };

  const handleFinish = () => {
    if (!accepted) return;
    gsap.to(rootRef.current, {
      opacity:0, scale:1.04, duration:0.45, ease:'power2.inOut',
      onComplete: onComplete,
    });
  };

  const { title, sub, Visual } = SLIDES[slide];

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] flex flex-col" style={{ background:'#060608' }}>

      {/* ── SPLASH ──────────────────────────────────────────── */}
      {phase === 'splash' && (
        <div ref={splashRef} className="absolute inset-0 flex items-center justify-center">
          <div ref={logoRef} className="flex flex-col items-center gap-4" style={{ opacity:0 }}>
            <div className="absolute rounded-full pointer-events-none"
              style={{ width:200, height:200, background:'radial-gradient(circle, rgba(207,20,43,0.20) 0%, transparent 70%)' }} />
            <div className="relative z-10 w-[72px] h-[72px] rounded-[22px] flex items-center justify-center"
              style={{
                background:'linear-gradient(145deg, #E8162F 0%, #8B000D 100%)',
                boxShadow:'0 0 52px rgba(207,20,43,0.45), 0 0 100px rgba(207,20,43,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}>
              <Mic className="w-9 h-9 text-white" />
            </div>
            <div className="text-center">
              <p className="font-black tracking-wide text-[15px] text-white">VozBusca</p>
              <p className="text-white/28 text-[10px] tracking-widest uppercase font-medium mt-0.5">Asistente humanitaria</p>
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDES ──────────────────────────────────────────── */}
      {phase === 'slides' && (
        <div ref={slidesRef} className="flex flex-col h-full" style={{ opacity:0 }}>
          {/* Skip */}
          <div className="flex justify-end px-6 pt-5 shrink-0">
            <button
              onClick={() => setPhase('terms')}
              className="flex items-center gap-0.5 text-[12px] font-medium text-white/28 hover:text-white/55 transition-colors"
            >
              Omitir <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div ref={contentRef} className="flex flex-col flex-1 min-h-0">
            {/* Visual */}
            <div className="flex-1 min-h-0 px-5 py-4">
              <Visual />
            </div>

            {/* Bottom */}
            <div className="shrink-0 px-6 pb-10 space-y-5">
              {/* Progress pills */}
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <div key={i} className="h-[3px] rounded-full transition-all duration-300"
                    style={{
                      width:      i === slide ? 22 : 6,
                      background: i === slide ? '#CF142B' : 'rgba(255,255,255,0.16)',
                    }} />
                ))}
              </div>

              <div className="space-y-2">
                <h2
                  className="font-black leading-[1.15] tracking-tight text-white whitespace-pre-line"
                  style={{ fontSize:'clamp(1.55rem, 6vw, 1.95rem)' }}
                >
                  {title}
                </h2>
                <p className="text-[12px] leading-relaxed text-white/35">{sub}</p>
              </div>

              <button
                onClick={goNext}
                className="w-full py-4 rounded-full text-[14px] font-bold transition-all duration-200 active:scale-[0.97]"
                style={{ background:'#FFFFFF', color:'#060608', boxShadow:'0 0 24px rgba(255,255,255,0.08)' }}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TERMS ───────────────────────────────────────────── */}
      {phase === 'terms' && (
        <div ref={termsRef} className="flex flex-col h-full px-6 pt-12 pb-10" style={{ opacity:0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background:'rgba(207,20,43,0.14)', border:'1px solid rgba(207,20,43,0.22)' }}>
              <ShieldAlert className="w-5 h-5 text-[#CF142B]" />
            </div>
            <p className="text-[10px] text-white/28 uppercase tracking-widest font-bold">Aviso importante</p>
          </div>

          <h2
            className="font-black text-white leading-[1.15] tracking-tight mb-3 whitespace-pre-line"
            style={{ fontSize:'clamp(1.55rem, 6vw, 1.95rem)' }}
          >
            {'Antes de\ncomenzar.'}
          </h2>

          <p className="text-[12px] text-white/35 leading-relaxed mb-5">
            VozBusca es una herramienta informativa de ayuda humanitaria asistida por Inteligencia Artificial. No reemplaza a los servicios de emergencia oficiales.
          </p>

          <div className="liquid-glass rounded-[20px] p-4 mb-6">
            <p className="text-[11px] text-white/40 leading-relaxed">
              Los datos de reportes se usan exclusivamente para la localización de personas ante la emergencia en Venezuela. No compartimos tu información con terceros.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="sr-only" />
              <div
                className="w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200"
                style={{
                  background:  accepted ? '#CF142B' : 'transparent',
                  borderColor: accepted ? '#CF142B' : 'rgba(255,255,255,0.22)',
                  boxShadow:   accepted ? '0 0 12px rgba(207,20,43,0.4)' : 'none',
                }}
              >
                {accepted && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
            </div>
            <span className="text-[12px] text-white/42 leading-relaxed group-hover:text-white/58 transition-colors">
              Entiendo que es una herramienta de auxilio informativo con IA y acepto los términos de uso.
            </span>
          </label>

          <div className="flex-1" />

          <button
            onClick={handleFinish}
            disabled={!accepted}
            className="w-full py-4 rounded-full text-[14px] font-bold transition-all duration-250"
            style={{
              background: accepted ? '#FFFFFF' : 'rgba(255,255,255,0.07)',
              color:      accepted ? '#060608' : 'rgba(255,255,255,0.20)',
              cursor:     accepted ? 'pointer' : 'not-allowed',
            }}
          >
            Aceptar y comenzar
          </button>
        </div>
      )}

    </div>
  );
}
