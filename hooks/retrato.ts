// El Cacique en pixel art: pelo negro crespo con patillas, el ojo derecho abierto y desviado
// (lo perdió de niño por una piedra de cauchera) y el izquierdo cerrado de risa, bigote,
// el diente de diamante y la cadena de oro sobre la camisa blanca.
// Cada celda de la terminal pinta dos píxeles con «▀»: el de arriba como letra, el de abajo como fondo.
// Si el de arriba es transparente se usa «▄» con el de abajo como letra, para no pintar el color de letra de la terminal.

// `boca`: la fila de celdas donde está la sonrisa, para que el globo de diálogo salga de ahí
// `canto`: los cuadros de la animación en orden, uno por compás; el primero es `celdas`
export type Retrato = { columnas: number; filas: number; boca: number; celdas: string; canto: readonly string[] }

// Cómo se mueve la cara en cada cuadro: las filas de píxeles que cambian y si la cabeza sube un píxel
type Gesto = 'media' | 'abierta' | 'parpadeo'
type Cambio = { filas: Record<number, string>; sube?: boolean }

// Canta dos frases y parpadea
const COMPASES: readonly (Gesto | 'cerrada')[] = [
  'cerrada', 'media', 'abierta', 'media',
  'cerrada', 'media', 'abierta', 'media',
  'parpadeo',
]

const TRANSPARENTE = 0x01000000

const PALETA: Record<string, number> = {
  '.': TRANSPARENTE,
  S: 0x8c5a3a, // piel
  s: 0x6e432a, // piel en sombra
  L: 0xab7550, // luz en nariz y pómulo
  q: 0x46291a, // borde de la cara
  M: 0x120e0c, // pelo, bigote, cejas y patillas
  n: 0x3a2a20, // rizos del pelo
  N: 0x4e3e33, // brillo del borde del pelo, para que el negro se lea sobre fondo oscuro
  E: 0x120e0c, // ojos
  w: 0xede6da, // blanco del ojo derecho
  W: 0xffffff, // dientes
  D: 0x7fe6ff, // el diamante
  m: 0x5a2219, // boca
  G: 0xe6b83e, // cadena de oro
  g: 0x9c761b, // oro en sombra
  C: 0xf4f4f2, // camisa
  c: 0xc4c6c2, // camisa en sombra
}

// 32 × 32 píxeles: el retrato de /cacique
const GRANDE = [
  '................................',
  '................................',
  '...........NNNNNNNNNN...........',
  '..........NMMMMMnMnMMN..........',
  '........NNMMnnMMMMMnMMNN........',
  '........NMMMMMMnMMMnMMnN........',
  '.......NMN.sMMnMMMnMq.NMN.......',
  '......NnMnsSSSSSSSSSSqMMMN......',
  '......NN.sSSSSSSSSSSSsq.NN......',
  '......NMsSSSSSSSSSSSSssqMN......',
  '......NMsMMMMMSSSSSSSssqMN......',
  '......NMSSSSSSSSSSMMMMMsMN......',
  '......NMSSqqqqSSSSSSSsssMN......',
  '......sMSSEEwwSSSSSEEsssMq......',
  '.....ssSSSssssSLSSESSEsssqq.....',
  '.....ssSSSSSSSSLSsSSSssssqq.....',
  '......sLLLSSSqSSsSqSSssssq......',
  '......ssLLSSMMMMMMMMSsssqq......',
  '.......sSSSMMMMMMMMMMsssq.......',
  '.......sSSMMWWWDWWWWMMssq.......',
  '........sSSSsmmmmmmsSssq........',
  '........sSSSSSSSSSSSSssq........',
  '.........sSSSssssssSSsq.........',
  '..........sSSSSSSSSSSq..........',
  '...........ssSqqqqSqq...........',
  '............Sqqqqqqs............',
  '...........cSSSSSSssc...........',
  '.........ccCGSSSSSsGCcc.........',
  '......ccCCCCSGSSSsGsCCCCcc......',
  '....ccCCCCCCCCGGGGCCCCCCCccc....',
  '...cCCCCCCCCCCCGGCCCCCCCCcccc...',
  '..cCCCCCCCCCCCCgGCCCCCCCCccccc..',
]

