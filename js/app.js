// Lógica da página: filtros, mapa, pauta, calendário e detalhes do evento.

const MES=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const MESC=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const TODAY=iso(new Date());
const status=e=>e.fim<TODAY?"past":(e.ini<=TODAY?"live":"next");
function fmtRange(e){const a=parse(e.ini),b=parse(e.fim);
  if(e.ini===e.fim)return a.getDate()+" de "+MES[a.getMonth()];
  if(a.getMonth()===b.getMonth())return a.getDate()+" a "+b.getDate()+" de "+MES[a.getMonth()];
  return a.getDate()+" de "+MES[a.getMonth()]+" a "+b.getDate()+" de "+MES[b.getMonth()];}

/* estado */
const S={tipo:"all",area:"all",q:"",uf:null,tab:"next",mine:false,month:null,selDay:null};
let saved=new Set();
try{saved=new Set(JSON.parse(localStorage.getItem("mjbr-saved")||"[]"))}catch(_){}
function persist(){try{localStorage.setItem("mjbr-saved",JSON.stringify([...saved]))}catch(_){}}
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();

function base(){ // filtros sem estado (usados pelo mapa)
  const q=norm(S.q.trim());
  return EVENTS.filter(e=>(S.tipo==="all"||e.tipo===S.tipo)&&(S.area==="all"||e.area===S.area)&&(!q||norm([e.nome,e.cidade,e.org,e.local,UFN[e.uf],e.uf].join(" ")).includes(q)));
}
const filtered=()=>base().filter(e=>!S.uf||e.uf===S.uf);

/* controles */
const $=id=>document.getElementById(id);
function buildControls(){
  const seg=$("typeSeg");
  const opts=[["all","Todos",null]].concat(Object.entries(TYPES).map(([k,v])=>[k,v.label,v.c]));
  seg.innerHTML=opts.map(([k,l,c])=>`<button type="button" data-t="${k}" aria-pressed="${k===S.tipo}" title="${k==="all"?"Todos os tipos":TYPES[k].desc}">${c?`<span class="dot" style="background:${c}"></span>`:""}${l}</button>`).join("");
  seg.onclick=ev=>{const b=ev.target.closest("button");if(!b)return;S.tipo=b.dataset.t;seg.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));render()};
  const areas=[...new Set(EVENTS.map(e=>e.area))].sort((a,b)=>a.localeCompare(b,"pt"));
  $("areaSel").innerHTML=`<option value="all">Todas as áreas</option>`+areas.map(a=>`<option>${a}</option>`).join("");
  $("areaSel").onchange=e=>{S.area=e.target.value;render()};
  $("q").oninput=e=>{S.q=e.target.value;render()};
  $("stateClear").onclick=()=>setUF(null);
  $("tabNext").onclick=()=>{S.tab="next";render()};
  $("tabPast").onclick=()=>{S.tab="past";render()};
  $("prevM").onclick=()=>{S.month=new Date(S.month.getFullYear(),S.month.getMonth()-1,1);S.selDay=null;renderCal()};
  $("nextM").onclick=()=>{S.month=new Date(S.month.getFullYear(),S.month.getMonth()+1,1);S.selDay=null;renderCal()};
  $("todayBtn").onclick=()=>{const t=new Date();S.month=new Date(t.getFullYear(),t.getMonth(),1);S.selDay=TODAY;renderCal()};
  $("calAll").onclick=()=>{S.mine=false;renderCal()};
  $("calMine").onclick=()=>{S.mine=true;renderCal()};
  $("icsAll").onclick=()=>{const evs=EVENTS.filter(e=>saved.has(e.id));if(!evs.length){toast("Salve eventos na sua agenda primeiro");return}copyIcs(evs,null)};
}
function setUF(uf){S.uf=(S.uf===uf?null:uf);render()}

