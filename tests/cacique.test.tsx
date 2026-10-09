import type { EngineInterface, RenderInput } from 'claude-code'
import { expect, test } from 'claude-code/testing'

import { FRASES, PASADOS, VERSOS } from '../hooks/cancionero'
import { RETRATO_CHICO, RETRATO_GRANDE } from '../hooks/retrato'

// Lo que el motor dibujaría debajo del mod
const motor = ($: EngineInterface, e: RenderInput) => {
  const { Text } = $.ui.resolve(e)
  return <Text>lo del motor</Text>
}

const BANDA = {
  plugin: 'cacique-code',
  surface: 'terminal',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 6,
    bodyColumns: 100,
    scroll: { offset: 0, bodyRows: 6 },
    view: {},
  },
} as const

test('el spinner canta el verso que el turno sorteó', async ($, on) => {
  let palabra = ''
  on('turn.start', ($, e) => ({ turnId: e.turnId }))
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    palabra = e.props.word
    return motor($, e)
  })

  await $.turn.start({ text: 'hola', turnId: 't1' })
  await $.ui.render({
    surface: 'terminal',
    component: 'Spinner',
    requestId: 'main',
    props: { word: 'Sauteing', message: null, suffix: '…', mode: 'thinking' },
  })

  expect(VERSOS).toContain(palabra)
})

test('el cierre de turno dice un pasado del cancionero', async ($, on) => {
  let palabra = ''
  on('ui.render', { component: 'TurnDuration' }, ($, e) => {
    palabra = e.props.word
    return motor($, e)
  })

  await $.ui.render({
    surface: 'terminal',
    component: 'TurnDuration',
    requestId: 'fin',
    props: { word: 'Baked', durationMs: 3000 },
  })

  expect(palabra).not.toBe('Baked')
  expect(PASADOS).toContain(palabra)
})

test('/cacique frases lista las sesenta y una frases', async $ => {
  const corrida = await $.command.run({
    command: 'cacique',
    args: 'frases',
    origin: { kind: 'composer' },
    presentation: { isFullscreen: false, columns: 100 },
  })

  expect(FRASES).toHaveLength(61)
  for (const f of FRASES) expect(corrida.text).toContain(f.texto)
})

test('el Cacique dice una frase en su globo, "Otra" la cambia y "Ocultar" la quita', async ($, on) => {
  on('ui.render', { component: 'AbovePrompt' }, motor)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BANDA, surface })
    const antes = (await ui.find({ key: 'dialogo' }))?.text
    await ui.press({ key: 'otra' })
    const despues = (await ui.find({ key: 'dialogo' }))?.text

    expect(antes).toBeDefined()
    expect(despues).not.toBe(antes)
    await ui.unmount()
  }

  const ui = await $.ui.mount(BANDA)
  await ui.press({ key: 'ocultar' })
  expect(await ui.find({ key: 'otra' })).toBeUndefined()
})

test('la banda muestra el retrato grande, el chico si no cabe, y ninguno si la banda es mínima', async ($, on) => {
  on('ui.render', { component: 'AbovePrompt' }, motor)
  const retratoCon = async (maxRows: number) => {
    const ui = await $.ui.mount({ ...BANDA, props: { ...BANDA.props, maxRows } })
    const retrato = await ui.find({ key: 'retrato' })
    await ui.unmount()
    return retrato
  }

  expect((await retratoCon(40))?.props).toMatchObject({ rows: RETRATO_GRANDE.filas })
  expect((await retratoCon(10))?.props).toMatchObject({ rows: RETRATO_CHICO.filas })
  expect(await retratoCon(3)).toBeUndefined()
})

test('/cacique sale con el retrato al lado', async ($, on) => {
  on('ui.render', { component: 'CommandOutput' }, motor)

  const ui = await $.ui.mount({
    plugin: 'cacique-code',
    surface: 'terminal',
    component: 'CommandOutput',
    props: { command: 'cacique', args: '', text: '> Póngale una docena.', isErrored: false },
  })

  expect(await ui.find({ key: 'retrato' })).toBeDefined()
})

const SIN_PERSONALIDAD = { sections: [{ id: 'intro', text: 'motor', scope: 'shared' as const }] }
const COMPOSICION = { model: 'm', promptModel: 'm', surfaces: [], tools: [], outputStyle: null, traits: [] }

test('el modo parranda le pone la personalidad al prompt del sistema', async ($, on) => {
  on('prompt.compose', () => SIN_PERSONALIDAD)

  const { sections } = await $.prompt.compose(COMPOSICION)

  expect(sections.map(s => s.id)).toContain('cacique-code:personalidad')
})

test('sin modo parranda el prompt del sistema queda como estaba', { options: { parranda: false } }, async ($, on) => {
  on('prompt.compose', () => SIN_PERSONALIDAD)

  const { sections } = await $.prompt.compose(COMPOSICION)

  expect(sections.map(s => s.id)).not.toContain('cacique-code:personalidad')
})

const leerCeldas = (base64: string) => {
  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  const bytes: number[] = []
  for (let i = 0; i < base64.length; i += 4) {
    const [a, b, c, d] = [...base64.slice(i, i + 4)].map(ch => (ch === '=' ? 0 : alfabeto.indexOf(ch)))
    const n = (a! << 18) | (b! << 12) | (c! << 6) | d!
    bytes.push((n >> 16) & 255, (n >> 8) & 255, n & 255)
  }
  const palabras = new Uint32Array(new Uint8Array(bytes.slice(0, Math.floor(bytes.length / 4) * 4)).buffer)
  return Array.from({ length: palabras.length / 3 }, (_, i) => palabras.slice(i * 3, i * 3 + 3))
}

test('ningún medio bloque pinta con el color de letra de la terminal', async () => {
  for (const retrato of [RETRATO_GRANDE, RETRATO_CHICO]) {
    const celdas = leerCeldas(retrato.celdas)

    expect(celdas).toHaveLength(retrato.columnas * retrato.filas)
    for (const [glifo, letra] of celdas) {
      if (glifo !== 0x20) expect(letra).not.toBe(0x01000000)
    }
  }
})
