import { atom, read, update } from 'claude-code'
import type { EngineInterface, PluginOptions, Register } from 'claude-code'

import { FRASES, PASADOS, PERSONALIDAD, SALUDOS, VERSOS } from './cancionero'
import { RETRATO_CHICO, RETRATO_GRANDE } from './retrato'
import type { Retrato } from './retrato'

const COMANDO = 'cacique'
const ESTADO = '🪗 Cacique Code · desde La Junta pa’l mundo'

const verso = atom({ plugin: 'cacique-code', key: 'verso' } as const, VERSOS[0]!)
const frase = atom({ plugin: 'cacique-code', key: 'frase' } as const, 0)
const isHidden = atom({ plugin: 'cacique-code', key: 'isHidden' } as const, false)

const SONIDOS = 'sounds'
const ES_AUDIO = /\.(mp3|wav|m4a|aiff?)$/i

type Momento = 'inicio' | 'fin' | 'error' | ''

const ANCHO_DEL_DIALOGO = 42
// Globo de una línea (3) + firma (1) + botones (1)
const ALTO_DEL_DIALOGO = 5

const celdas = (r: Retrato) => ({ columns: r.columnas, rows: r.filas, cells: r.celdas })

// Mientras Claude trabaja el retrato del globo canta: pasa por los cuadros de su canto a este compás
const COMPAS_MS = 150
let canto: { cancel: () => void } | undefined

const callar = () => {
  canto?.cancel()
  canto = undefined
}

const cantar = ($: EngineInterface, requestId: string, r: Retrato) => {
  callar()
  let compas = 0
  canto = $.clock.every(COMPAS_MS, () => {
    compas = (compas + 1) % r.canto.length
    $.ui.blit({ requestId, key: 'retrato', cells: r.canto[compas]! }).catch(callar)
  })
}

const alAzar = <T,>(lista: readonly T[]): T => lista[Math.floor(Math.random() * lista.length)]!
const otraFrase = (actual: number) => (actual + 1 + Math.floor(Math.random() * (FRASES.length - 1))) % FRASES.length

const RESPUESTAS: Record<string, () => string> = {
  '': () => {
    const f = alAzar(FRASES)
    return `> ${f.texto}\n\n— Diomedes Díaz, ${f.contexto}\n\nFuente: ${f.fuente}`
  },
  frases: () =>
    FRASES.map((f, i) => `${i + 1}. **«${f.texto}»**\n   ${f.contexto} · [fuente](${f.fuente})`).join('\n'),
  saludo: () => `¡${alAzar(SALUDOS)}!`,
  sonar: () => '🪗 ¡Suena el Cacique!',
}

// Toca un audio de sounds/ cuyo nombre empiece por el momento (inicio-*.mp3, fin-*.mp3, error-*.mp3);
// '' elige entre todos. Sin archivos, o con los sonidos apagados, no suena nada.
async function sonar($: EngineInterface, options: PluginOptions, momento: Momento) {
  if (options.sonidos === false) return
  try {
    const audios = (await $.fs.list(`${$.plugin.root}/${SONIDOS}`)).filter(
      f => f.kind === 'file' && ES_AUDIO.test(f.name) && f.name.startsWith(momento),
    )
    if (audios.length > 0) await $.audio.play({ asset: `${SONIDOS}/${alAzar(audios).name}` })
  } catch {
    // sin carpeta de sonidos o sin reproductor: el Cacique canta en silencio
  }
}

