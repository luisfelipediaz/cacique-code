# Cacique Code 🪗

Claude Code con alma vallenata, en homenaje a Diomedes Díaz, el Cacique de La Junta.

![El Cacique canta mientras Claude trabaja y el diamante del diente brilla cuando los tests pasan](preview/cacique.gif)

- **Spinner** con versos de parranda («Afinando el acordeón», «Tocando caja y guacharaca»…) y cierre de turno en pasado («Parrandeó», «Cantó»…).
- **Globo sobre el prompt** con el retrato del Cacique y una de sus frases, con botones `[ Otra ]` y `[ Ocultar ]`.
- **El Cacique canta** al aire de lo que hace Claude: son cuando piensa, paseo cuando escribe, merengue cuando arma una herramienta y puya cuando la corre. Abre y cierra la boca, sube la cabeza en las notas altas y parpadea.
- **El diente que brilla**: cuando los tests, el build o el lint salen bien, el diamante destella.
- **El saludo grabado**: al abrir la sesión te saluda por tu nombre de git y el de tu repo, como en sus grabaciones.
- **¡Terminó la parranda!**: notificación del sistema cuando termina un turno de 30 segundos o más (opción *Avisos*).
- **Sus fechas**: el 26 de mayo celebra su cumpleaños; el 22 de diciembre, aniversario de su muerte, se le recuerda sin parranda, sin sonidos y sin canto.
- **Citas verificadas**: con el modo parranda, Claude saca los dichos del Cacique con la herramienta `frase_del_cacique`, del cancionero verificado y con su fuente, en vez de citarlo de memoria.
- **`/cacique`**: una frase al azar con su fuente. `/cacique frases` las lista todas; `/cacique saludo` y `/cacique sonar` también.
- **Modo parranda** (opcional): Claude saluda y se despide a su estilo, solo en la conversación; el código, los commits y los PR quedan normales.
- **Sonidos** (opcionales): los audios que pongas en `sounds/` (`inicio-*.mp3`, `fin-*.mp3`, `error-*.mp3`) suenan al iniciar, al terminar un turno y cuando falla un comando.

## Instalación

En una sesión de Claude Code en la terminal:

```
/plugin install cacique-code --marketplace luisfelipediaz/cacique-code
```

Responde `y` para agregar el marketplace, elige el scope y configura las opciones.

## Los botones del globo

Dale el foco al globo con `ctrl+x` y luego `tab`, y presiona `o` para otra frase o `c` para ocultarlo (`Esc` vuelve al prompt). En pantalla completa también funcionan con click.

## Las frases

Están en `hooks/cancionero.ts`, cada una con el enlace a la fuente donde aparece. Varias son subidas de tono: es el Cacique.

## Aviso

Cacique Code es un homenaje de un fan, sin ánimo de lucro, y no tiene ninguna relación con Diomedes Díaz, su familia, sus herederos ni sus disqueras. No incluye letras ni grabaciones suyas: solo títulos de sus discos y dichos citados con la fuente de prensa donde aparecen. El retrato es un dibujo en pixel art hecho para el mod.
