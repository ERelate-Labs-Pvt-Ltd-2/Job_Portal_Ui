const states = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];
const seekerData=[];

for(let i=1;i<=20;i++){
  seekerData.push({
    appid:100+i,
    job:"Job Position "+i,
    company:"Company "+i,
    applied:`2025-12-${String(i%28+1).padStart(2,'0')}`,
    status:["submitted","under-review","shortlisted","offered","rejected"][i%5],
    state:states[i%states.length]
  });
}

function renderSeeker(){
  let t=document.getElementById("seekerBody"); 
  t.innerHTML="";

  const query=document.getElementById("searchBox").value.toLowerCase();
  const statusFilter=document.getElementById("statusFilter").value;
  const stateFilter=document.getElementById("stateFilter").value;

  seekerData.forEach(d=>{
    if((d.job.toLowerCase().includes(query)||d.company.toLowerCase().includes(query)) &&
       (statusFilter==="all"||d.status===statusFilter) &&
       (stateFilter==="all"||d.state===stateFilter)){
      
      let tr=document.createElement("tr");
      tr.innerHTML=
      `<td>#${d.appid}</td>
       <td>${d.job}</td>
       <td>${d.company}</td>
       <td>${d.applied}</td>
       <td><span class='badge ${d.status}'>${d.status}</span></td>
       <td>${d.state}</td>`;

      tr.addEventListener("click",()=>{
        window.location.href="status.html?id="+d.appid;
      });

      t.appendChild(tr);
    }
  });
}

document.getElementById("searchBox").oninput =
document.getElementById("statusFilter").onchange =
document.getElementById("stateFilter").onchange = function(){
  renderSeeker();
};

renderSeeker();
