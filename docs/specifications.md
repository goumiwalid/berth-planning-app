# 📄 Web Application Specifications  
**App Name:** *(TBD — e.g., BerthBoard, QuayPlan, PortFlow)*  
**Purpose:** Centralized, cloud-based vessel scheduling and berth planning tool for terminal operators, planners, and HQ teams — supporting container, RoRo, and bulk terminals.

---

## 🧩 Functional Specifications

### 1. **User Authentication & Multi-Tenant Access**
| Feature | Description |
|--------|-------------|
| Sign Up / Login | Email/password auth (Firebase/Supabase). |
| Role-Based Access | Admin, Planner, Viewer (HQ), Agent. |
| Tenant Separation | Each customer (port group) sees only their terminals and vessels. |
| Invite Users | Admins can invite new users to their terminal group. |

---

### 2. **Terminal & Berth Management**
| Feature | Description |
|--------|-------------|
| Terminal List | Each tenant has 1+ terminals. |
| Berth Setup | Each terminal defines its own list of berths. |
| Berth Properties | Name, Length (m), Max Draft (optional), Active Status. |
| Terminal Filter | Dropdown to select one terminal at a time in the UI. |

---

### 3. **Vessel Call Management**
| Feature | Description |
|--------|-------------|
| Vessel Form | Create/edit vessel calls: name, type, LOA, draft, ETA, ETD, operator, terminal, berth. |
| Vessel Table | List of vessels with filters (date, terminal, type, status). |
| Delete / Edit | Inline editing and deletion with validation. |
| Assign Berths | Berths selected based on current terminal. |
| Conflict Warning | Detect time/berth conflicts, LOA or draft violations. |

---

### 4. **Berth Planning View (Gantt Timeline)**
| Feature | Description |
|--------|-------------|
| Gantt Layout | Rows = berths of selected terminal, Columns = hours of the selected day. |
| Time Scale | 24h timeline (00:00 to 23:59), with horizontal scroll. |
| Vessel Block | Display vessel ETA–ETD block, positioned by time and berth. |
| Proportional Berth Length | CSS-scaled berth width based on meters. |
| Color Coding | Status-based: Planned, Confirmed, At Berth, Completed. |
| Click to Edit | Clicking a vessel opens edit form. |

---

### 5. **Operational Tracking (Post MVP)**
| Feature | Description |
|--------|-------------|
| Cargo Start/End | Capture timestamp of cargo start/stop. |
| Delays | Highlight vessels with delay to departure or operation start. |
| Gang Info | Optional: Number of gangs, shift tracking. |
| Visual Indicators | Flags on the Gantt or alerts in the table. |

---

### 6. **Export & Sharing**
| Feature | Description |
|--------|-------------|
| PDF/PNG Export | Export daily/weekly berth plan. |
| Shareable Link | View-only public link to a snapshot plan. |
| Reporting | CSV export of vessel table for selected terminal/date. |

---

### 7. **TOS Integration (Future Phase)**
| Feature | Description |
|--------|-------------|
| API Import | Receive vessel schedules from external systems. |
| Webhooks | Trigger external events (e.g., on ETA change). |
| API Structure | REST or GraphQL interface to sync with Navis, TOS+, etc. |

---

## 📐 UX/UI Specifications

### Pages/Views
1. **Login / Signup**
2. **Dashboard (Terminal Selector + Metrics Summary)**
3. **Vessel Call List + Form**
4. **Berth Planner (Gantt View)**
5. **Admin Panel (Manage Users, Terminals, Berths)**
6. **Reports & Exports**

### UI Components
- Header: Terminal selector, Date picker, User profile
- Sidebar: Navigation (Dashboard, Planning, Admin)
- Gantt View Canvas
- Vessel Modal Form
- Filters Panel (vessel type, status)
- Notifications (errors, success, warnings)

---

## 🗂️ Data Models (Initial)

```json
Terminal {
  id, name, tenant_id
}

Berth {
  id, name, terminal_id, length_m, max_draft, is_active
}

Vessel {
  id, name, type, loa, draft, eta, etd, operator, terminal_id, berth_id, status
}

User {
  id, email, name, role, tenant_id
}

Tenant {
  id, name
}