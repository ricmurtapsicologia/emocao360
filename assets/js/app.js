
(()=>{"use strict";
const URL="https://ricmurtapsicologia.github.io/emocao360/";
const PERSIST_KEY="emocao360_records_v2";
const OLD_KEY="plutchik_records_v1";
let sessionRecords=[];
let currentSelections=[];

const BASES=[
 {key:"joy",label:"Alegria",angle:-90,color:"#f3c746",low:"Serenidade",mid:"Alegria",high:"Êxtase",
 definition:"Experiências de satisfação, prazer ou conexão com algo valorizado.",
 function:"Pode favorecer aproximação, vínculo, exploração e repetição de experiências significativas.",
 strategies:["Notar o que tornou este momento importante.","Usar a energia disponível para ações coerentes com seus valores."],
 reflections:["O que esta emoção mostra sobre o que importa para mim?","Como aproveitar este momento sem exigir que ele dure para sempre?"]},
 {key:"trust",label:"Confiança",angle:-45,color:"#7fbd55",low:"Aceitação",mid:"Confiança",high:"Admiração",
 definition:"Experiências de segurança relacional, abertura e expectativa de confiabilidade.",
 function:"Pode favorecer vínculo, cooperação e aproximação quando o contexto oferece segurança suficiente.",
 strategies:["Observar evidências de confiabilidade, não apenas desejo de confiar.","Manter limites mesmo em relações importantes."],
 reflections:["Que sinais sustentam minha confiança?","Que limite ajuda a proteger este vínculo?"]},
 {key:"fear",label:"Medo",angle:0,color:"#4ea26d",low:"Apreensão",mid:"Medo",high:"Terror",
 definition:"Resposta relacionada à percepção de ameaça, risco ou possibilidade de perda.",
 function:"Pode direcionar atenção para segurança, preparação e proteção.",
 strategies:["Separar o que é perigo atual do que é possibilidade futura.","Escolher um passo proporcional ao risco real e aos recursos disponíveis."],
 reflections:["O que meu medo está tentando proteger?","O que está sob meu controle agora?"]},
 {key:"surprise",label:"Surpresa",angle:45,color:"#57a7bb",low:"Distração",mid:"Surpresa",high:"Assombro",
 definition:"Resposta a algo inesperado ou diferente do que estava previsto.",
 function:"Pode interromper expectativas e favorecer rápida atualização da atenção.",
 strategies:["Dar alguns instantes para assimilar antes de concluir.","Buscar informações adicionais quando o evento muda sua leitura da situação."],
 reflections:["O que mudou em relação ao que eu esperava?","Que informação ainda falta antes de decidir?"]},
 {key:"sadness",label:"Tristeza",angle:90,color:"#627db7",low:"Pensividade",mid:"Tristeza",high:"Luto",
 definition:"Experiências associadas a perda, frustração, afastamento ou redução de algo significativo.",
 function:"Pode favorecer recolhimento, processamento de perdas e busca de apoio.",
 strategies:["Reduzir exigências desnecessárias e reconhecer a perda envolvida.","Buscar apoio sem transformar tristeza em prova de incapacidade."],
 reflections:["O que foi perdido ou ameaçado aqui?","De que forma posso cuidar de mim enquanto atravesso isso?"]},
 {key:"disgust",label:"Nojo",angle:135,color:"#9d67aa",low:"Tédio",mid:"Nojo",high:"Repulsa",
 definition:"Resposta de afastamento diante do que é percebido como aversivo, contaminante ou incompatível.",
 function:"Pode favorecer proteção e distanciamento de estímulos percebidos como nocivos.",
 strategies:["Distinguir proteção útil de rejeição automática.","Examinar se o julgamento corresponde ao contexto atual."],
 reflections:["Do que quero me afastar e por quê?","Esse afastamento me protege ou apenas estreita minhas opções?"]},
 {key:"anger",label:"Raiva",angle:180,color:"#d46151",low:"Irritação",mid:"Raiva",high:"Ira",
 definition:"Resposta comum diante de frustração, bloqueio, injustiça percebida ou violação de limites.",
 function:"Pode mobilizar energia para proteção, reparação, posicionamento e mudança.",
 strategies:["Separar impulso de ação: intensidade não obriga resposta imediata.","Transformar energia em pedido, limite ou ação proporcional."],
 reflections:["Que limite ou expectativa foi atravessado?","Como posso ser firme sem aumentar o dano?"]},
 {key:"anticipation",label:"Antecipação",angle:225,color:"#e59b43",low:"Interesse",mid:"Antecipação",high:"Vigilância",
 definition:"Orientação da atenção para o que pode acontecer a seguir.",
 function:"Pode apoiar preparação, curiosidade, planejamento e busca de oportunidades.",
 strategies:["Transformar previsão em plano quando houver algo controlável.","Diferenciar preparação útil de ruminação repetitiva."],
 reflections:["O que estou prevendo: fato, hipótese ou possibilidade?","Qual é o próximo passo concreto que realmente ajuda?"]}
];

const DYADS=[
 {code:"love",label:"Amor",a:"joy",b:"trust",definition:"No modelo, alegria + confiança formam a diade primária chamada amor."},
 {code:"submission",label:"Submissão",a:"trust",b:"fear",definition:"No modelo, confiança + medo formam a diade primária chamada submissão."},
 {code:"awe",label:"Temor reverente",a:"fear",b:"surprise",definition:"No modelo, medo + surpresa formam a diade primária conhecida como awe; aqui traduzida como temor reverente."},
 {code:"disapproval",label:"Desaprovação",a:"surprise",b:"sadness",definition:"No modelo, surpresa + tristeza formam a diade primária chamada desaprovação."},
 {code:"remorse",label:"Remorso",a:"sadness",b:"disgust",definition:"No modelo, tristeza + nojo formam a diade primária chamada remorso."},
 {code:"contempt",label:"Desprezo",a:"disgust",b:"anger",definition:"No modelo, nojo + raiva formam a diade primária chamada desprezo."},
 {code:"aggressiveness",label:"Agressividade",a:"anger",b:"anticipation",definition:"No modelo, raiva + antecipação formam a diade primária chamada agressividade."},
 {code:"optimism",label:"Otimismo",a:"anticipation",b:"joy",definition:"No modelo, antecipação + alegria formam a diade primária chamada otimismo."}
];

const byKey=Object.fromEntries(BASES.map(x=>[x.key,x]));
const shade=(hex,amt)=>{let n=parseInt(hex.slice(1),16),r=Math.max(0,Math.min(255,(n>>16)+amt)),g=Math.max(0,Math.min(255,((n>>8)&255)+amt)),b=Math.max(0,Math.min(255,(n&255)+amt));return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)};
const mix=(a,b)=>{const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);const r=Math.round(((x>>16)+(y>>16))/2),g=Math.round((((x>>8)&255)+((y>>8)&255))/2),bl=Math.round(((x&255)+(y&255))/2);return "#"+((1<<24)+(r<<16)+(g<<8)+bl).toString(16).slice(1)};
const fmt=d=>new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(new Date(d));
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));

