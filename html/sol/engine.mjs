import {questions, topics} from './questions.mjs';
export function shuffle(items, rng = Math.random) {
 const copy=[...items]; for(let i=copy.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];} return copy;
}
// Momentos usa dos cupos (escena y orden). Otros cuatro temas reciben dos.
export function makeRound(rng=Math.random) {
 const extra=new Set(['momentos',...shuffle(Object.keys(topics).filter(t=>t!=='momentos'),rng).slice(0,4)]);
 const picked=Object.keys(topics).flatMap(topic=>{
  if(topic==='momentos')return [questions.find(q=>q.kind==='order'),shuffle(questions.filter(q=>q.kind==='scene'),rng)[0]];
  const pool=shuffle(questions.filter(q=>q.topic===topic),rng);
  if(topic==='animales'){
   const first=pool.find(q=>q.kind==='classify');
   return extra.has(topic)?[first,pool.find(q=>q.id!==first.id)]:[first];
  }
  return pool.slice(0,extra.has(topic)?2:1);
 });
 if(!picked.some(q=>q.kind==='tf')){
  const index=picked.findIndex(q=>['luna','habitos','plantas','sol'].includes(q.topic));
  picked[index]=shuffle(questions.filter(q=>q.topic===picked[index].topic&&q.kind==='tf'),rng)[0];
 }
 return shuffle(picked,rng).map(q=>({...q,options:shuffle(q.options,rng)}));
}
export function makeReview(concepts, rng=Math.random) {
 return shuffle(questions.filter(q=>concepts.includes(q.concept)),rng).map(q=>({...q,options:shuffle(q.options,rng)}));
}
export function startState(round) {return {round,index:0,stars:0,attempts:0,done:false,finished:false,missed:[],rejected:[]};}
export function answer(state, value) {
 if(state.done||state.finished)return state;
 const q=state.round[state.index];
 const correct=q.kind==='order'?Array.isArray(value)&&value.join('|')===q.answerOrder.join('|'):value===q.answer;
 if(state.rejected.includes(value))return state;
 const missed=correct?state.missed:[...new Set([...state.missed,q.concept])];
 return {...state,missed,attempts:state.attempts+1,stars:state.stars+(correct?1:0),done:correct||state.attempts===1,rejected:correct?state.rejected:[...state.rejected,value],correct};
}
export function next(state) {
 if(!state.done)return state;
 return state.index===state.round.length-1?{...state,finished:true}:{...state,index:state.index+1,attempts:0,done:false,rejected:[],correct:undefined};
}
export function prepare(round) {return round.map(q=>q.kind==='order'?{...q,answerOrder:['Amanecer','Mediodía','Atardecer','Noche']}:q);}
