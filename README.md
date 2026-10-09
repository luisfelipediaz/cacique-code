# Cacique Code 🪗

Claude Code con alma vallenata, en homenaje a Diomedes Díaz, el Cacique de La Junta.

- **Spinner** con versos de parranda («Afinando el acordeón», «Tocando caja y guacharaca»…) y cierre de turno en pasado («Parrandeó», «Cantó»…).
- **Globo sobre el prompt** con el retrato del Cacique y una de sus frases, con botones `[ Otra ]` y `[ Ocultar ]`.
- **El Cacique canta**: mientras Claude trabaja, el retrato del globo abre y cierra la boca, sube la cabeza en las notas altas y parpadea.
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

En la terminal normal el click no llega a los botones: usa `ctrl+x` y luego `tab` para darle el foco al globo, muévete con `tab` y presiona con `Enter` (`Esc` vuelve al prompt). En pantalla completa funcionan con click.

## Las frases

Están en `hooks/cancionero.ts`, cada una con el enlace a la fuente donde aparece. Varias son subidas de tono: es el Cacique.
