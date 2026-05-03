# AVS EduConnect — Master Context

> **Purpose of this file.** Canonical handoff document for AVS EduConnect. Drop the contents (or a link to this file) into any fresh AI chat, and the assistant will have everything it needs: what the product is, why it exists, how it is built, what is already shipped, and exactly where work stands right now.
>
> **Last updated:** 2026-04-29
> **Current phase:** Phase 1 Complete — High-fidelity Frontend Prototype
> **Working directory:** `d:\SaaS Project\AVS School Project`
> **Environment:** Vite + React + TypeScript. Frontend dev via Vite on `localhost:5173`. No backend yet.

---

## Table of contents

1. [The idea in detail](#1-the-idea-in-detail)
2. [Why this can win — market and wedge](#2-why-this-can-win--market-and-wedge)
3. [Engineering philosophy and target bar](#3-engineering-philosophy-and-target-bar)
4. [Architecture overview](#4-architecture-overview)
5. [Tech stack](#5-tech-stack)
6. [Repository layout](#6-repository-layout)
7. [Roadmap (phased)](#7-roadmap-phased)
8. [Progress log — what has been built](#8-progress-log--what-has-been-built)
9. [How a fresh AI chat should use this file](#9-how-a-fresh-ai-chat-should-use-this-file)

---

## 1. The idea in detail

### Elevator pitch
**AVS EduConnect is a multi-tenant School HRMS and Education Management SaaS.** It is designed to handle end-to-end operations for school franchises (managing 40-45+ branches). It unifies teacher management, student management, cross-branch integrations, inter-school competitions, and holistic performance tracking into a single platform.

### Roles and surfaces
The system accommodates 5 distinct personas, each with a dedicated dashboard and feature set:

| Role | Primary surfaces & Access |
|---|---|
| `SUPER_ADMIN` | Head Office Control Center. Manages all branches, global attendance, fee collection trends, cross-branch SDF (School Development Fund) requests, and network-wide alerts. |
| `PRINCIPAL` | School Management Hub. Handles their specific premises, tracks school-level attendance, fee targets, staff/student management, and daily school timelines. |
| `TEACHER` | Classroom Operations. Marks attendance, manages homework and assignments, enters marks, views timetable, and communicates with parents. |
| `STUDENT` | Learning Space. Accesses timetable, submits assignments, checks results, downloads study materials, and registers for extracurricular activities/competitions. |
| `PARENT` | Child's Progress Tracker. Monitors child's performance (attendance, grades), pays fees, tracks homework, and receives school notices. |

---

## 2. Why this can win — market and wedge

### The competitive reality
Most school management systems are either outdated legacy software or overly fragmented (using one app for fees, another for LMS, and another for HR). 

### The wedge
1. **Multi-Tenant Franchise Scale:** Built specifically for large school chains. The Super Admin has a bird's-eye view of 40+ branches, making it a true B2B SaaS rather than a single-school utility.
2. **End-to-End Unification:** Combines HRMS (Teacher management, SDF funds, Development) with Student Information (Attendance, Marks, Fees, Competitions).
3. **Premium Design:** A focus on high-fidelity, stunning user interfaces that wow stakeholders immediately.

---

## 3. Engineering philosophy and target bar

1. **"Authoritative yet Visionary" Aesthetics:** The UI must wow the user at first glance. We use a curated palette: **Emerald Green** (Primary), **Light Pink** (Accent), and **Cool Grey** (Neutral). Glassmorphism, smooth hover effects, and modern typography are mandatory.
2. **Vanilla CSS & CSS Variables:** We rely on CSS variables (`tokens.css`, `globals.css`, `reset.css`) for consistent styling and theming, rather than Tailwind CSS.
3. **Frontend-First Prototyping:** The current goal is securing client deal approval. Therefore, we are building a "logic-less" super-demo. The UI must be fully navigable, responsive, and visually complete with mock data, but does not require a working backend yet.
4. **Role-Adaptive UI:** The entire interface (Sidebar, Header, Dashboards) adapts instantly based on the active role. A centralized `AuthContext` handles mock role-switching for seamless demo presentations.
5. **Mobile Responsive:** Desktop-first for complex tables and charts, but fluid and fully usable on mobile devices.

---

## 4. Architecture overview

### High-level shape
- **Entry Point:** `main.tsx` wraps the app in `<ThemeProvider>` and `<AuthProvider>`.
- **Routing:** `react-router-dom` using `createBrowserRouter` with 54 total routes defined in `router.tsx`.
- **Layout:** An `AppShell` component wraps all protected routes, providing the `Sidebar` and `Header`.
- **Role Switching:** The `Header` contains a dropdown to instantly switch the active user role, updating the `AuthContext`.
- **Navigation:** The `Sidebar` dynamically renders menu items based on the active role.
- **Components:** Reusable UI elements (like `StatCard`, `ComingSoon`) are isolated in `src/components/ui`.

---

## 5. Tech stack

- **Core:** React 19, TypeScript
- **Build Tool:** Vite 6
- **Routing:** React Router v7
- **Styling:** Vanilla CSS (CSS Modules / standard CSS files scoped by BEM-like conventions), CSS Variables for tokens.
- **Icons:** `lucide-react`
- **Charts:** `recharts` (Bar, Line, Area, Pie, Radar charts)
- **Animations:** Standard CSS transitions/keyframes (Framer Motion is installed but CSS is preferred for base animations).

---

## 6. Repository layout

```
AVS School Project/
├── MASTER_CONTEXT.md                     # THIS FILE
├── index.html                            # App entry HTML (SEO optimized)
├── src/
│   ├── main.tsx                          # React entry point
│   ├── router.tsx                        # 54-route configuration
│   ├── types/
│   │   └── index.ts                      # TS interfaces for Users, Schools, Attendance, etc.
│   ├── contexts/
│   │   ├── AuthContext.tsx               # Mock auth state & role switching logic
│   │   └── ThemeContext.tsx              # Light/Dark mode state
│   ├── styles/
│   │   ├── tokens.css                    # Design system variables (Emerald, Pink, Grey)
│   │   ├── reset.css                     # Modern CSS reset
│   │   └── globals.css                   # Global utilities, glassmorphism, animations
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx / .css       # Main layout wrapper
│   │   │   ├── Header.tsx / .css         # Top nav, search, role switcher
│   │   │   └── Sidebar.tsx / .css        # Role-adaptive side navigation
│   │   └── ui/
│   │       ├── StatCard.tsx / .css       # Reusable KPI card with trend/progress
│   │       └── ComingSoon.tsx / .css     # Placeholder for unbuilt routes
│   └── pages/
│       ├── auth/
│       │   └── Login.tsx / .css          # Split-layout login with 5 role cards
│       ├── super-admin/
│       │   └── SuperAdminDashboard.tsx   # Network overview, charts, alerts
│       ├── principal/
│       │   └── PrincipalDashboard.tsx    # School KPIs, timeline, attendance charts
│       ├── teacher/
│       │   └── TeacherDashboard.tsx      # Timetable, submissions, grade pie chart
│       ├── student/
│       │   └── StudentDashboard.tsx      # Schedule, radar performance chart, assignments
│       └── parent/
│           └── ParentDashboard.tsx       # Child hero card, performance trends, notices
```

---

## 7. Roadmap (phased)

### Phase 1 — Foundation & Dashboards (COMPLETE)
**Goal:** Establish the design system, architecture, and core landing views for all 5 roles.
- [x] Vite + React + TS Setup
- [x] Design System (CSS variables, dark mode)
- [x] Auth Context & Role Switcher
- [x] AppShell, Sidebar, Header
- [x] Login Page
- [x] Super Admin Dashboard
- [x] Principal Dashboard
- [x] Teacher Dashboard
- [x] Student Dashboard
- [x] Parent Dashboard
- [x] Define 54 routes with placeholders

### Phase 2 — Secondary Modules (NEXT)
**Goal:** Flesh out the interactive modules required for the client demo.
- **Priority 1 (Super Admin):** Schools Directory (table with search/filter), School Details, Financial Reports, SDF Fund Management.
- **Priority 2 (Principal):** Student Management (CRUD table), Teacher Management, Attendance Monitor (calendar heatmap), Fee Management.
- **Priority 3 (Teacher):** Attendance Marking (interactive tap grid), Homework Manager, Marks Entry (spreadsheet style).
- **Priority 4 (Student/Parent):** Results (report card view), Study Materials, Fee Payment receipt view.

---

## 8. Progress log — what has been built

### 2026-04-29 — Phase 1 Complete: Dashboards & Architecture
- Initialized Vite + React + TS project.
- Implemented core design system using vanilla CSS variables (`tokens.css`), featuring the Emerald Green and Light Pink palette.
- Built the global layout (`AppShell`, `Sidebar`, `Header`) with a fully functional role-switching mechanism in the header.
- Created the `Login` page with a split-screen design and 5 Quick Demo Access cards.
- Built 5 high-fidelity, responsive dashboards utilizing `recharts` for data visualization:
  - **Super Admin:** Network-wide KPIs, Bar charts, Area charts for fees, alerts feed.
  - **Principal:** Timeline components, stacked bar charts for attendance.
  - **Teacher:** Timetable strip, grade distribution Pie chart, recent submissions.
  - **Student:** Assignment cards, Radar chart for subject performance.
  - **Parent:** Gradient child-profile card, Line chart for performance trends.
- Set up `react-router-dom` with 54 routes, mapping the unbuilt pages to a styled `ComingSoon` component.
- The prototype is running flawlessly at `localhost:5173`.

### 2026-04-29 — Phase 2 Start: Super Admin Overview Modules
- **Schools Directory** (`SchoolsDirectory.tsx` + `.css`):
  - 15 mock schools with realistic data (names, principals, KPIs, contact info).
  - Search by name, code, city, or principal.
  - Filter bar: Status (active/inactive), State, and Sort (name, students, attendance, fee collection).
  - Two view modes: **Grid** (school cards with stats, principal footer, action buttons) and **Table** (full data table with attendance/fee mini-bars, status badges).
  - Pagination (9 per page), empty state, animated card entrance.
  - Navigates to `/super-admin/schools/:id` (School Details placeholder).
- **Student Database** (`StudentDatabase.tsx` + `.css`):
  - 20 mock students across multiple schools with full academic/personal data.
  - Search by name, admission number, school, or parent.
  - Filter bar: School, Class, Gender dropdowns.
  - Status quick-filter chips: All / Active / Transferred / Graduated / Withdrawn with live counts.
  - Data table with sticky headers, avatar initials, grade badges (A/B/C/D color-coded), attendance mini-bars, rank display, status badges.
  - **Student Detail Modal**: Profile card with 3-stat summary, Academic Info, Personal Info, and Parent/Guardian sections.
  - Pagination (10 per page), empty state, Export button placeholder.
- Updated `router.tsx` to wire both modules (replacing ComingSoon placeholders).
- All new code uses CSS variables from `tokens.css` — zero hardcoded hex, zero Tailwind.

---

## 9. How a fresh AI chat should use this file

1. **Read this file first** to understand the project's scale, the 5 distinct user roles, and the Phase 2 priorities.
2. **Check the CSS system:** Always rely on `var(--primary-500)`, `var(--bg-card)`, etc., from `tokens.css`. Do not introduce Tailwind classes or hardcoded hex codes.
3. **Check the components:** Reuse `StatCard` and structure pages similarly to the existing dashboards. 
4. **Understand the state:** We are building a *prototype*. Mock data arrays at the top of component files are completely acceptable and expected at this stage. Focus on visual fidelity and layout over backend API integration.
5. **Append to the Progress Log** at the end of your session to keep the next AI instance informed.
