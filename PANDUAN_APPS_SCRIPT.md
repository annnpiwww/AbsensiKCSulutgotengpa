# 📋 Panduan Deploy Google Apps Script - Sinkronisasi Data Absensi

## 🎯 Tujuan
Script ini akan **otomatis membaca data dari 18 sheet** di spreadsheet lo dan mengubahnya jadi format JSON yang valid buat website.

---

## 🚀 Cara Deploy (Step-by-Step)

### Step 1: Buka Google Apps Script Editor

1. Buka spreadsheet lo: https://docs.google.com/spreadsheets/d/1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4/edit
2. Klik menu **Extensions** → **Apps Script**
3. Bakal kebuka tab baru dengan editor script

### Step 2: Copy Script

1. Di editor Apps Script, hapus semua code yang ada (default `function myFunction()`)
2. Copy **SEMUA ISI** file `apps-script-sync.js` yang udah gue bikin
3. Paste ke editor Apps Script
4. Klik **Save** (💾 icon atau Ctrl+S)
5. Kasih nama project, misalnya: **"Absensi Sync API"**

### Step 3: Deploy sebagai Web App

1. Klik tombol **Deploy** (di kanan atas) → pilih **New deployment**
2. Klik icon ⚙️ (gear) di sebelah "Select type"
3. Pilih **Web app**
4. Isi konfigurasi:
   - **Description**: `API Sync 18 Cabang v1`
   - **Execute as**: `Me (email-lo@gmail.com)`
   - **Who has access**: `Anyone` ← **PENTING!**
5. Klik **Deploy**
6. Authorize: Klik **Authorize access** → pilih akun Google lo → klik **Allow**
7. **COPY URL yang muncul!** Format: `https://script.google.com/macros/s/AKfycby.../exec`

### Step 4: Update Website

1. Buka website absensi lo
2. Klik tombol **"Hubungkan Ke Google Sheets"**
3. Paste **URL Apps Script** yang lo copy tadi ke kolom **"LINK APPS SCRIPT WEB APP"**
4. Klik **"Simpan Konfigurasi"**
5. Klik **"Sync 18 Sheet"** buat test sync

---

## ✅ Struktur Data yang Dibaca

Script ini akan membaca spreadsheet dengan struktur:

```
Sheet Name: TBM (atau 17 cabang lainnya)

Row 1:  | NO | NIP        | NAMA              | JAB | TGL MASUK | <tanggal headers>
Row 2:  | 1  | 25013204   | MOUDY BRENDA      | ACT | 10/01/25  | 01/07  | 02/07 | 03/07 | ...
Row 3:  | 2  | 23091501   | OTRISIA KARTIKA   | SPP | 13/09/23  | H      | H     | T     | ...
Row 4:  | 3  | 25041574   | FADILAH PULUBUHU  | SPP | 13/04/25  | H      | S     | H     | ...
```

### Kolom yang Dibaca:
- **Kolom B (index 1)**: NIP/NBM Karyawan
- **Kolom C (index 2)**: Nama Lengkap
- **Kolom D (index 3)**: Jabatan/Posisi
- **Kolom F dst (index 5+)**: Status absensi per tanggal

### Status yang Valid:
- `H` → Hadir
- `T` → Terlambat
- `A` → Alpa
- `S` → Sakit
- `SKD` → Surat Keterangan Dokter
- `I` → Izin
- `C` → Cuti
- `O` → Off
- `L` → Lembur

---

## 🔍 Testing & Debugging

### Test di Apps Script Editor:

1. Pilih function **`testSync`** di dropdown (di toolbar atas)
2. Klik **Run** (▶️ icon)
3. Cek output di **Execution log** (bawah)
4. Harusnya muncul: `Total records: XXX`

### Generate Summary Report:

1. Pilih function **`generateSummaryReport`**
2. Klik **Run**
3. Lihat breakdown per cabang & status di log

### Test via Browser:

1. Copy URL deployment lo
2. Paste di browser (Chrome/Firefox)
3. Harusnya download file JSON atau tampil data JSON
4. Cek apakah structure-nya valid:
```json
[
  {
    "id": "REC-TBM-25013204-2025-07-01",
    "employeeId": "25013204",
    "name": "MOUDY BRENDA LALONSANG",
    "position": "ACT ADMIN",
    "location": "TBM",
    "date": "2025-07-01",
    "status": "Hadir",
    "notes": "",
    "createdAt": "2026-08-01T10:29:42.049Z",
    "updatedBy": "Google Sheets Live Sync"
  }
]
```

