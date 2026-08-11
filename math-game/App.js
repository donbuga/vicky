import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { worlds } from './data/worlds.js';
import { makeExercise } from './utils/exerciseGenerators.js';
import { useProgress } from './hooks/useProgress.js';
import { useSound } from './hooks/useSound.js';
import { Character } from './components/Character.js';
import { GameHeader } from './components/GameHeader.js';
import { ProgressBar } from './components/ProgressBar.js';
import { Feedback } from './components/Feedback.js';
import { ResultScreen } from './components/ResultScreen.js';
import { ExerciseCard } from './games/ExerciseCard.js';
const cheers = ['¡Muy bien!', '¡Excelente!', '¡Lo lograste!', '¡Qué genial!'];
export default function App() {
    const { stats, finish } = useProgress(), sound = useSound();
    const [screen, setScreen] = useState('menu'), [world, setWorld] = useState(), [level, setLevel] = useState(1), [challenge, setChallenge] = useState(false), [index, setIndex] = useState(0), [correct, setCorrect] = useState(0), [streak, setStreak] = useState(0), [best, setBest] = useState(0), [errors, setErrors] = useState(0), [selected, setSelected] = useState(), [locked, setLocked] = useState(false), [feedback, setFeedback] = useState('');
    const total = challenge ? 15 : 10;
    const exercise = useMemo(() => screen === 'game' ? makeExercise(challenge ? worlds[Math.floor(Math.random() * worlds.length)].id : world, challenge ? 3 : level) : null, [screen, index, world, level, challenge]);
    const home = () => { setScreen('menu'); setChallenge(false); };
    const start = (l, isChallenge = false) => { setLevel(l); setChallenge(isChallenge); setIndex(0); setCorrect(0); setStreak(0); setBest(0); setErrors(0); setSelected(undefined); setLocked(false); setFeedback(''); setScreen('game'); };
    const answer = (value) => { if (locked || !exercise)
        return; if (value === exercise.answer) {
        const ns = streak + 1;
        setCorrect(c => c + 1);
        setStreak(ns);
        setBest(b => Math.max(b, ns));
        setLocked(true);
        setSelected(undefined);
        setFeedback(cheers[Math.floor(Math.random() * cheers.length)]);
        sound.play('good');
    }
    else {
        const ne = errors + 1;
        setErrors(ne);
        setStreak(0);
        setSelected(value);
        setFeedback(ne >= 2 ? exercise.explanation : `Casi, intenta otra vez. ${exercise.hint}`);
        sound.play('try');
    } };
    const next = () => { if (index + 1 >= total) {
        finish(world, correct, best, challenge);
        sound.play('done');
        setScreen('result');
    }
    else {
        setIndex(i => i + 1);
        setErrors(0);
        setSelected(undefined);
        setLocked(false);
        setFeedback('');
    } };
    if (screen === 'result')
        return _jsxs("div", { className: "app-shell", children: [_jsx(GameHeader, { stars: stats.stars + correct, correct: correct, streak: streak, sound: sound.enabled, onSound: () => sound.setEnabled(!sound.enabled), onHome: home }), _jsx(ResultScreen, { total: total, correct: correct, best: best, onAgain: () => start(level, challenge), onWorlds: home })] });
    return _jsxs("div", { className: "app-shell", children: [_jsx(GameHeader, { stars: stats.stars + (screen === 'game' ? correct : 0), correct: correct, streak: streak, sound: sound.enabled, onSound: () => sound.setEnabled(!sound.enabled), onHome: home }), screen === 'menu' && _jsxs("main", { className: "menu", children: [_jsxs("div", { className: "hero", children: [_jsxs("div", { children: [_jsx("span", { className: "eyebrow", children: "EVALUACI\u00D3N DEL 12 DE AGOSTO" }), _jsxs("h1", { children: ["\u00A1Aventura", _jsx("br", {}), _jsx("em", { children: "Matem\u00E1tica!" })] }), _jsx("p", { children: "Explora, juega y conquista las matem\u00E1ticas." })] }), _jsx(Character, {})] }), _jsx("h2", { children: "Elige tu mundo" }), _jsx("div", { className: "world-grid", children: worlds.map(w => _jsxs("button", { className: "world-card", style: { '--accent': w.color }, onClick: () => { setWorld(w.id); setScreen('levels'); }, children: [_jsx("span", { className: "world-emoji", children: w.emoji }), _jsxs("span", { children: [_jsx("b", { children: w.title }), _jsx("small", { children: w.subtitle })] }), stats.completed.includes(w.id) && _jsx("i", { children: "\u2713" })] }, w.id)) }), _jsxs("button", { className: "challenge", onClick: () => start(3, true), children: [_jsx("span", { children: "\uD83C\uDFAF" }), _jsx("b", { children: "Desaf\u00EDo final" }), _jsxs("small", { children: ["15 preguntas de todos los mundos \u00B7 R\u00E9cord: ", stats.bestChallenge] })] })] }), screen === 'levels' && _jsxs("main", { className: "levels card", children: [_jsx(Character, { message: "\u00BFCu\u00E1nto quieres explorar?" }), _jsx("h1", { children: "Elige un nivel" }), _jsx("p", { children: worlds.find(w => w.id === world)?.title }), [1, 2, 3].map(l => _jsxs("button", { onClick: () => start(l), children: [_jsxs("b", { children: ['⭐'.repeat(l), " ", ['Fácil', 'Medio', 'Difícil'][l - 1]] }), _jsx("span", { children: l === 1 ? 'Primeros pasos' : l === 2 ? 'Un poco más lejos' : '¡Gran aventura!' })] }, l))] }), screen === 'game' && exercise && _jsxs("main", { className: "play", children: [_jsx(ProgressBar, { current: index, total: total }), _jsx(Character, { mood: locked ? 'happy' : errors ? 'help' : 'hello', message: feedback || (challenge ? '¡Sorpresa de todos los mundos!' : '¡Tú puedes!') }), _jsx(ExerciseCard, { exercise: exercise, selected: selected, onAnswer: answer, disabled: locked }), feedback && _jsx(Feedback, { kind: locked ? 'good' : 'help', text: feedback }), " ", locked && _jsx("button", { className: "primary next", onClick: next, children: index + 1 === total ? 'Ver mi premio' : 'Siguiente →' })] })] });
}
