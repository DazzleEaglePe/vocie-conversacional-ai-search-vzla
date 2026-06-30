'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEMES = [
  { key: 'light',  Icon: Sun,     label: 'Claro'  },
  { key: 'dark',   Icon: Moon,    label: 'Oscuro' },
  { key: 'system', Icon: Monitor, label: 'Sistema' },
] as const;

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export default function ThemeToggle({ compact = false, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (compact) {
    // Cycle through themes on click
    const CYCLE: Record<string, string> = { light: 'dark', dark: 'system', system: 'light' };
    const current = THEMES.find(t => t.key === theme) ?? THEMES[0];
    const { Icon } = current;
    return (
      <button
        onClick={() => setTheme(CYCLE[theme ?? 'dark'] ?? 'dark')}
        className={cn(
          'p-2 rounded-full border transition-colors',
          'bg-[var(--app-glass)] border-[var(--app-glass-border)]',
          'text-[var(--app-text-2)] hover:text-[var(--app-text)]',
          className
        )}
        title={`Tema: ${current.label}`}
      >
        <Icon className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 rounded-full border',
        'bg-[var(--app-glass)] border-[var(--app-glass-border)]',
        className
      )}
    >
      {THEMES.map(({ key, Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium transition-all duration-200',
            theme === key
              ? 'bg-[#CF142B] text-white shadow-sm'
              : 'text-[var(--app-text-2)] hover:text-[var(--app-text)]'
          )}
          title={label}
        >
          <Icon className="w-3 h-3" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
