export function Feedback({kind,text}:{kind:'good'|'help';text:string}){return <div className={`feedback ${kind}`} role="status">{kind==='good'?'🌟':'💡'} {text}</div>}