function oldMigration(){
 try{
  if(localStorage.getItem(PERSIST_KEY)) return;
  const raw=localStorage.getItem(OLD_KEY); if(!raw) return;
  const old=JSON.parse(raw); if(!Array.isArray(old)) return;
  const clean=old.map((r,i)=>({
   id:r.id||Date.now()+i,createdAt:r.createdAt||new Date().toISOString(),recordDate:r.patientDate||null,
   emotionLabel:r.emotionLabel||"",type:r.type||"primary",primaryKey:r.primaryKey||null,primaries:r.primaries||null,
   intensity:r.userIntensity||"Moderada",context:r.context||"",triggers:r.triggers||"",behavior:r.behaviors||"",desired:r.desired||""
  }));
  localStorage.setItem(PERSIST_KEY,JSON.stringify(clean));
  localStorage.removeItem(OLD_KEY);
 }catch(e){}
}
function persistent(){try{const a=JSON.parse(localStorage.getItem(PERSIST_KEY)||"[]");return Array.isArray(a)?a:[]}catch(e){return[]}}
function savePersistent(a){localStorage.setItem(PERSIST_KEY,JSON.stringify(a))}
function allRecords(){return [...persistent().map(r=>({...r,_scope:"persistente"})),...sessionRecords.map(r=>({...r,_scope:"sessão"}))]}

