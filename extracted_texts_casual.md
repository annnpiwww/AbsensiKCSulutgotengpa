ex# Rekomendasi UI Copy (Casual & Usia 20-30 Tahun)

Dokumen ini merangkum usulan perubahan kalimat dari formal menjadi lebih kasual, santai, dan modern (ala startup/aplikasi masa kini seperti Gojek, Notion, atau Slack) untuk target pengguna usia 20–30 tahun.

---

## 1. `src/App.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 234 | `Utama` | `Beranda` / `Home` | Lebih umum di kalangan pengguna muda dibanding "Utama". |
| Baris 240 | `Dashboard Utama Presensi` | `Pantau Kehadiran Karyawan` | Menghindari kata "Dashboard Utama" yang terlalu kaku. |
| Baris 242 | `Analisa Perbandingan Cabang` | `Bandingkan Tiap Cabang` | Lebih aktif dan langsung ke intinya. |
| Baris 187 | `Apakah Anda yakin ingin mengembalikan data ke sampel awal?` | `Yakin mau reset data ke sampel awal?` | Bahasa percakapan santai tapi tetap jelas. |

---

## 2. `src/components/Sidebar.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 49 | `Dashboard Utama` | `Rangkuman Absen` | Lebih deskriptif untuk anak muda. |
| Baris 55 | `Log Kehadiran Karyawan` | `Riwayat Absensi` / `Log Absen` | Istilah "Log Absen" atau "Riwayat Absensi" terdengar lebih modern. |
| Baris 61 | `Analisa Lokasi Cabang` | `Analisis Cabang` | Lebih singkat dan padat. |
| Baris 77–78 | `Presensi SulutGo` <br> `Monitoring Enterprise` | `SulutGo Presensi` <br> `Pantau Kehadiran` | Lebih minimalis. |
| Baris 101 | `Catat Presensi Baru` | `Input Absen Baru` / `Isi Absen` | Generasi Z/Milenial lebih familiar dengan istilah "absen/absen baru". |
| Baris 114 | `Sync Sheet` | `Sync ke Sheet` | Menjelaskan arah integrasi dengan lebih jelas. |
| Baris 198 | `Reset Sampel Data` | `Reset ke Data Sampel` | Mengurangi kesan kaku. |
| Baris 206 | `Keluar Sesi` | `Keluar` / `Logout` | Istilah "Logout" jauh lebih lumrah dibanding "Keluar Sesi". |

---

## 3. `src/components/Navbar.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 51 | `Multi-Site Analytics & Google Sheets Sync • 18 Branches` | `Analisis Multi-Cabang & Sync Google Sheets • 18 Cabang` | Mengubah "Branches" ke "Cabang" agar konsisten semi-Inggris yang umum. |
| Baris 68 | `Google Sheets Sync` | `Hubungkan Ke Google Sheets` | Terasa seperti sebuah aksi (call-to-action). |
| Baris 90 | `Pusat (Superuser)` | `Akses Pusat (Superuser)` | Lebih jelas status kewenangannya. |
| Baris 122 | `Input Absensi` | `Tambah Absen` | Lebih ringkas. |
| Baris 129 | `Export Master CSV Report` | `Unduh Laporan CSV` | "Unduh" atau "Download" terasa lebih bersahabat dibanding "Export". |

---

## 4. `src/components/LoginPage.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 121 | `Sistem Dashboard Enterprise Kehadiran 18 Cabang` | `Pantau Absensi 18 Cabang Secara Realtime` | Menghilangkan kata "Sistem Dashboard Enterprise" yang terlampau formal. |
| Baris 123 | `Kelola log presensi karyawan, pantau keterlambatan, alpa, serta analytics tingkat kepatuhan cabang secara realtime.` | `Kelola riwayat absen, cek yang telat atau alpa, dan pantau kedisiplinan tiap cabang secara langsung.` | Tone lebih bersahabat dan mudah dicerna. |
| Baris 149 | `Sign In Aplikasi` | `Yuk, Masuk!` / `Log In ke Aplikasi` | Kata "Yuk, Masuk!" memberikan kesan menyambut yang baik. |
| Baris 150 | `Masuk dengan akun Google terdaftar untuk mengakses dashboard.` | `Masuk pakai akun Google terdaftar untuk akses statistik absensi.` | "pakai" menggantikan "dengan", "statistik" menggantikan "dashboard". |oke 
| Baris 184 | `Pilih Kantor Cabang:` | `Pilih Cabangmu:` | Menggunakan kata "-mu" terasa lebih personal. |
| Baris 205 | `Profil Sesi Login` | `Info Akun Login` | Lebih mudah dipahami. |
| Baris 221 | `Menghubungkan ke Akun Google...` | `Menghubungkan ke Google...` | Lebih cepat terbaca. |

