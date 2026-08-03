# Graph Report - /home/annnpii/Product development annpii/AbsensiKCSulutgotengpa  (2026-08-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 187 nodes · 334 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11

## God Nodes (most connected - your core abstractions)
1. `AttendanceRecord` - 32 edges
2. `compilerOptions` - 18 edges
3. `LocationCode` - 17 edges
4. `react` - 16 edges
5. `compilerOptions` - 15 edges
6. `UserSession` - 14 edges
7. `AttendanceService` - 13 edges
8. `App()` - 10 edges
9. `AppApi` - 9 edges
10. `LOCATION_NAMES` - 9 edges

## Surprising Connections (you probably didn't know these)
- `plugins` --extends--> `typescript`  [EXTRACTED]
  .oxlintrc.json → package.json
- `AttendanceChartsProps` --references--> `AttendanceRecord`  [EXTRACTED]
  src/components/AttendanceCharts.tsx → src/types/attendance.ts
- `AttendanceTableProps` --references--> `AttendanceRecord`  [EXTRACTED]
  src/components/AttendanceTable.tsx → src/types/attendance.ts
- `ExceptionTrackersProps` --references--> `AttendanceRecord`  [EXTRACTED]
  src/components/ExceptionTrackers.tsx → src/types/attendance.ts
- `GoogleSheetsSyncModalProps` --references--> `AttendanceRecord`  [EXTRACTED]
  src/components/GoogleSheetsSyncModal.tsx → src/types/attendance.ts

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (22): AddAttendanceModal(), AddAttendanceModalProps, AttendanceLogPage(), LocationAnalyticsPage(), LocationAnalyticsPageProps, LocationMetric, LocationSelector(), LocationSelectorProps (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (24): clsx, framer-motion, lucide-react, dependencies, clsx, framer-motion, lucide-react, react (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (23): DOM, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx (+15 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.24
Nodes (6): App(), AttendanceLogPageProps, generateMockAttendance(), AppApi, AttendanceService, AttendanceRecord

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (19): oxlint, devDependencies, oxlint, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (13): plugins, oxc, react, AttendanceTable(), AttendanceTableProps, STATUS_BADGES, DateFilterPreset, DateRangePicker() (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.29
Nodes (6): AttendanceCharts(), AttendanceChartsProps, STATUS_COLORS, EmployeeInfo, REAL_EMPLOYEES_BY_LOCATION, ALL_LOCATIONS

### Community 8 - "Community 8"
Cohesion: 0.33
Nodes (5): rules, react/only-export-components, react/rules-of-hooks, $schema, warn

### Community 9 - "Community 9"
Cohesion: 0.40
Nodes (5): DEFAULT_APPS_SCRIPT_URL, DEFAULT_SPREADSHEET_URL, getSpreadsheetId(), GoogleSheetsSyncModal(), GoogleSheetsSyncModalProps

## Knowledge Gaps
- **73 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `plugins` connect `Community 6` to `Community 8`, `Community 5`?**
  _High betweenness centrality (0.270) - this node is a cross-community bridge._
- **Why does `react` connect `Community 6` to `Community 0`, `Community 9`, `Community 7`?**
  _High betweenness centrality (0.261) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 5` to `Community 1`?**
  _High betweenness centrality (0.256) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14453781512605043 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._