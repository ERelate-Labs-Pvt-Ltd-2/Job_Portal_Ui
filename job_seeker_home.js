// Set job seeker name (later from backend)
const userName = "Rahul";

function setGreeting() {
    const nameEl = document.getElementById("user-name");
    if (nameEl) {
        nameEl.textContent = userName;
    }
}

function setFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

function setupProfileAlert() {
    const btn = document.getElementById("profile-btn");
    if (btn) {
        btn.addEventListener("click", () => {
            alert("Profile section will be available soon.");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setGreeting();
    setFooterYear();
    setupProfileAlert();
});
