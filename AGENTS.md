# AGENTS.md — AbsensiKCSulutgotengpa

Panduan komprehensif ini ditujukan untuk AI coding agent yang bekerja pada repository **AbsensiKCSulutgotengpa**. Dokumen ini menjelaskan gambaran proyek, arsitektur teknis, struktur direktori, konvensi pengembangan, strategi pengujian, dan alur deployment.

---

## 1. Project Overview (Gambaran Umum Proyek)

**AbsensiKCSulutgotengpa** (Attendance Analytics & Tracking Dashboard) adalah aplikasi web berbasis React + TypeScript untuk memantau, menganalisis, dan melaporkan data absensi karyawan di 18 lokasi/cabang operasional (Wilayah Sulut, Gorontalo, Sulteng, Papua, dll.).

- **Tujuan Utama**: Menyajikan visualisasi KPI, grafik tren absensi, exception tracking (Sakit, Izin, Alpa, SKD, Cuti, Terlambat), serta memfasilitasi penambahan/pengeditan data absensi secara lokal maupun sinkronisasi otomatis dari Google Spreadsheet.
- **Cakupan Cabang (18 Kode Lokasi Resmi)**:
  `TBM`, `NBM`, `PBM`, `PKM`, `PPM`, `MPP`, `MGKB`, `MGAM`, `MGMM`, `MGNW`, `MGTO`, `MGGJ`, `MGBP`, `MGLG`, `MGMP`, `MGMK`, `MGJY`, `MGNS`.
- **Status Absensi**:
  `Hadir`, `Izin`, `Sakit`, `SKD`, `Alpa`, `Cuti`, `Off`, `Terlambat`.

---

## 2. Technology Stack & Build Architecture

### Tech Stack
- **Frontend Core**: React 19 (`react` & `react-dom` v19.2.7), TypeScript (`~6.0.2`), Vite (`^8.1.1`).
- **Styling & Design System**: Tailwind CSS v4 (`@tailwindcss/vite` v4.3.3), Framer Motion (`^12.42.2`), Lucide React Icons (`^1.27.0`), Radix UI (`@radix-ui/react-popover`, `@radix-ui/react-slot`).
- **Visualisasi & Date Helpers**: Recharts (`^3.10.1`), `date-fns` (`^4.4.0`), `react-day-picker`.
- **Linting & Formatting**: Oxlint (`oxlint` v1.71.0) dengan aturan React dan TypeScript (`.oxlintrc.json`).
- **Backend / Integration**: Google Apps Script Web App API (`APPS_SCRIPT_FINAL.gs` / `apps-script-sync.js`) yang membaca data 18 sheet dari Google Spreadsheet central.
- **Hosting / Infrastructure**: Vercel SPA (`vercel.json` rewrite ke `/index.html`).

### Perintah Build & Lint (`package.json`)
- **Development**: `npm run dev` — Menjalankan Vite dev server.
- **Build Production**: `npm run build` — Menjalankan `tsc -b` (type-checking) lalu `vite build`.
- **Linting**: `npm run lint` — Menjalankan `oxlint` untuk analisis statis kode.
- **Preview Production Build**: `npm run preview` — Menjalankan server preview lokal dari direktori `dist/`.

---

## 3. Structure & Module Division (Struktur Kode)

```
AbsensiKCSulutgotengpa/
├── design-system/          # Spesifikasi M3 + Anti-UI-Slop design system (DESIGN_SYSTEM_M3_PRO.md)
├── docs/                   # Dokumentasi teknis & alur deployment (docs/deployment/, docs/agents/)
├── public/                 # Static assets (icons.svg, favicon.svg)
├── src/
│   ├── assets/             # Assets gambar & logo (logo.jpeg, hero.png, svg)
│   ├── components/         # Komponen UI utama
│   │   ├── ui/             # Reusable M3 / primitives (button, popover, calendar, modern-login)
│   │   ├── AttendanceCharts.tsx      # Komponen grafik (Pie & Line chart)
│   │   ├── AttendanceLogPage.tsx     # Halaman log data absensi & exception
│   │   ├── AttendanceTable.tsx       # Tabel data absensi & pencarian
│   │   ├── DateRangePicker.tsx       # Filter rentang tanggal
│   │   ├── ExceptionTrackers.tsx     # Tracker kasus khusus (Sakit, Izin, Alpa)
│   │   ├── GoogleSheetsSyncModal.tsx # Modal sinkronisasi Google Sheets & export CSV
│   │   ├── KpiSummaryCards.tsx       # Card KPI ringkasan absensi
│   │   ├── LocationAnalyticsPage.tsx # Halaman analisis per perbandingan cabang
│   │   ├── LocationSelector.tsx      # Selector cabang / lokasi
│   │   ├── LoginPage.tsx             # Halaman autentikasi
│   │   ├── Sidebar.tsx               # Navigasi utama & switch halaman
│   │   └── SkeletonLoader.tsx        # M3 Shimmer/Pulse loading state
│   ├── config/
│   │   └── auth.ts         # Configuration & whitelist validation untuk login (SUPERUSER & LOCATION_ADMIN)
│   ├── data/
│   │   └── mockData.ts     # Generator data absensi dummy untuk fallback
│   ├── lib/
│   │   └── utils.ts        # Helper fungsi Tailwind (`cn`)
│   ├── services/
│   │   ├── api.ts          # Layanan API terpadu (login, logout, CRUD attendance)
│   │   └── attendanceStore.ts # Service state & localStorage persistence (`absensi_kc_sulutgopas_records_v3`)
│   ├── types/
│   │   └── attendance.ts   # Definisi tipe TypeScript utama (`AttendanceRecord`, `LocationCode`, dll.)
│   ├── App.tsx             # Root component & routing state
│   ├── main.tsx            # Entry point React DOM
│   └── index.css           # Custom CSS variables, M3 color tokens & motion physics
├── APPS_SCRIPT_FINAL.gs    # Script Google Apps Script produksi untuk sinkronisasi Google Sheets
├── apps-script-sync.js     # Script Apps Script alternatif / development
├── CHECKLIST_FIX.md        # Panduan troubleshooting & checklist penyesuaian data
├── PANDUAN_APPS_SCRIPT.md  # Panduan step-by-step deploy Google Apps Script API
└── vercel.json             # Konfigurasi SPA routing Vercel
```

