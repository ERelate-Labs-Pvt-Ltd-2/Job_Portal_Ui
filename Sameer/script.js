// sample data
const data = [
  {appid:101, job:'Software Developer', company:'InnovaTech', applied:'2025-12-05', status:'under-review', stage:'HR Round', resume:'resume_101.pdf'},
  {appid:102, job:'Web Designer', company:'PixelCraft', applied:'2025-12-03', status:'submitted', stage:'Screening', resume:'resume_102.pdf'},
  {appid:103, job:'Data Analyst', company:'DataSense', applied:'2025-11-25', status:'rejected', stage:'—', resume:'resume_103.pdf'},
  {appid:104, job:'Frontend Engineer', company:'BlueWave', applied:'2025-12-01', status:'shortlisted', stage:'Technical Round', resume:'resume_104.pdf'},
  {appid:105, job:'QA Engineer', company:'AssureX', applied:'2025-11-20', status:'offered', stage:'Offer Released', resume:'resume_105.pdf'},
  {appid:106, job:'Product Manager', company:'Nova Labs', applied:'2025-12-02', status:'under-review', stage:'Screening', resume:'resume_106.pdf'},
];

let filtered = [...data];
let page = 1; 
const pageSize = 4;
let withdrawTarget = null;

const tbody = document.getElementById('tbody');
const q = document.getElementById('q');
const statusFilter = document.getElementById('statusFilter');
const dateFilter = document.getElementById('dateFilter');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const summary = document.getElementById('summary');
const empty = document.getElementById('empty');

function render(){
  const query = q.value.trim().toLowerCase();
  const status = statusFilter.value;
  const date = dateFilter.value;

  filtered = data.filter(d=>{
    if(status !== 'all' && d.status !== status) return false;
    if(date && d.applied < date) return false;
    if(query){
      const s = `${d.job} ${d.company} ${d.appid}`.toLowerCase();
      if(!s.includes(query)) return false;
    }
    return true;
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if(page > pages) page = pages;

  const start = (page-1)*pageSize;
  const slice = filtered.slice(start, start+pageSize);

  tbody.innerHTML = '';

  if(slice.length === 0){
    document.getElementById('appsTable').style.display = 'none';
    empty.style.display = 'block';
  } else {
    document.getElementById('appsTable').style.display = '';
    empty.style.display = 'none';
  }

  slice.forEach(r=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${r.appid}</td>
      <td class="hide-sm">${r.job}</td>
      <td class="hide-sm">${r.company}</td>
      <td>${r.applied}</td>
      <td>${statusBadge(r.status)}</td>
      <td class="hide-sm">${r.stage}</td>
      <td class="hide-sm"><button class="link" onclick="downloadResume('${r.resume}')">Download</button></td>
      <td style="text-align:right">
        <div class="actions">
          <button class="btn ghost" onclick="viewApp(${r.appid})">View</button>
          <button class="btn" onclick="openWithdraw(${r.appid})">Withdraw</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  summary.textContent = `Showing ${Math.min(total, (page-1)*pageSize + 1)} - ${Math.min(total, page*pageSize)} of ${total}`;
}

function statusBadge(s){
  if(s==='submitted') return '<span class="badge sub">Submitted</span>';
  if(s==='under-review') return '<span class="badge under">Under Review</span>';
  if(s==='shortlisted') return '<span class="badge sub">Shortlisted</span>';
  if(s==='offered') return '<span class="badge success">Offered</span>';
  if(s==='rejected') return '<span class="badge" style="background:#fff0f1;color:#9b1c1c">Rejected</span>';
  return `<span class="badge">${s}</span>`;
}

function viewApp(id){
  const found = data.find(d=>d.appid===id);
  alert(`Application #${id}\nJob: ${found.job}\nCompany: ${found.company}\nStatus: ${found.status}\nApplied: ${found.applied}`);
}

function openWithdraw(id){
  withdrawTarget = id;
  document.getElementById('modalBackdrop').style.display = 'flex';
  document.getElementById('modalText').innerHTML = `Are you sure you want to withdraw application <strong>#${id}</strong>?`;
}

document.getElementById('cancelWithdraw').addEventListener('click',()=>{
  withdrawTarget=null;
  document.getElementById('modalBackdrop').style.display='none';
});

document.getElementById('confirmWithdraw').addEventListener('click',()=>{
  if(withdrawTarget==null) return;
  const idx = data.findIndex(d=>d.appid===withdrawTarget);
  if(idx>-1) data.splice(idx,1);
  withdrawTarget=null;
  document.getElementById('modalBackdrop').style.display='none';
  page=1;
  render();
});

function downloadResume(filename){
  alert('Pretend downloading: '+filename);
}

prev.addEventListener('click',()=>{ if(page>1){ page--; render(); }});
next.addEventListener('click',()=>{ if(page*pageSize < filtered.length){ page++; render(); }});

[q,statusFilter,dateFilter].forEach(el=>el.addEventListener('input',()=>{page=1;render();}));

document.getElementById('downloadCsv').addEventListener('click',()=>{
  const rows = [['Application ID','Job Title','Company','Applied','Status','Stage','Resume']];
  filtered.forEach(r=>rows.push([r.appid,r.job,r.company,r.applied,r.status,r.stage,r.resume]));
  const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');

  const blob = new Blob([csv],{type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); 
  a.href=url; 
  a.download='applications.csv'; 
  document.body.appendChild(a); 
  a.click(); 
  a.remove(); 
  URL.revokeObjectURL(url);
});

render();
