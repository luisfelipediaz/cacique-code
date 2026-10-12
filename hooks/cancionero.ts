import type { Frase } from '../types'

// Lo que dice el spinner mientras Claude trabaja (reemplaza «Sauteing», «Baking»…)
export const VERSOS = [
  'Parrandeando',
  'Afinando el acordeón',
  'Componiendo',
  'Saludando a la fanaticada',
  'Cantándole a La Junta',
  'Echando el verso',
  'Montando la parranda',
  'Tocando caja y guacharaca',
  'Improvisando una piquería',
  'Puliendo el diamante',
] as const

// Lo que dice la línea que cierra el turno («Baked for 3s»)
export const PASADOS = ['Parrandeó', 'Cantó', 'Compuso', 'Tocó', 'Versió', 'Grabó'] as const

// Lo que el modelo lee en su prompt de sistema cuando el modo parranda está prendido
export const PERSONALIDAD = `Eres Cacique Code, Claude Code vestido de vallenato en homenaje a Diomedes Díaz, el Cacique de La Junta.
Abre cada respuesta con un saludo corto a su estilo («¡Ay hombe!», «¡Con mucho gusto!», «¡Listo pa’ la foto!») y, cuando venga al caso, cierra con uno de sus dichos.
Ese sabor va solo en la conversación: el código, los comandos, los mensajes de commit, los PR y los archivos que escribas van normales, sin jerga ni saludos.
Cuando cites un dicho suyo, sácalo con la herramienta mcp__cacique-code__frase_del_cacique y cítalo tal cual con su fuente: nunca le atribuyas a Diomedes una frase que no sea suya.`

// Muletillas verificadas en prensa (El Heraldo, Santa Marta Al Día) más títulos de sus discos
export const SALUDOS = [
  'Con mucho gusto',
  'Como Diomedes no hay otro',
  'Listo pa’ la foto',
  'Diomedes Díaz y el Cacique Code, pa’ mi fanaticada',
] as const

const MCCAUSLAND = 'https://lakalle.bluradio.com/entretenimiento/farandula/diomedes-diaz-y-la-historia-de-su-frase-que-se-convirtio-en-meme-yo-no-se-ernesto-no-se-so35'
const FESTIVAL = 'https://festivalvallenato.com/diomedes-diaz-artista-de-amores-dichos-y-cantos/'
const INFOBAE_MUJERES = 'https://www.infobae.com/colombia/2025/05/26/diomedes-diaz-revelo-su-preferencia-por-las-mujeres-feas-a-traves-de-sus-dichos-mas-famosos-a-las-bonitas-las-miran-mas/'
const SANTA_MARTA = 'https://santamartaaldia.co/los-dichos-frases-jocosas-y-salidas-de-tono-de-diomedes/'
const EXTRATEGIA = 'https://extrategiamedios.com/las-frases-inolvidables-de-diomedes-diaz-10-anos-despues-de-su-partida/'
const HERALDO = 'https://www.elheraldo.co/famosos/2020/05/26/diomedes-diaz-25-frases-de-el-papa-de-los-pollitos-729080/'
const TROPICANA = 'https://www.tropicanafm.com/2026/50-frases-inolvidables-de-diomedes-diaz-por-las-que-fue-apodado-el-papa-de-los-pollitos-436851.html'

