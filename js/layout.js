/* ============================================================
   layout.js — shared shell: sidebar, top bar, task modal,
   details panel, toast container, member modal, global init
   ============================================================ */

/* Inject shared HTML shell into the page */
function renderShell(){
  const body=document.body;
  /* Clear the orbs div if it exists */
  const orbs=body.querySelector('.orbs');
  if(orbs) orbs.remove();

  const mainContent=$('#main');
  const mainHTML=mainContent?mainContent.innerHTML:'';

  body.innerHTML=`
<div class="app-frame d-lg-flex gap-3 p-lg-3">
 <!-- SIDEBAR -->
 <div class="sw"><div class="offcanvas-lg offcanvas-start" id="side" tabindex="-1"><div class="offcanvas-body"><div class="card p-3 w-100 sidebar-inner">
  <div class="d-flex align-items-center gap-2 mb-3"><span class="av rounded-4" style="background:var(--p);width:42px;height:42px;font-size:1.2rem"><i class="bi bi-water"></i></span><b class="fs-5" style="color:var(--ink)">TaskFlow</b><button class="btn-close ms-auto d-lg-none" data-bs-dismiss="offcanvas" data-bs-target="#side" aria-label="Close menu"></button></div>
  <nav class="vstack gap-1" id="nav"></nav>
  <div class="sidebar-motto rounded-4 p-3 mt-auto small">Plan it. Track it. <b>Finish it.</b></div>
 </div></div></div></div>
 <main class="flex-grow-1 p-3 p-lg-0" style="min-width:0">
  <!-- TOP BAR -->
  <div class="d-flex gap-2 align-items-center mb-3">
   <button class="btn btn-light d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#side" aria-label="Open menu"><i class="bi bi-list"></i></button>
   <div class="search-glass input-group" style="max-width:380px"><span class="input-group-text border-0"><i class="bi bi-search"></i></span><input id="q" class="form-control border-0 shadow-none" placeholder="Search tasks…" aria-label="Search tasks"></div>
   <div class="ms-auto d-flex gap-2 align-items-center">
    <button id="dk" class="btn btn-light" aria-label="Toggle dark mode"><i class="bi bi-moon"></i></button>
    <span id="pom-badge" style="display:none"></span>
    <span id="stk" class="badge rounded-pill py-2 px-3" style="background:var(--tint);color:var(--ink);border:1px solid var(--card-border)" title="Current streak"></span>
    <div class="dropdown d-none d-sm-block">
     <button class="btn btn-light" data-bs-toggle="dropdown" aria-label="Settings"><i class="bi bi-gear"></i></button>
     <ul class="dropdown-menu dropdown-menu-end">
      <li><button class="dropdown-item" onclick="resetData()"><i class="bi bi-arrow-counterclockwise me-2"></i>Reset sample data</button></li>
     </ul>
    </div>
    <div class="dropdown d-none d-sm-block"><button class="btn btn-light" data-bs-toggle="dropdown" aria-label="Notifications"><i class="bi bi-bell"></i></button><ul class="dropdown-menu dropdown-menu-end" id="nf"></ul></div>
    <button class="btn btn-primary" onclick="openM()"><i class="bi bi-plus-lg"></i><span class="d-none d-sm-inline"> Add New Task</span></button>
    <span class="av" style="background:#e0485f;width:40px;height:40px" title="Fabiola">FM</span>
   </div>
  </div>
  <div id="main"></div>
 </main>
</div>

<!-- ADD / EDIT TASK (Bootstrap modal) -->
<div class="modal fade" id="mo" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><form class="modal-content rounded-4" onsubmit="sv(event)">
 <div class="modal-header border-0"><h5 class="modal-title fw-bold" id="mt">Add New Task</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
 <div class="modal-body vstack gap-3"><input type="hidden" id="mi">
  <div class="form-floating"><input id="f1" class="form-control" required placeholder="Title"><label for="f1">Title</label></div>
  <div class="form-floating"><textarea id="f2" class="form-control" style="height:80px" placeholder="Description"></textarea><label for="f2">Description</label></div>
  <div class="row g-2"><div class="col"><label class="small" for="f3">Priority</label><select id="f3" class="form-select"><option>Low<option selected>Medium<option>High</select></div><div class="col"><label class="small" for="f4">Status</label><select id="f4" class="form-select"><option value="open">Open<option value="prog">In Progress<option value="done">Done</select></div></div>
  <div class="row g-2"><div class="col"><label class="small" for="f5">Start date</label><input type="date" id="f5" class="form-control"></div><div class="col"><label class="small" for="f6">Due date</label><input type="date" id="f6" class="form-control" required></div></div>
  <div><div class="small mb-1">Assignees</div><div id="f7" class="d-flex flex-wrap gap-2"></div></div>
 </div>
 <div class="modal-footer border-0"><button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary">Save task</button></div>
</form></div></div>

<!-- TASK DETAILS (Bootstrap offcanvas) -->
<div class="offcanvas offcanvas-end" id="dt" tabindex="-1"><div class="offcanvas-header"><h5 class="fw-bold" id="dh"></h5><button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button></div><div class="offcanvas-body" id="db"></div></div>

<!-- ADD MEMBER (Bootstrap modal) -->
<div class="modal fade" id="addMemberModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><form class="modal-content rounded-4" onsubmit="saveMember(event)">
 <div class="modal-header border-0"><h5 class="modal-title fw-bold">Add Team Member</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
 <div class="modal-body vstack gap-3">
  <div class="form-floating"><input id="mem-name" class="form-control" required placeholder="Full name" maxlength="60"><label for="mem-name">Full name</label></div>
  <div class="form-floating"><input id="mem-role" class="form-control" placeholder="Role" maxlength="40" value="Member"><label for="mem-role">Role</label></div>
  <div><div class="small mb-1">Choose a color</div><div id="mem-colors" class="d-flex flex-wrap gap-2"></div></div>
  <div id="mem-error" class="text-danger small" style="display:none"></div>
 </div>
 <div class="modal-footer border-0"><button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary">Add member</button></div>
</form></div></div>

<div class="toast-container position-fixed bottom-0 end-0 p-3" id="tc"></div>`;
}