function polar(r,deg){const a=deg*Math.PI/180;return [r*Math.cos(a),r*Math.sin(a)]}
function wedge(r1,r2,start,end){const [x1,y1]=polar(r1,start),[x2,y2]=polar(r1,end),[x3,y3]=polar(r2,end),[x4,y4]=polar(r2,start);return `M ${x1} ${y1} A ${r1} ${r1} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x4} ${y4} Z`}
function buildWheel(){
 const svg=document.getElementById("wheel"),NS="http://www.w3.org/2000/svg";svg.innerHTML="";
 const bg=document.createElementNS(NS,"circle");bg.setAttribute("r","188");bg.setAttribute("fill","var(--surface)");bg.setAttribute("stroke","var(--border)");svg.appendChild(bg);
 const rings=[{key:"low",r1:25,r2:72,delta:32},{key:"mid",r1:72,r2:120,delta:0},{key:"high",r1:120,r2:158,delta:-28}];
 BASES.forEach(base=>{
  rings.forEach(r=>{
   const label=base[r.key],p=document.createElementNS(NS,"path"),start=base.angle-18,end=base.angle+18;
   p.setAttribute("d",wedge(r.r1,r.r2,start,end));p.setAttribute("fill",shade(base.color,r.delta));p.setAttribute("class","wheel-segment");
   p.setAttribute("tabindex","0");p.setAttribute("role","button");p.dataset.code=`${base.key}:${r.key}`;p.setAttribute("aria-label",`${label}, ${base.label}, intensidade ${r.key==="low"?"baixa":r.key==="mid"?"média":"alta"}`);
   p.addEventListener("click",()=>selectEmotion(p.dataset.code));p.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectEmotion(p.dataset.code)}});svg.appendChild(p);
   const rr=(r.r1+r.r2)/2,[x,y]=polar(rr,base.angle),t=document.createElementNS(NS,"text");t.setAttribute("x",x);t.setAttribute("y",y);t.setAttribute("text-anchor","middle");t.setAttribute("dominant-baseline","middle");t.setAttribute("class","wheel-label"+(r.key==="high"?" light":""));t.textContent=label;svg.appendChild(t);
  })
 });
 DYADS.forEach((d,i)=>{
  const a=byKey[d.a],b=byKey[d.b],angle=a.angle+22.5,p=document.createElementNS(NS,"path");
  p.setAttribute("d",wedge(164,190,angle-10,angle+10));p.setAttribute("fill",mix(a.color,b.color));p.setAttribute("class","wheel-segment");p.setAttribute("tabindex","0");p.setAttribute("role","button");p.dataset.code=`dyad:${d.code}`;p.setAttribute("aria-label",`Diade ${d.label}`);
  p.addEventListener("click",()=>selectEmotion(p.dataset.code));p.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectEmotion(p.dataset.code)}});svg.appendChild(p);
  const [x,y]=polar(177,angle),t=document.createElementNS(NS,"text");t.setAttribute("x",x);t.setAttribute("y",y);t.setAttribute("text-anchor","middle");t.setAttribute("dominant-baseline","middle");t.setAttribute("class","wheel-label");t.textContent=d.label;svg.appendChild(t)
 });
 buildPicker()
}
function buildPicker(){
 const s=document.getElementById("mobileEmotion");
 BASES.forEach(b=>["low","mid","high"].forEach(r=>{const o=document.createElement("option");o.value=`${b.key}:${r}`;o.textContent=`${b[r]} — ${b.label}`;s.appendChild(o)}));
 DYADS.forEach(d=>{const o=document.createElement("option");o.value=`dyad:${d.code}`;o.textContent=`${d.label} — diade`;s.appendChild(o)});
 s.addEventListener("change",()=>{if(s.value)selectEmotion(s.value)})
}
function selectionMeta(code){
 if(code.startsWith("dyad:")){
  const d=DYADS.find(x=>x.code===code.split(":")[1]);
  return d?{code,label:d.label,type:"diad",primaries:[d.a,d.b]}:null
 }
 const [k,ring]=code.split(":"),b=byKey[k];
 return b?{code,label:b[ring],type:"primary",primaryKey:k,ring}:null
}
function selectedLabels(){return currentSelections.map(code=>selectionMeta(code)).filter(Boolean).map(x=>x.label)}
function selectEmotion(code){
 const idx=currentSelections.indexOf(code),adding=idx===-1;
 if(adding)currentSelections.push(code);else currentSelections.splice(idx,1);
 document.querySelectorAll(".wheel-segment").forEach(x=>x.classList.toggle("selected",currentSelections.includes(x.dataset.code)));
 const input=document.getElementById("emotionName"),picker=document.getElementById("mobileEmotion");
 if(picker)picker.value="";
 if(!currentSelections.length){
  input.value="";
  document.getElementById("emotionDetails").innerHTML='<p class="details-empty">Selecione uma ou mais emoções na roda. Emoções diferentes podem coexistir na mesma situação; a ferramenta não exige que você escolha apenas uma.</p>';
  return
 }
 const focusCode=adding?code:currentSelections[currentSelections.length-1],selected=selectedLabels();
 let html="";
 if(focusCode.startsWith("dyad:")){
  const d=DYADS.find(x=>x.code===focusCode.split(":")[1]),a=byKey[d.a],b=byKey[d.b];
  html=`<h3 class="emotion-title">${esc(d.label)}</h3><p class="emotion-meta">Diade primária · ${esc(a.label)} + ${esc(b.label)}</p><div class="details-grid">
   <div class="info-block"><b>Como ler no modelo</b><p>${esc(d.definition)}</p></div>
   <div class="info-block"><b>Uso psicoeducativo</b><p>Trate a diade como uma hipótese de linguagem. Experiências reais podem envolver mais de duas emoções, ambivalência e significados pessoais que a roda não representa.</p></div>
   <div class="info-block"><b>Pergunta útil</b><p>Quais partes de ${esc(a.label.toLowerCase())} e ${esc(b.label.toLowerCase())} aparecem nesta situação, e o que cada uma parece pedir de você?</p></div></div>`;
 }else{
  const [k,ring]=focusCode.split(":"),b=byKey[k],degree=ring==="low"?"baixa":ring==="mid"?"média":"alta";
  html=`<h3 class="emotion-title">${esc(b[ring])}</h3><p class="emotion-meta">${esc(b.label)} · intensidade qualitativa ${degree}</p><div class="details-grid">
   <div class="info-block"><b>Definição funcional</b><p>${esc(b.definition)}</p></div>
   <div class="info-block"><b>Possível função</b><p>${esc(b.function)}</p></div>
   <div class="info-block"><b>Estratégias de regulação</b><ul>${b.strategies.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
   <div class="info-block"><b>Perguntas para reflexão</b><ul>${b.reflections.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div>`;
 }
 const summary=`<div class="selection-summary"><b>${selected.length===1?"Emoção selecionada":"Emoções selecionadas simultaneamente"}</b><div class="selection-chips">${selected.map(x=>`<span class="selection-chip">${esc(x)}</span>`).join("")}</div><div class="multi-note">${selected.length>1?"Essas emoções serão reunidas no mesmo registro. Se alguma não fizer mais sentido, clique novamente no respectivo setor para removê-la.":"Você pode continuar selecionando outros setores se mais de uma emoção estiver presente."}</div></div>`;
 document.getElementById("emotionDetails").innerHTML=summary+html+`<p class="model-note">A intensidade indicada pela roda é uma categoria qualitativa do modelo, não uma medida clínica objetiva.</p>`;
 input.value=selected.join(" + ")
}
function feedback(msg,type="ok"){const el=document.getElementById("feedback");el.textContent=msg;el.className=`feedback show ${type}`;setTimeout(()=>el.className="feedback",5500)}

