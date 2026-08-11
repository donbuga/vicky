import { jsxs as _jsxs } from "react/jsx-runtime";
export function AnswerButton({ value, onClick, state }) { return _jsxs("button", { className: `answer ${state || ''}`, onClick: onClick, children: [state === 'correct' && '✓ ', state === 'wrong' && '↻ ', value] }); }
