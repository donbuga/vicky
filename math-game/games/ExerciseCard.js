import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnswerButton } from '../components/AnswerButton.js';
import { NumberObjects } from '../components/NumberObjects.js';
import { TensAndUnits } from '../components/TensAndUnits.js';
import { NumberLine } from '../components/NumberLine.js';
export function ExerciseCard({ exercise, selected, onAnswer, disabled }) { const v = exercise.visual; return _jsxs("section", { className: "exercise card", children: [_jsx("h1", { children: exercise.prompt }), _jsxs("div", { className: "visual", children: [v?.kind === 'objects' && _jsx(NumberObjects, { value: v.value || 0 }), " ", v?.kind === 'base10' && _jsx(TensAndUnits, { value: v.value || 0 }), " ", v?.kind === 'equation' && _jsx("div", { className: "big-equation", children: v.text }), " ", v?.kind === 'sequence' && _jsx(NumberLine, { values: v.values || [] })] }), _jsx("div", { className: "answers", children: exercise.options.map(o => _jsx(AnswerButton, { value: o, onClick: () => onAnswer(o), state: selected === o ? 'wrong' : undefined }, o)) }), disabled && _jsx("p", { className: "next-note", children: "\u00A1Toca \u201CSiguiente\u201D para continuar!" })] }); }
