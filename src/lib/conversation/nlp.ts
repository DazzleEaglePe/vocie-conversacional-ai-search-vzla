import type { Intent, Entity } from './types';

// Normalizar texto (quitar acentos, convertir a minúsculas)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function classifyMessage(text: string): { intent: Intent; entities: Entity } {
  const normalized = normalizeText(text);
  let intent: Intent = 'fuera_de_dominio';

  // 1. Clasificación de Intents por reglas de palabras clave
  if (
    normalized.includes('operador') ||
    normalized.includes('coordinador') ||
    normalized.includes('humano') ||
    normalized.includes('persona real') ||
    normalized.includes('hablar con alguien') ||
    normalized.includes('emergencia medica') ||
    normalized.includes('dolor') ||
    normalized.includes('grave')
  ) {
    intent = 'hablar_con_humano';
  } else if (
    normalized.includes('refugio') ||
    normalized.includes('albergue') ||
    normalized.includes('donde dormir') ||
    normalized.includes('alojamiento') ||
    normalized.includes('techo') ||
    normalized.includes('quedarse')
  ) {
    intent = 'consultar_refugio';
  } else if (
    normalized.includes('donar') ||
    normalized.includes('voluntario') ||
    normalized.includes('ayuda') ||
    normalized.includes('viveres') ||
    normalized.includes('comida') ||
    normalized.includes('ropa') ||
    normalized.includes('colaborar') ||
    normalized.includes('donativo') ||
    normalized.includes('acopio')
  ) {
    intent = 'consultar_ayuda';
  } else if (
    normalized.includes('reportar') ||
    normalized.includes('registrar') ||
    normalized.includes('desaparecido') ||
    normalized.includes('desaparecida') ||
    normalized.includes('no aparece') ||
    normalized.includes('no lo encuentro') ||
    normalized.includes('no la encuentro') ||
    normalized.includes('no sabemos de') ||
    normalized.includes('perdi a')
  ) {
    intent = 'reportar_desaparecido';
  } else if (
    normalized.includes('buscar') ||
    normalized.includes('encontrar') ||
    normalized.includes('localizar') ||
    normalized.includes('busco a') ||
    normalized.includes('donde esta') ||
    normalized.includes('saber de') ||
    normalized.includes('paradero')
  ) {
    intent = 'buscar_persona';
  }

  // 2. Extracción de Entidades usando Expresiones Regulares
  const entities: Entity = {};

  // Extracción de Nombre
  // Buscar patrones comunes como "buscar a [Nombre]", "reportar a [Nombre]", "se llama [Nombre]", "nombre es [Nombre]"
  const nameRegexes = [
    /(?:buscar|reportar|localizar)\s+a\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /(?:se llama|nombre es)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /(?:paciente|persona)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/
  ];

  for (const regex of nameRegexes) {
    const match = text.match(regex);
    if (match && match[1]) {
      entities.nombre = match[1].trim();
      break;
    }
  }

  // Si no se encuentra con mayúsculas, intentar una versión más general con minúsculas pero acotada
  if (!entities.nombre) {
    const backupMatch = text.match(/(?:buscar a|se llama|nombre es)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,25})/i);
    if (backupMatch && backupMatch[1]) {
      // Evitar capturar palabras clave o conectores largos
      const nameCandidate = backupMatch[1].trim();
      if (!nameCandidate.includes('un ') && !nameCandidate.includes('el ')) {
        entities.nombre = nameCandidate;
      }
    }
  }

  // Extracción de Cédula (7 u 8 dígitos, opcionalmente precedida por V o E)
  const cedulaMatch = text.match(/\b(?:v|e)?-?(\d{7,8})\b/i);
  if (cedulaMatch && cedulaMatch[1]) {
    entities.cedula = cedulaMatch[1];
  }

  // Extracción de Edad (un número seguido de "años" o "de edad")
  const edadMatch = text.match(/\b(\d{1,3})\s*(?:anos|años|de edad)\b/i);
  if (edadMatch && edadMatch[1]) {
    entities.edad = edadMatch[1];
  }

  // Extracción de Zona (Localidades venezolanas conocidas)
  const venezuelanZones = [
    'caracas', 'valencia', 'maracaibo', 'barquisimeto', 'miranda', 'lara', 'zulia',
    'carabobo', 'aragua', 'tachira', 'merida', 'bolivar', 'anzoategui', 'falcon',
    'sucre', 'monagas', 'nueva esparta', 'yaracuy', 'apure', 'barinas', 'cojedes',
    'guarico', 'portuguesa', 'trujillo', 'vargas', 'la guaira', 'maracay', 'san cristobal'
  ];

  for (const zone of venezuelanZones) {
    if (normalized.includes(zone)) {
      // Capitalizar la zona encontrada para que se vea bonita en la UI
      entities.zona = zone
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      break;
    }
  }

  // Extracción de Último Avistamiento ("visto en [lugar]", "última vez en [lugar]")
  const avistamientoMatch = text.match(/(?:visto por ultima vez en|ultima vez en|visto en|desaparecio en|estaba en)\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,30})/i);
  if (avistamientoMatch && avistamientoMatch[1]) {
    entities.ultimoAvistamiento = avistamientoMatch[1].trim();
  }

  return { intent, entities };
}
