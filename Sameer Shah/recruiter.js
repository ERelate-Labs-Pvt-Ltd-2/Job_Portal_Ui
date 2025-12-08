const recruiterData=[
  {name:"Aman Gupta", role:"Frontend Dev", exp:"2 yrs", status:"Shortlisted", date:"2025-12-01", state:"Delhi"},
  {name:"Rohit Sharma", role:"Backend Dev", exp:"3 yrs", status:"Under Review", date:"2025-12-03", state:"Mumbai"},
  {name:"Suman Verma", role:"UI/UX Designer", exp:"1 yr", status:"Interview", date:"2025-12-04", state:"Bangalore"},
  {name:"Imran Khan", role:"QA Tester", exp:"2 yrs", status:"Rejected", date:"2025-12-02", state:"Chennai"},
  {name:"Pooja Singh", role:"HR Executive", exp:"4 yrs", status:"Selected", date:"2025-12-06", state:"Kolkata"},
  {name:"Raj Kumar", role:"Full Stack Dev", exp:"3 yrs", status:"Hold", date:"2025-12-05", state:"Delhi"},
  {name:"Sakshi", role:"Accountant", exp:"5 yrs", status:"Round 2", date:"2025-12-07", state:"Mumbai"},
  {name:"Vivek", role:"Marketing Head", exp:"4 yrs", status:"Submitted", date:"2025-12-08", state:"Bangalore"},
  {name:"Anjali", role:"Sales Manager", exp:"6 yrs", status:"Shortlisted", date:"2025-12-09", state:"Chennai"},
  {name:"Harshit", role:"Data Analyst", exp:"1 yr", status:"Under Review", date:"2025-12-10", state:"Kolkata"}
];

function renderRecruiter(){
  let t=document.getElementById("recruiterBody"); 
  t.innerHTML="";
  const query=document.getElementById("searchBox").value.toLowerCase();
  const statusFilter=document.getElementById("statusFilter").value;
  const stateFilter=document.getElementById("stateFilter").value;

  recruiterData.forEach((d,i)=>{
    if((d.name.toLowerCase().includes(query)||d.role.toLowerCase().includes(query)) &&
       (statusFilter==="all"||d.status.toLowerCase()===statusFilter.toLowerCase()) &&
       (stateFilter==="all"||d.state===stateFilter)){
      
      let tr=document.createElement("tr");
      tr.innerHTML=
      `<td>${d.name}</td>
       <td>${d.role}</td>
       <td>${d.exp}</td>
       <td><span class='badge ${d.status.toLowerCase().replace(/ /g,'-')}'>${d.status}</span></td>
       <td>${d.date}</td>
       <td>${d.state}</td>
       <td><button class='download-btn' onclick='downloadResume("${d.name}")'>Download</button></td>`;

      tr.addEventListener("click",()=>{
        window.location.href="status.html?id=R"+(i+1);
      });

      t.appendChild(tr);
    }
  });
}

function downloadResume(name){
  alert(`Downloading resume of ${name}...`);
}

document.getElementById("searchBox").oninput =
document.getElementById("statusFilter").onchange =
document.getElementById("stateFilter").onchange = function(){
  renderRecruiter();
};

renderRecruiter();
