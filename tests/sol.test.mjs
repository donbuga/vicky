import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,topics,moments} from '../html/sol/questions.mjs';
import {makeRound,makeReview,startState,answer,next,prepare} from '../html/sol/engine.mjs';
function rng(seed){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
test('banco completo: identificadores, respuestas, pistas y conceptos válidos',()=>{
 assert.ok(questions.length>=30);assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
 for(const q of questions){assert.ok(topics[q.topic]);assert.ok(q.options.includes(q.answer));assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.hint&&q.explanation&&q.concept);if(q.kind==='choice'||q.kind==='scene')assert.equal(q.options.length,3);}
});
test('1000 partidas: 12 preguntas únicas, siete temas equilibrados y cinco formatos',()=>{
 const positions=new Set();
 for(let i=0;i<1000;i++){
  const round=makeRound(rng(i));assert.equal(round.length,12);assert.equal(new Set(round.map(q=>q.id)).size,12);
  for(const topic of Object.keys(topics)){const n=round.filter(q=>q.topic===topic).length;assert.ok(n>=1&&n<=2,topic);}
  for(const kind of ['choice','tf','scene','order','classify'])assert.ok(round.some(q=>q.kind===kind),kind);
  round.filter(q=>q.kind==='choice').forEach(q=>positions.add(q.options.indexOf(q.answer)));
 }
 assert.deepEqual([...positions].sort(),[0,1,2]);
});
test('acierto: una estrella, sin doble puntaje ni avance automático',()=>{
 const round=prepare(makeRound(rng(5)));let s=startState(round);const q=s.round[0];
 assert.equal(next(s),s);s=answer(s,q.kind==='order'?moments:q.answer);assert.equal(s.stars,1);assert.equal(s.index,0);assert.ok(s.done);assert.equal(answer(s,q.answer),s);s=next(s);assert.equal(s.index,1);assert.equal(s.attempts,0);
});
test('error y segundo intento correcto: pista, estrella y concepto para repaso',()=>{
 const q=questions.find(q=>q.kind==='choice');let s=startState([q]);s=answer(s,q.options[1]);assert.equal(s.done,false);assert.equal(s.stars,0);assert.equal(s.attempts,1);assert.deepEqual(s.missed,[q.concept]);assert.equal(answer(s,q.options[1]),s);
 s=answer(s,q.answer);assert.equal(s.stars,1);assert.ok(s.done);assert.deepEqual(s.missed,[q.concept]);
 const review=makeReview(s.missed);assert.ok(review.length);assert.ok(review.every(r=>s.missed.includes(r.concept)));
});
test('dos errores: revela respuesta, sin estrella y termina al continuar',()=>{
 const q=questions.find(q=>q.kind==='choice');let s=startState([q]);s=answer(s,q.options[1]);s=answer(s,q.options[2]);assert.equal(s.stars,0);assert.equal(s.done,true);assert.equal(s.finished,false);s=next(s);assert.equal(s.finished,true);
});
test('orden por toques: exige la secuencia completa y permite reintentar',()=>{
 let s=startState(prepare([questions.find(q=>q.kind==='order')]));s=answer(s,[...moments].reverse());assert.equal(s.done,false);s=answer(s,moments);assert.equal(s.stars,1);assert.equal(s.done,true);
});
test('partida completa, progreso y reinicio sin errores heredados',()=>{
 let s=startState(prepare(makeRound(rng(10))));for(let i=0;i<12;i++){assert.equal(s.index,i);const q=s.round[i];s=answer(s,q.kind==='order'?moments:q.answer);s=next(s);}
 assert.equal(s.stars,12);assert.ok(s.finished);assert.deepEqual(s.missed,[]);assert.deepEqual(makeReview(s.missed),[]);
 s=startState(prepare(makeRound()));assert.equal(s.index,0);assert.equal(s.stars,0);assert.equal(s.finished,false);assert.deepEqual(s.missed,[]);
});
