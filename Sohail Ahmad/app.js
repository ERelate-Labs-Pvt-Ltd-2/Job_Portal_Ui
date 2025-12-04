// Application model structure
const application = {
    applicant: "John Doe",
    position: "Frontend Developer",
    currentStep: 0,
    steps: [
        "Applied",
        "Phone Screening",
        "Technical Interview",
        "Offer",
        "Hired"
    ]
};

// DOM elements
const stepsContainer = document.getElementById("stepsContainer");

// Render steps
function renderSteps() {
    stepsContainer.innerHTML = "";

    application.steps.forEach((step, index) => {
        const div = document.createElement("div");
        div.className = "step";
        if (index === application.currentStep) div.classList.add("active");

        div.textContent = `${index + 1}. ${step}`;
        div.addEventListener("click", () => {
            application.currentStep = index;
            renderSteps();
        });

        stepsContainer.appendChild(div);
    });
}

// Navigation buttons
document.getElementById("nextBtn").addEventListener("click", () => {
    if (application.currentStep < application.steps.length - 1) {
        application.currentStep++;
        renderSteps();
    }
});

document.getElementById("prevBtn").addEventListener("click", () => {
    if (application.currentStep > 0) {
        application.currentStep--;
        renderSteps();
    }
});

document.getElementById("resetBtn").addEventListener("click", () => {
    application.currentStep = 0;
    renderSteps();
});

// Initial render
document.getElementById("applicantName").textContent = application.applicant;
document.getElementById("positionName").textContent = application.position;
renderSteps();
