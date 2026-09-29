# TaskTrack Frontend

TaskTrack is a modern **Task & Team Management** web application developed for **PRN232 – Assignment 1**.

This repository contains the frontend application built with **Next.js App Router**, **React**, **TypeScript**, and **Tailwind CSS**. It communicates with the TaskTrack ASP.NET Core Web API through RESTful endpoints.

## Student Information

- **Student ID:** QE190088
- **Class:** SE19B
- **Subject:** PRN232
- **Assignment:** Assignment 1

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- REST API
- Vercel

---

## Live Application

- **Frontend:** https://prn-232-ass1-fe.vercel.app
- **Backend API:** https://tasktrack-api-mi6g.onrender.com
- **Frontend Repository:** https://github.com/nhngchau/PRN232_Ass1_FE
- **Backend Repository:** https://github.com/nhngchau/PRN232_Ass1_BE

> The Render free backend may require a short cold-start period after being inactive.

---

## Main Features

### Dashboard

- Displays department, project, and task statistics
- Provides overview cards for quick access to application data

### Department Management

- View active departments
- View department details and related projects
- Create departments
- Update departments
- Delete departments when allowed by backend business rules
- Search departments

### Project Management

- View projects and project details
- View tasks belonging to a project
- Create projects
- Update projects
- Delete projects when allowed by backend business rules
- Filter and search project data
- Display project status badges

### Task Management

- View task details
- Create tasks
- Update tasks
- Assign tags to tasks
- Search and filter tasks
- Display status and priority badges
- Display due dates
- Soft-delete tasks

Task deletion is implemented as **soft delete**, meaning the task is removed from active lists while the database record is retained.

### Tag Management

- View tags
- Create tags
- Update tags
- Delete tags when allowed by backend business rules

### Task Search

Tasks can be filtered by:

- Title
- Status
- Priority
- Project
- Tag

---

## Application Routes

### Public Pages

```text
/
/departments
/departments/[id]
/projects/[id]
/tasks/[id]
/search
```

### Management Pages

```text
/departments/manage
/projects/manage
/tasks/manage
/tags/manage
```

---

## UI / UX

TaskTrack uses a responsive SaaS-style dashboard interface.

Implemented UI features include:

- Responsive layout
- Collapsible desktop sidebar
- Mobile navigation
- Custom Select components
- Status and priority badges
- Loading states
- Empty states
- Responsive tables
- Custom scrollbar
- TaskTrack branding

### Toast Notifications

A reusable floating toast notification system is used for operation results such as:

- Create success
- Update success
- Delete success
- API/server errors
- Delete guard errors

Toasts appear at the top-right of the screen, automatically dismiss after a short period, and can also be closed manually.

### Delete Confirmation

All management pages use a reusable custom confirmation dialog before delete operations.

- Departments, Projects, and Tags use guarded delete behavior based on backend rules.
- Tasks use soft delete and are removed only from active lists.

### Client-side Validation

Create and Edit forms validate user input before sending requests to the backend.

Examples include:

- Required names and titles
- Required Department or Project selections
- Invalid date ranges

Validation errors are shown directly below the corresponding field using red text and invalid-field styling.

Client-side validation errors are not displayed as toast notifications.

---

## Environment Variables

Create a local `.env.local` file in the frontend project root.

```env
NEXT_PUBLIC_API_URL=http://localhost:<backend-port>
```

For the deployed application:

```env
NEXT_PUBLIC_API_URL=https://tasktrack-api-mi6g.onrender.com
```

Do not commit sensitive credentials or secrets to GitHub.

---

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/nhngchau/PRN232_Ass1_FE.git
cd PRN232_Ass1_FE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend API URL

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:<backend-port>
```

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Code Quality

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Both commands should complete successfully before deployment.

---

## Deployment

The frontend is deployed on **Vercel**.

Production URL:

https://prn-232-ass1-fe.vercel.app

When the Vercel project is connected to the GitHub repository, pushes to the configured deployment branch can automatically trigger a new deployment.

The frontend communicates with the deployed ASP.NET Core backend hosted on Render.

---

## Project Structure

```text
app/
├── departments/
├── projects/
├── tasks/
├── tags/
├── search/
├── globals.css
└── layout.tsx

components/
├── layout/
└── ui/

lib/
└── api.ts

public/
└── tasktrack-logo.png
```

---

## Known Issues

No known critical issues at the time of submission.

The Render free backend may take a short time to respond after a period of inactivity.

---

## License

This project was created for educational purposes as part of **PRN232 Assignment 1** at **FPT University**.
