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
 - HTML, CSS, JS (modular)
 - Timeline/Gantt library: FullCalendar, DHTMLX, or Vis.js
 - Responsive layout for tablet/desktop

 ### Backend
 - Supabase or Firebase for real-time database & auth
 - Role-based access control
 - Cloud Functions or Node API backend for validation & integrations

 ### Hosting
 - Vercel or Netlify for frontend
 - Firebase Hosting if using Firebase backend
 - Multi-tenant architecture with per-company data isolation

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

 ## 📂 Suggested File Structure

 project-root/
 ├── public/
 │ └── index.html
 ├── styles/
 │ └── main.css
 ├── scripts/
 │ └── app.js
 │ └── vessel.js
 │ └── planner.js
 ├── components/
 │ └── VesselForm.js
 │ └── GanttView.js
 │ └── Login.js
 │ └── TenantSwitcher.js
 ├── backend/
 │ └── api.js
 │ └── db-config.js
 │ └── auth.js
 │ └── constraints.js
 ├── data/
 │ └── mock-vessels.json
 │ └── terminals.json
 ├── config/
 │ └── firebase-config.js
 │ └── roles.json
 ├── claude.md