/* Navigation rendering */
function renderNav(){
  $('#nav').innerHTML=NAV.map(([k,n,i])=>
    `<a class="nav-link ${k==PAGE?'active':''}" href="${FILES[k]}"${k==PAGE?' aria-current="page"':''}><i class="bi ${i}"></i>${n}</a>`
  ).join('');
}

/* Header badges */
const clk=()=>{const e=$('#clk');if(e)e.textContent=new Date().toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'})};

function hdr(){
  const stkEl=$('#stk');
  if(stkEl) stkEl.innerHTML=`<i class="bi bi-fire" style="color:var(--y)"></i> ${streak()}`;
  const o=S.t.filter(isOv).length;
  const nfEl=$('#nf');
  if(nfEl) nfEl.innerHTML=`<li class="dropdown-item-text small">${o?o+' overdue task'+(o>1?'s':'')+' need attention':'You are all caught up'}</li>`;
  updatePomBadge();
}

/* Dark mode toggle with sun/moon icon */
function initDarkMode(){
  document.documentElement.dataset.bsTheme=S.dk||'light';
  updateDkIcon();
  $('#dk').onclick=()=>{
    const h=document.documentElement;
    const x=h.dataset.bsTheme=='dark'?'light':'dark';
    h.dataset.bsTheme=x;
    S.dk=x;save();
    updateDkIcon();
  };
}
function updateDkIcon(){
  const icon=$('#dk i');
  if(!icon)return;
  const isDark=document.documentElement.dataset.bsTheme=='dark';
  icon.className=isDark?'bi bi-sun':'bi bi-moon';
}

/* Search behavior: live on Tasks, Enter-only on other pages */
function initSearch(){
  const q=$('#q');
  if(!q) return;
  if(PAGE=='tasks'){
    q.value=sessionStorage.tfq||'';
    q.oninput=()=>{sessionStorage.tfq=q.value;go('tasks')};
  } else {
    q.value='';
    q.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        e.preventDefault();
        const v=q.value.trim();
        if(v){sessionStorage.tfq=v;location.href='tasks.html'}
      }
    });
  }
}

/* Drag & drop */
function initDragDrop(){
  document.addEventListener('dragstart',e=>{const c=e.target.closest('.tk');if(c)e.dataTransfer.setData('text/plain',c.dataset.id)});
  document.addEventListener('dragover',e=>{if(e.target.closest('.col-k'))e.preventDefault()});
  document.addEventListener('drop',e=>{const k=e.target.closest('.col-k');if(k){e.preventDefault();move(+e.dataTransfer.getData('text/plain'),k.dataset.s)}});
}

