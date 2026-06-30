// ─── /api/chat — Endpoint principal del bot ───────────────────────────────────
// Recibe el historial, llama al LLM (via factory), detecta handoff.
// Desacoplado del provider concreto gracias a ILLMProvider.

import { NextRequest, NextResponse } from 'next/server';
import { createLLMProvider } from '@/lib/llm/factory';
import { SYSTEM_PROMPT } from '@/lib/conversation/system-prompt';
import type { ChatRequest, ChatResponse } from '@/lib/conversation/types';

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages } = body;

    if (!messages?.length) {
      return NextResponse.json({ error: 'messages requerido' }, { status: 400 });
    }

    const provider = createLLMProvider();
    const result = await provider.chat(messages, SYSTEM_PROMPT);

    // HANDOFF: el LLM inserta [HANDOFF_TRIGGER] cuando debe escalar a humano
    const isHandoff = result.content.includes('[HANDOFF_TRIGGER]');
    const content = result.content.replace('[HANDOFF_TRIGGER]', '').trim();

    const response: ChatResponse = { content, isHandoff };
    return NextResponse.json(response);
  } catch (error) {
    console.error('[/api/chat]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
