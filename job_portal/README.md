
# Job Portal – Full Stack Application

This repository contains a **complete, end-to-end Job Portal application** built using a modern full-stack architecture. The project demonstrates real-world practices for authentication, role-based authorization, REST API design, and scalable frontend-backend integration.

---

## 1. Overall Project Architecture

The project follows a **standard full-stack architecture**:

```
Frontend (React + Vite)
        ↓ HTTP (REST APIs, JSON)
Backend (Node.js + Express)
        ↓ ODM (Mongoose)
Database (MongoDB)
```

### Why this architecture?

* Clear **separation of concerns**

  * Frontend: UI and user experience
  * Backend: business logic and security
  * Database: persistent data storage
* Independent scalability of frontend and backend
* Industry-standard approach for SaaS and job portals

---

## 2. Project Structure

```
JOB_PORTAL/
├── job-portal-frontend/
└── job-portal-backend/
```

This separation enables independent development, testing, and deployment of frontend and backend services.

---

## 3. Backend – job-portal-backend

The backend is built using **Node.js, Express, MongoDB, and Mongoose**.

### 3.1 Server Bootstrapping

#### server.js

**Purpose**

* Entry point of the backend application

**Responsibilities**

* Load environment variables
* Connect to MongoDB
* Start the Express server

This keeps startup logic separate from application logic.

---

#### app.js

**Purpose**

* Central Express application configuration

**Responsibilities**

* Register middleware (CORS, JSON parsing)
* Register API routes
* Define health check endpoint

Mounted API routes:

* `/api/auth`
* `/api/jobs`
* `/api/applications`
* `/api/candidates`

---

### 3.2 Configuration Layer

#### config/env.js

* Centralized environment variable loading
* Prevents repeated `dotenv.config()` calls

#### config/db.js

* MongoDB connection logic
* Isolated for better error handling
* Application exits if DB connection fails (expected backend behavior)

---

### 3.3 Database Models (Mongoose Schemas)

MongoDB is used for its flexible, document-based structure and fast development cycle.

#### User.model.js

Represents both **job seekers** and **recruiters**.

**Fields**

* `name`
* `email` (unique)
* `password` (hashed)
* `role` (`seeker` | `recruiter`)

**Key Design Decisions**

* Password hashing with bcrypt
* Pre-save hooks for security
* Role stored directly for simpler authorization

---

#### Job.model.js

Represents a job posting created by a recruiter.

**Key Fields**

* Job metadata (title, company, location)
* `jobType` enum for validation
* `recruiterId` for ownership and authorization

---

#### Application.model.js

Acts as the **link between jobs and candidates**.

**Fields**

* `jobId`
* `seekerId`
* `recruiterId`
* `status`

**Design Choice**

* `recruiterId` stored directly to optimize recruiter queries and reduce joins

---

### 3.4 Authentication & Authorization

#### utils/jwt.js

* Centralized JWT generation and verification
* Keeps token logic reusable and consistent

#### auth.middleware.js

**Flow**

1. Read `Authorization` header
2. Validate Bearer token
3. Verify JWT
4. Fetch user from database
5. Attach user to `req.user`

Ensures user still exists and role is up to date.

---

#### role.middleware.js

* Implements role-based access control (RBAC)
* Prevents unauthorized access between recruiters and seekers

---

### 3.5 Controllers (Business Logic)

Controllers contain all business rules and validations.

#### auth.controller.js

* Register: validate input, hash password, issue JWT
* Login: verify credentials, issue JWT

---

#### job.controller.js

* Create job (recruiter only)
* Fetch all jobs (public)
* Fetch recruiter-specific jobs

---

#### application.controller.js

Core workflow logic:

* Apply for job (prevents duplicates)
* View seeker applications
* View recruiter applications
* Update application status (recruiter only)

Uses Mongoose `populate()` to fetch related data.

---

#### candidate.controller.js

Supports recruiter-side candidate discovery:

* List all seekers
* Search candidates
* View candidate profiles

---

### 3.6 Routes Layer

* Routes are thin
* Controllers are fat

Each route:

* Applies authentication middleware
* Applies role-based middleware
* Delegates logic to controllers

This improves maintainability and testability.

---

## 4. Frontend – job-portal-frontend

The frontend is built using **React, Vite, Axios, and React Router**.

### 4.1 Application Entry

#### main.jsx

* Mounts the React application
* Wraps app with router

#### App.jsx

* Central routing configuration
* Public routes
* Protected routes
* Role-based navigation

---

### 4.2 Authentication (Frontend)

#### tokenService.js

* Save and retrieve JWT
* Decode user information
* Handle logout

#### authService.js

* Login API calls
* Register API calls

Keeps components clean and focused on UI.

---

#### ProtectedRoute / RequireAuth

* Protects routes
* Enforces role-based access
* Redirects unauthorized users

Mirrors backend RBAC logic.

---

### 4.3 API Layer

#### services/api.js

* Central Axios instance
* Base URL configuration
* Automatically attaches JWT to requests

Other service files map directly to backend APIs:

* jobService
* applicationService

---

### 4.4 Pages and Components

#### Authentication

* Login
* Register

#### Seeker Flow

* Job listing
* Apply to jobs
* Track application status
* Seeker dashboard

#### Recruiter Flow

* Post jobs
* View applications
* Update application status
* Search candidates

#### Shared Components

* Header
* Sidebar
* Toast notifications

---

## 5. Frontend ↔ Backend Workflow Example

**Apply for Job**

1. User clicks Apply
2. Frontend sends request to `/api/applications/apply/:jobId`
3. Axios attaches JWT
4. Backend:

   * Auth middleware validates user
   * Role middleware ensures seeker role
   * Controller creates application
5. Response returned
6. UI updates

This flow is consistent across the application.

---

## 6. Complete Application Workflow

### Job Seeker

1. Register / Login
2. Browse jobs
3. Apply to jobs
4. Track application status

### Recruiter

1. Register / Login
2. Post jobs
3. View applicants
4. Shortlist or reject candidates
5. Search candidates

---

## 7. Strengths of This Design

* Clean separation of layers
* Secure authentication and authorization
* Role-based access control
* Scalable schema design
* Real-world job portal workflows

### Easily Extendable With

* Resume uploads
* Messaging system
* Admin panel
* Payments or subscriptions

---

## Final Assessment

This project is a **production-ready MVP Job Portal** demonstrating:

* Correct architectural decisions
* Secure backend design
* Clean frontend-backend integration
* Real-world data modeling

It is well-suited for learning, interviews, and further scaling.