/* Pomodoro ring rendering */
const renderRing=()=>{
  const e=$('#ring');
  if(!e) return;
  e.innerHTML=donut([['var(--p)',S.p[tm.m]*60-tm.left],['var(--track)',tm.left]],P2(Math.floor(tm.left/60))+':'+P2(tm.left%60),{f:'Focus',s:'Short break',l:'Long break'}[tm.m],250);
};

/* ============================================================
   Task actions
   ============================================================ */
function go(p){
  if(p!=PAGE){location.href=FILES[p];return}
  renderNav();
  $('#main').innerHTML=R[PAGE]();
  renderRing();clk();hdr();
  $$('[data-bs-toggle=tooltip]').forEach(e=>new bootstrap.Tooltip(e));
  bootstrap.Offcanvas.getInstance('#side')?.hide();
}
const mv=n=>{cm+=n;if(cm<0){cm=11;cy--}if(cm>11){cm=0;cy++}go('cal')};
function move(id,s){
  const t=S.t.find(x=>x.id==id);if(!t||t.s==s)return;
  t.s=s;
  if(s=='done'){t.dn=TD;S.d[TD]=1;toast('Task done! Streak updated.')}
  else t.dn=null;
  act(`Fabiola moved #${id} to ${L[s]}`);save();go(PAGE);
}
function openM(id,s,dt){
  const t=id?S.t.find(x=>x.id==id):{};
  $('#mt').textContent=id?'Edit Task':'Add New Task';
  $('#mi').value=id||'';
  /* Use raw text (unescape stored values) for editing */
  $('#f1').value=t.t?unesc(t.t):'';
  $('#f2').value=t.ds?unesc(t.ds):'';
  $('#f3').value=t.p||'Medium';
  $('#f4').value=t.s||s||'open';
  $('#f5').value=t.a||TD;
  $('#f6').value=t.b||dt||D(3);
  $('#f7').innerHTML=S.m.map(m=>`<input type="checkbox" class="btn-check" id="m_${m[0]}" value="${m[0]}" ${(t.as||[]).includes(m[0])?'checked':''}><label class="btn btn-outline-primary btn-sm rounded-pill" for="m_${m[0]}">${esc(m[1]).split(' ')[0]}</label>`).join('');
  bootstrap.Modal.getOrCreateInstance('#mo').show();
}
function sv(e){
  e.preventDefault();
  const id=+$('#mi').value;
  /* Store raw text — escape only happens at render time */
  const o={t:$('#f1').value.trim(),ds:$('#f2').value.trim(),p:$('#f3').value,s:$('#f4').value,a:$('#f5').value||TD,b:$('#f6').value,as:$$('#f7 :checked').map(x=>x.value)};
  if(!o.as.length)o.as=['FM'];
  let t=S.t.find(x=>x.id==id);
  if(t) Object.assign(t,o);
  else{t={...o,id:Math.max(0,...S.t.map(x=>x.id))+1,cm:[],at:[]};S.t.push(t)}
  t.dn=t.s=='done'?t.dn||TD:null;
  if(t.dn==TD) S.d[TD]=1;
  act(`Fabiola ${id?'edited':'added'} #${t.id}`);save();
  bootstrap.Modal.getInstance('#mo').hide();go(PAGE);
}
function del(id){
  if(!confirm('Delete this task?'))return;
  S.t=S.t.filter(x=>x.id!=id);
  act(`Fabiola deleted #${id}`);save();
  bootstrap.Offcanvas.getInstance('#dt')?.hide();go(PAGE);
}
function det(id){
  const t=S.t.find(x=>x.id==id);
  if(!t) return;
  const k=dd(TD,t.b),tot=Math.max(1,dd(t.a,t.b));
  $('#dh').textContent='#'+t.id+' '+(t.t);
  const comments=(t.cm||[]).map(c=>{
    const m=S.m.find(x=>x[0]==c.by)||[c.by,c.by,'','#999'];
    return`<div class="d-flex gap-2 mb-2"><span class="av" style="background:${m[3]};width:28px;height:28px;font-size:.6rem">${esc(c.by)}</span><div class="flex-grow-1"><div class="d-flex justify-content-between"><small class="fw-semibold">${esc(m[1])}</small><small class="text-secondary">${ago(c.w)}</small></div><div class="small">${esc(c.tx)}</div></div></div>`
  }).join('');
  const attachments=(t.at||[]).map((a,i)=>
    `<div class="d-flex justify-content-between align-items-center py-1"><div class="small"><i class="bi bi-paperclip me-1"></i>${esc(a.name)} <span class="text-secondary">(${a.size})</span></div><button class="btn btn-sm text-danger" onclick="removeAtt(${id},${i})" aria-label="Remove attachment"><i class="bi bi-x-lg"></i></button></div>`
  ).join('');
  $('#db').innerHTML=`<div class="d-flex gap-2 mb-3"><span class="badge ${PB[t.p]} align-self-center">${t.p}</span><select class="form-select form-select-sm w-auto rounded-pill" aria-label="Status" onchange="move(${id},this.value);det(${id})">${Object.keys(L).map(s=>`<option value="${s}" ${t.s==s?'selected':''}>${L[s]}`).join('')}</select></div>
  ${donut(t.s=='done'?[['var(--g)',1]]:k<0?[['var(--r)',1]]:[['var(--p)',Math.min(k,tot)],['var(--track)',Math.max(tot-k,0)]],t.s=='done'?'✓':Math.abs(k),t.s=='done'?'done':k<0?'days late':'days left',140)}
  <p class="mt-3"><i class="bi bi-calendar3"></i> ${fm(t.a)} – ${fm(t.b)}</p><div class="mb-3">${av(t.as)}</div><p class="text-secondary">${t.ds?esc(t.ds):'No description yet.'}</p>
  <button class="btn btn-primary me-2" onclick="bootstrap.Offcanvas.getInstance('#dt').hide();openM(${id})"><i class="bi bi-pencil"></i> Edit</button><button class="btn btn-outline-danger rounded-pill" onclick="del(${id})"><i class="bi bi-trash"></i> Delete</button>
  <hr>
  <h6 class="fw-bold"><i class="bi bi-chat-dots me-1"></i> Comments (${(t.cm||[]).length})</h6>
  <div class="vstack gap-1 mb-2" style="max-height:200px;overflow-y:auto">${comments||'<p class="text-secondary small">No comments yet.</p>'}</div>
  <form class="input-group" onsubmit="addComment(event,${id})"><input class="form-control rounded-start-pill" placeholder="Add a comment…" id="cmt-input" autocomplete="off"><button class="btn btn-primary" aria-label="Send comment"><i class="bi bi-send"></i></button></form>
  <hr>
  <h6 class="fw-bold"><i class="bi bi-paperclip me-1"></i> Attachments (${(t.at||[]).length})</h6>
  <div class="vstack gap-1 mb-2">${attachments||'<p class="text-secondary small">No attachments.</p>'}</div>
  <div class="d-flex gap-2 align-items-center"><button class="btn btn-outline-primary btn-sm" onclick="addAtt(${id})"><i class="bi bi-plus-lg"></i> Add attachment</button><small class="text-secondary"><i class="bi bi-info-circle"></i> Files are not uploaded — only name and size are saved.</small></div>`;
  bootstrap.Offcanvas.getOrCreateInstance('#dt').show();
}