---

## 4. Key Conventions & Business Logic (Konvensi Pengembangan)

### Autentikasi & Whitelist (`src/config/auth.ts`)
- **SUPERUSER**:
  - Diizinkan mengakses seluruh data 18 cabang (`assignedLocation: 'ALL'`).
  - Email harus terdaftar di `SUPERUSER_WHITELIST` (contoh: `flakoro10@gmail.com`, `ayudyahp21@gmail.com`).
- **LOCATION_ADMIN**:
  - Hanya diizinkan mengakses cabang yang ditugaskan kepadanya.
  - Email dan kode lokasi harus terdaftar di `LOCATION_ADMIN_WHITELIST` (contoh: `pbmbss2026@gmail.com` -> `PBM`).
- Sesi dan token autentikasi disimpan di `localStorage` (`absensi_session` dan `absensi_auth_token`).

### Persistence & Data Layer (`src/services/attendanceStore.ts` & `api.ts`)
- Data disimpan di `localStorage` dengan key `absensi_kc_sulutgopas_records_v3`.
- Saat pertama kali dibuka tanpa data lokal, aplikasi memuat data dummy dari `generateMockAttendance()`.
- Fitur **Google Sheets Sync** memungkinkan pembaruan data secara real-time dari Google Apps Script Web App API (`DEFAULT_APPS_SCRIPT_URL`).
- Mendukung fitur **CSV Export** dan **CSV Import** sebagai fallback offline.

### Design System M3 (`design-system/DESIGN_SYSTEM_M3_PRO.md`)
- **Warna Utama**: Vibrant Medium Navy (`#1d4ed8`).
- **Extended Status Tonal Containers**:
  - Hadir: Emerald Container (`#d1fae5`) | Text (`#065f46`)
  - Sakit: Sky Container (`#e0f2fe`) | Text (`#075985`)
  - SKD: Indigo Container (`#e0e7ff`) | Text (`#3730a3`)
  - Izin: Amber Container (`#fef3c7`) | Text (`#92400e`)
  - Terlambat: Tangerine Container (`#ffedd5`) | Text (`#9a3412`)
  - Alpa: Crimson Container (`#ffe4e6`) | Text (`#9f1239`)
  - Cuti: Purple Container (`#f3e8ff`) | Text (`#6b21a8`)
  - Off: Slate Container (`#f1f5f9`) | Text (`#334155`)
- **Motion Physics**: Easing `cubic-bezier(0.2, 0.0, 0.0, 1.0)` dengan durasi fast snappy `160ms–180ms`.

---

## 5. Testing & Verification Instructions (Petunjuk Pengujian)

Sebelum mengirimkan (commit/push) perubahan kode:
1. **Type Checking & Build Check**:
   ```bash
   npm run build
   ```
   Pastikan tidak ada error kompilasi TypeScript (`tsc`) maupun Vite build output.
2. **Linting Check**:
   ```bash
   npm run lint
   ```
   Pastikan kode mematuhi aturan Oxlint tanpa error linting.
3. **Apps Script Integration Testing**:
   Jalankan fungsi `testSync()` pada Google Apps Script Editor untuk memverifikasi validitas eksekusi membaca 18 sheet cabang tanpa runtime error.

---

## 6. Deployment & Environment Process (Proses Deployment)

- **Frontend Deployment**:
  - Aplikasi di-deploy ke **Vercel** (`https://absensikcsulutgotengpa.vercel.app`).
  - Konfigurasi `vercel.json` memastikan SPA rewrite berjalan lancar.
  - Alur deployment lengkap terdapat di `docs/deployment/DEPLOYMENT_GUIDE.md`.
- **Google Apps Script API Deployment**:
  - Apps Script di-deploy sebagai Web App (`Execute as: Me`, `Who has access: Anyone`).
  - URL hasil deployment Apps Script dimasukkan pada `DEFAULT_APPS_SCRIPT_URL` di `src/components/GoogleSheetsSyncModal.tsx`.

---

## 7. Agent Skills & Internal Tracking

### Issue Tracker
Isu atau tugas internal dilacak sebagai file markdown di bawah direktori `.scratch/`. Rujukan dokumentasi: `docs/agents/issue-tracker.md`.

### Domain Docs
Dokumentasi domain mengikuti arsitektur single-context repository. Rujukan dokumentasi: `docs/agents/domain.md`.
