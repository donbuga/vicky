import { jsxs as _jsxs } from "react/jsx-runtime";
export function Feedback({ kind, text }) { return _jsxs("div", { className: `feedback ${kind}`, role: "status", children: [kind === 'good' ? '🌟' : '💡', " ", text] }); }
