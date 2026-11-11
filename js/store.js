/* ============================================================
   store.js — data, helpers, localStorage, streak, pomodoro state
   ============================================================ */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const P2=n=>String(n).padStart(2,'0');
const F=d=>d.getFullYear()+'-'+P2(d.getMonth()+1)+'-'+P2(d.getDate());
const D=n=>{const d=new Date();d.setDate(d.getDate()+n);return F(d)};
const TD=D(0);
const dd=(a,b)=>Math.round((new Date(b+'T00:00')-new Date(a+'T00:00'))/864e5);
const fm=d=>new Date(d+'T00:00').toLocaleDateString('en',{month:'short',day:'numeric'});
const wd=(d,o)=>new Date(d+'T00:00').toLocaleDateString('en',o);
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* Unescape for editing: reverse esc() so form inputs show original characters */
const unesc=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
const L={open:'Open',prog:'In Progress',done:'Done'};
const SC={open:'var(--p)',prog:'var(--y)',done:'var(--g)'};
const PB={High:'bg-danger-subtle text-danger-emphasis',Medium:'bg-warning-subtle text-warning-emphasis',Low:'bg-info-subtle text-info-emphasis'};
const PC={High:'#de5f9b',Medium:'#e8b93d',Low:'#4a90e2'};
const GOALS=[['Research Report','12 chapters',7,12,'bi-book',10],['App Prototype','20 screens',6,20,'bi-phone',16],['Final Presentation','30 slides',25,30,'bi-easel',4]];
const QUOTES=[['The secret of getting ahead is getting started.','Mark Twain'],['Focus on being productive instead of busy.','Tim Ferriss'],['Small daily improvements lead to staggering results.','Robin Sharma']];

function seed(){
  const t=[[50,'Load-Up research sources','High','open',-3,2,'MC AR'],[51,'Clean-Up survey data','Medium','open',-2,4,'SO'],[52,'Finish-Up slide deck','Low','open',0,9,'PS LM'],[63,'Peer review round','Medium','open',1,12,'AR PS SO MC LM'],
  [53,'Design system tokens','Medium','prog',-6,1,'PS'],[54,'Build prototype login flow','High','prog',-5,2,'SO AR'],[55,'Draft report introduction','High','prog',-4,3,'LM'],[57,'Kickoff meeting notes','Low','prog',-9,-1,'AR'],
  [56,'Interview 5 users','Medium','done',-12,-4,'MC',-4],[58,'Competitor analysis','Medium','done',-14,-6,'MC PS',-6],[59,'Set up shared drive','Low','done',-15,-8,'SO',-8],[60,'Moodboard','Low','done',-13,-5,'PS',-5],[61,'Project outline','High','done',-11,-3,'LM AR',-3],[62,'Wireframes v1','Medium','done',-10,-2,'PS SO',-2]
  ].map(([id,t,p,s,a,b,as,dn])=>({id,t,p,s,a:D(a),b:D(b),as:as.split(' '),ds:'',dn:dn==null?null:D(dn),cm:[],at:[]}));
  const d={};
  // Seed 4–5 recent days of activity so streak starts > 0
  for(let i=0;i<5;i++) d[D(-i)]=1;
  t.forEach(x=>{if(x.dn)d[x.dn]=1});
  return{t,d,dk:'light',p:{f:25,s:5,l:15},l:{},
  m:[['AR','Alex Rivera','Project Lead','#8b5cf6'],['PS','Priya Shah','Designer','#db5a9b'],['SO','Sam Okafor','Developer','#e8a33d'],['MC','Mia Chen','Researcher','#4cb782'],['LM','Leo Martin','Writer','#4a7fe8'],['FM','Fabiola Marcia Walean','Member','#e0485f']],
  a:[{t:'Priya moved #53 to In Progress',w:Date.now()-72e5},{t:'Sam moved #54 to In Progress',w:Date.now()-1e8},{t:'Mia moved #56 to Done',w:Date.now()-2e8}],
  c:[['PS','I pushed the new design tokens, have a look when you can.'],['SO','Nice! Login flow is almost done, just fixing the form errors.'],['AR','Great work. Let\'s aim to wrap the prototype by Friday.']]}
}

let S=JSON.parse(localStorage.getItem('tf')||'null')||seed();
/* Migrate old data: add safe defaults for new fields */
S.t.forEach(t=>{
  if(typeof t.t==='string')t.t=unesc(t.t);if(typeof t.ds==='string')t.ds=unesc(t.ds);
  if(!t.cm) t.cm=[];
  if(!t.at) t.at=[];t.cm.forEach(c=>{if(typeof c.tx==='string')c.tx=unesc(c.tx)});
});
S.m.forEach(m=>{if(typeof m[1]==='string')m[1]=unesc(m[1]);if(typeof m[2]==='string')m[2]=unesc(m[2])});
if(!S.d) S.d={};
S.pr=S.pr||GOALS.map(([name,desc,done,total,icon,days],i)=>({id:'p'+(i+1),name,desc,total,icon,due:D(days),status:'active'}));
S.nr=S.nr||[]; S.set={appearance:'light',sound:true,autoStart:false,notifications:true,notifyOverdue:true,notifyDue:true,notifyStreak:true,notifyComments:true,notifyFocus:true,...(S.set||{})}; S.fb=S.fb||[];
S.t.forEach(t=>{if(!('pj' in t))t.pj=S.pr[0]?.id||''});
if(!localStorage.getItem('tf')) localStorage.setItem('tf',JSON.stringify(S));
const R={};