/* mapa */
const OFF={RN:[1118,290],PB:[1124,350],PE:[1118,410],AL:[1100,466],SE:[1078,520],ES:[985,725],RJ:[905,835],DF:[780,545]};
function buildMap(){
  const svg=$("map");let h="";
  for(const[uf,g]of Object.entries(GEO))h+=`<path class="uf" data-uf="${uf}" d="${g.d}" tabindex="0" role="button" aria-label="${UFN[uf]}"><title>${UFN[uf]}</title></path>`;
  h+=`<g id="badges"></g>`;
  svg.innerHTML=h;
  svg.addEventListener("click",ev=>{const p=ev.target.closest("[data-uf]");if(p)setUF(p.dataset.uf)});
  svg.addEventListener("keydown",ev=>{if((ev.key==="Enter"||ev.key===" ")&&ev.target.dataset.uf){ev.preventDefault();setUF(ev.target.dataset.uf)}});
}
function renderMap(){
  const cnt={};base().forEach(e=>cnt[e.uf]=(cnt[e.uf]||0)+1);
  document.querySelectorAll("#map path.uf").forEach(p=>{const uf=p.dataset.uf,n=cnt[uf]||0;
    p.style.fill=n===0?"var(--map-0)":n===1?"var(--map-1)":"var(--map-2)";
    p.classList.toggle("sel",S.uf===uf);p.classList.toggle("dim",!!S.uf&&S.uf!==uf);
    p.querySelector("title").textContent=UFN[uf]+": "+n+(n===1?" evento":" eventos");
    p.setAttribute("aria-label",UFN[uf]+", "+n+(n===1?" evento":" eventos")+(S.uf===uf?", selecionado":""));});
  let b="";
  for(const[uf,n]of Object.entries(cnt)){const c=GEO[uf].c,o=OFF[uf]||c,r=n>9?28:25;
    if(OFF[uf])b+=`<line class="lead" x1="${c[0]}" y1="${c[1]}" x2="${o[0]}" y2="${o[1]}"/>`;
    b+=`<g class="badge" data-uf="${uf}"><circle cx="${o[0]}" cy="${o[1]}" r="${r}"/><text x="${o[0]}" y="${o[1]+1}">${n}</text></g>`;}
  $("badges").innerHTML=b;
}

/* lista */
function itemHTML(e,showStatus=true){
  const d=parse(e.ini),st=status(e);
  return `<li><button type="button" class="item" data-id="${e.id}">
    <span class="date" aria-hidden="true"><b>${pad(d.getDate())}</b><span>${MESC[d.getMonth()]}</span></span>
    <span style="min-width:0"><span class="ttl">${saved.has(e.id)?'<span class="star" aria-label="Na sua agenda">★</span> ':""}${e.nome}</span>
    <span class="meta"><span class="uf">${e.uf}</span><span>${e.cidade}</span><span>${fmtRange(e)}</span>
    <span class="pill"><span class="dot" style="background:${TYPES[e.tipo].c}"></span>${TYPES[e.tipo].label}</span>
    ${showStatus&&st==="live"?'<span class="live">Acontecendo</span>':""}</span></span></button></li>`;
}
function renderList(){
  const f=filtered();
  const next=f.filter(e=>status(e)!=="past").sort((a,b)=>a.ini.localeCompare(b.ini));
  const past=f.filter(e=>status(e)==="past").sort((a,b)=>b.ini.localeCompare(a.ini));
  $("nNext").textContent=next.length;$("nPast").textContent=past.length;
  $("tabNext").setAttribute("aria-selected",S.tab==="next");$("tabPast").setAttribute("aria-selected",S.tab==="past");
  const arr=S.tab==="next"?next:past;
  $("agendaTitle").textContent=S.uf?UFN[S.uf]:"Todo o Brasil";
  $("list").innerHTML=arr.length?arr.map(e=>itemHTML(e)).join(""):
    `<li class="empty">${S.tab==="next"?"Nenhum evento por vir com esses filtros.":"Nenhum evento passado com esses filtros."}${(S.uf||S.tipo!=="all"||S.area!=="all"||S.q)?'<br><button class="btn" type="button" data-reset>Limpar filtros</button>':""}</li>`;
  const chip=$("stateChip");chip.classList.toggle("on",!!S.uf);$("stateChipTxt").textContent=S.uf?"Estado: "+UFN[S.uf]:"";
}
function resetFilters(){S.tipo="all";S.area="all";S.q="";S.uf=null;$("areaSel").value="all";$("q").value="";$("typeSeg").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.t==="all"));render()}