function recordFromForm(){
 const selections=currentSelections.map(code=>selectionMeta(code)).filter(Boolean).map(x=>x.type==="diad"?{code:x.code,label:x.label,type:x.type,primaries:x.primaries}:{code:x.code,label:x.label,type:x.type,primaryKey:x.primaryKey});
 let type="custom",primaryKey=null,primaries=null;
 if(selections.length===1){type=selections[0].type;primaryKey=selections[0].primaryKey||null;primaries=selections[0].primaries||null}
 else if(selections.length>1)type="multi";
 return {id:Date.now()+Math.floor(Math.random()*1000),createdAt:new Date().toISOString(),recordDate:document.getElementById("recordDate").value||null,
 emotionLabel:document.getElementById("emotionName").value.trim(),type,primaryKey,primaries,selections,intensity:document.getElementById("intensity").value,
 context:document.getElementById("context").value.trim(),triggers:document.getElementById("triggers").value.trim(),behavior:document.getElementById("behavior").value.trim(),desired:document.getElementById("desired").value.trim()}
}
function onSubmit(e){
 e.preventDefault();const r=recordFromForm();if(!r.emotionLabel||!r.context){feedback("Preencha ao menos a emoção e o contexto do episódio.","err");return}
 if(document.getElementById("persistChoice").checked){const a=persistent();a.push(r);savePersistent(a);feedback("Registro salvo neste navegador. A identificação não foi armazenada.")}
 else{sessionRecords.push(r);feedback("Registro guardado apenas nesta sessão. Ele não permanecerá após fechar a página.")}
 renderAll()
}
function deleteRecord(id,scope){
 if(scope==="persistente"){savePersistent(persistent().filter(r=>String(r.id)!==String(id)))}else{sessionRecords=sessionRecords.filter(r=>String(r.id)!==String(id))}
 renderAll()
}
function renderHistory(){
 const list=document.getElementById("historyList"),records=allRecords().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));list.innerHTML="";
 if(!records.length){list.innerHTML='<div class="empty">Nenhum registro ainda.</div>';return}
 records.forEach(r=>{const d=document.createElement("div");d.className="record";
  const top=document.createElement("div");top.className="record-top";
  const txt=document.createElement("div");txt.innerHTML=`<strong>${esc(r.emotionLabel||"Emoção")}</strong><div class="record-meta">${esc(fmt(r.createdAt))} · ${esc(r.intensity||"")} · ${esc(r._scope)}</div>`;
  const del=document.createElement("button");del.type="button";del.textContent="Excluir";del.setAttribute("aria-label","Excluir este registro");del.onclick=()=>deleteRecord(r.id,r._scope);
  top.append(txt,del);d.append(top);if(r.context){const p=document.createElement("p");p.textContent=r.context.length>180?r.context.slice(0,180)+"…":r.context;d.append(p)}list.append(d)
 })
}
function renderBars(){
 const counts=Object.fromEntries(BASES.map(b=>[b.key,0]));
 const addSelection=sel=>{if(sel.type==="primary"&&sel.primaryKey in counts)counts[sel.primaryKey]+=1;else if(sel.type==="diad"&&Array.isArray(sel.primaries))sel.primaries.forEach(k=>{if(k in counts)counts[k]+=.5})};
 allRecords().forEach(r=>{if(Array.isArray(r.selections)&&r.selections.length)r.selections.forEach(addSelection);else addSelection(r)});
 const max=Math.max(1,...Object.values(counts)),box=document.getElementById("bars");box.innerHTML="";
 BASES.forEach(b=>{const row=document.createElement("div");row.className="bar-row";row.innerHTML=`<span>${esc(b.label)}</span><div class="bar-track"><div class="bar-fill" style="width:${(counts[b.key]/max)*100}%;background:${b.color}"></div></div><b>${counts[b.key]}</b>`;box.append(row)})
}
function renderAll(){renderHistory();renderBars()}
function clearForm(){
 document.getElementById("emotionForm").reset();document.getElementById("recordDate").value=new Date().toISOString().slice(0,10);currentSelections=[];document.querySelectorAll(".wheel-segment").forEach(x=>x.classList.remove("selected"));document.getElementById("emotionDetails").innerHTML='<p class="details-empty">Selecione uma ou mais emoções na roda. Emoções diferentes podem coexistir na mesma situação; a ferramenta não exige que você escolha apenas uma.</p>';document.getElementById("mobileEmotion").value=""
}
function summaryText(){
 const r=recordFromForm();if(!r.emotionLabel)return "";
 const lines=["Registro emocional — Emoção 360",`Data: ${r.recordDate?new Date(r.recordDate+"T12:00:00").toLocaleDateString("pt-BR"):"não informada"}`,`Emoção(ões): ${r.emotionLabel}`,`Intensidade percebida: ${r.intensity}`];
 if(r.context)lines.push(`Contexto: ${r.context}`);if(r.triggers)lines.push(`Gatilhos percebidos: ${r.triggers}`);if(r.behavior)lines.push(`O que fiz/evitei: ${r.behavior}`);if(r.desired)lines.push(`Resposta que gostaria de construir: ${r.desired}`);
 lines.push("","Resumo criado em ferramenta psicoeducativa; não constitui avaliação diagnóstica.");return lines.join("\n")
}
async function shareSummary(){
 const text=summaryText();if(!text){feedback("Preencha ao menos a emoção antes de preparar o resumo.","err");return}
 try{if(navigator.share){await navigator.share({title:"Registro emocional",text})}else if(navigator.clipboard){await navigator.clipboard.writeText(text);feedback("Resumo copiado. Cole-o apenas no canal e para a pessoa que você escolher.")}else{prompt("Copie o resumo abaixo:",text)}}catch(e){}
}
async function sharePage(){
 const data={title:"Emoção 360",text:"Ferramenta psicoeducativa para identificar e organizar experiências emocionais.",url:URL};
 try{if(navigator.share)await navigator.share(data);else if(navigator.clipboard){await navigator.clipboard.writeText(URL);feedback("Link da ferramenta copiado.")}else prompt("Copie o link:",URL)}catch(e){}
}
function exportData(){
 const data=persistent();const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),records:data},null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="emocao360-registros.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
