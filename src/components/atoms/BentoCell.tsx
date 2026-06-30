'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

// Subtle colored background tints only for the small badges
const TINTS: Record<string, string> = {
  red:   'rgba(239, 68, 68, 0.08)',
  green: 'rgba(16, 185, 129, 0.08)',
  blue:  'rgba(56, 189, 248, 0.08)',
  amber: 'rgba(245, 158, 11, 0.08)',
};

const BORDERS: Record<string, string> = {
  red:   'rgba(239, 68, 68, 0.20)',
  green: 'rgba(16, 185, 129, 0.20)',
  blue:  'rgba(56, 189, 248, 0.20)',
  amber: 'rgba(245, 158, 11, 0.20)',
};

const TEXT_COLORS: Record<string, string> = {
  red:   '#F87171',
  green: '#34D399',
  blue:  '#38BDF8',
  amber: '#FCD34D',
};

const DOT_COLORS: Record<string, string> = {
  red:   '#EF4444',
  green: '#10B981',
  blue:  '#0EA5E9',
  amber: '#F59E0B',
};

export type BentoVariant = 'red' | 'green' | 'blue' | 'amber';

interface BentoCellProps {
  value?: number;
  suffix?: string;
  label?: string;
  sublabel?: string;
  badge?: string;
  variant: BentoVariant;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  children?: ReactNode;     // for non-stat cells
  onClick?: () => void;
}

export default function BentoCell({
  value, suffix = '', label, sublabel, badge,
  variant, className, style, delay = 0, children, onClick,
}: BentoCellProps) {
  const cellRef = useRef<HTMLDivElement>(null);
  const numRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!cellRef.current) return;

    gsap.fromTo(cellRef.current,
      { opacity: 0, y: 22, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', delay }
    );

    if (numRef.current && value !== undefined) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 1.8,
        delay: delay + 0.25,
        ease: 'power2.out',
        onUpdate: () => {
          if (numRef.current)
            numRef.current.textContent = Math.floor(obj.val).toLocaleString('es-VE') + suffix;
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={cellRef}
      onClick={onClick}
      className={cn(
        'ios-glass relative overflow-hidden rounded-[24px] flex flex-col transition-all duration-300',
        onClick && 'cursor-pointer hover:bg-white/[0.02] active:scale-[0.98] transition-transform duration-150',
        className
      )}
      style={{
        opacity: 0,
        ...style
      }}
    >
      {/* Inner diagonal sheen — the iOS specular highlight */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: 0, right: 0, height: '100%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.005) 45%, transparent 45%)',
          borderRadius: '24px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-4 gap-1.5 justify-between">
        {/* Top bar with Badge and/or Status Dot */}
        <div className="flex items-center justify-between w-full shrink-0">
          {badge ? (
            <span
              className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{
                color: TEXT_COLORS[variant],
                background: TINTS[variant],
                border: `1px solid ${BORDERS[variant]}`
              }}
            >
              {badge}
            </span>
          ) : (
            <div />
          )}
          
          {/* Status dot in the top corner */}
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              variant === 'red' && "animate-pulse"
            )}
            style={{
              backgroundColor: DOT_COLORS[variant],
              boxShadow: `0 0 6px ${DOT_COLORS[variant]}`
            }}
          />
        </div>

        {value !== undefined ? (
          <div className="flex flex-col mt-4">
            <span
              ref={numRef}
              className="tabular-nums font-black leading-none tracking-tight text-[var(--app-text)]"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              }}
            >
              0
            </span>
            <span className="text-xs font-semibold leading-tight text-[var(--app-text-2)] mt-1.5">
              {label}
            </span>
            {sublabel && (
              <span className="text-[10px] text-[var(--app-text-3)] mt-0.5">
                {sublabel}
              </span>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
