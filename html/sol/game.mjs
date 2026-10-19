import {topics,moments} from './questions.mjs';
import {makeRound,makeReview,startState,answer,next,prepare} from './engine.mjs';
import {guide,art,scene,sun} from './art.mjs';
const app=document.querySelector('#app');
let state=null,screen='welcome',order=[],showDemo=false,auto=false,readingTimer,angle=180,paused=true;
const canSpeak='speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
try{auto=localStorage.getItem('vicky-sol-auto')==='true';}catch{/* El juego también funciona sin almacenamiento. */}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function stopSpeech(){clearTimeout(readingTimer);if(canSpeak)window.speechSynthesis.cancel();}
function speak(text){
 stopSpeech();if(!canSpeak)return;
 try{const u=new SpeechSynthesisUtterance(text);const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>/^es[-_]CL$/i.test(v.lang))||voices.find(v=>/^es/i.test(v.lang))||null;u.lang=u.voice?.lang||'es-CL';u.rate=.85;u.pitch=1.05;speechSynthesis.speak(u);}catch{/* La lectura es opcional. */}
}
function settings(){return `<div class="speech-settings">${canSpeak?`<label><input id="auto" type="checkbox" ${auto?'checked':''}> Leer automáticamente</label>`:'<p class="subtle">La lectura en voz alta no está disponible en este navegador. ¡Puedes jugar con el texto!</p>'}</div>`;}
function listenButton(){return canSpeak?'<button data-action="listen">🔊 Escuchar</button>':'';}
function demo(){return `<section class="demo" aria-labelledby="demo-title"><div class="demo-head"><h2 id="demo-title">¿Cómo llega la noche?</h2><span aria-hidden="true">🌎</span></div><p>El Sol sigue brillando. ¡La Tierra gira sobre sí misma!</p><div class="demo-layout"><svg viewBox="0 0 480 255" role="img" aria-label="Demostración del día y la noche. Sol fijo a la izquierda; Tierra que gira y punto de Victoria."><defs><clipPath id="globe"><circle cx="335" cy="115" r="72"/></clipPath></defs>${sun(80,110,37)}<g stroke="#d7b45e" stroke-width="3"><path d="M144 80h100m-100 30h100m-100 30h100"/><path d="m236 74 8 6-8 6m0 18 8 6-8 6m0 18 8 6-8 6" fill="none"/></g><circle cx="335" cy="115" r="72" fill="#8ccadb"/><g clip-path="url(#globe)"><g id="rotating-land"><path d="m290 49-22 53 44 8 13 40 28 22 31-48-16-30 11-29Z" fill="#7fa882"/><path d="m283 145 15 35 26-9-8-24Z" fill="#7fa882"/></g><path d="M335 43a72 72 0 0 1 0 144Z" fill="#233758" opacity=".82"/></g><circle cx="335" cy="115" r="72" fill="none" stroke="#35566c" stroke-width="3"/><g id="victoria-point"><circle r="9" fill="#f9df69" stroke="#233b59" stroke-width="3"/><circle r="3" fill="#233b59"/></g><path d="M287 205q50 19 94-1m-15-7 17 6-10 13" fill="none" stroke="#47667b" stroke-width="3"/><text x="55" y="185" font-size="18" fill="#574320">Sol fijo</text><text x="277" y="245" font-size="17" fill="#304959">La Tierra gira ↻</text></svg><div><p class="demo-status" id="demo-status"></p><p>El punto representa el lugar de Victoria.</p><div class="demo-controls"><button data-action="pause">${paused?'▶ Iniciar giro':'⏸ Pausar'}</button><button data-action="step">Girar un paso ↻</button></div><p class="subtle">Representación simplificada vista desde arriba. El punto no indica una ubicación exacta en el mapa. Una vuelta tarda unas 24 horas.</p></div></div></section>`;}
function welcome(){return `<section class="intro"><div><div class="eyebrow">Ciencias · El día y la noche</div><h1>¡Victoria, vamos a<br>explorar <em>el Sol!</em></h1><p class="lead">Descubre, juega y gana estrellas con nuestro amigo Sol.</p><button class="primary" data-action="start">¡Vamos a jugar! →</button><div class="chips"><span>12 preguntas</span><span>★ Una estrella por acierto</span><span>A tu ritmo</span></div>${settings()}</div><div class="hero-art">${guide()}<span class="little" aria-hidden="true">✧</span><p>¡Hola! Soy tu compañero<br>en esta aventura.</p></div></section>${demo()}`;}
function questionSpeech(){
 if(screen==='welcome')return '¡Victoria, vamos a explorar el Sol! Toca Vamos a jugar para comenzar.';
 if(screen==='results')return resultSpeech();
 const q=state.round[state.index];
 if(state.done)return `${state.correct?'¡Ganaste una estrella!':'¡Sigamos aprendiendo!'} Respuesta correcta: ${q.kind==='order'?moments.join(', '):q.answer}. ${q.explanation} Toca Continuar.`;
 const options=q.options.map((o,i)=>`${i+1}. ${o}`).join('. ');
 return `${state.attempts?'Pista: '+q.hint+' Intenta otra vez. ':''}${q.prompt} ${options}${q.kind==='order'?'. Toca cada momento en orden y después Comprobar.':''}`;
}
function question(){
 const q=state.round[state.index];
 const feedback=state.done?`<div class="feedback ${state.correct?'good':''}" role="status"><strong>${state.correct?'★ ¡Ganaste una estrella!':'☀ ¡Sigamos aprendiendo!'}</strong><p><b>Respuesta correcta:</b> ${esc(q.kind==='order'?moments.join(' → '):q.answer)}</p><p>${esc(q.explanation)}</p><button class="primary" data-action="continue">Continuar →</button></div>`:state.attempts?`<div class="feedback" role="status"><strong>☀ ¡Puedes intentarlo otra vez!</strong><p>Pista: ${esc(q.hint)}</p></div>`:'';
 let options;
 if(q.kind==='order'){
 options=`<div class="order-result" aria-live="polite">${order.length?order.map((v,i)=>`${i+1}. ${esc(v)}`).join(' → '):'Toca los momentos desde el amanecer.'}</div><div class="order-options">${q.options.map((o,i)=>`<button data-order="${i}" ${order.includes(o)||state.done?'disabled':''}>${scene(o)}${esc(o)}</button>`).join('')}</div><div class="order-actions"><button data-action="clear" ${state.done||!order.length?'disabled':''}>Borrar orden</button><button class="primary" data-action="check" ${state.done||order.length!==4?'disabled':''}>Comprobar ✓</button></div>`;
 }else options=`<div class="options">${q.options.map((o,i)=>{const correct=state.done&&o===q.answer,rejected=state.rejected.includes(o);return `<button class="option ${correct?'correct':''} ${rejected?'incorrect':''}" data-answer="${i}" ${state.done||rejected?'disabled':''}><span class="letter" aria-hidden="true">${correct?'✓':rejected?'↻':String.fromCharCode(65+i)}</span><span>${esc(o)}${rejected?' · Probemos otra':''}</span></button>`;}).join('')}</div>`;
 return `<section class="game"><div class="game-top"><span>${showReview?'Repaso · ':''}Pregunta ${state.index+1} de ${state.round.length}</span><span class="score" aria-label="${state.stars} estrellas">★ ${state.stars} estrellas</span></div><div class="track" role="progressbar" aria-label="Preguntas completadas" aria-valuemin="0" aria-valuemax="${state.round.length}" aria-valuenow="${state.index+(state.done?1:0)}"><div style="width:${(state.index+(state.done?1:0))/state.round.length*100}%"></div></div><article class="question-card"><div class="question-meta"><span class="eyebrow">${topics[q.topic]}</span>${listenButton()}</div><h2 id="question-title" tabindex="-1">${esc(q.prompt)}</h2>${q.kind==='order'?'':`<div class="question-art">${art(q.art)}</div>`}${options}${feedback}</article>${settings()}<button class="demo-toggle" data-action="demo" aria-expanded="${showDemo}">${showDemo?'Cerrar explorador':'Explorar el día y la noche'}</button>${showDemo?demo():''}</section>`;
}
let showReview=false;
function resultSpeech(){return `¡Victoria, lo lograste! Ganaste ${state.stars} de ${state.round.length} estrellas. ${state.missed.length?'Podemos seguir practicando: '+missedTopics().map(t=>topics[t]).join(', '):'¡Exploraste todos los temas de esta aventura!'}`;}
function missedTopics(){return [...new Set(state.missed.map(c=>c.split(':')[0]))];}
function results(){return `<section class="result"><div class="guide celebrate">${guide()}</div><div class="eyebrow">${showReview?'Repaso completado':'Aventura completada'}</div><h1>¡Victoria, lo lograste!</h1><p class="big-score celebrate">★ ${state.stars} de ${state.round.length} estrellas</p><p>Cada pregunta te ayuda a descubrir algo nuevo.</p><div class="summary"><h2>${state.missed.length?'Sigamos explorando':'¡Qué gran exploradora!'}</h2>${state.missed.length?`<p>Podemos practicar un poquito más:</p><ul class="review-list">${missedTopics().map(t=>`<li>${topics[t]}</li>`).join('')}</ul>`:'<p>¡Exploraste todos los temas de esta aventura!</p>'}<p class="subtle">También repasaremos lo que costó al primer intento.</p></div>${listenButton()}<div class="result-actions"><button class="primary" data-action="start">Jugar otra vez</button><button data-action="review" ${state.missed.length?'':'disabled'}>Repasar lo que me costó</button></div>${!state.missed.length?'<p class="empty-note">No hay errores para repasar. ¡Puedes jugar otra vez!</p>':''}${settings()}${demo()}</section>`;}
function render(narrate=false,focus=false){
 stopSpeech();app.innerHTML=screen==='welcome'?welcome():screen==='results'?results():question();drawDemo();
 if(focus)document.querySelector('#question-title, .result h1')?.focus({preventScroll:true});
 if(narrate&&auto)readingTimer=setTimeout(()=>speak(questionSpeech()),180);
}
function begin(review=false){
 const round=review?makeReview(state.missed):makeRound();
 if(!round.length)return;
 state=startState(prepare(round));screen='game';showReview=review;order=[];showDemo=false;paused=true;render(true,true);window.scrollTo({top:0,behavior:'instant'});
}
function submit(value){state=answer(state,value);if(state.attempts===1&&!state.done)order=[];render(true);}
app.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button||button.disabled)return;
 if(button.dataset.answer!==undefined){submit(state.round[state.index].options[Number(button.dataset.answer)]);return;}
 if(button.dataset.order!==undefined){order.push(state.round[state.index].options[Number(button.dataset.order)]);render();return;}
 switch(button.dataset.action){
 case 'start':begin();break;
 case 'review':begin(true);break;
 case 'listen':speak(questionSpeech());break;
 case 'continue':state=next(state);order=[];showDemo=false;paused=true;if(state.finished)screen='results';render(true,true);window.scrollTo({top:0,behavior:'instant'});break;
 case 'clear':order=[];render();break;
 case 'check':submit([...order]);break;
 case 'demo':showDemo=!showDemo;paused=true;render();break;
 case 'pause':paused=!paused;button.textContent=paused?'▶ Reanudar giro':'⏸ Pausar';break;
 case 'step':paused=true;angle=(angle+30)%360;drawDemo();document.querySelector('[data-action="pause"]').textContent='▶ Reanudar giro';break;
 }
});
app.addEventListener('change',event=>{if(event.target.id==='auto'){auto=event.target.checked;try{localStorage.setItem('vicky-sol-auto',String(auto));}catch{}if(auto)speak(questionSpeech());else stopSpeech();}});
function drawDemo(){const point=document.querySelector('#victoria-point');if(!point)return;const a=angle*Math.PI/180;point.setAttribute('transform',`translate(${335+54*Math.cos(a)} ${115+54*Math.sin(a)})`);document.querySelector('#rotating-land').setAttribute('transform',`rotate(${angle-180} 335 115)`);const status=document.querySelector('#demo-status');const night=Math.cos(a)>0;const text=night?'● Victoria: es de noche':'☀ Victoria: es de día';if(status.textContent!==text)status.textContent=text;}
let last=0;function animate(t){if(!paused&&!document.hidden&&document.querySelector('#victoria-point')){angle=(angle+Math.min(t-last,50)*.012)%360;drawDemo();}last=t;requestAnimationFrame(animate);}requestAnimationFrame(animate);
window.addEventListener('pagehide',stopSpeech);document.addEventListener('visibilitychange',()=>{if(document.hidden){paused=true;stopSpeech();const b=document.querySelector('[data-action="pause"]');if(b)b.textContent='▶ Reanudar giro';}});
render();