const save=()=>localStorage.setItem('tf',JSON.stringify(S));

const isOv=t=>t.s!='done'&&t.b<TD;
const col=t=>isOv(t)?'var(--r)':SC[t.s];
const open_=m=>S.t.filter(x=>x.s!='done'&&x.as.includes(m)).length;
const done_=m=>S.t.filter(x=>x.s=='done'&&x.as.includes(m)).length;
const av=ids=>ids.map(i=>{const m=S.m.find(x=>x[0]==i)||[i,i,'','#999'];return`<span class="av" style="background:${m[3]}" title="${esc(m[1])}">${esc(i)}</span>`}).join('');
const act=t=>{S.a.unshift({t,w:Date.now()});S.a=S.a.slice(0,30)};
const ago=w=>{const m=Math.round((Date.now()-w)/6e4);return m<1?'just now':m<60?m+' min ago':m<1440?Math.round(m/60)+' h ago':Math.round(m/1440)+' days ago'};
const streak=()=>{let n=0,i=S.d[D(0)]?0:1;while(S.d[D(-i)]){n++;i++}return n};
const best=()=>{let b=0,c=0;for(let i=365;i>=0;i--){c=S.d[D(-i)]?c+1:0;b=Math.max(b,c)}return b};
const donut=(p,c,s,z=150)=>{const T=p.reduce((x,y)=>x+y[1],0)||1;let a=0;const g=p.map(([k,n])=>{const b=a;a+=n/T*100;return`${k} ${b}% ${a}%`}).join(',');return`<div class="donut" style="width:${z}px;height:${z}px;background:conic-gradient(${g})"><div><b style="font-size:${z/4.5}px;color:var(--ink)">${c}</b><small class="text-secondary">${s}</small></div></div>`};
const H=(t,s,x='')=>`<div class="d-flex justify-content-between align-items-start gap-2"><div><h2 class="fw-bold mb-0">${t}</h2><p class="text-secondary">${s}</p></div>${x}</div>`;
const PG=(a,b,c,d)=>`<div class="btn-group"><button class="btn btn-light" aria-label="Previous" onclick="${a}"><i class="bi bi-chevron-left"></i></button><button class="btn btn-light" onclick="${b}">${c}</button><button class="btn btn-light" aria-label="Next" onclick="${d}"><i class="bi bi-chevron-right"></i></button></div>`;
const bar=p=>`<div class="progress" style="height:8px"><div class="progress-bar bg-success" style="width:${p}%"></div></div>`;
const toast=m=>{const e=document.createElement('div');e.className='toast align-items-center border-0';e.setAttribute('role','alert');e.innerHTML=`<div class="d-flex"><div class="toast-body">${m}</div><button class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;$('#tc').append(e);new bootstrap.Toast(e,{delay:3000}).show()};
const beep=()=>{try{const a=new AudioContext(),o=a.createOscillator();o.connect(a.destination);o.start();o.stop(a.currentTime+.4)}catch(e){}};

/* ============================================================
   POMODORO PERSISTENCE (across pages via localStorage)
   Store: tf_pom = { end: <unix ms>, mode: 'f'|'s'|'l', task: '', running: bool }
   On load: restore timer, check if expired while away
   ============================================================ */
const pomKey='tf_pom';
function savePom(state){localStorage.setItem(pomKey,JSON.stringify(state))}
function loadPom(){try{return JSON.parse(localStorage.getItem(pomKey))}catch(e){return null}}
function clearPom(){localStorage.removeItem(pomKey)}

/* Pomodoro state object — shared across pages */
const tm={m:'f',left:0,run:0,iv:0,k:''};

function initPomState(){
  tm.left=S.p[tm.m]*60;
  const ps=loadPom();
  if(!ps) return;
  if(ps.running){
    const now=Date.now();
    if(now>=ps.end){
      /* Timer finished while user was away */
      finOffscreen(ps);
      clearPom();
    } else {
      /* Timer still running — resume */
      tm.m=ps.mode||'f';
      tm.k=ps.task||'';
      tm.left=Math.ceil((ps.end-now)/1000);
      tm.run=1;
      tm.iv=setInterval(()=>{
        if(--tm.left<=0) fin();
        else{renderRing();updatePomBadge()}
      },1000);
    }
  } else if(ps.left!=null){
    /* Timer was paused */
    tm.m=ps.mode||'f';
    tm.k=ps.task||'';
    tm.left=ps.left;
    tm.run=0;
  }
}

function finOffscreen(ps){
  /* Log the session that completed while the user was on another page */
  if(S.set.sound)beep();
  if(ps.mode=='f'){
    const a=S.l[TD]||(S.l[TD]=[0,0]);
    a[0]++;a[1]+=S.p.f;
    S.d[TD]=1;
    act('Fabiola finished a focus session'+(ps.task?' on #'+ps.task:''));
    save();
  }
  setTimeout(()=>toast('⏰ Your focus session finished while you were away!'),500);
  tm.m=ps.mode=='f'?'s':'f';
  tm.left=S.p[tm.m]*60;
  tm.run=0;
  tm.k='';
}

function updatePomBadge(){
  const badge=$('#pom-badge');
  if(!badge) return;
  if(tm.run){
    badge.innerHTML=`<span class="pomo-badge"><i class="bi bi-stopwatch"></i> ${P2(Math.floor(tm.left/60))}:${P2(tm.left%60)}</span>`;
    badge.style.display='inline-block';
  } else {
    badge.style.display='none';
  }
}

/* FILES mapping */
const FILES={dash:'index.html',tasks:'tasks.html',projects:'projects.html',tl:'timeline.html',cal:'calendar.html',pom:'pomodoro.html',ana:'analytics.html',mem:'members.html',notifications:'notifications.html',profile:'profile.html',settings:'settings.html',help:'help.html'};
const NAV=[['dash','Dashboard','bi-grid'],['tasks','Tasks','bi-list-check'],['projects','Projects','bi-kanban'],['tl','Timeline','bi-bar-chart-steps'],['cal','Calendar','bi-calendar3'],['pom','Pomodoro','bi-stopwatch'],['ana','Analytics','bi-graph-up'],['mem','Members','bi-people']];

/* Card rendering */
const card=t=>{
  const cmCount=t.cm?t.cm.length:0;
  const atCount=t.at?t.at.length:0;
  const counters=[];
  if(cmCount) counters.push(`<i class="bi bi-chat-dots"></i> ${cmCount}`);
  if(atCount) counters.push(`<i class="bi bi-paperclip"></i> ${atCount}`);
  return`<div class="card tk p-3 mb-2" draggable="true" data-id="${t.id}" tabindex="0" role="button" aria-label="Task #${t.id} ${esc(t.t)}" style="border-left:5px solid ${col(t)}" onclick="det(${t.id})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();det(${t.id})}"><div class="fw-semibold ${t.s=='done'?'text-decoration-line-through opacity-75':''}"><span class="text-primary">#${t.id}</span> ${esc(t.t)}</div><div class="d-flex justify-content-between align-items-center my-2"><span class="badge ${PB[t.p]}">${t.p}</span><small class="${isOv(t)?'text-danger':'text-secondary'}"><i class="bi bi-calendar3"></i> ${fm(t.b)}</small></div><div class="d-flex justify-content-between align-items-center"><div>${av(t.as)}</div>${counters.length?`<small class="text-secondary d-flex gap-2">${counters.join(' ')}</small>`:''}</div></div>`
};

