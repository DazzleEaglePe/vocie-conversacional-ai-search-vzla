// ─── ElevenLabs TTS Service ───────────────────────────────────────────────────
// Convierte texto a audio. El bot "habla" con una voz empática en español.
// Usamos solo el TTS API (no ElevenAgents) — Claude sigue siendo el cerebro.

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? 'es-ES-Standard-A';
const API_KEY = process.env.ELEVENLABS_API_KEY ?? '';

// Voces en español recomendadas de ElevenLabs:
// - "Rachel" (multilingual): 21m00Tcm4TlvDq8ikWAM
// - "Valentina" (si la creas clonada): la que configures
// Podés encontrar IDs en: https://api.elevenlabs.io/v1/voices

export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  if (!API_KEY) throw new Error('ELEVENLABS_API_KEY no está definida en .env.local');

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.6,        // más alto = más consistente, menos expresivo
          similarity_boost: 0.8, // qué tan fiel a la voz original
          style: 0.2,            // expresividad emocional (bajo para mantener calma)
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs error: ${error}`);
  }

  return response.arrayBuffer();
}
