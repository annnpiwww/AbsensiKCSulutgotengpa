# Data Tulisan (UI Strings) Project Absensi KC Sulutgopas

Dokumen ini berisi daftar semua teks/string antarmuka pengguna (UI Strings) yang diekstrak dari file-file TypeScript (`.tsx` dan `.ts`) di dalam proyek. Daftar ini dapat digunakan sebagai referensi untuk melakukan perbaikan, standarisasi, atau pelokalan teks pada kode TypeScript.

---

## 1. `src/App.tsx`
* **Breadcrumb & Judul Halaman:**
  * `"Dashboard"` (Baris 231)
  * `"Utama"` (Baris 234)
  * `"Log Kehadiran"` (Baris 235)
  * `"Analisa Lokasi"` (Baris 236)
  * `"Dashboard Utama Presensi"` (Baris 240)
  * `"Log Kehadiran Karyawan"` (Baris 241)
  * `"Analisa Perbandingan Cabang"` (Baris 242)
* **Pusat/Cabang:**
  * `"Semua 18 Cabang (Pusat)"` (Baris 160)
* **Alert/Confirm Dialog:**
  * `"Apakah Anda yakin ingin mengembalikan data ke sampel awal?"` (Baris 187)

---

## 2. `src/components/Sidebar.tsx`
* **Menu Navigasi & Deskripsi:**
  * `"Dashboard Utama"` (Baris 49)
  * `"Ringkasan & KPI Presensi"` (Baris 51)
  * `"Log Kehadiran Karyawan"` (Baris 55)
  * `"Data Presensi Realtime"` (Baris 57)
  * `"Analisa Lokasi Cabang"` (Baris 61)
  * `"Perbandingan 18 Cabang"` (Baris 63)
* **Brand Header:**
  * `"Presensi SulutGo"` (Baris 77)
  * `"Monitoring Enterprise"` (Baris 78)
* **Quick Actions:**
  * `"Catat Presensi Baru"` (Baris 101)
  * `"Sync Sheet"` (Baris 114)
  * `"Export CSV"` (Baris 124)
* **Bagian Navigasi & Profil:**
  * `"Menu Navigasi"` (Baris 132)
  * `"Superuser"` (Baris 175)
  * `"Admin Cabang"` (Baris 175)
  * `"Reset Sampel Data"` (Baris 198)
  * `"Keluar Sesi"` (Baris 206)

---

## 3. `src/components/Navbar.tsx`
* **Brand Header:**
  * `"ABSENSI KC SULUTGOPAS"` (Baris 44)
  * `"v2.4 Live"` (Baris 47)
  * `"Multi-Site Analytics & Google Sheets Sync • 18 Branches"` (Baris 51)
* **Google Sheets Action:**
  * `"Google Sheets Sync"` (Baris 68)
* **Role Switcher / Dropdown:**
  * `"Pratama (Pusat HRD)"` (Baris 78)
  * `"Pusat (Superuser)"` (Baris 90)
  * `"Pusat"` (Baris 91)
  * `"Akses Manajemen Pusat ke semua 18 cabang"` (Baris 87)
  * `"Admin Cabang (TBM)"` (Baris 111)
  * `"TBM"` (Baris 112)
  * `"Akses Admin Terbatas Cabang TBM"` (Baris 108)
* **Quick Actions:**
  * `"Input Absensi"` (Baris 122)
  * `"Export Master CSV Report"` (Baris 129)
  * `"Reset Sample Data"` (Baris 138)

---

## 4. `src/components/LoginPage.tsx`
* **Left Side (Brand Banner):**
  * `"Monitoring Absensi"` (Baris 114)
  * `"KC SulutGo & Tengpa"` (Baris 115)
  * `"Sistem Dashboard Enterprise Kehadiran 18 Cabang"` (Baris 121)
  * `"Kelula log presensi karyawan, pantau keterlambatan, alpa, serta analytics tingkat kepatuhan cabang secara realtime."` (Baris 123)
  * `"Otentikasi Google OAuth 2.0 Single Sign-On (SSO)"` (Baris 132)
  * `"Akses Berbasis Peran (Superuser Pusat & Admin Cabang)"` (Baris 136)
  * `"Analisis & Matriks Kedisiplinan 18 Cabang"` (Baris 140)