/* Reset sample data */
function resetData(){
  if(!confirm('Reset all data to sample data? This cannot be undone.')) return;
  localStorage.removeItem('tf');
  clearPom();
  location.reload();
}

function notifications(){const ns=[];if(S.set.notifications&&S.set.notifyOverdue)S.t.filter(isOv).forEach(t=>ns.push({id:'ov'+t.id,type:'overdue',icon:'bi-exclamation-circle',title:`Task overdue: ${t.t}`,text:`Due ${fm(t.b)}`}));(S.set.notifications&&S.set.notifyDue?S.t:[]).filter(t=>t.s!=='done'&&dd(TD,t.b)>=0&&dd(TD,t.b)<=2).forEach(t=>ns.push({id:'due'+t.id,type:'due',icon:'bi-calendar-event',title:`Due soon: ${t.t}`,text:`Due ${fm(t.b)}`}));(S.set.notifications&&S.set.notifyStreak?[3,7,14,30]:[]).filter(n=>streak()>=n).forEach(n=>ns.push({id:'streak'+n,type:'milestone',icon:'bi-fire',title:`${n}-day streak milestone`,text:'Keep up the great work!'}));(S.set.notifications&&S.set.notifyComments?S.t:[]).forEach(t=>(t.cm||[]).forEach((c,i)=>ns.push({id:`cm${t.id}-${i}`,type:'comment',icon:'bi-chat',title:`New comment on ${t.t}`,text:c.tx})));(S.set.notifications&&S.set.notifyFocus?Object.entries(S.l||{}):[]).forEach(([d,v])=>{if(v[0])ns.push({id:'focus'+d,type:'focus',icon:'bi-stopwatch',title:'Focus session completed',text:`${v[0]} session(s) on ${d}`})});return ns}
