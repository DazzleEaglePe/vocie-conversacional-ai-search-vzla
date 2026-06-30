'use client';

import { useState, useCallback } from 'react';
import type { Message, ChatRequest, ChatResponse } from '@/lib/conversation/types';
import { classifyMessage } from '@/lib/conversation/nlp';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hola, soy Valentina. Estoy acá para ayudarte a encontrar a tus seres queridos o conseguir información sobre refugios y ayuda. ¿En qué puedo asistirte?',
  timestamp: new Date(),
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // 1. Clasificar el mensaje del usuario (Intent y Entidades)
    const { intent, entities } = classifyMessage(text);

    // 2. Crear y agregar el mensaje del usuario al historial
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      intent,
      entities,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 3. Preparar el historial de chat para la petición (formato esperado por la API)
      const chatHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const requestBody: ChatRequest = {
        messages: chatHistory,
      };

      // 4. Realizar la llamada HTTP segura a la ruta de API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor de IA.');
      }

      const data: ChatResponse = await response.json();

      // 5. Crear el mensaje de respuesta de Valentina
      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        isHandoff: data.isHandoff,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (data.isHandoff) {
        setShowHandoff(true);
      }

      return data.content; // Retornamos para que useVoice pueda hablar la respuesta
    } catch (error) {
      console.error('Error al enviar mensaje:', error);

      // Error de red/servidor: mensaje neutro, sin forzar handoff permanente
      const fallbackMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Disculpame, estoy teniendo problemas de conexión en este momento. Por favor intentá de nuevo en unos segundos.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);

      return fallbackMessage.content;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setShowHandoff(false);
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    showHandoff,
    sendMessage,
    clearChat,
  };
}
