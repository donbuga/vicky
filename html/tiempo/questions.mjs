export const days = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
export const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
export const dayName = date => days[(date.getDay()+6)%7];
export function adjacent(date, delta) { const copy = new Date(date); copy.setDate(copy.getDate()+delta); return copy; }
const q = (topic, text, answer, options, explanation, calendar=null) => ({topic,text,answer:String(answer),options:options.map(String),explanation,calendar});
export function daily(date = new Date()) {
 return [-1,0,1].map((delta,i)=>q('Días', ['¿Qué día fue ayer?','¿Qué día es hoy?','¿Qué día será mañana?'][i],dayName(adjacent(date,delta)),days,`Hoy es ${dayName(date)}. Ayer fue ${dayName(adjacent(date,-1))} y mañana será ${dayName(adjacent(date,1))}.`));
}
export function bank() {
 const list=[];
 days.forEach((d,i)=>[-1,1].forEach(delta=>list.push(q('Días',`Si hoy es ${d}, ¿qué día ${delta<0?'fue ayer':'será mañana'}?`,days[(i+delta+7)%7],days,`El orden es lunes, martes, miércoles, jueves, viernes, sábado y domingo. Después del domingo vuelve el lunes.`))));
 months.forEach((m,i)=>[-1,1].forEach(delta=>list.push(q('Meses',`¿Qué mes viene ${delta<0?'antes':'después'} de ${m}?`,months[(i+delta+12)%12],months,`Los meses siguen este orden: ${months.join(', ')}. Después de diciembre comienza enero de un nuevo año.`))));
 list.push(q('Semana','¿Qué días forman el fin de semana?','sábado y domingo',['viernes y sábado','sábado y domingo','lunes y martes'],'El fin de semana está formado por sábado y domingo.'),q('Semana','¿Qué día inicia la semana?','lunes',days,'En este calendario, la semana comienza el lunes y termina el domingo.'),q('Semana','¿Qué día termina la semana?','domingo',days,'El domingo es el último día de la semana; luego comienza el lunes.'));
 [['¿Cuántos días tiene una semana?',7,[5,7,12],'Una semana tiene 7 días.'],['¿Cuántos meses tiene un año?',12,[7,10,12],'Un año tiene 12 meses.'],['¿Qué unidad usamos para contar los cumpleaños?', 'años',['días','meses','años'],'Cada cumpleaños celebramos un año más.'],['¿Qué dura menos?','un día',['un año','un mes','un día'],'Un día dura menos que un mes y un año.'],['Si estamos en el año 2026, ¿qué año viene después?',2027,[2025,2026,2027],'Los años avanzan de uno en uno: 2025, 2026, 2027.'],['¿Cuántos días tiene un año común?',365,[12,365,366],'Un año común tiene 365 días. Un año bisiesto tiene 366.']].forEach(a=>list.push(q('Unidades',...a)));
 [['Antes de comer, ¿qué hacemos?','lavarnos las manos',['lavarnos las manos','retirar el plato','lavar el plato usado'],'Primero nos lavamos las manos, después comemos y al final retiramos el plato.'],['Antes sembré una semilla. Ahora la riego. ¿Qué ocurrirá después?','crecerá una planta',['sembraré esa misma semilla','crecerá una planta','todavía no la he sembrado'],'Antes sembré, ahora riego y después crecerá la planta.'],['Antes me puse el pijama. Ahora duermo. ¿Qué haré después?','despertarme',['ponerme el pijama antes de dormir','despertarme','seguir antes de acostarme'],'El orden es ponerse el pijama, dormir y despertarse.'],['Antes desayuné. Ahora estoy en clases. ¿Qué hago ahora?','estoy en clases',['desayuno','estoy en clases','me acostaré'],'Ahora indica lo que está pasando en este momento.']].forEach(a=>list.push(q('Antes, ahora y después',...a)));
 for (const [year,month] of [[2026,9],[2027,1],[2028,1]]) {
 const total=new Date(year,month+1,0).getDate(); const cal={year,month};
 list.push(q('Calendario',`Mira el calendario. ¿Qué día de la semana es el 1 de ${months[month]}?`,dayName(new Date(year,month,1)),days,'Busca el número 1 y lee el día que encabeza su columna.',cal),q('Calendario',`¿Cuántos días tiene ${months[month]} de ${year}?`,total,[28,29,30,31],'El último número del calendario indica cuántos días tiene ese mes.',cal),q('Calendario',`¿Qué fecha viene después del ${total} de ${months[month]}?`,`1 de ${months[(month+1)%12]}`,[`1 de ${months[(month+1)%12]}`,`1 de ${months[month]}`,`2 de ${months[(month+1)%12]}`],'Al terminar un mes, seguimos con el día 1 del mes siguiente.',cal));
 }
 return list;
}
export function shuffle(items) { const a=[...items]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
export function assessment() { const all=bank(); return shuffle([...new Set(all.map(q=>q.topic))].flatMap(t=>shuffle(all.filter(q=>q.topic===t)).slice(0,3))); }
