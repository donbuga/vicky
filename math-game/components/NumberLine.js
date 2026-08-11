import { jsx as _jsx } from "react/jsx-runtime";
export function NumberLine({ values }) { return _jsx("div", { className: "number-line", children: values.map((v, i) => _jsx("span", { className: v === '__' ? 'missing' : '', children: v }, i)) }); }
