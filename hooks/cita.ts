import type { Frase } from '../types'
import { FRASES } from './cancionero'

// Lo que el modelo lee de la herramienta frase_del_cacique: así cita del cancionero verificado y no de memoria
export const HERRAMIENTA = {
  name: 'frase_del_cacique',
  description:
    'Devuelve un dicho verificado de Diomedes Díaz con su contexto y la fuente de prensa donde aparece. ' +
    'Úsala siempre que vayas a citar a Diomedes, en vez de citarlo de memoria, y cita el texto tal cual.',
  inputSchema: {
    type: 'object',
    properties: {
      tema: {
        type: 'string',
        description: 'Palabras para elegir un dicho a propósito (p. ej. «plata», «muerte», «parranda»); sin tema, uno al azar',
      },
    },
  },
  isDeferred: false,
}

const sinTildes = (texto: string) => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

// Las frases que mencionan alguna palabra del tema; si ninguna la menciona, todas
export const frasesSobre = (tema: string | undefined): readonly Frase[] => {
  const palabras = sinTildes(tema ?? '').split(/[^a-z0-9]+/).filter(p => p.length > 2)
  const halladas = FRASES.filter(f => palabras.some(p => sinTildes(`${f.texto} ${f.contexto}`).includes(p)))
  return halladas.length > 0 ? halladas : FRASES
}

export const citar = (f: Frase) => `«${f.texto}» — Diomedes Díaz, ${f.contexto}. Fuente: ${f.fuente}`
