import type { EngineInterface, On, RenderInput, RenderPropsOf, UiBlitArgs } from 'claude-code'
import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'

import { FRASES, PASADOS, SALUDOS, VERSOS } from '../hooks/cancionero'
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

test('mientras Claude trabaja el Cacique canta: pasa por todos los cuadros de su canto; en silencio no se mueve', async ($, on) => {
  on('ui.render', { component: 'AbovePrompt' }, motor)
  const reloj = mock.clock(on)
  const cuadros: string[] = []
  on('ui.blit', ($, e: UiBlitArgs) => {
    if ('cells' in e && e.key === 'retrato') cuadros.push(e.cells)
    return { value: {} }
  })

  const cantando = await $.ui.mount({ ...BANDA, props: { ...BANDA.props, maxRows: 40, isWorking: true } })
  await reloj.advance(3000)

  const distintos = new Set(RETRATO_GRANDE.canto)
  expect(distintos.size).toBe(4)
  for (const cuadro of distintos) expect(cuadros).toContain(cuadro)

  await cantando.unmount()
  const callado = await $.ui.mount({ ...BANDA, props: { ...BANDA.props, maxRows: 40 } })
  await reloj.advance(0)
  const alCallar = cuadros.length
  await reloj.advance(1000)

  expect(cuadros).toHaveLength(alCallar)
  expect((await callado.find({ key: 'retrato' }))?.props).toMatchObject({ cells: RETRATO_GRANDE.celdas })
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

const INICIO = { cwd: '/repos/cacique-code', surface: 'terminal', isInteractive: true } as const

// El mundo al abrir la sesión: la fecha, el usuario de git y el repo; devuelve los toasts que salieron y el reloj
const abrirSesion = async ($: Engine, on: On, fecha: Date, nombre = 'Luis Felipe Díaz\n') => {
  const reloj = mock.clock(on, { now: fecha.getTime() })
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('command.register', ($, e) => ({ value: { command: e.name } }))
  on('ui.status', () => ({ value: undefined }))
  on('process.run', () => ({ value: { exitCode: 0, stdout: nombre, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }))
  on('session.repo', () => ({ value: { root: '/repos/cacique-code', remote: null, internal: false, name: null } }))
  const toasts: string[] = []
  on('ui.toast', ($, e) => {
    toasts.push(e.text)
    return { value: undefined }
  })
  await $.session.start(INICIO)
  return { toasts, reloj }
}

const DIA_CORRIENTE = new Date(2026, 9, 9, 10)

test('al abrir la sesión el Cacique saluda al compadre por su nombre de git y su repo', async ($, on) => {
  expect((await abrirSesion($, on, DIA_CORRIENTE)).toasts).toContain('¡Un saludo pa’ mi compadre Luis, allá en cacique-code!')
})

test('sin nombre en git el saludo es uno de los suyos', async ($, on) => {
  const [toast] = (await abrirSesion($, on, DIA_CORRIENTE, '')).toasts
  expect(SALUDOS.map(s => `¡${s}!`)).toContain(toast)
})

test('el 26 de mayo anuncia su cumpleaños', async ($, on) => {
  expect((await abrirSesion($, on, new Date(2026, 4, 26, 10))).toasts).toContain(
    '🎂 Hoy el Cacique cumpliría 69 años. ¡Feliz 26 de mayo, diomedistas!',
  )
})

test('el 22 de diciembre es homenaje: sin parranda en el prompt y el retrato no canta', async ($, on) => {
  on('prompt.compose', () => SIN_PERSONALIDAD)
  on('ui.render', { component: 'AbovePrompt' }, motor)
  const cuadros: string[] = []
  on('ui.blit', ($, e: UiBlitArgs) => {
    if ('cells' in e) cuadros.push(e.cells)
    return { value: {} }
  })

  const { toasts, reloj } = await abrirSesion($, on, new Date(2026, 11, 22, 10))
  expect(toasts[0]).toStartWith('🕯️ Hoy hace 13 años se fue el Cacique')

  const { sections } = await $.prompt.compose(COMPOSICION)
  expect(sections.map(s => s.id)).not.toContain('cacique-code:personalidad')

  await $.ui.mount({ ...BANDA, props: { ...BANDA.props, maxRows: 40, isWorking: true } })
  await reloj.advance(1000)
  expect(cuadros).toHaveLength(0)
})

const TURNO = { answer: 'listo', isAborted: false, turnId: 't1', reason: 'answer' } as const

const avisosDe = async ($: Engine, on: On, durationMs: number) => {
  const avisos: string[] = []
  on('turn.complete', ($, e) => ({ text: e.answer }))
  on('ui.notify', ($, e) => {
    avisos.push(e.text)
    return { value: { isSent: true, channel: 'ghostty' } }
  })
  await $.turn.complete({ ...TURNO, durationMs })
  return avisos
}

test('un turno largo avisa con una notificación que terminó la parranda; uno corto no', async ($, on) => {
  const [aviso] = await avisosDe($, on, 45_000)
  expect(aviso).toEndWith('45 s. ¡Terminó la parranda!')
  expect(PASADOS.some(p => aviso!.startsWith(p))).toBe(true)
})

test('un turno corto no avisa', async ($, on) => {
  expect(await avisosDe($, on, 5_000)).toHaveLength(0)
})

test('con los avisos apagados no avisa ni un turno largo', { options: { avisos: false } }, async ($, on) => {
  expect(await avisosDe($, on, 45_000)).toHaveLength(0)
})

// Cuántos cuadros canta el retrato en un segundo al aire del modo que trae el spinner
const cuadrosPorSegundo = async ($: Engine, on: On, mode: RenderPropsOf['Spinner']['mode']) => {
  const reloj = mock.clock(on)
  let cuadros = 0
  on('ui.blit', () => {
    cuadros++
    return { value: {} }
  })
  on('ui.render', { component: 'AbovePrompt' }, motor)
  let sufijo = ''
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    sufijo = e.props.suffix
    return motor($, e)
  })
  await $.ui.render({ surface: 'terminal', component: 'Spinner', requestId: 'main', props: { word: 'x', message: null, suffix: '…', mode } })
  await $.ui.mount({ ...BANDA, props: { ...BANDA.props, maxRows: 40, isWorking: true } })
  await reloj.advance(1000)
  return { cuadros, sufijo }
}

test('el retrato canta al aire del trabajo: puya cuando corre herramientas, son cuando piensa', async ($, on) => {
  const puya = await cuadrosPorSegundo($, on, 'tool-use')
  expect(puya.sufijo).toBe('… a ritmo de puya')
  expect(puya.cuadros).toBeGreaterThanOrEqual(10)
})

test('pensando canta despacio, a ritmo de son', async ($, on) => {
  const son = await cuadrosPorSegundo($, on, 'thinking')
  expect(son.sufijo).toBe('… a ritmo de son')
  expect(son.cuadros).toBeLessThanOrEqual(4)
})

// Corre un Bash con el resultado dado mientras el globo canta; devuelve los cuadros que pintó
const cuadrosTrasBash = async ($: Engine, on: On, command: string, isError: boolean) => {
  const reloj = mock.clock(on)
  const cuadros: string[] = []
  on('ui.blit', ($, e: UiBlitArgs) => {
    if ('cells' in e) cuadros.push(e.cells)
    return { value: {} }
  })
  on('ui.render', { component: 'AbovePrompt' }, motor)
  on('tool.call', () =>
    isError ? { isError: true, result: 'falló' } : { result: { stdout: 'ok', stderr: '', interrupted: false } },
  )
  await $.ui.mount({ ...BANDA, props: { ...BANDA.props, maxRows: 40, isWorking: true } })
  await $.tool.call({ tool: 'Bash', command })
  await reloj.advance(2000)
  return cuadros
}

test('cuando los tests salen en verde el diamante del diente brilla', async ($, on) => {
  const cuadros = await cuadrosTrasBash($, on, 'npm test', false)
  for (const brillo of RETRATO_GRANDE.brillo) expect(cuadros).toContain(brillo)
})

test('si los tests fallan el diamante no brilla', async ($, on) => {
  const cuadros = await cuadrosTrasBash($, on, 'npm test', true)
  expect(cuadros).not.toContain(RETRATO_GRANDE.brillo[0])
})

test('un comando que no es de tests ni build no hace brillar el diamante', async ($, on) => {
  const cuadros = await cuadrosTrasBash($, on, 'ls -la', false)
  expect(cuadros).not.toContain(RETRATO_GRANDE.brillo[0])
})