/* calendário */
function renderCal(){
  const m=S.month,y=m.getFullYear(),mo=m.getMonth();
  $("monthLbl").textContent=MES[mo][0].toUpperCase()+MES[mo].slice(1)+" "+y;
  $("calAll").setAttribute("aria-pressed",!S.mine);$("calMine").setAttribute("aria-pressed",S.mine);
  $("nMine").textContent=saved.size;
  const evs=(S.mine?EVENTS.filter(e=>saved.has(e.id)):filtered());
  const start=new Date(y,mo,1-new Date(y,mo,1).getDay());
  let h=["DOM","SEG","TER","QUA","QUI","SEX","SÁB"].map(d=>`<div class="dow" aria-hidden="true">${d}</div>`).join("");
  for(let i=0;i<42;i++){
    const d=new Date(start.getFullYear(),start.getMonth(),start.getDate()+i),k=iso(d);
    if(i===35&&d.getMonth()!==mo)break;
    const de=evs.filter(e=>e.ini<=k&&e.fim>=k).sort((a,b)=>a.ini.localeCompare(b.ini));
    const hol=HOL[k];
    const label=`${d.getDate()} de ${MES[d.getMonth()]}${hol?", "+hol[0]:""}, ${de.length} ${de.length===1?"evento":"eventos"}`;
    h+=`<button type="button" class="day${d.getMonth()!==mo?" out":""}${k===TODAY?" today":""}${S.selDay===k?" sel":""}" data-day="${k}" aria-label="${label}">
      <span class="dnum"><b>${d.getDate()}</b></span>
      ${hol?`<span class="hol${hol[1]?" law":""}">${hol[0]}</span>`:""}
      ${de.slice(0,2).map(e=>`<span class="ev${saved.has(e.id)?" saved":""}" style="--c:${TYPES[e.tipo].c}" data-id="${e.id}" title="${e.nome}">${e.nome}</span>`).join("")}
      ${de.length>2?`<span class="more">+${de.length-2} mais</span>`:""}
      <span class="dots" aria-hidden="true">${de.slice(0,4).map(e=>`<span class="dot" style="background:${TYPES[e.tipo].c}"></span>`).join("")}</span>
    </button>`;
  }
  $("cal").innerHTML=h;
  renderDay(evs);
}
function renderDay(evs){
  const box=$("daylist");
  if(!S.selDay){box.hidden=true;return}
  const k=S.selDay,d=parse(k),de=evs.filter(e=>e.ini<=k&&e.fim>=k);
  box.hidden=false;
  const hol=HOL[k];
  $("dayTitle").textContent=`${d.getDate()} de ${MES[d.getMonth()]}${hol?" · "+hol[0]:""}`;
  $("dayItems").innerHTML=de.length?de.map(e=>itemHTML(e)).join(""):`<li class="empty">Nenhum evento neste dia${S.mine?" na sua agenda":""}.</li>`;
}