* **Right Side (Form):**
  * `"Sign In Aplikasi"` (Baris 149)
  * `"Masuk dengan akun Google terdaftar untuk mengakses dashboard."` (Baris 150)
  * `"Superuser"` (Baris 165)
  * `"Admin Cabang"` (Baris 175)
  * `"Pilih Kantor Cabang:"` (Baris 184)
  * `"Profil Sesi Login"` (Baris 205)
  * `"Menghubungkan ke Akun Google..."` (Baris 221)
  * `"Sign in with Google"` (Baris 244)
  * `"Terproteksi Google Workspace OAuth 2.0"` (Baris 255)

---

## 5. `src/components/AttendanceLogPage.tsx`
* **Header Bento Banner:**
  * `"Database Log Presensi"` (Baris 108)
  * `"Log Kehadiran Karyawan"` (Baris 110)
  * `"Riwayat presensi harian seluruh karyawan terdaftar di 18 Kantor Cabang KC SulutGo & Tengpa."` (Baris 111-112)
  * `"Catat Presensi Baru"` (Baris 122)
* **Filter Toolbar:**
  * `"Cari Nama Karyawan / NBM..."` (Baris 135)
  * `"Semua Status Presensi"` (Baris 150)
  * `"Hadir Tepat Waktu"` (Baris 151)
  * `"Terlambat"` (Baris 152)
  * `"Alpa"` (Baris 153)
  * `"Sakit"` (Baris 154)
  * `"Izin"` (Baris 155)
  * `"Menampilkan **{length}** dari **{total}** total data log."` (Baris 164)
  * `"Urutkan:"` (Baris 168)
  * `"Terbaru (Descending)"` (Baris 175)
  * `"Terlama (Ascending)"` (Baris 176)
* **Tabel Headers & Status:**
  * `"Tanggal"` (Baris 190)
  * `"Nama Karyawan"` (Baris 191)
  * `"Cabang"` (Baris 192)
  * `"Status"` (Baris 193)
  * `"Keterangan / Posisi"` (Baris 194)
  * `"Aksi"` (Baris 195)
  * `"Tidak ada data presensi yang sesuai dengan kriteria pencarian."` (Baris 203)
* **Status Badges:**
  * `"Hadir Tepat Waktu"` (Baris 59)
  * `"Terlambat"` (Baris 66)
  * `"Alpa (Tanpa Keterangan)"` (Baris 73)
  * `"Sakit ({status})"` (Baris 81)
  * `"Izin / Cuti"` (Baris 89)

---

## 6. `src/components/AttendanceTable.tsx`
* **Header Controls:**
  * `"Log Presensi Detail Karyawan"` (Baris 114)
  * `"Menampilkan {filteredRecords.length} dari total {records.length} data presensi"` (Baris 118)
* **Filter Toolbar:**
  * `"Cari nama / NBM..."` (Baris 129)
  * `"Semua Status"` (Baris 150)
  * `"Hadir"` (Baris 151)
  * `"Izin"` (Baris 152)
  * `"Sakit"` (Baris 153)
  * `"SKD (Dokter)"` (Baris 154)
  * `"Terlambat"` (Baris 155)
  * `"Alpa"` (Baris 156)
  * `"Cuti"` (Baris 157)
  * `"Off"` (Baris 158)
  * `"Reset"` (Baris 178)
* **Tabel Headers & Actions:**
  * `"Nama Karyawan"` (Baris 192)
  * `"Cabang"` (Baris 193)
  * `"Tanggal"` (Baris 194)
  * `"Status"` (Baris 195)
  * `"Catatan / Alasan"` (Baris 196)
  * `"Aksi"` (Baris 197)
  * `"Edit"` (Baris 257)
  * `"ReadOnly"` (Baris 260)
  * `"Tidak ditemukan catatan presensi untuk kriteria filter ini."` (Baris 269)