---

## 5. `src/components/AttendanceLogPage.tsx` & `AttendanceTable.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Log - Baris 111-112 | `Riwayat presensi harian seluruh karyawan terdaftar di 18 Kantor Cabang KC SulutGo & Tengpa.` | `Daftar lengkap riwayat absen harian karyawan dari 18 cabang KC SulutGo & Tengpa.` | Lebih ringkas. |
| Log - Baris 135 | `Cari Nama Karyawan / NBM...` | `Cari nama atau NIP/NBM...` | Huruf kecil pada penghubung membuat lebih bersahabat. |
| Log - Baris 150 | `Semua Status Presensi` | `Semua Status Absen` | Lebih konsisten dengan kata "Absen". |
| Log - Baris 164 | `Menampilkan {length} dari {total} total data log.` | `Menampilkan {length} dari total {total} riwayat.` | "Riwayat" lebih familier dibanding "data log". |
| Log - Baris 175-176 | `Terbaru (Descending)` <br> `Terlama (Ascending)` | `Paling Baru` <br> `Paling Lama` | Menghilangkan istilah teknis database (Asc/Desc) yang belum tentu dipahami semua user. |
| Log - Baris 203 | `Tidak ada data presensi yang sesuai dengan kriteria pencarian.` | `Data absen yang kamu cari nggak ditemukan.` | Menggunakan bahasa kasual "kamu" dan "nggak". |
| Table - Baris 118 | `Menampilkan {filteredRecords.length} dari total {records.length} data presensi` | `Menampilkan {filteredRecords.length} dari {records.length} data absen` | Lebih sederhana. |
| Table - Baris 269 | `Tidak ditemukan catatan presensi untuk kriteria filter ini.` | `Nggak ada riwayat absen yang cocok dengan filter.` | Kasual dan mudah dimengerti. |

---

## 6. `src/components/AddAttendanceModal.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 93 | `Simpan & Sinkronkan langsung ke database cabang` | `Data otomatis sinkron ke database cabang` | Lebih informatif dan menenangkan. |
| Baris 126 | `Contoh: MAYA KUSUMA` | `misal: Maya Kusuma` | "misal" lebih santai daripada "Contoh" dan penggunaan huruf kecil/besar yang normal. |
| Baris 209 | `Catatan tambahan (opsional)...` | `Ada catatan tambahan? (opsional)` | Menggunakan kalimat tanya membuat form terasa interaktif. |

---

## 7. `src/components/LocationSelector.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 36 | `Pilih cabang spesifik atau mode agregasi pusat` | `Pilih cabang tertentu atau lihat data gabungan` | Istilah "agregasi pusat" terlalu akademis/teknis. "Data gabungan" jauh lebih jelas. |
| Baris 46 | `Terkunci: {location}` | `Hanya Akses Cabang: {location}` | "Terkunci" bisa berkonotasi error/negatif, opsi baru memperjelas batas hak akses. |
| Baris 58 | `🌐 Semua 18 Kantor Cabang (Aggregated)` | `🌐 Semua 18 Cabang (Gabungan)` | Lebih sederhana dibanding kata "Aggregated". |

---

## 8. `src/components/DateRangePicker.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 76 | `Filter data presensi berdasarkan periode terkonfirmasi` | `Filter berdasarkan tanggal konfirmasi` | Lebih ringkas. |
| Baris 155 | `• Perlu Konfirmasi` | `• Klik Terapkan dulu` | Mengingatkan user untuk menekan tombol aksi secara bersahabat. |
| Baris 168 | `Terapkan Tanggal` | `Pasang Filter` / `Terapkan` | Lebih singkat. |

