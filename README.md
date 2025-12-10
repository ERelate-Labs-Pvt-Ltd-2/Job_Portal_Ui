📄 Job Portal — Application List (Front-End UI)

This project contains two separate, fully-designed, animated front-end pages:

Job Seeker Application List Page

Job Recruiter Application List Page

Both pages share the same modern UI theme, clean components, and animations but show different datasets and features depending on the user type.

🚀 Features
✅ Common Features (Both Pages)

Clean & modern UI

Smooth table row animation

Highlight hover effects

Attractive status badges

Responsive layout

Minimalistic top header

Organized filters & search

Footer section included

Redirect on row click → status.html?id=XYZ

🔍 Job Seeker Page Features

Displays a list of jobs that a user has applied to

Columns include:

Application ID

Job Title

Company

Applied Date

Application Status

State

Integrated filters:

Search Box

Status Filter

State Filter

Smooth table animations

🧑‍💼 Job Recruiter Page Features

Displays candidate list for recruiters

Columns include:

Candidate Name

Position

Experience

Status

Date

State

Resume Download Button

Filters include:

Search (Name / Job Role)

Status Filter

State Filter

Resume Download mock feature (alert popup)

Beautiful badge system for status colors

🛠️ Technologies Used
Technology	Purpose
HTML5	Structure
CSS3	Styling, animations, layout
Vanilla JavaScript	Dynamic rendering & filtering
No Libraries Required	Fully standalone
📂 Project Structure
/project-root
│
├── job-seeker.html
├── job-recruiter.html
└── status.html  (opened on row click)

🔗 Navigation

Each table row triggers:

status.html?id=[unique-id]


This allows dynamic linking to an application status page.

✨ UI/UX Enhancements

Animated table rows using @keyframes

Soft shadows & rounded cards

Modern accent color: #2563eb

Styled search input with icon

Professional footer design

Fully mobile-friendly layout