* **Pagination:**
  * `"Halaman {currentPage} dari {totalPages}"` (Baris 280)

---

## 7. `src/components/AddAttendanceModal.tsx`
* **Header:**
  * `"Edit Presensi Karyawan"` (Baris 90)
  * `"Input Absensi Baru"` (Baris 90)
  * `"Simpan & Sinkronkan langsung ke database cabang"` (Baris 93)
* **Form Labels & Placeholders:**
  * `"NBM / NIP"` (Baris 109)
  * `"Nama Lengkap"` (Baris 120)
  * `"Contoh: MAYA KUSUMA"` (Baris 126)
  * `"Kantor Cabang"` (Baris 138)
  * `"Tanggal Presensi"` (Baris 158)
  * `"Status Kehadiran"` (Baris 174)
  * `"Catatan / Keterangan"` (Baris 204)
  * `"Catatan tambahan (opsional)..."` (Baris 209)
* **Form Actions:**
  * `"Batal"` (Baris 222)
  * `"Simpan Perubahan"` (Baris 230)
  * `"Simpan Presensi"` (Baris 230)

---

## 8. `src/components/LocationSelector.tsx`
* **Header & Info:**
  * `"Lokasi Cabang Operational"` (Baris 29)
  * `"18 Unit Cabang"` (Baris 32)
  * `"Pilih cabang spesifik atau mode agregasi pusat"` (Baris 36)
  * `"Terkunci: {location}"` (Baris 46)
* **Dropdown Option:**
  * `"🌐 Semua 18 Kantor Cabang (Aggregated)"` (Baris 58)

---

## 9. `src/components/DateRangePicker.tsx`
* **Presets:**
  * `"Semua Tanggal"` (Baris 49)
  * `"Periode 1 - 25 Juli 2026"` (Baris 50)
  * `"Bulan Ini (Juli 2026)"` (Baris 51)
  * `"Hari Ini"` (Baris 52)
  * `"Kustom: Satu Tanggal"` (Baris 53)
  * `"Kustom: Rentang Tanggal"` (Baris 54)
* **Header & Info:**
  * `"Filter Periode Waktu"` (Baris 68)
  * `"Live Sync Realtime"` (Baris 72)
  * `"Filter data presensi berdasarkan periode terkonfirmasi"` (Baris 76)
  * `"Reset"` (Baris 90)
* **Custom Date Picker Labels:**
  * `"Pilih Tanggal:"` (Baris 118)
  * `"Dari:"` (Baris 132)
  * `"Sampai:"` (Baris 141)
  * `"• Perlu Konfirmasi"` (Baris 155)
  * `"Terapkan Tanggal"` (Baris 168)
* **Active Filter Status Summary:**
  * `"Status Filter:"` (Baris 177)
  * `"Semua Log Presensi"` (Baris 179)
  * `"Periode 1 Juli 2026 - 25 Juli 2026"` (Baris 180)
  * `"Bulan Juli 2026 Full"` (Baris 181)
  * `"Hari Ini"` (Baris 182)
  * `"Tanggal: {date}"` (Baris 183)
  * `"Pilih tanggal & terapkan"` (Baris 183)
  * `"{startDate} s/d {endDate}"` (Baris 184)
  * `"Tentukan tanggal & terapkan"` (Baris 184)

---

## 10. `src/components/GoogleSheetsSyncModal.tsx`
* **Header:**
  * `"Integrasi Google Sheets API (18 Unit Cabang)"` (Baris 47)
  * `"Spreadsheet Target: "` (Baris 50)
* **Status Bar & Sync Actions:**
  * `"Google Sheets Realtime Synchronizer Active"` (Baris 73)
  * `"Terakhir diperbarui: "` (Baris 76)
  * `"Buka Sheet"` (Baris 89)
  * `"Sync 18 Sheet"` (Baris 98)
  * `"Memproses..."` (Baris 98)
* **Cabang List Grid:**
  * `"Daftar Tab Sheet Per Cabang (18 Sheet Active)"` (Baris 106)
  * `"Logs"` (Baris 124)