---

## 9. `src/components/LocationAnalyticsPage.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 107 | `Evaluasi kepatuhan presensi, tingkat keterlambatan, dan risiko alpa di seluruh unit cabang KC SulutGo & Tengpa.` | `Pantau tingkat kehadiran, keterlambatan, dan riwayat alpa karyawan di 18 cabang KC SulutGo & Tengpa.` | Mengganti kata berat "Kepatuhan presensi" dengan "Kehadiran". |
| Baris 119 | `Cabang Terdisiplin` | `Cabang Paling Rajin` / `Paling Disiplin` | "Paling Rajin" terdengar sangat segar dan mengapresiasi. |
| Baris 138 | `Keterlambatan Tinggi` | `Paling Sering Telat` | Menyingkirkan kata formal "Keterlambatan Tinggi". |
| Baris 155 | `Risiko Alpa Tinggi` | `Alpa Terbanyak` / `Sering Alpa` | Lebih lugas dan mudah dipahami dalam sekali lirik. |
| Baris 174 | `Bebas Terlambat & Alpa:` | `Mantap! Bebas Telat & Alpa` | Menambahkan ekspresi "Mantap!" khas anak muda untuk pencapaian positif. |

---

## 10. `src/components/ExceptionTrackers.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 29 | `Tracker Absensi Khusus & Pengecualian` | `Pemantauan Khusus (Alpa / Sakit / Izin)` | Menghilangkan kata teknis "Exception Tracker/Pengecualian". |
| Baris 32 | `Pemantauan ketidakhadiran berulang untuk verifikasi HRD & Supervisor` | `Cek karyawan yang sering absen untuk keperluan follow-up HRD.` | Kalimat lebih mengalir dan kasual. |
| Baris 82 | `⚠️ Perhatian: Catatan Alpa memerlukan konfirmasi langsung dari Supervisor Cabang.` | `⚠️ Warning: Data alpa harus dikonfirmasi langsung oleh Supervisor Cabang.` | Menggunakan "Warning:" yang umum di UI modern. |
| Baris 137 | `Nihil Alpa: Seluruh karyawan di lokasi ini terverifikasi hadir atau izin resmi.` | `Keren! Nggak ada yang alpa hari ini.` | Sangat kasual, menggunakan "Keren!" untuk status nihil alpa. |
| Baris 167 | `Surat Terverifikasi` | `Surat Dokter OK` | Istiliah "Surat Dokter OK" atau "Berkas Lengkap" terasa sangat modern. |
| Baris 209 | `Disetujui Head` | `Izin Disetujui` | Lebih praktis. |

---

## 11. `src/components/KpiSummaryCards.tsx`

| Lokasi / File | Teks Formal (Sebelumnya) | Usulan Teks Kasual (Rekomendasi) | Penjelasan / Tone |
| :--- | :--- | :--- | :--- |
| Baris 56 | `Ringkasan Eksekutif Presensi` | `Overview Kehadiran` / `Rangkuman Absen` | Mengurangi kata formal "Eksekutif". |
| Baris 65 | `Tingkat Kehadiran Akumulatif` | `Tingkat Kehadiran` | Lebih simpel. |
| Baris 72 | `Target >90%` | `Target Min. 90%` | Menuliskan "Min." mempermudah pemahaman simbol matematika `>`. |
| Baris 129 | `Presensi Terverifikasi Sesuai Jam` | `Hadir Sesuai Jadwal` | Lebih manusiawi dibanding "Presensi Terverifikasi". |
| Baris 155 | `Surat Keterangan Dokter / Mandiri` | `Ada Surat Dokter / Izin Mandiri` | Lebih lugas. |
| Baris 181 | `Keperluan Dinas / Pribadi Resmi` | `Ada Tugas Dinas atau Izin Resmi` | Menjelaskan "Keperluan" menjadi "Ada Tugas...". |
| Baris 213 | `Perlu Tindak Lanjut HRD` | `Butuh Follow-up HRD` | Menggunakan "Follow-up" yang sangat akrab di telinga pekerja muda Indonesia. |