---

## 🐛 Troubleshooting

### Problem 1: "Authorization required"
**Solusi**: 
- Re-deploy script
- Pilih **Manage deployments** → Edit → Save as new version
- Authorize ulang

### Problem 2: Data kosong / 0 records
**Cek**:
1. Nama sheet sesuai kode cabang? (TBM, MND, TGR, dll)
2. Format tanggal di header row 2 bener?
3. Ada data di row 3 dst?
4. Jalanin `testSync()` di editor buat liat error log

### Problem 3: CORS error di website
**Solusi**:
- Pastikan deployment setting "Who has access" = **Anyone**
- Bukan "Only myself"
- Re-deploy dengan setting yang bener

### Problem 4: Tanggal salah parse
**Cek format tanggal di spreadsheet**:
- Format valid: `DD/MM/YYYY`, `YYYY-MM-DD`, atau Date object
- Jangan pake format custom yang aneh

### Problem 5: Status tidak muncul
**Cek kode status di cell**:
- Harus exact match: `H`, `T`, `A`, `S`, dll
- Huruf besar/kecil OK (script auto-convert uppercase)
- Ga boleh ada spasi extra

---

## 📊 Output Format

Setiap record yang dihasilkan punya structure:

```typescript
{
  id: string;              // Unique ID: "REC-{LOCATION}-{NIP}-{DATE}"
  employeeId: string;      // NIP/NBM karyawan
  name: string;            // Nama lengkap
  position: string;        // Jabatan
  location: LocationCode;  // Kode cabang (TBM, MND, dll)
  date: string;            // Format: YYYY-MM-DD
  status: AttendanceStatus;// Hadir, Terlambat, Alpa, dll
  notes: string;           // Catatan tambahan
  createdAt: string;       // ISO timestamp
  updatedBy: string;       // "Google Sheets Live Sync"
}
```

---

## 🔄 Update Script (Kalau Ada Perubahan)

1. Edit file di Apps Script editor
2. Save (Ctrl+S)
3. Klik **Deploy** → **Manage deployments**
4. Klik **Edit** (✏️ icon) pada deployment yang aktif
5. Ubah **Version** jadi **New version**
6. Klik **Deploy**
7. **URL tetap sama**, ga perlu update di website

---

## 🎯 18 Cabang yang Didukung

Script ini otomatis baca semua sheet dengan nama:

1. **TBM** - Toko Bintang Manado
2. **NBM** - New Bendar Manado
3. **PBM** - Pasar Bersehati Manado
4. **PKM** - Pasar Kalimas Manado
5. **PPM** - Pesar Karombasan Manado
6. **MPP** - Mall Pelayanan Publik
7. **MGKB** - Mie Gacoan Kotamobagu
8. **MGAM** - Mie Gacoan AA Maramis
9. **MGMM** - Mie Gacoan AirMadidi
10. **MGNW** - Mie Gacoan Nani Wartabone
11. **MGTO** - Mie Gacoan Tomohon
12. **MGGJ** - Mie Gacoan Gorontalo Jhon
13. **MGBP** - Mie Gacoan Bitung Palar
14. **MGLG** - Mie Gacoan Limboto GOrontalo
15. **MGMP** - Mie Gacoan Mangaraja Palu
16. **MGMK** - Mie Gacoan Mimika
17. **MGJY** - Mie Gacoan Jayapura
18. **MGNS** - Mie Gacoan Sorong

**Kalau ada sheet yang ga ketemu**, script akan skip dan log warning (ga bakal error).

---

## 💡 Tips Optimasi

1. **Jangan terlalu sering sync** - Data ga perlu real-time banget, sync 1-2x per hari cukup
2. **Pake auto-sync** - Set trigger di Apps Script buat auto-run tiap 6 jam
3. **Monitor performance** - Cek execution log kalau sync jadi lambat
4. **Backup data** - Export CSV dari website secara berkala

---

## 📞 Support

Kalau ada masalah:
1. Cek **Execution log** di Apps Script editor
2. Jalanin `testSync()` buat debug
3. Pastikan structure spreadsheet sesuai format di atas

Good luck bro! 🚀
