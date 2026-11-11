/* tasks.js — Tasks board page renderer */
R.tasks=function(){
  const q=$('#q')?$('#q').value.toLowerCase():'';
  const f=S.t.filter(t=>(!q||('#'+t.id+' '+t.t).toLowerCase().includes(q))&&(!fp||t.p==fp)&&(!fa||t.as.includes(fa)));
  return H('Task Board','Drag cards between columns to update their status. Use the search bar to find a title or #number.')+`<div class="row g-2 mb-3"><div class="col-6 col-md-3 ms-md-auto"><select class="form-select rounded-pill" aria-label="Filter by priority" onchange="fp=this.value;go('tasks')"><option value="">All priorities${['High','Medium','Low'].map(p=>`<option ${fp==p?'selected':''}>${p}`).join('')}</select></div><div class="col-6 col-md-3"><select class="form-select rounded-pill" aria-label="Filter by member" onchange="fa=this.value;go('tasks')"><option value="">Everyone${S.m.map(m=>`<option value="${m[0]}" ${fa==m[0]?'selected':''}>${esc(m[1])}`).join('')}</select></div></div>
<div class="row g-3">${Object.keys(L).map(s=>{const c=f.filter(t=>t.s==s);return`<div class="col-lg-4"><div class="col-k p-3 h-100" data-s="${s}"><div class="d-flex align-items-center gap-2 mb-3"><i class="bi bi-circle-fill" style="font-size:.6rem;color:${SC[s]}"></i><b>${L[s]}</b><span class="badge rounded-pill bg-primary-subtle ms-auto">${c.length}</span></div>${c.map(card).join('')||'<p class="text-center text-secondary small">No tasks yet</p>'}<button class="btn btn-outline-primary w-100 mt-1" onclick="openM(0,'${s}')"><i class="bi bi-plus-lg"></i> Add Card</button></div></div>`}).join('')}</div>`;
};
initApp();
