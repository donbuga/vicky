export type WorldId='numbers'|'tens'|'compose'|'add'|'subtract'|'inverse'|'sequence';
export type Level=1|2|3;
export type Visual={kind:'objects'|'base10'|'equation'|'sequence';value?:number;values?:Array<number|string>;text?:string};
export interface Exercise {id:string;world:WorldId;prompt:string;answer:string;options:string[];visual?:Visual;hint:string;explanation:string}
export interface Stats {stars:number;completed:WorldId[];bestStreak:number;bestChallenge:number}
