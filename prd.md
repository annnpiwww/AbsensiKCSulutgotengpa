# Product Requirements Document (PRD): Attendance Analytics & Tracking Dashboard

## 1. Project Overview
The **Attendance Analytics & Tracking Dashboard** is a web-based application designed to monitor, analyze, and report employee attendance metrics across multiple locations/branches. The system tracks four primary attendance statuses: **Hadir** (Present), **Izin** (Permission), **Sakit** (Sick), and **Alpa** (Unexcused Absence). Data is synchronized or imported from a central Google Spreadsheet structure, enabling HR and managers to identify attendance trends, spot anomalies, and track specific employee absenteeism by location.

---

## 2. Target Users & Stakeholders
* **HR Managers / Operations Leads**: Monitor overall company and branch-level attendance compliance.
* **Branch Supervisors / Location Managers**: Track location-specific attendance, identify chronic absenteeism, and review daily status logs.
* **AI Agent / Developer**: Responsible for implementing the frontend dashboard, data parsing layer, and visualization components.

---

## 3. Core Features & Functional Requirements

### 3.1. Dashboard Overview & KPI Metrics
* **Summary KPI Cards**:
  * Total Workforce / Active Employees
  * Overall Attendance Rate (%)
  * Total Hadir, Sakit, Izin, and Alpa counts for the selected period.
* **Visual Charts**:
  * Attendance Status Distribution (Pie / Donut Chart).
  * Attendance Trends Over Time (Line Chart: Daily/Weekly/Monthly).
  * Location Comparison Bar Chart (Comparing Hadir vs. Sakit/Izin/Alpa across locations).

### 3.2. Location-Based Filtering & Multi-Site Support
* Dropdown or Tabbed interface corresponding to the location names defined in the Google Spreadsheet.
* Ability to aggregate data globally (All Locations) or drill down into a specific branch.

### 3.3. Granular Tracking & Drill-Down Tables
* **Detailed Employee Logs Table**: Searchable and filterable table showing employee name, date, location, status, and remarks.
* **Exception Reports**:
  * **Sakit Tracker**: Who is sick, how many days, and at which location.
  * **Izin Tracker**: Who took permission and frequency tracking.
  * **Alpa (Unauthorized Absence) Tracker**: High-priority alert table for unexcused absences to enable immediate intervention.

### 3.4. Data Ingestion & Sync
* Support for importing/syncing data from Google Sheets (based on the provided spreadsheet structure where tabs represent locations).
* Fallback CSV upload feature for manual backups or offline updates.

---

## 4. Technical Architecture & Tech Stack Recommendations

* **Frontend**:
  * **Framework**: React.js (Vite) or Next.js (App Router) for server-side rendering and fast page loads.
  * **Styling**: Tailwind CSS for modern, responsive UI design.
  * **UI Components**: Shadcn UI or Radix UI primitives.
  * **Data Visualization**: Recharts or Chart.js for responsive charts.
  * **Table Management**: TanStack Table (React Table) for sorting, filtering, and pagination.
* **Backend / API (Optional or Lightweight)**:
  * Node.js (Express) or Python (FastAPI) to handle Google Sheets API integration and secure environment variable management.
* **Data Source**:
  * Google Sheets API v4 (reading data from sheets corresponding to location names).

---

## 5. UI/UX Design Guidelines
* **Color Palette**: Professional enterprise palette (Clean white background `#f8fafc`, slate text, accent colors: Emerald Green for *Hadir*, Amber/Yellow for *Izin*, Blue for *Sakit*, Crimson Red for *Alpa*).
* **Responsiveness**: Fully responsive desktop and tablet layout optimized for HR managers on the go.
* **Card & Container Styling**: Clean cards with subtle shadows, clear typography hierarchy, and intuitive filter bars at the top of each view.

---

## 6. Implementation Phases for AI Agent

### Phase 1: Project Scaffolding & Setup
* Initialize Next.js / Vite project with Tailwind CSS and Lucide React icons.
* Setup directory structure (`/components`, `/lib`, `/types`, `/hooks`).

### Phase 2: Mock Data / Data Parsing Layer
* Create mock data structures mirroring the Google Sheets format (Columns: `Employee ID`, `Name`, `Location`, `Date`, `Status`, `Notes`).
* Implement a CSV/Sheet parser utility to transform raw row data into structured state.

### Phase 3: Dashboard & KPI Components
* Build `SummaryCards` component for total counts and percentages.
* Build `AttendanceCharts` using Recharts for visual breakdowns.

### Phase 4: Location & Status Filters
* Implement global filters (Location dropdown, Date range picker, Status filter).
* Build searchable data tables with pagination for exception tracking (Sakit, Izin, Alpa).

### Phase 5: Polish & Export
* Add export to CSV/PDF functionality.
* Refine UI responsiveness, empty states, and loading skeletons.

---

## 7. Role-Based Access Control (RBAC) & Authentication
* **Authentication System**: Secure login portal supporting role separation.
* **Roles & Permissions**:
  1. **Superuser (Pusat / Management)**:
     * Full access to global statistics, charts, and aggregated data across all 18 locations.
     * Can view comparative cross-location analytics, export master reports, and manage high-level summaries.
  2. **Location Admin (Admin Cabang)**:
     * Restricted access limited strictly to their assigned location/site.
     * Can view, input, and **update attendance data** (Hadir, Izin, Sakit, Alpa) for their specific location.
     * Changes made by Location Admins must sync directly back to the designated Google Spreadsheet corresponding to their location sheet.

---

## 8. Specific Locations Scope (18 Locations / Sheets)
The system must support exactly 18 distinct location sheets corresponding to the provided codes:
1. `TBM`
2. `NBM`
3. `PBM`
4. `PKM`
5. `PPM`
6. `MPP`
7. `MGKB`
8. `MGAM`
9. `MGMM`
10. `MGNW`
11. `MGTO`
12. `MGGJ`
13. `MGBP`
14. `MGLG`
15. `MGMP`
16. `MGMK`
17. `MGJY`
18. `MGNS`
