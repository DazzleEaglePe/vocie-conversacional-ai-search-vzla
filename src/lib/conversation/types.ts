// ─── Conversation Design Types ───────────────────────────────────────────────
// Tipado central del sistema conversacional. Cada tipo mapea a un concepto
// concreto de conversation design.

export type Role = 'user' | 'assistant';

// INTENTS: las 6 intenciones que el bot reconoce (dominio acotado)
export type Intent =
  | 'buscar_persona'
  | 'reportar_desaparecido'
  | 'consultar_refugio'
  | 'consultar_ayuda'
  | 'hablar_con_humano'
  | 'fuera_de_dominio';

// ENTITIES: datos estructurados extraídos del mensaje del usuario
export interface Entity {
  nombre?: string;
  cedula?: string;
  edad?: string;
  zona?: string;
  ultimoAvistamiento?: string;
}

// Mensaje individual en la conversación
export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  intent?: Intent;
  entities?: Entity;
  isHandoff?: boolean; // señal de escalación a humano
}

// Quick replies: botones de respuesta rápida que acotan la ambigüedad
export interface QuickReply {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

// Estado global del chat
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  showHandoff: boolean;
}

// Payload que recibe el endpoint /api/chat
export interface ChatRequest {
  messages: { role: Role; content: string }[];
}

// Respuesta del endpoint /api/chat
export interface ChatResponse {
  content: string;
  isHandoff: boolean;
}
