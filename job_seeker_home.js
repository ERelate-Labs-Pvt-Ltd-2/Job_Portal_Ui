const userName = "Rahul"; // change as needed

function setGreeting() {
    const greetingEl = document.getElementById("greeting-text");
    const nameEl = document.getElementById("user-name");

    if (greetingEl) greetingEl.textContent = "Welcome,";
    if (nameEl) nameEl.textContent = userName;
}

function setFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

function fillQuickStats() {
    const savedCount = document.getElementById("saved-count");
    const appliedCount = document.getElementById("applied-count");
    const interviewCount = document.getElementById("interview-count");

    // Static values for now; later you can fetch from DB
    if (savedCount) savedCount.textContent = "3";
    if (appliedCount) appliedCount.textContent = "5";
    if (interviewCount) interviewCount.textContent = "1";
}

function setupProfileButton() {
    const profileBtn = document.getElementById("profile-btn");
    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            alert("Profile / Resume feature will be added later.");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setGreeting();
    setFooterYear();
    fillQuickStats();
    setupProfileButton();
});
