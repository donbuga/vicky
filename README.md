# Aventura Matemática

Juego educativo para practicar contenidos de matemática de 1º básico. Desde el portal, abre **Matemáticas → Evaluación del 12 de agosto**.

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