const GESTOS_GRANDE: Record<Gesto, Cambio> = {
  media: { filas: { 20: '........sSSSmmmmmmmmSssq........' } },
  abierta: {
    filas: {
      20: '........sSSSmmmmmmmmSssq........',
      21: '........sSSSmmmmmmmmSssq........',
      22: '.........sSSSSmmmmSSSsq.........',
    },
    sube: true,
  },
  parpadeo: {
    filas: {
      12: '......NMSSSSSSSSSSSSSsssMN......',
      13: '......sMSSMMMMSSSSSEEsssMq......',
    },
  },
}

// 16 × 16 píxeles: el de la banda sobre el prompt
const CHICO = [
  '....NNNNNNNN....',
  '...NMMnMMMMnMN..',
  '..NMnMMMMMMnMMN.',
  '..NMMsSSSSSsMMN.',
  '..MMSSSSSSSSsMM.',
  '..MSMMSSSSMMMsM.',
  '..sSEwSSSSSSSsq.',
  '..sLssSSSSEESsq.',
  '..sLSSSLsESSEsq.',
  '..sSMMMMMMMMSsq.',
  '..sMMWWDWWWWMMq.',
  '...sSmmmmmmSsq..',
  '....sSSSSSSsq...',
  '.....qssssq.....',
  '..CCCcGSSGcCCC..',
  '.CCCCCcGGcCCCcc.',
]

const MEDIO_ARRIBA = 0x2580
const MEDIO_ABAJO = 0x2584
const ESPACIO = 0x20

const celda = (arriba: number, abajo: number) => {
  if (arriba !== TRANSPARENTE) return [MEDIO_ARRIBA, arriba, abajo]
  if (abajo !== TRANSPARENTE) return [MEDIO_ABAJO, abajo, TRANSPARENTE]
  return [ESPACIO, TRANSPARENTE, TRANSPARENTE]
}

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

const aBase64 = (bytes: Uint8Array) => {
  let texto = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const [a = 0, b = 0, c = 0] = [bytes[i], bytes[i + 1], bytes[i + 2]]
    const n = (a << 16) | (b << 8) | c
    texto += ALFABETO[(n >> 18) & 63]! + ALFABETO[(n >> 12) & 63]!
    texto += i + 1 < bytes.length ? ALFABETO[(n >> 6) & 63]! : '='
    texto += i + 2 < bytes.length ? ALFABETO[n & 63]! : '='
  }
  return texto
}

const GESTOS_CHICO: Record<Gesto, Cambio> = {
  media: { filas: { 12: '....sSmmmmSsq...' } },
  abierta: { filas: { 12: '....smmmmmmsq...' } },
  parpadeo: { filas: { 6: '..sSMMSSSSSSSsq.' } },
}

const color = (fila: string | undefined, x: number) => PALETA[fila?.[x] ?? '.'] ?? TRANSPARENTE

const codificar = (pixeles: readonly string[]) => {
  const columnas = pixeles[0]!.length
  const filas = Math.ceil(pixeles.length / 2)
  const palabras = new Uint32Array(columnas * filas * 3)
  for (let y = 0; y < filas; y++) {
    for (let x = 0; x < columnas; x++) {
      palabras.set(celda(color(pixeles[2 * y], x), color(pixeles[2 * y + 1], x)), (y * columnas + x) * 3)
    }
  }
  return { columnas, filas, celdas: aBase64(new Uint8Array(palabras.buffer)) }
}

// Al subir, la fila de arriba sale del cuadro y la de abajo se repite
const gesticular = (pixeles: readonly string[], { filas, sube }: Cambio) => {
  const cara = pixeles.map((fila, y) => filas[y] ?? fila)
  return sube ? [...cara.slice(1), cara.at(-1)!] : cara
}

const pintar = (pixeles: readonly string[], gestos: Record<Gesto, Cambio>): Retrato => {
  const quieto = codificar(pixeles)
  const cuadros = { cerrada: quieto.celdas, media: '', abierta: '', parpadeo: '' }
  for (const gesto of ['media', 'abierta', 'parpadeo'] as const) {
    cuadros[gesto] = codificar(gesticular(pixeles, gestos[gesto])).celdas
  }
  return {
    ...quieto,
    boca: Math.floor(pixeles.findIndex(fila => fila.includes('W')) / 2),
    canto: COMPASES.map(compas => cuadros[compas]),
  }
}

export const RETRATO_GRANDE = pintar(GRANDE, GESTOS_GRANDE)
export const RETRATO_CHICO = pintar(CHICO, GESTOS_CHICO)
