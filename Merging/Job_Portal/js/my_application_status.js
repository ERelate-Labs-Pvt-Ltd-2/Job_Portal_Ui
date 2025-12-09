const seekerStatus = {
  "101": 2, "102": 3, "103": 6, "104": 4, "105": 5,
  "106": 3, "107": 1, "108": 6, "109": 2, "110": 5,
  "111": 4, "112": 3, "113": 2, "114": 6, "115": 1,
  "116": 3, "117": 4, "118": 5, "119": 2, "120": 6
};

const notes = {
  1: "Your application has been received successfully.",
  2: "HR is reviewing your resume.",
  3: "Communication round is being evaluated.",
  4: "Aptitude test has been assigned.",
  5: "Technical team is taking your interview.",
  6: "Final result will be declared soon."
}

const seekerDecision = {
  "103": "rejected",
  "108": "selected",
  "114": "rejected",
  "120": "selected"
};

const recruiterStatus = {
  "R1": 4, "R2": 3, "R3": 5, "R4": 6, "R5": 6,
  "R6": 2, "R7": 4, "R8": 3, "R9": 6, "R10": 2
};

const recruiterDecision = {
  "R4": "rejected",
  "R5": "selected",
  "R9": "selected"
};

const recruiterInfo = {
  "R1":{name:"Aman Gupta",role:"Frontend Dev"},
  "R2":{name:"Rohit Sharma",role:"Backend Dev"},
  "R3":{name:"Suman Verma",role:"UI/UX Designer"},
  "R4":{name:"Imran Khan",role:"QA Tester"},
  "R5":{name:"Pooja Singh",role:"HR Executive"},
  "R6":{name:"Raj Kumar",role:"Full Stack Dev"},
  "R7":{name:"Sakshi",role:"Accountant"},
  "R8":{name:"Vivek",role:"Marketing Head"},
  "R9":{name:"Anjali",role:"Sales Manager"},
  "R10":{name:"Harshit",role:"Data Analyst"}
};

const seekerInfo = id => ({
  title: "Job Position " + (id - 100),
  company: "Company " + (id - 100),
  applied: "2025-12-10"
});

const q = new URLSearchParams(window.location.search);
const id = q.get("id");

let currentStatus = 1;
let finalDecision = "";
let isSeeker = false;

if(seekerStatus[id]){
  isSeeker = true;
  currentStatus = seekerStatus[id];
  finalDecision = seekerDecision[id] || "";
}
else if(recruiterStatus[id]){
  currentStatus = recruiterStatus[id];
  finalDecision = recruiterDecision[id] || "";
}

const box = document.getElementById("detailsBox");

if(isSeeker){
  let info = seekerInfo(id);
  box.innerHTML = `
    <div class="detail"><span>Application ID:</span> #${id}</div>
    <div class="detail"><span>Job Title:</span> ${info.title}</div>
    <div class="detail"><span>Company:</span> ${info.company}</div>
    <div class="detail"><span>Applied On:</span> ${info.applied}</div>
  `;
} else {
  let info = recruiterInfo[id];
  box.innerHTML = `
    <div class="detail"><span>Candidate:</span> ${info.name}</div>
    <div class="detail"><span>Position:</span> ${info.role}</div>
    <div class="detail"><span>Application ID:</span> ${id}</div>
  `;
}

function updateTimeline(){
  let steps = document.querySelectorAll(".step");

  steps.forEach(step=>{
    let s = parseInt(step.getAttribute("data-step"));

    if(s < currentStatus) step.classList.add("completed");
    else if(s === currentStatus) step.classList.add("active");

    step.onclick = ()=>{
      openPopup(
        step.querySelector(".step-title").innerText,
        notes[s]
      );
    };
  });

  if(currentStatus === 6){
    let final = document.getElementById("finalDesc");

    if(finalDecision === "selected"){
      final.innerHTML += `<br><span class="badge selected">Selected ✔</span>`;
    }
    else if(finalDecision === "rejected"){
      final.innerHTML += `<br><span class="badge rejected">Rejected ✖</span>`;
    }
  }
}

updateTimeline();

function updateProgress(){
  let percent = ((currentStatus - 1) / 5) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}
updateProgress();

function toggleDark(){
  document.body.classList.toggle("dark");
}

function openPopup(title, note){
  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popupNote").innerText = note;
  document.getElementById("popupBg").style.display="flex";
}
function closePopup(){
  document.getElementById("popupBg").style.display="none";
}
