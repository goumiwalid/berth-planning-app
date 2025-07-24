# # Project: Port Vessel Scheduling App (SaaS)

 ## 📌 Description
 A collaborative, cloud-based vessel scheduling web application designed for 
 port operators, terminal planners, and HQ teams. The app supports berth 
 planning and vessel operation tracking across container, RoRo, and bulk 
 terminals, with real-time multi-user access and future integration to TOS 
 systems.

 ---

 ## 🎯 Goals
 - Centralize berth planning across terminals and ports in one interface
 - Replace static tools (Excel, PDFs, emails) with a shareable, real-time 
 planner
 - Track both scheduled berth windows and operational execution (cargo ops, 
 start/stop)
 - Support real-time collaboration across multiple users and roles
 - Allow scalable deployment for multiple terminals (multi-tenant)

 ---

 ## 🧩 Core Modules (MVP + Extensions)

 ### 🔧 Vessel & Schedule Management
 - Manual + API-based vessel call creation
 - Editable ETA/ETD, LOA, draft, terminal, agent/operator
 - Visual conflict detection (berth, draft, quay length)

 ### 📅 Berth Scheduling Gantt View
 - Drag-and-drop Gantt interface for vessel-to-berth assignment
 - Color-coded status: Planned, Confirmed, At Berth, Completed, Delayed
 - Timeline zoom (daily, weekly, monthly)

 ### ⚠️ Operational Validation & Conflict Logic
 - Overlap detection on berth & quay
 - Draft + LOA limits per berth
 - Tidal/time window constraints (optional)

 ### 🔒 User Roles & Access Control
 - Admin (full rights)
 - Terminal Planner (edit own terminal)
 - HQ Viewer (view all terminals)
 - Line Agent (restricted vessel visibility)
 - Invite-based onboarding

 ### 📤 Export, Sharing & Reporting
 - Export berth plan as PDF or image
 - Shareable planning views (read-only URL)
 - Weekly report generation (PDF, CSV)

 ### ⛴️ Vessel Operations Tracking (Post-MVP)
 - Add real-time timestamps: cargo start/stop, gang-in/gang-out
 - Visual indicator for delays
 - Ops logs per vessel

 ### 🔁 TOS Integration Framework (Future)
 - API-ready structure for Navis N4, TOS+, or custom TOS
 - Webhook triggers or scheduled imports

 ---

 ## 🏗️ Architecture Overview

 ### Frontend
 - **React 18** with **TypeScript** for type safety and modern development
 - **Vite** for fast development and optimized builds
 - **Ant Design v5** for comprehensive UI component library
 - **React Router v6** for client-side routing and navigation
 - Timeline/Gantt library: Vis.js Timeline for berth scheduling visualization
 - Responsive design with mobile-first approach

 ### Backend
 - Supabase or Firebase for real-time database & auth
 - Role-based access control with granular permissions
 - Cloud Functions or Node API backend for validation & integrations
 - Multi-tenant data isolation with tenant-specific access

 ### Hosting & Deployment
 - Vercel or Netlify for frontend deployment
 - Firebase Hosting if using Firebase backend
 - Multi-tenant architecture with per-company data isolation
 - Environment-based configuration for development/production

 ---

 ## 🛡️ Authentication & Security
 - Firebase Auth / Supabase Auth (email + invite-based access)
 - Role enforcement at API/database level
 - Optional 2FA (future)

 ---

 ## 🌍 Multi-Tenant Support
 - Each customer (port group) has isolated data space
 - Admin can manage terminals, berths, users under their tenant
 - SaaS dashboard for global instance management

 ---

 ## 🧪 Dev Roadmap (Suggested Timeline)

 | Week | Goal |
 |------|------|
 | 1    | Project setup, vessel call CRUD, terminal setup |
 | 2    | Berth planner UI (Gantt), basic drag/drop |
 | 3    | Conflict detection logic, validation rules |
 | 4    | Real-time sync + multi-user collaboration |
 | 5    | User auth + roles, tenant-based views |
 | 6    | Export + sharing tools |
 | 7    | Operational timestamps tracking |
 | 8+   | TOS integration scaffolding, tenant management UI |

 ---

 ## 📂 React Project Structure

 react-berth-app/
 ├── public/
 │ └── vite.svg
 ├── src/
 │ ├── components/           # Reusable UI components
 │ │ ├── auth/              # Authentication components
 │ │ │ └── ProtectedRoute.tsx
 │ │ ├── common/            # Common utilities
 │ │ │ ├── ErrorBoundary.tsx
 │ │ │ └── TenantSwitcher.tsx
 │ │ ├── dashboard/         # Dashboard components
 │ │ ├── layout/            # Layout components
 │ │ │ ├── Header.tsx
 │ │ │ ├── Sidebar.tsx
 │ │ │ └── MainLayout.tsx
 │ │ ├── timeline/          # Gantt timeline components
 │ │ │ └── BerthTimeline.tsx
 │ │ └── vessels/           # Vessel management
 │ │   ├── VesselForm.tsx
 │ │   └── VesselTable.tsx
 │ ├── contexts/            # React Context providers
 │ │ └── AuthContext.tsx
 │ ├── pages/               # Page components
 │ │ ├── Dashboard.tsx
 │ │ ├── Login.tsx
 │ │ ├── Signup.tsx
 │ │ ├── UserProfile.tsx
 │ │ ├── Settings.tsx
 │ │ ├── VesselManagement.tsx
 │ │ └── BerthPlanning.tsx
 │ ├── services/            # API service layer
 │ │ └── auth/
 │ │   └── authService.ts
 │ ├── types/               # TypeScript definitions
 │ │ └── index.ts
 │ ├── utils/               # Utility functions
 │ │ ├── constants.ts
 │ │ └── theme.ts
 │ ├── hooks/               # Custom React hooks
 │ └── router.tsx           # Application routing
 ├── docs/
 │ └── CLAUDE.md            # Project documentation
 ├── package.json
 ├── tsconfig.json
 ├── vite.config.ts
 └── .env.local             # Environment variables

 ---

 ## 📋 Development Workflow Guidelines

 ### Git Commit Protocol
 - **Commit Frequency**: Commit to git every time a new functionality is added or major update is completed
 - **Commit Messages**: Create comprehensive commit messages that clearly describe:
   - What functionality was added or updated
   - Key technical changes made
   - Any breaking changes or important notes
   - Use format: `Add [feature]: [brief description]` or `Update [component]: [brief description]`

 ### Task Management
 - **Todo List Updates**: Update todo list whenever a task is completed to keep track of work progress
 - **Progress Tracking**: Maintain development history and task completion status
 - **Priority Management**: Mark tasks with appropriate priority levels (high/medium/low)

 ### Documentation Maintenance
 - Keep technical specifications up to date with actual implementation
 - Document any deviations from original plan or architecture changes
 - Maintain clear separation between project specifications and development progress

 ---

 **Last Updated**: December 2024  
 **Architecture**: React 18 + TypeScript + Vite + Ant Design v5