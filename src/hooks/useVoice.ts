'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

// SpeechRecognition no tiene tipos en lib.dom — declaración mínima
type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  return (
    (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition ??
    null
  );
}

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Parar de reproducir audio si está hablando
  const stopSpeaking = useCallback(() => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // El audio ya había terminado o no estaba reproduciéndose
      }
      audioSourceRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Parar el reconocimiento de voz
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ya estaba detenido
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Iniciar reconocimiento de voz nativo en el browser
  const startListening = useCallback((onTranscript: (transcript: string) => void) => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) {
      console.warn('Este navegador no soporta reconocimiento de voz nativo (SpeechRecognition).');
      alert('El reconocimiento de voz no está soportado en este navegador. Por favor prueba en Chrome, Edge o Safari.');
      return;
    }

    // Si ya está escuchando, lo detenemos
    if (isListening) {
      stopListening();
      return;
    }

    // Detener la reproducción de voz si Valentina está hablando
    stopSpeaking();

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'es-419'; // Español latinoamericano
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Error en reconocimiento de voz:', event.error);
        if (event.error === 'not-allowed') {
          alert('Permiso de micrófono denegado. Habilita el acceso en tu navegador.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Error al iniciar reconocimiento de voz:', error);
      setIsListening(false);
    }
  }, [isListening, stopListening, stopSpeaking]);

  // Generar audio y reproducirlo vía Web Audio API
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Detener audio anterior si estuviera activo
    stopSpeaking();

    // Detener escucha si estuviera activa para no retroalimentar la voz al micrófono
    stopListening();

    setIsSpeaking(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener el archivo de audio de /api/tts');
      }

      const arrayBuffer = await response.arrayBuffer();

      // Inicializar AudioContext (requiere interacción del usuario, que ocurre al enviar o pulsar)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // Reactivar si el navegador lo suspendió
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Decodificar y reproducir
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      audioSourceRef.current = source;

      source.onended = () => {
        setIsSpeaking(false);
        audioSourceRef.current = null;
      };

      source.start(0);
    } catch (error) {
      console.error('Error al reproducir audio de TTS:', error);
      setIsSpeaking(false);
    }
  }, [stopListening, stopSpeaking]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
