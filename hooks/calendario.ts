// Los dos días del Cacique: nació el 26 de mayo de 1957 en La Junta y murió el 22 de diciembre
// de 2013 en Valledupar (https://es.wikipedia.org/wiki/Diomedes_D%C3%ADaz). En su cumpleaños la
// fanaticada le lleva serenata a la tumba; en el aniversario de su muerte se le recuerda sin parranda.
export type Dia = 'cumpleanos' | 'homenaje' | 'corriente'

const NACIO = 1957
const MURIO = 2013

// Clave «mes-día», con el mes desde 1
const DIAS: Record<string, Dia> = {
  '5-26': 'cumpleanos',
  '12-22': 'homenaje',
}

export const diaDelCacique = (fecha: Date): Dia => DIAS[`${fecha.getMonth() + 1}-${fecha.getDate()}`] ?? 'corriente'

// Lo que dice el toast al abrir la sesión ese día; los días corrientes saluda
export const ANUNCIOS: Record<Exclude<Dia, 'corriente'>, (año: number) => string> = {
  cumpleanos: año => `🎂 Hoy el Cacique cumpliría ${año - NACIO} años. ¡Feliz 26 de mayo, diomedistas!`,
  homenaje: año => `🕯️ Hoy hace ${año - MURIO} años se fue el Cacique de La Junta. Hoy no hay parranda.`,
}
