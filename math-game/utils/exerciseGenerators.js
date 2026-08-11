const n = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (a) => [...a].sort(() => Math.random() - .5);
const choices = (answer, min = 0, max = 100) => { const s = new Set([answer]); for (let d = 1; s.size < 4; d++) {
    for (const v of shuffle([answer - d, answer + d]))
        if (v >= min && v <= max)
            s.add(v);
} return shuffle([...s]).map(String); };
const id = () => `${Date.now()}-${Math.random()}`;
export function generateComparisonExercise() { const a = n(0, 20), b = n(0, 20), ans = a > b ? '>' : a < b ? '<' : '='; return { id: id(), world: 'numbers', prompt: '¿Qué signo va en el centro?', answer: ans, options: shuffle(['<', '>', '=']), visual: { kind: 'equation', text: `${a}  ?  ${b}` }, hint: 'Mira cuál cantidad es más grande.', explanation: `${a} ${ans} ${b}` }; }
export function generateOrderingExercise(level) { const count = level === 1 ? 3 : 4; const vals = shuffle(Array.from({ length: 21 }, (_, i) => i)).slice(0, count); const down = Math.random() < .5; const sorted = [...vals].sort((a, b) => down ? b - a : a - b), wrong1 = [...sorted].reverse(), wrong2 = [...sorted]; [wrong2[0], wrong2[1]] = [wrong2[1], wrong2[0]]; const wrong3 = [...sorted]; [wrong3[count - 2], wrong3[count - 1]] = [wrong3[count - 1], wrong3[count - 2]]; return { id: id(), world: 'numbers', prompt: `Elige el orden de ${down ? 'mayor a menor' : 'menor a mayor'}`, answer: sorted.join(' · '), options: shuffle([sorted, wrong1, wrong2, wrong3].map(x => x.join(' · '))), hint: `Comienza por el número más ${down ? 'grande' : 'pequeño'}.`, explanation: sorted.join(' → ') }; }
export function generateRepresentationExercise() { const x = n(0, 20); return { id: id(), world: 'numbers', prompt: '¿Cuántos objetos hay?', answer: String(x), options: choices(x, 0, 20), visual: { kind: 'objects', value: x }, hint: 'Toca cada estrella con la mirada y cuenta.', explanation: `Hay ${x} objetos. Su símbolo es ${x}.` }; }
export function generateTensUnitsExercise() { const x = n(0, 20), d = Math.floor(x / 10), u = x % 10, ans = `${d} decena${d === 1 ? '' : 's'} y ${u} unidad${u === 1 ? '' : 'es'}`; const opts = new Set([ans]); for (let k = 0; opts.size < 4; k++) {
    const dd = n(0, 2), uu = n(0, 9);
    opts.add(`${dd} decena${dd === 1 ? '' : 's'} y ${uu} unidad${uu === 1 ? '' : 'es'}`);
} return { id: id(), world: 'tens', prompt: `¿Cómo formamos el ${x}?`, answer: ans, options: shuffle([...opts]), visual: { kind: 'base10', value: x }, hint: 'Cada barra completa vale 10.', explanation: `${x} = ${d} decena${d === 1 ? '' : 's'} + ${u} unidad${u === 1 ? '' : 'es'} = ${d * 10} + ${u}` }; }
export function generateCompositionExercise() { const x = n(0, 20), a = Math.random() < .6 ? Math.floor(x / 10) * 10 : n(0, x), b = x - a; return { id: id(), world: 'compose', prompt: `Completa: ${a} + ${b} = ?`, answer: String(x), options: choices(x, 0, 20), visual: { kind: 'objects', value: x }, hint: 'Junta las dos partes.', explanation: `${x} se construye con ${a} + ${b}.` }; }
function arithmetic(world, level) { const max = [0, 5, 10, 20][level]; let a = n(0, max), b = n(0, max); if (world === 'add' && a + b > max)
    b = max - a; if (world === 'subtract' && b > a)
    [a, b] = [b, a]; const ans = world === 'add' ? a + b : a - b, op = world === 'add' ? '+' : '−'; return { id: id(), world, prompt: `¿Cuánto es ${a} ${op} ${b}?`, answer: String(ans), options: choices(ans, 0, max), visual: { kind: 'equation', text: `${a} ${op} ${b} = ?` }, hint: world === 'add' ? 'Junta las cantidades.' : 'Empieza con la primera cantidad y quita.', explanation: `${a} ${op} ${b} = ${ans}` }; }
export const generateAdditionExercise = (l) => arithmetic('add', l);
export const generateSubtractionExercise = (l) => arithmetic('subtract', l);
export function generateInverseOperationExercise(level) { const max = [0, 5, 10, 20][level], a = n(0, max), b = n(0, max - a), total = a + b; return { id: id(), world: 'inverse', prompt: `Si ${a} + ${b} = ${total}, entonces ${total} − ${b} = ?`, answer: String(a), options: choices(a, 0, max), visual: { kind: 'objects', value: total }, hint: `De ${total}, quita ${b}.`, explanation: `Sumar y restar deshacen el camino: ${total} − ${b} = ${a}.` }; }
export function generateSequenceExercise(level) { const step = level === 1 ? 1 : level === 2 ? (Math.random() < .5 ? 2 : 5) : 10; const back = level === 3 ? Math.random() < .5 : Math.random() < .25; const delta = back ? -step : step; const maxStart = 100 - (back ? 0 : step * 4), minStart = back ? step * 4 : 0, start = n(minStart, maxStart), missing = n(1, 3), vals = Array.from({ length: 5 }, (_, i) => start + i * delta), ans = vals[missing]; const shown = vals.map((v, i) => i === missing ? '__' : v); return { id: id(), world: 'sequence', prompt: `Cuenta de ${step} en ${step} ${back ? 'hacia atrás' : 'hacia adelante'}`, answer: String(ans), options: choices(ans, 0, 100), visual: { kind: 'sequence', values: shown }, hint: `${back ? 'Resta' : 'Suma'} ${step} cada vez.`, explanation: vals.join(' → ') }; }
export function makeExercise(world, level) { if (world === 'numbers')
    return [generateComparisonExercise, () => generateOrderingExercise(level), generateRepresentationExercise][n(0, 2)](); if (world === 'tens')
    return generateTensUnitsExercise(); if (world === 'compose')
    return generateCompositionExercise(); if (world === 'add')
    return generateAdditionExercise(level); if (world === 'subtract')
    return generateSubtractionExercise(level); if (world === 'inverse')
    return generateInverseOperationExercise(level); return generateSequenceExercise(level); }