* **Backup CSV Actions:**
  * `"Offline / Backup Export:"` (Baris 134-135)
  * `"Export Master CSV"` (Baris 142)

---

## 11. `src/components/LocationAnalyticsPage.tsx`
* **Header Bento Hero:**
  * `"Executive Analytics Dashboard"` (Baris 104)
  * `"Analisa Kinerja 18 Cabang"` (Baris 106)
  * `"Evaluasi kepatuhan presensi, tingkat keterlambatan, dan risiko alpa di seluruh unit cabang KC SulutGo & Tengpa."` (Baris 107)
* **Top Insights Bento Cards:**
  * `"Cabang Terdisiplin"` (Baris 119)
  * `"Tingkat Kehadiran: "` (Baris 126)
  * `"Hadir: ... | Terlambat: ..."` (Baris 130)
  * `"Keterlambatan Tinggi"` (Baris 138)
  * `"Terlambat: **{total}** Log"` (Baris 144)
  * `"Rasio Terlambat: **{percentage}**% dari total log."` (Baris 147)
  * `"Risiko Alpa Tinggi"` (Baris 155)
  * `"Total Alpa: **{alpa}** Kejadian"` (Baris 161)
  * `"Rasio Alpa: **{percentage}**% dari total log."` (Baris 164)
* **Perfect Attendance Banner:**
  * `"Bebas Terlambat & Alpa:"` (Baris 174)
* **Matrix Table:**
  * `"Matriks Kepatuhan 18 Kantor Cabang"` (Baris 186)
  * `"Nama Kantor Cabang"` (Baris 195)
  * `"Total Log"` (Baris 196)
  * `"Hadir"` (Baris 197)
  * `"Terlambat"` (Baris 198)
  * `"Alpa"` (Baris 199)
  * `"Sakit"` (Baris 200)
  * `"Izin"` (Baris 201)
  * `"Tingkat Kehadiran"` (Baris 202)

---

## 12. `src/components/ExceptionTrackers.tsx`
* **Header:**
  * `"Tracker Absensi Khusus & Pengecualian"` (Baris 29)
  * `"Pemantauan ketidakhadiran berulang untuk verifikasi HRD & Supervisor"` (Baris 32)
* **Tab Buttons:**
  * `"Alpa ({count})"` (Baris 47)
  * `"Sakit ({count})"` (Baris 59)
  * `"Izin ({count})"` (Baris 71)
* **Tab 1 - Alpa Tracker:**
  * `"⚠️ Perhatian: Catatan Alpa memerlukan konfirmasi langsung dari Supervisor Cabang."` (Baris 82)
  * `"High Priority"` (Baris 83)
  * `"Nama Karyawan"` (Baris 91)
  * `"Cabang"` (Baris 92)
  * `"Tanggal Alpa"` (Baris 93)
  * `"Frekuensi Total"` (Baris 94)
  * `"Keterangan"` (Baris 95)
  * `"Tindakan HR"` (Baris 96)
  * `"{freq}x Alpa"` (Baris 114)
  * `"Tanpa Keterangan"` (Baris 117)
  * `"Kontak Cabang"` (Baris 124)
  * `"Nihil Alpa: Seluruh karyawan di lokasi ini terverifikasi hadir atau izin resmi."` (Baris 137)
* **Tab 2 - Sakit Tracker:**
  * `"Karyawan"` (Baris 151)
  * `"Cabang"` (Baris 152)
  * `"Tanggal Sakit"` (Baris 153)
  * `"Diagnosa / Catatan"` (Baris 154)
  * `"Status Berkas"` (Baris 155)
  * `"Surat Terverifikasi"` (Baris 167)
  * `"Tidak ada catatan sakit pada periode waktu ini."` (Baris 178)
* **Tab 3 - Izin Tracker:**
  * `"Karyawan"` (Baris 192)
  * `"Cabang"` (Baris 193)
  * `"Tanggal Izin"` (Baris 194)
  * `"Keperluan Izin"` (Baris 195)
  * `"Approval"` (Baris 196)
  * `"Disetujui Head"` (Baris 209)
  * `"Tidak ada permohonan izin pada periode waktu ini."` (Baris 219)

