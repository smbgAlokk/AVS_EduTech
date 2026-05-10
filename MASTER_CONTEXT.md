# AVS EduConnect — Master Context

> **Purpose of this file.** This is the canonical handoff document for AVS EduConnect. Drop its contents (or a link to it) into any fresh AI chat — Claude, GPT, Gemini, whatever — and the assistant will have everything it needs: what the product is, why it exists, the engineering approach, what's already built, and where the project stands right now.
>
> **Last updated:** 2026-05-12
> **Project day 0:** 2026-05-03 (first commit)
> **Current phase:** P0 — Pitch-ready prototype
> **Owner:** Alok Kumar
> **Working directory:** `d:\SaaS Project\AVS School Project`
> **Environment:** Windows 11, Node + Vite dev server, no backend, no managed services yet

---

## Table of contents

1. [The idea in detail](#1-the-idea-in-detail)
2. [Why this can win — market and wedge](#2-why-this-can-win--market-and-wedge)
3. [Monetization model](#3-monetization-model)
4. [Engineering philosophy and target bar](#4-engineering-philosophy-and-target-bar)
5. [Architecture overview](#5-architecture-overview)
6. [Tech stack](#6-tech-stack)
7. [Repository layout](#7-repository-layout)
8. [Roadmap (phased)](#8-roadmap-phased)
9. [Progress log — what has been built](#9-progress-log--what-has-been-built)
10. [What has NOT been built yet (deliberately)](#10-what-has-not-been-built-yet-deliberately)
11. [Top risks and unresolved questions](#11-top-risks-and-unresolved-questions)
12. [How a fresh AI chat should use this file](#12-how-a-fresh-ai-chat-should-use-this-file)

---

## 1. The idea in detail

### Elevator pitch
**AVS EduConnect** is a specialized school-management SaaS built for the **Adarsh Vidyalaya Sangathan, Assam (AVS)** — a state government body that runs **50+ schools** across Assam. It is the single console from which the AVS HQ runs every school in the network, and the daily working tool for every principal, teacher, student, and parent inside those schools. Think of it as a purpose-built HRMS + ERP + LMS hybrid for one specific government umbrella body, not a generic EdTech tool.

### Core mechanic / what it does
The product is built around **five role-based experiences** that all share one data backbone:

1. **Super Admin (AVS HQ / Sangathan office)** — sees the entire network. Schools directory, cross-school student database, financial reports, attendance overview, School Development Fund (SDF) management, development works, initiatives, inter-school competitions, network-wide notifications.
2. **Principal (per school)** — runs one school. Students, teachers, attendance monitor, exams, fee collection, accounts, SDF, class allotment, announcements, gallery, reports.
3. **Teacher** — daily classroom tool. Mark attendance, assign homework, enter marks, view timetable, share study material, run weekly tests, parent chat.
4. **Student** — academic life. Timetable, assignments, results, study material, activities, chat with teacher, profile.
5. **Parent** — child monitoring. Performance, attendance, fees, homework, school notices, events, chat.

The same data model (`School`, `Student`, `Teacher`, `Attendance`, `Exam`, `Marks`, `Fee`, `SDFund`, `DevelopmentWork`, …) feeds every role — what changes is the slice each role sees and the permissions they have on it.

### Roles and surfaces
| Role | Primary surface | Secondary surface |
|---|---|---|
| Super Admin | Web dashboard (desktop) | Mobile app (deferred) |
| Principal | Web dashboard (desktop + tablet) | Mobile app (deferred) |
| Teacher | Mobile app (deferred) → Web for now | Web |
| Student | Mobile app (deferred) → Web for now | Web |
| Parent | Mobile app (deferred) → Web for now | Web |

### Why now
- Assam state government is actively pushing digital transformation in education.
- AVS network has **50+ schools** that today run on paper, Excel, and disconnected legacy systems — there is no single source of truth at the Sangathan level.
- The Secretary of the Education Department is the actual decision-maker; a polished, end-to-end prototype is the wedge to win the contract.
- No incumbent SaaS in the Indian market is built specifically for **state-government umbrella bodies running networks of schools** — they're either single-school products (Teachmint, Classplus) or generic ERPs (MyClassboard, ERP-Buddy).

---

## 2. Why this can win — market and wedge

### The competitive reality
The Indian school-software market is crowded — Teachmint, Classplus, MyClassboard, Edsys, ERP-Buddy, Schoolytics, Edumarshal, plus countless local vendors. **A generic clone of any of these loses.** They all already exist, have sales teams, and have brand recognition.

The reason AVS EduConnect can win is that **we are not selling to "schools" as a market** — we are selling to **one specific government body** with a deal structure and a feature set that no horizontal SaaS bothers to build.

### The wedge
*(Draft proposed by AI for founder review — Alok to confirm or revise)*

1. **Built for the umbrella body, not the individual school.** Every competitor is school-first; the Sangathan office is a bolt-on. We invert that. Cross-school analytics, SDF allocation, network-wide initiatives, and inter-school competitions are first-class features — not afterthoughts.
2. **Government-specific workflows.** SDF (School Development Fund) tracking with audit trails, government-style approval chains, expense categorization that maps to government audit categories, principal-to-HQ fund requests with status. Generic ERPs do not model this; bolting it on costs months.
3. **Designed for the Indian government rural reality.** Resilience to flaky network, low-spec Android phones for teachers and parents, Assamese language support roadmap, lightweight mobile experience. (Deferred but architected for.)
4. **One purchase decision, 50+ deployments.** Because the buyer is the Sangathan, every school onboarded is essentially zero-CAC after the parent contract — no per-school sales motion. This shapes pricing, support model, and product priorities.
5. **Pitch-grade UI bar.** The prototype is being built to industry-leading polish (Linear / Notion / Vercel reference quality) because the deal is won or lost in a single demo to the Secretary. UI quality is not nice-to-have — it is the wedge against the ugly-but-functional incumbents.

### Target customer (beachhead)
- **Single beachhead:** Adarsh Vidyalaya Sangathan, Assam — the founder is in active pursuit of this contract.
- **Buyer:** Secretary of the Education Department of Assam (or whoever the AVS Secretary delegates to).
- **Users:** ~60,000–70,000 across all 50+ schools (staff + teachers + students + parents combined).
- **Land/expand path (future, post-pilot):** other state Sangathans (Sarva Shiksha Abhiyan affiliates, Kendriya Vidyalaya–style bodies, district-level government school groups). **Out of scope until AVS is live and successful.**

### The customer is not always the user
- **Decides:** Secretary of Education, Govt. of Assam.
- **Pays:** Govt. of Assam (one-time license + recurring maintenance).
- **Champions internally:** AVS HQ administrators (the "Super Admin" role).
- **Daily users:** principals, teachers, students, parents — none of whom signed the contract.

This split matters: the demo must wow the Secretary (top-down polish, dashboards, oversight) **and** the daily features must actually work for low-tech teachers and parents (bottom-up usability). Build for both.

---

## 3. Monetization model

| Component | Model | Notes |
|---|---|---|
| Initial deployment | **One-time license fee** to AVS / Govt of Assam | Covers full access to all modules across all schools in the AVS network |
| Ongoing | **Monthly maintenance contract** | Hosting, support, updates, bug fixes, new features |
| Per-school pricing | None | Single contract covers the whole network |
| Per-user pricing | None | Single contract covers all 60–70k users |
| Mobile apps | Included | Deferred to later phase but priced into the maintenance |

### Unit economics targets
- **TBD** — to be set after the Secretary indicates the size of the budget envelope. Infrastructure cost target should keep gross margin ≥ 70% on the maintenance contract.
- Variable cost driver is hosting at 60–70k user scale — pick a backend that cost-scales sublinearly with users (caching, CDN, read replicas) before signing a fixed-fee maintenance.

### Year 1 monetization rules
- Do **not** pursue any other customer until AVS is live and stable. Single-customer focus.
- Do **not** offer a free tier or freemium — this is a B2G enterprise sale, not consumer SaaS.
- Do **not** discount the maintenance fee to win the deal — the maintenance is what funds the product long-term.
- Do **not** quote a price until you understand the government's procurement cycle and budget envelope.

---

## 4. Engineering philosophy and target bar

1. **Every screen in the prototype must be demo-grade.** The deal is won in a single pitch meeting; an unpolished screen kills the sale. Every page either looks pitch-ready or is a deliberate `ComingSoon` placeholder — there is no third state of "half-built and ugly."
2. **Industry-standard reference bar.** Linear, Notion, Vercel, Stripe Dashboard. Not "good enough for a prototype" — actual top-tier SaaS UI.
3. **Mock data, real architecture.** The prototype has no backend, but the data layer, types, hooks, and component contracts are written as if a real backend exists. When the backend lands, swap the data accessors — do not rewrite the UI.
4. **Type-safe end to end.** Every entity has a TypeScript type in [src/types/index.ts](src/types/index.ts). No `any`. No `as` casts unless unavoidable and commented.
5. **Token-driven design system.** All colors, spacing, radii, shadows live in [src/styles/tokens.css](src/styles/tokens.css). Components reference tokens; never hardcoded hex.
6. **Pagination, filtering, virtualization from day 1.** Even with mock data, every list assumes 60k+ rows. Generic hooks ([usePagination](src/hooks/usePagination.ts), filter hooks) are already in place.
7. **Route-level code splitting.** React Router 7 lazy routes will be enabled as the bundle grows — design the router to allow it.
8. **No premature backend.** Resist the urge to wire Supabase / Firebase right now. Until the contract is signed, the prototype's job is to look perfect in a demo, not to persist data.
9. **Architected for mobile.** Layouts must be responsive even on web-only screens — mobile apps come later, and we don't want to redesign every screen when they do.
10. **Fail loudly in dev, gracefully in demo.** Strict TypeScript, ESLint clean on every commit. But never show a stack trace to the Secretary — empty states and error boundaries everywhere.

### Engineering maturity phases
| Phase | Name | Scope | Gate to advance |
|---|---|---|---|
| **P0** | Pitch-ready prototype | Frontend-only, mock data, every module designed to industry-standard UI | A complete walkthrough demo across all 5 roles, zero placeholder screens in the demo path |
| **P1** | Pilot with AVS | Real backend, 1–2 schools onboarded with real data, real auth | Two AVS schools using the system daily for a full month with no critical bugs |
| **P2** | Network rollout | All 50+ AVS schools live, full feature set, mobile apps shipped | All 50+ schools onboarded; >80% daily active rate among teachers; SLA met for 90 consecutive days |
| **P3** | Maturity | Hardened, audited, observable, supported at government SLA | Stable revenue from AVS maintenance; ready to consider second-customer expansion |
| **P4** | Multi-Sangathan | Productize for other state government school bodies | Out of scope until P3 is met |

---

## 5. Architecture overview

### High-level shape (current — P0 prototype)

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (React 19 SPA, Vite dev server)                    │
│                                                             │
│  ┌─────────────┐   ┌─────────────────────────────────────┐  │
│  │  Routing    │   │  Contexts                           │  │
│  │  (RR7)      │──▶│  AuthContext  (mock role switcher)  │  │
│  │             │   │  ThemeContext (light/dark)          │  │
│  └─────────────┘   └─────────────────────────────────────┘  │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AppShell  (Sidebar + Header + Outlet)               │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Role-scoped pages (super-admin / principal / …)     │   │
│  │  consume mock data via /src/data/* accessors         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### High-level shape (planned — P1 onwards)

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Web SPA    │   │  Teacher    │   │  Parent /   │
│  (current)  │   │  Mobile App │   │  Student    │
│             │   │  (RN/Expo)  │   │  Mobile App │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                 │
       └────────┬────────┴────────┬────────┘
                │                 │
                ▼                 ▼
       ┌──────────────────────────────────┐
       │  API Gateway (REST + WebSocket)  │
       │  Auth: JWT + role-based access   │
       └────────────┬─────────────────────┘
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌──────────┐
   │ Postgres│ │  Redis  │ │  Object  │
   │ (multi- │ │ (cache, │ │  Store   │
   │ tenant  │ │ pubsub) │ │ (S3-like)│
   │ by      │ │         │ │          │
   │ school) │ │         │ │          │
   └─────────┘ └─────────┘ └──────────┘
```

### Key architectural decisions and why
- **React 19 + Vite + TypeScript.** Mature, fast, large ecosystem, easy to hire for. React 19 specifically for the new Actions / async transitions which will simplify P1 backend wiring.
- **React Router 7 (data router).** Future-proof routing with loaders/actions ready for when the real API arrives — same routes will then fetch real data instead of mocks with minimal change.
- **No CSS framework (no Tailwind).** Vanilla CSS + design tokens (`--primary-500`, `--accent-200`, …) + per-component CSS files. Reasoning: full control of the UI bar, no class-soup, simpler audit trail for government compliance reviews. **This is a deliberate choice — do not propose adding Tailwind without explicit founder approval.**
- **Mock data layer mirrors a real API.** Functions in `src/data/*.ts` look like API calls (`getSchools()`, `getStudents()`). When backend lands, change the function bodies; do not change the call sites.
- **Single `AppShell` for all authenticated routes.** Sidebar + Header are role-aware via `useAuth()`. Adding a new role-scoped page = adding one route, the shell handles the rest.
- **TanStack Table + TanStack Query (planned).** Table is already in deps for big-list rendering. Query will be added when the backend lands — for now mock data is consumed synchronously.
- **Recharts for data viz** — sufficient for dashboards; revisit if performance becomes an issue at 60k user scale.

### Critical path / hot path
The bottleneck at full scale (60–70k users) is **the Super Admin dashboard rendering cross-school aggregates**.
- Step 1: Super Admin logs in → AppShell loads.
- Step 2: SuperAdminDashboard mounts → fetches network-wide aggregates (totals, per-school metrics, leaderboards).
- Step 3: SchoolsDirectory / StudentDatabase potentially renders thousands of rows.

**Measurement points (to add in P1):**
- Cold-load time of SuperAdminDashboard from login.
- Time-to-interactive on SchoolsDirectory at 50+ schools.
- Time-to-interactive on StudentDatabase at 60k students (must use server pagination + virtualization).

### Protocol / API contract
**Not yet defined** — no backend exists. When P1 begins, derive the API surface directly from the existing `src/data/*.ts` accessor signatures so the UI does not change.

---

## 6. Tech stack

### Languages and tooling
- **TypeScript** ~6.0 (strict mode via `tsconfig.app.json`)
- **ESLint** 10 + `typescript-eslint` 8 + React Hooks plugin
- **Vite** 8 (dev + build)
- **Node** (whatever Vite 8 requires; pinned via dev usage)

### Frontend
- **React** 19.2
- **React DOM** 19.2
- **React Router** 7.14 (data router)
- **TanStack Table** 8.21 (deferred-use; in deps, not yet consumed)
- **Framer Motion** 12.38 (animations; used selectively for polish)
- **Lucide React** (icon set across all role sidebars)
- **Recharts** 3.8 (dashboard charts)
- **date-fns** 4.1 (date formatting)

### Backend
- **None.** No server, no database, no auth provider.
- Planned for P1: Postgres + Redis + a Node/Bun API (TBD — finalize in P1 spike). Supabase as a possible shortcut, but only if it can hit the cost-per-user target at 70k scale.

### Data layer
- **In-memory TypeScript modules** under `src/data/` — `schools.ts`, `students.ts`, `dashboards.ts`, `finance.ts`, `sdf.ts`. Each exports typed accessor functions.
- All entity types live in [src/types/index.ts](src/types/index.ts) — single source of truth.

### Current infrastructure
- Local Vite dev server only.
- Git: GitHub repo, branches `main` / `dev` / `alpha` / `beta`. Active development happens on `alpha`, merges through `dev` to `main`.

### Planned infrastructure (P1+)
- Hosting: TBD (Vercel for SPA + a Node API on Render/Fly/Hetzner is the cheap path; AWS/GCP if government compliance demands it).
- Database: Postgres (multi-tenant by `schoolId`).
- Cache: Redis (sessions, dashboard aggregates, leaderboards).
- Object storage: S3-compatible (study materials, gallery photos, attachments).
- Auth: JWT-based, role + school scoped.
- Observability: Sentry for errors, simple Postgres-backed audit log for government compliance.
- Mobile: React Native + Expo (planned; reuses types and possibly hooks from web).

---

## 7. Repository layout

```
AVS School Project/
├── src/
│   ├── main.tsx                  # App bootstrap; wraps Router in Auth + Theme providers
│   ├── router.tsx                # All routes; ComingSoon for unbuilt pages
│   ├── assets/                   # Static images (hero, logos)
│   ├── styles/
│   │   ├── tokens.css            # Design tokens — single source of truth for colors/spacing
│   │   ├── reset.css             # CSS reset
│   │   └── globals.css           # Global styles + token import
│   ├── types/
│   │   └── index.ts              # All entity TypeScript types — domain model lives here
│   ├── contexts/
│   │   ├── AuthContext.tsx       # Mock role switcher; will become real auth in P1
│   │   └── ThemeContext.tsx      # Light/dark mode
│   ├── data/                     # Mock data + accessors (stand-in for the future API)
│   │   ├── index.ts              # Barrel export
│   │   ├── schools.ts            # Schools mock + getSchools()
│   │   ├── students.ts           # Students mock + getStudents()
│   │   ├── dashboards.ts         # Dashboard aggregates
│   │   ├── finance.ts            # Fee/expense mock data
│   │   ├── sdf.ts                # School Development Fund mock data
│   │   ├── development.ts        # Development works (projects, tenders, vendors, inspections, budget, docs)
│   │   ├── attendance.ts         # Attendance (all roles): schools, classes, defaulters, leave, holidays, trends
│   │   ├── staff-watch.ts        # Staff compliance: teachers/principals, disciplinary actions, period log, surprise visits
│   │   └── policies.ts           # Editable attendance policies (18 policies × 6 categories with govt-floor governance)
│   ├── hooks/                    # Generic, reusable hooks
│   │   ├── usePagination.ts
│   │   ├── useSchoolsFilter.ts
│   │   ├── useStudentsFilter.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx      # Sidebar + Header + Outlet — wraps every authed route
│   │   │   ├── Sidebar.tsx       # Role-aware nav config
│   │   │   └── Header.tsx
│   │   ├── ui/
│   │   │   ├── StatCard.tsx
│   │   │   ├── ComingSoon.tsx    # Placeholder for unbuilt pages
│   │   │   └── InspectionModal.tsx
│   │   └── shared/               # Cross-role components used by multiple roles
│   │       ├── FinancialReports.tsx
│   │       ├── SdfFundManagement.tsx
│   │       ├── DevelopmentWorks.tsx
│   │       ├── AttendanceModule.tsx  # used by ALL 5 roles via `role` prop
│   │       ├── StaffWatchPanel.tsx   # SA + Principal disciplinary "superpowers"
│   │       └── PoliciesPanel.tsx     # SA Attendance policies + holiday calendar (full CRUD)
│   └── pages/
│       ├── auth/Login.tsx        # Role picker (no real auth yet)
│       ├── super-admin/          # SuperAdminDashboard, SchoolsDirectory, SchoolDetails, StudentDatabase
│       ├── principal/            # PrincipalDashboard, PrincipalStudents, PrincipalTeachers
│       ├── teacher/              # TeacherDashboard (rest are ComingSoon)
│       ├── student/              # StudentDashboard (rest are ComingSoon)
│       └── parent/               # ParentDashboard (rest are ComingSoon)
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
└── README.md                     # Default Vite README — to be replaced
```

---

## 8. Roadmap (phased)

Phase gates are the contract. Do not advance to the next phase until the current phase gate is met.

### Phase 0 — Pitch-ready prototype (now → pitch date) — **In progress**
**Goal:** Walk the AVS Secretary through every module, across all 5 roles, with industry-standard UI polish. Every screen in the demo path must be either fully designed or deliberately marked `ComingSoon` — never half-built.

- [x] Project scaffold (Vite + React 19 + TS + RR7)
- [x] Design tokens (emerald + pink + grey palette)
- [x] AppShell with role-aware Sidebar + Header
- [x] Mock auth context with all 5 roles
- [x] Login (role picker) page
- [x] Super Admin: Dashboard, Schools Directory, School Details, Student Database
- [x] Super Admin: Financial Reports, SDF Fund Management (shared components)
- [x] Super Admin + Principal: Development Works (shared, role-filtered tabs)
- [x] Attendance Module — shared across **all 5 roles** with reusable primitives + role-aware tabs
- [x] Staff Watch — HQ + Principal "superpowers" panel with working disciplinary action flow
- [x] Principal: Dashboard, Students (with filters), Teachers (with search/filter)
- [x] Principal: Financial Reports, SDF Fund (shared components reused)
- [x] Teacher / Student / Parent: Dashboard skeletons
- [x] Generic hooks: pagination, schools filter, students filter
- [ ] Super Admin: Initiatives, Competitions, Notifications, Settings
- [ ] Principal: Exams, Class Allotment, Announcements, Photo Gallery, Reports, Student Profile
- [ ] Teacher: Homework, Marks Entry, Timetable, Materials, Activities, Parent Chat, Weekly Tests, Profile
- [ ] Student: Timetable, Assignments, Results, Materials, Activities, Chat, Profile
- [ ] Parent: Performance, Fees, Homework, Chat, Notices, Events, Child Profile
- [ ] Empty states, loading skeletons, error boundaries on every page
- [ ] Mobile-responsive pass on every page
- [ ] Demo script — exact click path for the Secretary pitch
- **Gate:** Complete demo walkthrough of all 5 roles, zero broken screens in the demo path, founder-approved polish bar on every page.

### Phase 1 — Pilot with AVS (post-contract)
**Goal:** Two real AVS schools running the system on real data with real auth.
- [ ] Backend stack chosen (Postgres + API server + Redis)
- [ ] Auth (real, school-scoped, role-based)
- [ ] Replace mock data accessors with real API calls (UI unchanged)
- [ ] Multi-tenancy by `schoolId`
- [ ] Data import for two pilot schools (students, teachers, classes)
- [ ] Audit log (government compliance)
- [ ] Sentry / observability
- [ ] Hosting + CI/CD
- **Gate:** Two AVS schools using the system daily for one month with no P0/P1 bugs.

### Phase 2 — Network rollout (all 50+ AVS schools)
**Goal:** Every AVS school live; teacher/student/parent mobile apps shipped.
- [ ] Onboarding tooling (bulk school + user import)
- [ ] Performance hardening for 60–70k users (caching, CDN, query indexes, virtualization)
- [ ] Teacher mobile app (RN/Expo)
- [ ] Parent + Student mobile app (RN/Expo)
- [ ] Assamese language support
- [ ] Offline support for critical flows (attendance marking, grade entry)
- **Gate:** All 50+ schools onboarded; >80% teacher daily active; uptime SLA met for 90 consecutive days.

### Phase 3 — Maturity
**Goal:** Hardened, audited, supported at government-grade SLA.
- [ ] Government compliance audit (data residency, retention, audit trails)
- [ ] 24/7 support coverage
- [ ] Disaster recovery + backup verified
- [ ] Documentation + training materials in Assamese + English
- **Gate:** Stable maintenance revenue; system runs without founder daily intervention.

### Phase 4 — Multi-Sangathan (out of scope until P3)
Productize for other state government school bodies. Do not start P4 work, even partially, before P3 gate is met.

---

## 9. Progress log — what has been built

### 2026-05-03 — Project bootstrap
- First commit. Vite + React 19 + TS scaffold.
- Initial build fixes.

### 2026-05-04 — Foundation
- Auth context with all 5 mock roles wired in.
- Theme context (light/dark).
- AppShell + Sidebar + Header with role-aware nav.
- Login page (role picker).
- Super Admin: Dashboard, Schools Directory, School Details.
- Principal: Dashboard, PrincipalStudents with filter UI.
- Generic hooks: pagination, filters.
- Design tokens (emerald + pink + grey palette).

### 2026-05-05 — Super Admin breadth + Principal teachers
- Super Admin: Student Database (cross-school).
- Shared FinancialReports component (consumed by Super Admin + Principal).
- Shared SdfFundManagement component (consumed by Super Admin + Principal).
- Principal: PrincipalTeachers with search + filter.
- A few more Super Admin modules scaffolded.

### 2026-05-06 — Documentation
- This MASTER_CONTEXT.md created.

### 2026-05-08 — Development Works module (Management section)
- Added shared **DevelopmentWorks** component at [src/components/shared/DevelopmentWorks.tsx](src/components/shared/DevelopmentWorks.tsx) covering the full government project lifecycle (proposal → sanction → tender → work order → execution → inspection → completion → UC) with role-aware tab filtering.
- **Super Admin (HQ) tabs (6):** Overview, All Projects, Proposals & Approvals (inbox), Tenders & Vendors, Inspections, Budget Allocation.
- **Principal tabs (5):** Overview, My Projects, New Proposal (form + outbox), Inspections, Documents.
- Tabs hidden cross-role: HQ-only — Proposals inbox, Tenders & Vendors, Budget; Principal-only — New Proposal form, Documents. Single component, single source of truth — same pattern as `FinancialReports` and `SdfFundManagement`.
- New mock data layer at [src/data/development.ts](src/data/development.ts): 16 dev works across 10 categories (Civil Construction, Renovation, Furniture, Sanitation, Electrical, Solar, Sports, IT/Smart Class, Boundary Wall, Library), 7 govt funding sources (Samagra Shiksha, PM SHRI, NABARD, 14th FC Grant, SDF, State Govt Grant, CSR), 8 empanelled contractors, 6 tenders, 10 inspections, 10 budget allocations, 10 documents.
- Industry-standard UI: KPI strip, status distribution pie + legend, spend-by-category bar chart, upcoming-milestone feed with pulse indicator, activity stream, tender bid countdown, vendor rating cards (5-star), calendar-styled inspection rows with overdue/upcoming/completed sections, school-wise alloc/sanc/util stacked bar chart, document grid with type-coded icons (UC, CC, WO, BOQ, photos, inspection reports, invoices). Fully responsive across 4→2→1 column breakpoints.
- Government terminology baked in: BOQ, EMD, Work Order No., Sanctioning Authority, Utilisation Certificate, MNRE/PWD/NABARD inspectors, e-tender lifecycle.
- Routed at `/super-admin/development` and `/principal/development`. Type-check + ESLint + production build all clean.

### 2026-05-09 — Attendance module (shared across all 5 roles)
- Added shared **AttendanceModule** at [src/components/shared/AttendanceModule.tsx](src/components/shared/AttendanceModule.tsx) — single component, `role` prop, role-aware tab configuration. Same component drives the experience for Super Admin, Principal, Teacher, Student, and Parent.
- **Optimization approach:** built reusable primitives once and composed them into role-specific tab content. Primitives: `KpiTile`, `AttendanceDonut` (SVG, no dependency), `AttendanceCalendar` (month grid w/ status colors), `AttendanceTrendChart`, `StatusPill`, `LeaveApplicationCard` (inbox + outbox variants), `LeaveForm` (categories vary by role), `DefaulterRow`, `ApplyLeavePanel`. Tab content for student/parent and SA/principal defaulters uses the same panel with a scope/`forParent` flag — no duplicated UI.
- **Tabs per role:**
  - **Super Admin (5):** Network Overview · Schools · Trends · Defaulters · Policies & Calendar
  - **Principal (5):** Today's Pulse · Classes · Defaulters · Leave Approvals · Calendar
  - **Teacher (4):** Mark Attendance · History · Class Register · My Leave
  - **Student (3):** My Attendance · Calendar · Apply Leave
  - **Parent (3):** Child's Attendance · Calendar · Apply Leave
- New mock data layer at [src/data/attendance.ts](src/data/attendance.ts): 12 schools with today's pulse + week/month/year averages, 12 classes for the demo school w/ marked status, 44 students in roll 10-A pre-marked for teacher demo, 10 cross-school defaulters by risk level (severe/critical/warning), 10 leave applications across student/teacher/parent applicants in mixed states (pending/approved/rejected), 20 govt + state + religious + school holidays for AY 2025-26, 30-day daily trend, 12-month monthly trend with prev-year comparison, subject-wise attendance for 8 subjects, demo student summary.
- **Govt-school flow elements:** 75% threshold for exam eligibility (configurable in policies), late-marking cutoff at 09:15 IST, daily govt portal sync, auto-escalate on 3 consecutive days, holiday calendar including Bohag Bihu/Durga Puja/Eid/Independence Day. Defaulter rows include parent contact + "send notice" action.
- **Teacher Mark Attendance UI:** roll-call grid w/ P/A/L/Lv buttons per student, bulk-mark all present/absent, live counter strip with % donut, draft auto-save indicator, submit. Class switcher across teacher's assigned classes (10-A, 10-B, 9-A).
- **Student / Parent UI:** big donut % hero + 4-stat strip + subject-wise bars + streak tiles + threshold-status banner + month calendar + recent absences feed.
- All 5 routes wired (`/super-admin/attendance`, `/principal/attendance`, `/teacher/attendance`, `/student/attendance`, `/parent/attendance`). Added "My Attendance" link to the Student sidebar (was missing).
- Type-check + ESLint + production build clean.

### 2026-05-10 — Staff Watch (HQ + Principal disciplinary superpowers)
- Added shared **StaffWatchPanel** at [src/components/shared/StaffWatchPanel.tsx](src/components/shared/StaffWatchPanel.tsx). Mounted as a new "Staff Watch" tab inside the Attendance module for both Super Admin and Principal — addresses the founder's "teachers don't actually come / classes not run" problem.
- **Working disciplinary flow** — clicking *Take Action* on any staff card opens a full-fidelity action modal (8 action types, severity-coded), submitting actually mutates state: action lands in the Action Log with a fresh ID, the staff card's risk level escalates, salary status changes for hold/dock/suspension actions, and a toast confirms. Pre-filled citation text is generated from the staff's actual record (AWOL count, attendance %, coverage rate) and is editable.
- **Sub-tabs (SA, 5):** Overview · Teachers · Principals · Action Log · Surprise Visits
- **Sub-tabs (Principal, 4):** Overview · Teachers · Today's Periods · Action Log
- **Action types & authority:** SA can issue all 8 (Show-Cause, Written Warning, Salary Hold, Salary Deduction, Suspension Recommendation, Surprise Inspection, Transfer Recommendation, Counseling). Principal authority limited to Show-Cause, Written Warning, Counseling.
- **Risk levels:** Compliant (≥92%) · Watch (85–92%) · Warning (78–85%) · Critical (70–78%) · Severe (<70%) — colour-coded throughout (left stripe on staff cards, distribution bar, badges).
- **Today's Periods** tab (Principal only) shows real-time class-by-class period log w/ teacher names, status colour coding (Conducted/Missed/Substituted/Cancelled), and an aggregate coverage rate. Period that's "missed" shows the teacher in red with "Teacher absent without notice" note.
- **Surprise Inspections** tab (SA only) — schedule unannounced visits, inspector + designation, post-visit report w/ staff-present/expected ratio, classes-active/scheduled, 1-5 rating, findings.
- **Mock data** at [src/data/staff-watch.ts](src/data/staff-watch.ts): 18 staff members across 5 schools (mix of teachers + principals across all 5 risk levels), 7 disciplinary actions in mixed states (pending/responded/closed/escalated/completed), 12 today's period entries for demo school, 6 surprise visits.
- All buttons are wired (Phone, Email open native handlers with the staff's number/email; Show-Cause shortcut opens modal pre-set to that action; Mark Closed/Escalate placeholders shown on pending actions).
- Type-check + ESLint + production build clean.

### 2026-05-11 — Schedule Inspection flow + Staff Watch UI cleanup
- **New: 2-step Schedule Inspection modal.** Clicking *Schedule Inspection* in the Staff Watch → Surprise Visits sub-tab now opens a complete working flow:
  - **Step 1 — Where & When:** school picker (auto-sorted by lowest attendance, "most likely to need a check"), date input with "in N days" hint, 12 time-slot pills, scrollable inspector roster (7 inspectors with role/designation, click-to-select with check icon).
  - **Step 2 — Brief & Confirm:** sticky summary of selections, 8 focus-area chips (Staff presence, Class running, Infrastructure, Cleanliness, Student attendance, Teaching quality, Books/registers audit, Anti-corruption), 3 confidentiality tiles (Inspector only / Inspector + HQ / Announced), 4 priority pills (low/normal/high/urgent — urgent pulses), free-text concerns. Final preview pane lists exactly what will happen ("sealed brief sent to X only", "report within 24h", urgent ping if applicable).
  - Submitting: visit added to scheduled list with auto-generated SV-ID, animated highlight ring on the new card for 2.4s, toast confirms.
- **Data layer extension** at [src/data/staff-watch.ts](src/data/staff-watch.ts): added `Confidentiality`, `VisitPriority` types, `INSPECTOR_ROSTER` (7 govt inspectors), `FOCUS_AREAS` (8 verification categories), `CONFIDENTIALITY_META`, plus optional `focusAreas/confidentiality/priority/specificConcerns` fields on `SurpriseVisit`.
- **Staff Watch UI cleanup** — addressing "looks clumsy / data flowing randomly":
  - **Hero replaced** with slim header strip: smaller icon, single-line title + tight subtitle, four inline status pills (Compliant / Watch / Critical / Pending) instead of four oversized stat blocks.
  - **Staff cards rebuilt (`sw-card2`)** — removed the 4-flag grid + redundant tag row + 4 stacked action buttons. New layout: top stripe colour-codes risk; identity row (avatar + name + meta + risk badge); two prominent metric blocks (attendance % and class coverage % with sub-line "X of Y days/periods"); inline compact stats row (`0 AWOL · 1 late · 0 early-out`); footer with salary/last-action tags + 3-button action group (📞 / ✉ / Take Action). Card now reads in 5 visual zones instead of 10+, far more breathing room.
  - **Visit cards redesigned** — old dense single-row layout replaced by `sw-visit-card` with proper card hierarchy (head with date block + school + rating/scheduled-tag, body with inspector + focus chips + concerns/findings + stats). Section headers use uppercase tertiary-text micro-labels instead of heavy card heads. New "Schedule Inspection" CTA in lighter banner.
- All buttons remain wired (Phone/Email use `tel:` / `mailto:`, Schedule Inspection actually mutates state, action modal flow unchanged).
- Type-check + ESLint + production build clean.

### 2026-05-12 — Editable Policies & Calendar (Super Admin)
- **Replaced the static "Policies & Calendar" tab** with a full working **PoliciesPanel** at [src/components/shared/PoliciesPanel.tsx](src/components/shared/PoliciesPanel.tsx). All 18 policies are now actually editable; all changes commit immediately, persist for the session, and confirm via toast.
- **Two-pane responsive layout:** Policies (left, 1.4fr) · Holiday Calendar (right, 1fr, sticky). Collapses to single-column at 1100px. KPI strip header replaced with slim 3-pill counter (Total · Mandatory · Customized).
- **6 policy categories, 18 policies** (data layer at [src/data/policies.ts](src/data/policies.ts)): Academic Eligibility · Notifications · Timing & Marking · Escalation Rules · Govt Integration · Leave Policy. Filterable via category chip row + free-text search.
- **6 input control types — `PolicyControl` dispatches by policy.type:**
  - `toggle` — switch with Enabled/Disabled label, immediate commit
  - `percent` — range slider + numeric input + suffix, clamped between min/max
  - `number` — −/+ stepper input with unit label
  - `time` — native `<input type="time">` with IST suffix
  - `select` — dropdown
  - `multiselect` — toggleable chip group (e.g. notification channels: SMS/In-app/Email/WhatsApp/IVR)
- **Govt-mandate enforcement:** policies with `governance: 'mandatory'` show a `Lock` badge + tooltip explaining the legal source (e.g. CBSE Bye-laws Sec 6.1, SSA-Assam MoU 2024). When the value sits at the govt floor, an "at govt floor" hint appears next to the slider; can raise above but not below.
- **Customization tracking:** rows where the value differs from the default get a left emerald accent stripe + "Customized" tag + "Changed by You on [date]" note. Per-row reset button (RotateCcw icon) reverts to default. Top-bar "Reset all" appears when any policy is customized.
- **Holiday Calendar — full CRUD:** type filter chips (All/National/State/Religious/School/Examination), Upcoming/Past sections (past auto-faded), hover-reveals edit/delete icons. **Working modal** (Add/Edit) with name input, date picker, weekday auto-display, 5 visual category tiles (each colour-stripe-coded), description textarea, save/cancel/delete buttons. State persists via React.
- **Toast** confirms every change ("Updated: Late marking cut-off time", "Added: Independence Day", etc.).
- Fully responsive (1100/768/540 breakpoints): controls stack on mobile, modal form switches to single column, Holiday panel moves below policies.
- Type-check + ESLint + production build clean.

### Where we are right now (as of 2026-05-12)
The prototype's "spine" is in place: routing, role-aware shell, design system, mock data layer, and the high-priority Super Admin and Principal modules are real screens. Teacher / Student / Parent dashboards exist but most of their inner pages are `ComingSoon` placeholders. The next concrete action is to keep building module-by-module to industry-standard UI quality, working through the unchecked items in Phase 0.

**Next action:** pick the next-most-important unbuilt module from §8 Phase 0 and build it end-to-end with full UI polish, mock data, and responsive layout.

---

## 10. What has NOT been built yet (deliberately)

Every item below is cut **on purpose** until its phase gate. Adding any of these before the gate burns runway and confuses the pitch.

- **Real backend / API / database** — deferred to P1. Today everything is in-memory mock data.
- **Real authentication** — deferred to P1. Today login is a role picker that swaps mock users.
- **Persistence** — nothing survives a page refresh. Intentional for the prototype.
- **Payments / fee collection rails** — deferred to P1. Fee UI shows mock numbers.
- **Mobile apps (RN/Expo)** — deferred to P2. Web is responsive; native comes after the contract.
- **Assamese language UI** — deferred to P2. English-only for the pitch (the Secretary speaks English in business contexts).
- **Offline support** — deferred to P2.
- **Real-time chat / notifications transport** — deferred to P1. UI is mocked.
- **Tests (unit / integration / e2e)** — deferred to P1. The prototype changes shape too fast for tests to be worth writing yet.
- **CI/CD pipeline** — deferred to P1. Local dev only.
- **Tailwind / any CSS framework** — explicit "no" decision. Vanilla CSS + tokens is the approach. Do not propose changing this.
- **Supabase / Firebase / any specific BaaS** — deliberately undecided until P1 spike, when we know the cost-per-user math.
- **Multi-tenancy implementation** — deferred to P1.
- **Audit log / government compliance instrumentation** — deferred to P1.
- **Second customer / other state Sangathans** — out of scope until P3.

---

## 11. Top risks and unresolved questions

### Risks
1. **Scaling the platform to 60–70k concurrent-ish users without crashes or jank.** *(Founder's #1 stated fear.)*
   **Mitigation:** Architect for it from day 1 even though the prototype has no real load.
   - Server-side pagination on every list (already abstracted via [usePagination](src/hooks/usePagination.ts)).
   - Plan to use TanStack Table virtualization for any list > 100 rows.
   - In P1, choose a backend pattern with read replicas + Redis caching for dashboard aggregates.
   - CDN-fronted SPA, route-level code-splitting, image lazy-loading.
   - Realtime only where it earns its keep (chat, notifications) — everything else is request/response.

2. **Holding the UI polish bar across every screen.** *(Founder's #2 stated fear.)*
   **Mitigation:**
   - Lock a reference design bar (Linear / Notion / Vercel / Stripe Dashboard).
   - Token-driven design system — every color, spacing, radius from `tokens.css`.
   - One reusable `StatCard`, `ComingSoon`, etc. — never reinvent per page.
   - Empty / loading / error states on every screen, not just the happy path.
   - Founder reviews every new module against the reference bar before marking it "done."

3. **Single-customer concentration risk.** Entire business depends on closing AVS. If the deal slips or stalls, there is no fallback revenue.
   **Mitigation:** Treat the prototype as the only sales asset; iterate on it quickly based on the Secretary's reactions. Keep the codebase generic enough to retarget to another Sangathan later without a rewrite.

4. **Government procurement timeline uncertainty.** B2G sales can stretch over many months and depend on budget cycles.
   **Mitigation:** Don't over-build the prototype. Build the demo path deeply and the rest as `ComingSoon`. Resist the urge to wire a real backend before the contract.

5. **UI bar slippage as scope grows.** The first ten pages will be polished; the next thirty risk being rushed.
   **Mitigation:** Define a polish checklist and apply it to every page before marking done. Refuse to merge half-polished pages — better to keep `ComingSoon` than ship something ugly.

### Unresolved questions
- [ ] What's the target pitch date for the AVS Secretary meeting?
- [ ] What's the budget envelope the Govt of Assam is likely to approve? (Drives infra cost ceiling.)
- [ ] Are there government compliance requirements (data residency, audit trails, security certifications) we need to design for from day 1?
- [ ] Which two AVS schools will be the P1 pilot?
- [ ] What's the existing data we'd inherit (paper records? Excel? a legacy system to migrate from)?
- [ ] Will the Secretary's demo be on a projector (desktop view) or on a tablet/phone (mobile view)?
- [ ] Do we need a Hindi/Assamese version for the pitch itself, or is English fine?

---

## 12. How a fresh AI chat should use this file

If you are an AI assistant reading this file at the start of a new chat:

1. **Read the whole file before making suggestions.** The owner has made deliberate choices. Don't re-derive them.
2. **Respect the phase gates.** We are in **P0 (pitch-ready prototype)**. Do not propose backend wiring, real auth, payments, or mobile apps unless explicitly asked. They are P1+ work and proposing them now wastes time.
3. **Architecture decisions are made; don't relitigate them.** Specifically: React + TS + Vite + RR7 stays. Vanilla CSS + design tokens stays — do not propose Tailwind. Mock data stays in `src/data/*.ts` — do not propose adding a backend.
4. **Hold the UI bar.** Every new page should target Linear / Notion / Vercel polish. Empty states, loading states, error states, responsive layout — not optional.
5. **Use the existing primitives.** Before building a new component, check `src/components/ui/`, `src/components/shared/`, and `src/hooks/`. Reuse `StatCard`, `ComingSoon`, `usePagination`, the filter hooks.
6. **Update this file as part of the work.** When a meaningful chunk completes, append to §9 with today's date and a short bullet list. When a phase 0 item ships, check the box in §8. Bump the "Last updated" line in the header.
7. **Respect the explicit deferrals in §10.** Do not "helpfully" add tests, real auth, persistence, or any other deferred concern. If you think one is needed now, raise it as a question — don't just build it.
8. **Match the audience.** This product is being demoed to a government Secretary. Copy, microcopy, labels, and tone should be professional, direct, and free of EdTech buzzwords.
9. **When in doubt, ask.** Clarifying questions beat assumptions, especially on UI polish and information architecture.

### Quick facts table (for very fast context loading)
| Key | Value |
|---|---|
| Project | AVS EduConnect — school-management SaaS for Adarsh Vidyalaya Sangathan, Assam (50+ schools, 60–70k users) |
| Owner | Alok Kumar |
| Stage | P0 — pitch-ready prototype (started 2026-05-03) |
| Tech stack | React 19 + TypeScript + Vite + React Router 7 + vanilla CSS + design tokens |
| Runtime state | In-memory mock data only (`src/data/*.ts`); nothing persists |
| Persistence | No — deferred to P1 |
| Auth | Mock role picker only — no real auth, deferred to P1 |
| Current phase | P0 — pitch-ready prototype |
| Immediate next action | Build the next-most-important unbuilt Phase 0 module to industry-standard polish |
| Hard rule | Demo-grade or `ComingSoon` — no half-built pages in the demo path |

---

*End of master context. Keep this file in sync with reality after every meaningful session.*