/* detalhes */
let cur=null;
function openEvent(id){
  const e=BYID[id];if(!e)return;cur=e;
  const st=status(e);
  $("dEyebrow").textContent=TYPES[e.tipo].label+" · "+e.area;
  $("dTitle").textContent=e.nome;
  const rows=[["Data",fmtRange(e)+" de 2026"+(st==="live"?" · acontecendo agora":st==="past"?" · já aconteceu":"")],["Cidade",e.cidade+" ("+e.uf+")"],["Local",e.local||"Ver na página do evento"],["Realização",e.org],["Tipo",TYPES[e.tipo].desc]];
  $("dFacts").innerHTML=rows.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join("");
  $("dSave").textContent=saved.has(e.id)?"★ Na minha agenda":"☆ Salvar na minha agenda";
  $("dGcal").href=gcal(e);
  $("dSrc").href=e.url;
  $("icsBox").hidden=true;
  const dlg=$("dlg");if(!dlg.open)dlg.showModal();
}
function gcal(e){
  const a=e.ini.replaceAll("-",""),f=parse(e.fim);f.setDate(f.getDate()+1);
  const p=new URLSearchParams({action:"TEMPLATE",text:e.nome,dates:a+"/"+iso(f).replaceAll("-",""),location:[e.local,e.cidade+" - "+e.uf].filter(Boolean).join(", "),details:"Realização: "+e.org+"\nMais informações: "+e.url});
  return "https://calendar.google.com/calendar/render?"+p.toString();
}
function ics(evs){
  const esc=s=>s.replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");
  const stamp=new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z";
  const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Mapa Juridico BR//PT","CALSCALE:GREGORIAN"];
  evs.forEach(e=>{const f=parse(e.fim);f.setDate(f.getDate()+1);
    L.push("BEGIN:VEVENT","UID:"+e.id+"-2026@mapajuridico.br","DTSTAMP:"+stamp,"DTSTART;VALUE=DATE:"+e.ini.replaceAll("-",""),"DTEND;VALUE=DATE:"+iso(f).replaceAll("-",""),"SUMMARY:"+esc(e.nome),"LOCATION:"+esc([e.local,e.cidade+" - "+e.uf].filter(Boolean).join(", ")),"DESCRIPTION:"+esc("Realização: "+e.org+"\n"+e.url),"URL:"+e.url,"END:VEVENT")});
  L.push("END:VCALENDAR");return L.join("\r\n");
}
async function copyIcs(evs,box){
  const txt=ics(evs);
  try{await navigator.clipboard.writeText(txt);toast(evs.length===1?"Evento copiado em formato .ics":evs.length+" eventos copiados em formato .ics. Cole num arquivo .ics para importar.")}
  catch(_){
    if(box){box.hidden=false;box.value=txt;box.focus();box.select();toast("Selecionei o texto .ics: copie com Ctrl+C")}
    else{openFallback(txt)}
  }
}
function openFallback(txt){ // sem dialog aberto: usa a caixa do modal com o primeiro evento salvo
  const first=EVENTS.find(e=>saved.has(e.id));if(first)openEvent(first.id);
  const b=$("icsBox");b.hidden=false;b.value=txt;b.focus();b.select();toast("Selecionei o texto .ics: copie com Ctrl+C");
}
let tt;function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2600)}

/* eventos de UI */
document.addEventListener("click",ev=>{
  const r=ev.target.closest("[data-reset]");if(r){resetFilters();return}
  const evEl=ev.target.closest(".ev[data-id]");if(evEl){ev.stopPropagation();openEvent(evEl.dataset.id);return}
  const it=ev.target.closest(".item[data-id]");if(it){openEvent(it.dataset.id);return}
  const day=ev.target.closest(".day[data-day]");if(day){S.selDay=S.selDay===day.dataset.day?null:day.dataset.day;renderCal();if(S.selDay&&window.matchMedia("(max-width:640px)").matches)$("daylist").scrollIntoView({block:"nearest"});}
});
$("dClose").onclick=()=>$("dlg").close();
$("dlg").addEventListener("click",ev=>{if(ev.target===$("dlg"))$("dlg").close()});
$("dSave").onclick=()=>{if(!cur)return;if(saved.has(cur.id)){saved.delete(cur.id);toast("Removido da sua agenda")}else{saved.add(cur.id);toast("Salvo na sua agenda")}persist();$("dSave").textContent=saved.has(cur.id)?"★ Na minha agenda":"☆ Salvar na minha agenda";render()};
$("dIcs").onclick=()=>{if(cur)copyIcs([cur],$("icsBox"))};
$("dMap").onclick=()=>{if(!cur)return;S.uf=cur.uf;$("dlg").close();render();$("mapa").scrollIntoView({block:"start"})};

function stats(){
  $("sTotal").textContent=EVENTS.length;
  $("sUfs").textContent=new Set(EVENTS.map(e=>e.uf)).size;
  $("sNext").textContent=EVENTS.filter(e=>status(e)!=="past").length;
}
function render(){renderMap();renderList();renderCal()}

const t0=new Date();S.month=new Date(t0.getFullYear(),t0.getMonth(),1);
if(t0.getFullYear()!==2026){S.month=new Date(2026,10,1)}
$("suggestTop").href=suggestURL();$("suggestFoot").href=suggestURL();
buildControls();buildMap();stats();render();
