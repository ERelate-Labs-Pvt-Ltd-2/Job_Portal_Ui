
const userName = "Rahul"; 

const dummyApplications = [
    {
        title: "Frontend Developer",
        company: "ABC Technologies",
        appliedOn: "20 Nov 2025",
        status: "Under Review",
        statusClass: "review",
        link: "application_status.html?applicationId=101"
    },
    {
        title: "Backend Developer",
        company: "XYZ Software",
        appliedOn: "16 Nov 2025",
        status: "Pending",
        statusClass: "pending",
        link: "application_status.html?applicationId=102"
    },
    {
        title: "UI/UX Designer",
        company: "DesignHub",
        appliedOn: "10 Nov 2025",
        status: "Accepted",
        statusClass: "accepted",
        link: "application_status.html?applicationId=103"
    }
];

function setGreeting() {
    const greetingEl = document.getElementById("greeting-text");
    const nameEl = document.getElementById("user-name");

    const now = new Date();
    const hour = now.getHours();

    let greeting = "Welcome,";


    if (greetingEl) greetingEl.textContent = greeting;
    if (nameEl) nameEl.textContent = userName;
}

function setFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

function fillQuickStats() {
    // dummy numbers based on applications
    const savedCount = document.getElementById("saved-count");
    const appliedCount = document.getElementById("applied-count");
    const interviewCount = document.getElementById("interview-count");

    if (savedCount) savedCount.textContent = "3"; // static for now
    if (appliedCount) appliedCount.textContent = dummyApplications.length.toString();
    if (interviewCount) interviewCount.textContent = "1"; // static example
}

function renderRecentApplications() {
    const tbody = document.getElementById("recent-applications");
    if (!tbody) return;

    tbody.innerHTML = "";

    dummyApplications.forEach((app) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${app.title}</td>
            <td>${app.company}</td>
            <td>${app.appliedOn}</td>
            <td><span class="badge ${app.statusClass}">${app.status}</span></td>
            <td>
                <a href="${app.link}" class="btn small">View</a>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function setupComingSoonHandlers() {
    // Any link with data-feature="status" will show an alert instead of navigating
    const comingSoonLinks = document.querySelectorAll("[data-feature='status']");
    comingSoonLinks.forEach((el) => {
        el.addEventListener("click", function (e) {
            e.preventDefault();
            alert("This feature will be available soon. For now, please check 'My Applications' page.");
        });
    });

    const profileBtn = document.getElementById("profile-btn");
    if (profileBtn) {
        profileBtn.addEventListener("click", () => {
            alert("Profile / Resume management will be implemented later.");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setGreeting();
    setFooterYear();
    fillQuickStats();
    renderRecentApplications();
    setupComingSoonHandlers();
});
