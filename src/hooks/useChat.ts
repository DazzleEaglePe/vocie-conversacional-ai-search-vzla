'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Message, ChatRequest, ChatResponse } from '@/lib/conversation/types';
import { classifyMessage } from '@/lib/conversation/nlp';

// ── Storage keys ─────────────────────────────────────────────────────────────
const KEY_ACTIVE  = 'vb_active_conv';   // current conversation
const KEY_HISTORY = 'vb_history_list';  // past conversations
const MAX_HISTORY = 20;                 // cap to avoid localStorage bloat

// ── Types ─────────────────────────────────────────────────────────────────────
export interface StoredConversation {
  id:        string;
  title:     string;    // first user message, truncated
  preview:   string;    // last message preview
  messages:  Message[];
  updatedAt: string;    // ISO string
  msgCount:  number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const WELCOME: Message = {
  id:        'welcome',
  role:      'assistant',
  content:   'Hola, soy Valentina. Estoy acá para ayudarte a encontrar a tus seres queridos o conseguir información sobre refugios y ayuda. ¿En qué puedo asistirte?',
  timestamp: new Date(),
};

function restoreDates(msgs: Message[]): Message[] {
  return msgs.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
}

function generateTitle(messages: Message[]): string {
  const first = messages.find(m => m.role === 'user');
  if (!first) return 'Nueva conversación';
  const t = first.content.trim();
  return t.length > 40 ? t.slice(0, 37) + '...' : t;
}

function loadActive(): Message[] {
  try {
    const raw = localStorage.getItem(KEY_ACTIVE);
    if (!raw) return [WELCOME];
    const conv: StoredConversation = JSON.parse(raw);
    return restoreDates(conv.messages);
  } catch { return [WELCOME]; }
}

function loadHistory(): StoredConversation[] {
  try {
    const raw = localStorage.getItem(KEY_HISTORY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredConversation[];
  } catch { return []; }
}

function saveActive(messages: Message[]) {
  const conv: StoredConversation = {
    id:        'active',
    title:     generateTitle(messages),
    preview:   messages[messages.length - 1]?.content ?? '',
    messages,
    updatedAt: new Date().toISOString(),
    msgCount:  messages.length,
  };
  localStorage.setItem(KEY_ACTIVE, JSON.stringify(conv));
}

function archiveToHistory(messages: Message[]) {
  // Only archive if the user actually said something
  const hasUserMsg = messages.some(m => m.role === 'user');
  if (!hasUserMsg) return;

  const conv: StoredConversation = {
    id:        crypto.randomUUID(),
    title:     generateTitle(messages),
    preview:   messages[messages.length - 1]?.content.slice(0, 80) ?? '',
    messages,
    updatedAt: new Date().toISOString(),
    msgCount:  messages.length,
  };

  const existing = loadHistory();
  const updated  = [conv, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(KEY_HISTORY, JSON.stringify(updated));
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useChat() {
  const [messages,    setMessages]    = useState<Message[]>([WELCOME]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [history,     setHistory]     = useState<StoredConversation[]>([]);
  const [hydrated,    setHydrated]    = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setMessages(loadActive());
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  // Auto-save active conversation on every change
  useEffect(() => {
    if (!hydrated) return;
    saveActive(messages);
  }, [messages, hydrated]);

  // ── sendMessage ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const { intent, entities } = classifyMessage(text);
    const userMessage: Message = {
      id:        crypto.randomUUID(),
      role:      'user',
      content:   text,
      timestamp: new Date(),
      intent,
      entities,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.role, content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory } as ChatRequest),
      });

      if (!res.ok) throw new Error('Error al conectar con el servidor de IA.');

      const data: ChatResponse = await res.json();
      const botMessage: Message = {
        id:         crypto.randomUUID(),
        role:       'assistant',
        content:    data.content,
        timestamp:  new Date(),
        isHandoff:  data.isHandoff,
      };

      setMessages(prev => [...prev, botMessage]);
      if (data.isHandoff) setShowHandoff(true);
      return data.content;

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const fallback: Message = {
        id:        crypto.randomUUID(),
        role:      'assistant',
        content:   'Disculpame, estoy teniendo problemas de conexión. Por favor intentá de nuevo en unos segundos.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallback]);
      return fallback.content;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // ── clearChat — archives current, starts fresh ───────────────────────────
  const clearChat = useCallback(() => {
    archiveToHistory(messages);
    localStorage.removeItem(KEY_ACTIVE);
    const updated = loadHistory();
    setHistory(updated);
    setMessages([WELCOME]);
    setShowHandoff(false);
    setIsLoading(false);
  }, [messages]);

  // ── loadConversation — resume a past session ─────────────────────────────
  const loadConversation = useCallback((id: string) => {
    const hist = loadHistory();
    const conv = hist.find(c => c.id === id);
    if (!conv) return;
    // Archive current before loading (if it has user messages)
    archiveToHistory(messages);
    // Remove the one we're loading from history (it becomes active)
    const updated = hist.filter(c => c.id !== id);
    localStorage.setItem(KEY_HISTORY, JSON.stringify(updated));
    setHistory(updated);
    setMessages(restoreDates(conv.messages));
    setShowHandoff(false);
  }, [messages]);

  // ── deleteFromHistory ────────────────────────────────────────────────────
  const deleteFromHistory = useCallback((id: string) => {
    const updated = loadHistory().filter(c => c.id !== id);
    localStorage.setItem(KEY_HISTORY, JSON.stringify(updated));
    setHistory(updated);
  }, []);

  return {
    messages,
    isLoading,
    showHandoff,
    history,
    sendMessage,
    clearChat,
    loadConversation,
    deleteFromHistory,
  };
}