export const register: Register = (on, options) => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: COMANDO,
      description: 'Una frase del Cacique de La Junta (args: frases | saludo | sonar)',
      argumentHint: '[frases|saludo|sonar]',
    })
    $.ui.status(ESTADO)
    $.ui.toast(`¡${alAzar(SALUDOS)}!`)
    void sonar($, options, 'inicio')

    return next(e)
  })

  on('command.run', { command: COMANDO }, async ($, e) => {
    const pedido = e.args.trim().toLowerCase()
    const responder = RESPUESTAS[pedido] ?? RESPUESTAS['']!
    if (pedido === 'sonar') void sonar($, options, '')

    return { text: responder() }
  })

  on('ui.render', { component: 'CommandOutput', props: { command: COMANDO } }, ($, e, next) => {
    if (e.surface !== 'terminal' || e.props.isErrored) return next(e)

    const { Box, Markdown, Raster } = $.ui.resolve(e)

    return (
      <Box gap={2}>
        <Raster key="retrato" {...celdas(RETRATO_GRANDE)} />
        <Box flexDirection="column" flexShrink={1}>
          <Markdown key="texto" text={e.props.text} />
        </Box>
      </Box>
    )
  })

  on('prompt.compose', async ($, e, next) => {
    const compuesto = await next(e)
    if (options.parranda === false) return compuesto

    return {
      sections: [...compuesto.sections, { id: 'cacique-code:personalidad', text: PERSONALIDAD, scope: 'session' }],
    }
  })

  on('turn.complete', async ($, e, next) => {
    void sonar($, options, 'fin')

    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    await update($, verso, () => alAzar(VERSOS))
    await update($, frase, otraFrase)

    return next(e)
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) =>
    next({ ...e, props: { ...e.props, word: await read($, verso) } }),
  )

  on('ui.render', { component: 'TurnDuration' }, ($, e, next) =>
    next({ ...e, props: { ...e.props, word: PASADOS[e.props.durationMs % PASADOS.length]! } }),
  )

  on('ui.render', { component: 'PromptHint' }, ($, e, next) =>
    next({ ...e, props: { ...e.props, tail: e.props.isWorking ? '¡ay hombe!' : '🪗 /cacique' } }),
  )

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    callar()
    if (e.props.hasSurvey || (await read($, isHidden))) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)
    const { texto, contexto } = FRASES[await read($, frase)]!

    // El globo de diálogo; con retrato, su punta sale a la altura de la boca
    const dialogo = (punta: boolean, bajada: number) => (
      <Box flexDirection="column" flexShrink={1} marginTop={bajada}>
        <Box>
          {punta && (
            <Box marginTop={1}>
              <Text color="yellow">◀</Text>
            </Box>
          )}
          <Box key="dialogo" borderStyle="round" borderColor="yellow" paddingX={1} flexShrink={1}>
            <Text color="yellow">{texto}</Text>
          </Box>
        </Box>
        <Text dimColor>  — Diomedes Díaz, {contexto}</Text>
        <Box>
          <Button key="otra" label="Otra" onPress={() => update($, frase, otraFrase)} />
          <Button key="ocultar" label="Ocultar" onPress={() => update($, isHidden, () => true)} />
        </Box>
      </Box>
    )

    // El grande donde quepa; si la banda está corta (pantalla completa la limita a media terminal), el chico
    const cabe = (r: Retrato) => r.filas <= e.props.maxRows && r.columnas + ANCHO_DEL_DIALOGO <= e.props.bodyColumns
    const retrato = [RETRATO_GRANDE, RETRATO_CHICO].find(cabe)
    if (e.surface !== 'terminal' || retrato === undefined) return dialogo(false, 0)

    const { Raster } = $.ui.resolve(e)
    // La punta va una fila bajo el borde superior del globo; sin pasarse del alto del retrato
    const bajada = Math.max(0, Math.min(retrato.boca - 1, retrato.filas - ALTO_DEL_DIALOGO))
    if (e.props.isWorking) cantar($, e.requestId, retrato)

    return (
      <Box>
        <Raster key="retrato" {...celdas(retrato)} />
        {dialogo(true, bajada)}
      </Box>
    )
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)
    const isDesafinado = ran.deny === undefined && ran.isError === true

    $.ui.status(isDesafinado ? '🪗 Se desafinó el acordeón: el comando falló' : ESTADO)
    if (isDesafinado) void sonar($, options, 'error')

    return ran
  })
}