function clearPersistent(){if(confirm("Apagar todos os registros persistentes deste navegador? Esta ação não pode ser desfeita.")){localStorage.removeItem(PERSIST_KEY);renderAll();feedback("Histórico persistente apagado.")}}
function setPrintText(id,value,emptyLabel="Não informado"){
 const el=document.getElementById(id);if(!el)return;const text=String(value??"").trim();el.textContent=text||emptyLabel;el.classList.toggle("empty",!text)
}
function printReadingData(){
 if(!currentSelections.length)return {title:"Emoção nomeada pelo usuário",definition:"A emoção foi registrada com as palavras do usuário, sem associação automática a um setor da roda.",functionText:"Use o rótulo como ponto de partida para explorar contexto, necessidades, valores e padrões em psicoterapia."};
 if(currentSelections.length>1){
  const labels=selectedLabels();
  return {title:`Emoções selecionadas: ${labels.join(" · ")}`,definition:"Este registro reúne diferentes emoções percebidas na mesma experiência. Emoções simultâneas podem coexistir, ter intensidades distintas e apontar para necessidades ou tendências de ação diferentes.",functionText:"No uso psicoeducativo, a multisseleção amplia a linguagem sobre a experiência sem transformar a combinação em diagnóstico ou classificação definitiva."}
 }
 const currentSelection=currentSelections[0];
 if(currentSelection.startsWith("dyad:")){
  const d=DYADS.find(x=>x.code===currentSelection.split(":")[1]),a=byKey[d.a],b=byKey[d.b];
  return {title:d.label,definition:d.definition,functionText:`No modelo de Plutchik, esta diade combina ${a.label.toLowerCase()} e ${b.label.toLowerCase()}. Trate essa combinação como hipótese de linguagem, não como classificação definitiva da experiência.`}
 }
 const [key,ring]=currentSelection.split(":"),b=byKey[key],degree=ring==="low"?"baixa":ring==="mid"?"média":"alta";
 return {title:`${b[ring]} · ${b.label}`,definition:b.definition,functionText:`${b.function} A posição escolhida corresponde a uma intensidade qualitativa ${degree} no modelo.`}
}
function buildPrintSheet(){
 const r=recordFromForm(),identity=document.getElementById("identity").value.trim(),reading=printReadingData();
 setPrintText("printIdentity",identity);setPrintText("printDate",r.recordDate?new Date(r.recordDate+"T12:00:00").toLocaleDateString("pt-BR"):"");setPrintText("printEmotion",r.emotionLabel);setPrintText("printIntensity",r.intensity);
 setPrintText("printContext",r.context,"Não preenchido");setPrintText("printTriggers",r.triggers,"Não preenchido");setPrintText("printBehavior",r.behavior,"Não preenchido");setPrintText("printDesired",r.desired,"Não preenchido");
 const printTwo=document.getElementById("printTwo");if(printTwo)printTwo.classList.toggle("stack",(r.triggers.length+r.behavior.length)>620);
 setPrintText("printReadingTitle",reading.title);setPrintText("printDefinition",reading.definition);setPrintText("printFunction",reading.functionText);
 const now=new Date(),date=now.toLocaleDateString("pt-BR"),time=now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});setPrintText("printGenerated",`Gerado em ${date}, às ${time}`);
}
function printPdf(){
 if(!document.getElementById("emotionName").value.trim()){feedback("Preencha a emoção antes de abrir a versão para PDF.","err");return}
 buildPrintSheet();
 const warn="A versão para impressão pode conter informações pessoais e emocionais. Em dispositivo compartilhado, revise o conteúdo e o local onde o arquivo será salvo. Continuar?";
 if(confirm(warn))window.print()
}
function init(){
 oldMigration();buildWheel();document.getElementById("recordDate").value=new Date().toISOString().slice(0,10);renderAll();
 document.getElementById("emotionForm").addEventListener("submit",onSubmit);document.getElementById("shareSummary").onclick=shareSummary;document.getElementById("sharePage").onclick=sharePage;document.getElementById("printPdf").onclick=printPdf;document.getElementById("clearForm").onclick=clearForm;document.getElementById("exportData").onclick=exportData;document.getElementById("clearPersistent").onclick=clearPersistent;
 document.getElementById("themeBtn").onclick=()=>{const b=document.body,n=b.dataset.theme==="dark"?"light":"dark";b.dataset.theme=n;localStorage.setItem("emocao360_theme",n)};
 window.addEventListener("beforeprint",buildPrintSheet);
 const saved=localStorage.getItem("emocao360_theme");if(saved==="dark")document.body.dataset.theme="dark";
}
document.addEventListener("DOMContentLoaded",init);
})();
