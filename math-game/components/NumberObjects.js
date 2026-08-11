import { jsx as _jsx } from "react/jsx-runtime";
export function NumberObjects({ value }) { return _jsx("div", { className: "objects", "aria-label": `${value} estrellas`, children: value === 0 ? _jsx("span", { className: "empty", children: "ning\u00FAn objeto \u00B7 0" }) : Array.from({ length: value }, (_, i) => _jsx("span", { children: "\u2B50" }, i)) }); }
