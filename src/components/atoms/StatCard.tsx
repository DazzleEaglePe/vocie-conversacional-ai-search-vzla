'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
  colorClass: string;       // bg color
  textColorClass: string;   // value color
  badgeLabel?: string;
  delay?: number;
}

export default function StatCard({
  value, suffix = '', label, sublabel,
  colorClass, textColorClass, badgeLabel, delay = 0,
}: StatCardProps) {
  const numRef   = useRef<HTMLSpanElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);

  // GSAP counter animation on mount
  useEffect(() => {
    if (!numRef.current || !cardRef.current) return;

    // Card entrance
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', delay }
    );

    // Number count-up
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 1.8,
      delay: delay + 0.2,
      ease: 'power2.out',
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = Math.floor(obj.val).toLocaleString('es-VE') + suffix;
        }
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn('relative rounded-2xl p-4 flex flex-col gap-1 overflow-hidden', colorClass)}
      style={{ opacity: 0 }}
    >
      {badgeLabel && (
        <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full self-start', textColorClass, 'bg-white/10')}>
          {badgeLabel}
        </span>
      )}
      <span ref={numRef} className={cn('text-3xl font-bold tabular-nums leading-none', textColorClass)}>
        0
      </span>
      <span className="text-xs font-medium leading-tight" style={{ color: 'var(--app-text-2)' }}>{label}</span>
      {sublabel && <span className="text-[10px]" style={{ color: 'var(--app-text-3)' }}>{sublabel}</span>}
    </div>
  );
}