/* Comments */
function addComment(e,id){
  e.preventDefault();
  const inp=$('#cmt-input');
  const tx=inp.value.trim();
  if(!tx) return;
  const t=S.t.find(x=>x.id==id);
  if(!t) return;
  if(!t.cm) t.cm=[];
  t.cm.push({by:'FM',tx:tx,w:Date.now()});
  act(`Fabiola commented on #${id}`);
  save();det(id);
}

/* Attachments */
function addAtt(id){
  const name=prompt('Attachment file name (e.g. report.pdf):');
  if(!name||!name.trim()) return;
  const size=prompt('File size (e.g. 2.4 MB):');
  const t=S.t.find(x=>x.id==id);
  if(!t) return;
  if(!t.at) t.at=[];
  t.at.push({name:name.trim(),size:(size||'unknown').trim()});
  save();det(id);
}
function removeAtt(id,idx){
  const t=S.t.find(x=>x.id==id);
  if(!t||!t.at) return;
  t.at.splice(idx,1);
  save();det(id);
}

/* ============================================================
   Pomodoro actions (shared)
   ============================================================ */
function setM(m){
  clearInterval(tm.iv);tm.run=0;tm.m=m;tm.left=S.p[m]*60;
  clearPom();
  if(PAGE=='pom') go('pom');
  updatePomBadge();
}
function tg(){
  if(tm.run){
    clearInterval(tm.iv);tm.run=0;
    /* Save paused state */
    savePom({running:false,mode:tm.m,task:tm.k,left:tm.left});
  } else {
    tm.run=1;
    const endTime=Date.now()+tm.left*1000;
    savePom({running:true,end:endTime,mode:tm.m,task:tm.k});
    tm.iv=setInterval(()=>{
      if(--tm.left<=0) fin();
      else{renderRing();updatePomBadge()}
    },1000);
  }
  if(PAGE=='pom') go('pom');
  updatePomBadge();
}
function fin(){
  clearInterval(tm.iv);tm.run=0;beep();clearPom();
  if(tm.m=='f'){
    const a=S.l[TD]||(S.l[TD]=[0,0]);
    a[0]++;a[1]+=S.p.f;S.d[TD]=1;
    act('Fabiola finished a focus session'+(tm.k?' on #'+tm.k:''));
    toast('Focus session done! Time for a break.');
    tm.m=a[0]%4?'s':'l';
  } else {
    toast('Break is over! Time to focus.');
    tm.m='f';
  }
  tm.left=S.p[tm.m]*60;save();
  if(PAGE=='pom') go('pom');
  else hdr();
  updatePomBadge();
}

