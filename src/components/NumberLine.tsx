export function NumberLine({values}:{values:Array<number|string>}){return <div className="number-line">{values.map((v,i)=><span className={v==='__'?'missing':''} key={i}>{v}</span>)}</div>}
