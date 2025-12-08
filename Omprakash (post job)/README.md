# 🧑‍💻 Job Portal Recruiter Dashboard

A simple Job Portal UI built with **Flask + MySQL**, allowing recruiters to:

✔ Post new job openings  
✔ Edit job details  
✔ Delete jobs  
✔ Filter by job type, location, search keywords  
✔ Expand job details  
✔ Responsive clean UI  

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Flask | Backend |
| PyMySQL | Database connectivity |
| MySQL / phpMyAdmin | Database |
| Bootstrap | UI Styling |

---


## ⚡ Setup Instructions

### 1️⃣ Clone Repo

```sh
git clone https://github.com/ERelate-Labs-Pvt-Ltd-2/Job_Portal_UI.git
cd Job_Portal_UI/Omprakash (post job)

2️⃣ Install Dependencies
    pip install -r requirements.txt

3️⃣ Setup Database

Create database:

CREATE DATABASE jobportal;
USE jobportal;

Create table:

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  salary VARCHAR(255),
  experience VARCHAR(255),
  job_type VARCHAR(50),
  skills TEXT,
  description TEXT,
  responsibilities TEXT,
  qualifications TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

4️⃣ Run Project
  python app.py