---

## 13. `src/components/AttendanceCharts.tsx`
* **Donut Chart (Status):**
  * `"Distribusi Status Presensi"` (Baris 82)
  * `"Persentase agregat presensi"` (Baris 84)
  * `"Logs"` (Baris 87)
* **Line Chart (Trend):**
  * `"Tren Kehadiran Harian"` (Baris 140)
  * `"Pergerakan 10 tanggal terakhir"` (Baris 142)
* **Bar Chart (Comparison):**
  * `"Komparasi Cabang"` (Baris 175)
  * `"Ringkasan per lokasi cabang"` (Baris 177)

---

## 14. `src/components/KpiSummaryCards.tsx`
* **Executive Summary Card:**
  * `"Ringkasan Eksekutif Presensi"` (Baris 56)
  * `"Tingkat Kehadiran Akumulatif"` (Baris 65)
  * `"Target >90%"` (Baris 72)
  * `"Status Kehadiran ({hadir} / {total} Log)"` (Baris 80)
  * `"{totalEmployees} Karyawan"` (Baris 98)
  * `"tercatat di cabang"` (Baris 99)
  * `"Realtime updates"` (Baris 103)
* **Hadir Card:**
  * `"Hadir Tepat Waktu"` (Baris 112)
  * `"Presensi Terverifikasi Sesuai Jam"` (Baris 129)
* **Sakit Card:**
  * `"Izin Sakit"` (Baris 138)
  * `"Surat Keterangan Dokter / Mandiri"` (Baris 155)
* **Izin Card:**
  * `"Permohonan Izin"` (Baris 164)
  * `"Keperluan Dinas / Pribadi Resmi"` (Baris 181)
* **Alpa Card:**
  * `"Ketidakhadiran Alpa"` (Baris 192)
  * `"Perlu Tindak Lanjut HRD"` (Baris 213)
  * `"Tidak Ada Alpa"` (Baris 213)

---

## 15. `src/types/attendance.ts`
* **Daftar Nama Detil Cabang (LOCATION_NAMES):**
  * `TBM: 'TBM - Toko Bintang Manado'` (Baris 32)
  * `NBM: 'NBM - New Bendar Manado'` (Baris 33)
  * `PBM: 'PBM - Pasar Bersehati Manado'` (Baris 34)
  * `PKM: 'PKM - Pasar Kalimas Manado'` (Baris 35)
  * `PPM: 'PPM - Pesar Karombasan Manado'` (Baris 36)
  * `MPP: 'MPP - Mall Pelayanan Publik '` (Baris 37)
  * `MGKB: 'MGKB - Mie Gacoan Kotamobagu'` (Baris 38)
  * `MGAM: 'MGAM - Mie Gacoan AA Maramis'` (Baris 39)
  * `MGMM: 'MGMM - Mie Gacoan AirMadidi'` (Baris 40)
  * `MGNW: 'MGNW - Mie Gacoan Nani Wartabone'` (Baris 41)
  * `MGTO: 'MGTO - Mie Gacoan Tomohon'` (Baris 42)
  * `MGGJ: 'MGGJ - Mie Gacoan Gorontalo Jhon'` (Baris 43)
  * `MGBP: 'MGBP - Mie Gacoan Bitung Palar'` (Baris 44)
  * `MGLG: 'MGLG - Mie Gacoan Limboto GOrontalo'` (Baris 45)
  * `MGMP: 'MGMP - Mie Gacoan Mangaraja Palu'` (Baris 46)
  * `MGMK: 'MGMK - Mie Gacoan Mimika'` (Baris 47)
  * `MGJY: 'MGJY - Mie Gacoan Jayapura'` (Baris 48)
  * `MGNS: 'MGNS - Mie Gacoan Sorong'` (Baris 49)

---

## 16. `src/services/attendanceStore.ts`
* **Default Sessions:**
  * `"Superuser BSS Recruitment"` (Baris 150)
  * `"Admin Cabang TBM"` (Baris 157)
