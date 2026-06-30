'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HEIGHTS = [28, 40, 52, 64, 52, 40, 28]; // organic mountain shape

export default function WaveformBars() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;
      const tween = gsap.to(bar, {
        scaleY: gsap.utils.random(0.15, 1, true),
        duration: gsap.utils.random(0.35, 0.7),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.06,
      });
      tweens.push(tween);
    });

    return () => tweens.forEach((t) => t.kill());
  }, []);

  return (
    <div className="flex items-center justify-center gap-[5px]" style={{ height: 72 }}>
      {HEIGHTS.map((h, i) => (
        <div
          key={i}
          ref={(el) => { barsRef.current[i] = el; }}
          className="rounded-full origin-center"
          style={{
            width: 5,
            height: h,
            background: 'linear-gradient(to top, #CF142B, #EFC050)',
            transform: 'scaleY(0.2)',
          }}
        />
      ))}
    </div>
  );
}
