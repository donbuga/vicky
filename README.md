# Aventura Matemática

Juego educativo para practicar contenidos de matemática de 1º básico. Desde el portal, abre **Matemáticas → Evaluación del 13 de agosto**.

## Instalar y ejecutar

```bash
npm install
npm run dev
```

Para comprobar la versión de producción: `npm run build`.

## Estructura

- `src/components`: piezas visuales reutilizables.
- `src/games`: presentación de los ejercicios.
- `src/utils/exerciseGenerators.ts`: generadores matemáticos desacoplados.
- `src/hooks`: sonido y persistencia con `localStorage`.
- `src/data` y `src/types`: mundos y contratos de datos.

## Agregar ejercicios

Crea un generador que devuelva `Exercise` en `exerciseGenerators.ts`, agrégalo a `makeExercise` y, si necesita otra visualización, incorpora el nuevo tipo visual en `ExerciseCard`.


## Ciencias → Prueba del Sol

Juego para Victoria, de 1º básico, integrado en el menú de Ciencias. Sigue la
convención de los juegos independientes de `html/`: HTML, CSS, SVG y módulos
JavaScript, sin dependencias externas ni instalación. No requiere backend.

Desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/html/prueba-del-sol.html` o entra desde Ciencias
en `http://localhost:8000/`. Usa HTTP: abrir el archivo directamente con `file://`
no permite cargar módulos en algunos navegadores. También funciona en GitHub Pages.

- `html/sol/questions.mjs`: 36 preguntas editables, temas, conceptos, pistas y explicaciones.
- `html/sol/engine.mjs`: selección equilibrada, dos intentos, estrellas y repaso por concepto.
- `html/sol/game.mjs`: interfaz, voz del navegador y demostración día/noche.
- `html/sol/art.mjs` y `style.css`: ilustraciones SVG y diseño adaptable.

Cada partida tiene 12 preguntas, todos los temas (una o dos preguntas por tema)
y los cinco formatos. Cada respuesta acertada, incluso al segundo intento, suma
una estrella. Los errores del primer intento también se incluyen en el repaso,
que puede tener otra cantidad de preguntas y usa solo los conceptos con errores.
La voz prefiere `es-CL`, usa otra voz española si está disponible y conserva la
opción de narración automática localmente; el juego funciona también sin voz.
La demostración es un modelo simplificado visto desde arriba, no un mapa exacto.

Verificación de lógica y contenido (Node 18 o posterior):

```bash
node --test tests/sol.test.mjs
```

El juego se sirve directamente desde `html/`, como los demás juegos de Ciencias;
no necesita el build de Vite de las otras aplicaciones del repositorio.


## Historia → Prueba de unidades de tiempo

Desde Historia, abre **Prueba de unidades de tiempo** o visita
`html/prueba-de-unidades-de-tiempo.html`. Se sirve directamente como sitio
estático, sin dependencias ni build.

Incluye práctica diaria de ayer/hoy/mañana con la fecha local del dispositivo,
práctica por seis temas y una prueba equilibrada de 18 preguntas. Evalúa días,
meses, años, inicio y fin de semana, calendarios y antes/ahora/después.
Cada respuesta recibe explicación y el resultado permite repasar errores.
La última práctica diaria se guarda localmente si el navegador lo permite.
La lectura de preguntas usa la voz del navegador cuando está disponible.

Verificación: `node --test tests/tiempo.test.mjs`.
