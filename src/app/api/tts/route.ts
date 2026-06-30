import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/voice/elevenlabs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'El parámetro "text" es requerido.' }, { status: 400 });
    }

    const audioBuffer = await textToSpeech(text);

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error en [/api/tts]:', error);
    const message = error instanceof Error ? error.message : 'Error interno al generar audio';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
