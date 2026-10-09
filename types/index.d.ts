export type Frase = { texto: string; contexto: string; fuente: string }

declare module 'claude-code' {
  interface PluginState {
    'cacique-code': { verso: string; frase: number; isHidden: boolean }
  }
}