/* ============================================================
   Chat (Members page)
   ============================================================ */
function chat(e){
  e.preventDefault();
  const inp=$('#cm_');
  const x=inp.value.trim();
  if(!x) return;
  S.c.push(['FM',x]);save();go('mem');
  const c=$('#ch');if(c) c.scrollTop=c.scrollHeight;
}

/* ============================================================
   Members (modal-based add, remove with confirmation)
   ============================================================ */
const MEMBER_COLORS=['#8b5cf6','#db5a9b','#e8a33d','#4cb782','#4a7fe8','#e0485f','#3b82f6','#f97316','#06b6d4','#84cc16'];
let selectedMemberColor=MEMBER_COLORS[0];

function addM(){
  /* Open the Add Member modal */
  const colorsEl=$('#mem-colors');
  colorsEl.innerHTML=MEMBER_COLORS.map(c=>`<div class="color-chip ${c==selectedMemberColor?'selected':''}" style="background:${c}" onclick="pickMemberColor('${c}',this)"></div>`).join('');
  $('#mem-name').value='';$('#mem-role').value='Member';
  $('#mem-error').style.display='none';
  bootstrap.Modal.getOrCreateInstance('#addMemberModal').show();
}
function pickMemberColor(c,el){
  selectedMemberColor=c;
  $$('#mem-colors .color-chip').forEach(e=>e.classList.remove('selected'));
  el.classList.add('selected');
}
function saveMember(e){
  e.preventDefault();
  const name=$('#mem-name').value.trim();
  const role=$('#mem-role').value.trim()||'Member';
  const errEl=$('#mem-error');
  if(!name){errEl.textContent='Name is required.';errEl.style.display='block';return}
  /* Generate unique initials */
  let initials=name.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
  if(!initials){errEl.textContent='Invalid name.';errEl.style.display='block';return}
  /* Check uniqueness */
  const existing=S.m.map(m=>m[0]);
  if(existing.includes(initials)){
    /* Try alternative: first letter + last letter */
    const parts=name.split(/\s+/);
    if(parts.length>1) initials=(parts[0][0]+parts[parts.length-1][parts[parts.length-1].length-1]).toUpperCase();
    if(existing.includes(initials)){
      let suffix=2;
      let base=initials[0];
      while(existing.includes(base+suffix)){suffix++}
      initials=base+suffix;
    }
  }
  S.m.push([initials,name,role,selectedMemberColor]);
  act('Fabiola added '+name+' to the team');
  save();
  bootstrap.Modal.getInstance('#addMemberModal').hide();
  go(PAGE);
}
function removeMember(initials){
  if(initials=='FM'){toast('Cannot remove yourself.');return}
  const m=S.m.find(x=>x[0]==initials);
  if(!m) return;
  if(!confirm(`Remove ${m[1]} from the team?`)) return;
  S.m=S.m.filter(x=>x[0]!=initials);
  /* Remove from task assignees; if task has no assignees, assign to FM */
  S.t.forEach(t=>{
    t.as=t.as.filter(a=>a!=initials);
    if(!t.as.length) t.as=['FM'];
  });
  act('Fabiola removed '+m[1]+' from the team');
  save();go(PAGE);
}

/* ============================================================
   Global init — call from each page script
   ============================================================ */
let fp='',fa='',wk=0,cy=new Date().getFullYear(),cm=new Date().getMonth(),sel=TD;

function initApp(){
  renderShell();
  initDarkMode();
  initSearch();
  initDragDrop();
  initPomState();
  setInterval(clk,1000);
  go(PAGE);
}