// Las 61, cada una con la fuente donde se verificó
export const FRASES: readonly Frase[] = [
  {
    texto: 'Si yo supiera que muerto serviría más, me moriría hoy mismo, pero no sé, Ernesto, no sé.',
    contexto: 'entrevista en video con Ernesto McCausland',
    fuente: MCCAUSLAND,
  },
  {
    texto: 'Póngale una docena.',
    contexto: 'a McCausland, cuando le preguntó cuántas viudas dejaría',
    fuente: 'https://www.elespectador.com/entretenimiento/gente/diomedes-diaz-el-dia-que-el-cacique-predijo-lo-que-pasaria-luego-de-su-muerte/',
  },
  {
    texto: 'Tómense un Águila, contraten una prepago y a culiar.',
    contexto: 'consejo a los jóvenes desde la tarima, en video viral',
    fuente: 'https://www.bluradio.com/nacion/tomense-una-cerveza-contraten-una-prepago-y-a-c-diomedes-a-jovenes',
  },
  {
    texto: '¡Que vivan los mongólicos!',
    contexto: 'en tarima, al saludar a un niño con discapacidad',
    fuente: 'https://www.publimetro.co/deportes/2026/08/24/davo-xeneize-cayo-en-la-trampa-colombiano-le-mando-un-saludo-de-diomedes-y-su-reaccion-fue-epica/',
  },
  {
    texto: 'Como Diomedes no hay otro, ese nunca nacería, y si nace no se cría, y si se cría se vuelve loco.',
    contexto: 'su dicho de cabecera',
    fuente: FESTIVAL,
  },
  {
    texto: 'A mí me gustan las mujeres feas porque muchos no las miran, en cambio a las bonitas, sí.',
    contexto: 'respuesta en una entrevista',
    fuente: INFOBAE_MUJERES,
  },
  {
    texto: 'Me llaman la atención las muchachas del servicio doméstico. Ellas son buenas, nobles y sanas.',
    contexto: 'respuesta en una entrevista',
    fuente: INFOBAE_MUJERES,
  },
  {
    texto: 'Usted no sea tan sapo, tan lambón.',
    contexto: 'a un espectador que lo apuraba, concierto en Soledad (Atlántico), 1996',
    fuente: 'https://www.eltiempo.com/cultura/gente/diomedes-diaz-la-historia-de-su-frase-mas-polemica-usted-no-sea-tan-sapo-3346510',
  },
  {
    texto: 'Denme licor que el agua es pa’ las matas.',
    contexto: 'saludo en una grabación',
    fuente: FESTIVAL,
  },
  {
    texto: 'Toque el acordeón.',
    contexto: 'en tarima, en plena pelea con Omar Geles, Valledupar 2005',
    fuente: 'https://www.eltiempo.com/cultura/gente/video-omar-geles-y-la-vez-que-se-peleo-en-vivo-y-en-tarima-con-diomedes-diaz-lo-mandaron-a-callar-3345198',
  },
  {
    texto: 'Pa’ lo que hay que ver hoy en día, mejor es estar uno ciego.',
    contexto: 'en tarima, su consejo a una niña invidente para que no se apenara',
    fuente: EXTRATEGIA,
  },
  {
    texto: '¡Que vivan los locos!',
    contexto: 'en tarima, tras subir a un hombre con problemas del habla',
    fuente: SANTA_MARTA,
  },
  {
    texto: 'No es que el zorro sea atrevido, sino que las gallinas se van lejos.',
    contexto: 'dicho en la grabación de «Vení, vení»',
    fuente: HERALDO,
  },
  {
    texto: 'Si una vela se me apaga, la otra me queda prendida.',
    contexto: 'dicho sobre las mujeres',
    fuente: HERALDO,
  },
  {
    texto: 'Al que le van a dar le guardan, y si está frío, se lo calientan.',
    contexto: 'dicho sobre las mujeres',
    fuente: HERALDO,
  },
  {
    texto: 'Ahora es que se va a ver cuál es el chivo que más mea.',
    contexto: 'dicho de parranda',
    fuente: HERALDO,
  },
  {
    texto: 'Las vacas pariendo y yo bebiendo.',
    contexto: 'dicho de parranda',
    fuente: HERALDO,
  },
  {
    texto: 'El que tiene pa’l whisky, tiene pa’l hielo.',
    contexto: 'dicho de parranda',
    fuente: HERALDO,
  },
  {
    texto: 'Mátame guayabo, ya que el amor no pudo.',
    contexto: 'dicho en la grabación de «Sin saber que me espera»',
    fuente: HERALDO,
  },
  {
    texto: 'La que me dejó a mí, no fue por falta de chuzo, porque casi se lo borro.',
    contexto: 'en una presentación, para sacarse el clavo de una ruptura',
    fuente: 'https://revistaentornos.com/de-musas-a-escaramuzas/',
  },
  {
    texto: 'Al negro, este… hay que marcarlo con una tiza, porque como se vaya la luz no lo encontramos.',
    contexto: 'en video',
    fuente: 'https://www.tiktok.com/@royalty_shirts/video/7520379217041755398',
  },
  {
    texto: 'Ay Virgen del Carmen, dame vida, dame salud, que lo demás lo resuelvo yo.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Sólo el que está bajo el techo, es el que sabe donde cae la gotera.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'La mujer es como el toro bravo, que si usted se descuida le pega.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Ese servidor de trago mío acaso cree que esto es penicilina, cada 3 horas dándome… así no son las cosas.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'El que tiene la plata, la tiene aquí, pero pa’l otro mundo no lleva na’.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'La plata del pobre no vale ná, porque cuando la coge, la va a pagar.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'El que muere por su gusto, hasta la muerte le sale.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Cuántos de todos esos millones que están guardaos y que son míos, no daría yo ahora, pa’ que mi papá se levantara de esa tumba fría.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Todos los pájaros vuelan pero no cantan igual.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Ojalá el mar fuera mío, pa’ dártelo con to’ y pescao.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'El hombre no vale por el terreno que pisa sino por el horizonte que descubren sus ojos.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Lo que pasa es que hay unas que creen que el mundo es de ellas y los demás viven alquilaos, ¡así no es!',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Ándenme la tabla que los clavos los pongo yo.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Se vuelven como el nido de la paloma, pura paja y cag…',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Sépase una cosa, otro Diomedes no va a nacer… pero puede haber un gran Rafael Santos.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Diomedes Díaz es el papá del cantante que tú tienes.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Porque sobre de mí, la ropa y las moscas, por imprudentes.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Ser rico es mejor.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'No es que uno se muera, sino lo que dura muerto.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Yo no tengo ni tengo ni necesito, pero si me dan, cojo.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Jesucristo se murió hace más de 2.000 años… ¿esperarlo? Ese no vuelve más… los evangélicos morirán engañados.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'El perro puede ser muy fino, pero es perro.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Se hace bien o no se hace na’.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Ya los esclavos se acabaron y los vividores van en las mismas, decayendo, decayendo.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Al que le gusta el barro, carga el terrón en la mochila y el que le gusta la mujer, no perdona ninguna.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Los que van adelante, no van lejos si los de atrás se apuran.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'A sembrar arroz, porque esto está malo.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'No hay chorro que no termine en gota.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Hoy amanezco como el ternero sin enrejá, sabroso.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Arriba está el que pa’bajo mira.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'No se le olvide, que el hambre se va pero vuelve, vuelve.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Después no vaya a salir que la puerca parió y que los cochinitos se perdieron.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Ganao que amansa otro, algún resabio le queda.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'De ahí va pa’ allá, bejuco que se atraviese, machete con él.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Tantas penas para un sólo corazón.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Según el último diagnóstico médico, por ahora la muerte tendrá que esperar, aleluya.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: '¡Vivan los hombres, vivos o muertos pero, vivan los hombres!',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'No es que sea bonito, pero sabroso sí la hemos pasao.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Ábranle el ojo al cajón y por lo que veo todos los que están aquí son de clase media, y esa es cosa cara un entierro de pobre.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
  {
    texto: 'Yo a lo único que puedo temerle es al agua, a la luz y a los impuestos.',
    contexto: 'uno de sus dichos',
    fuente: TROPICANA,
  },
]
