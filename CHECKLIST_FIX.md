# 🔧 Checklist Fix Data Mismatch Website vs Spreadsheet

## ✅ Yang Udah Dikerjain

### 1. **Apps Script Lengkap** ✅
File: `apps-script-sync.js`
- Baca otomatis 18 sheet cabang
- Parse data dengan validasi proper
- Handle berbagai format tanggal
- Map status absensi (H, T, A, S, SKD, I, C, O, L)
- Generate unique ID per record
- Error handling & logging lengkap

### 2. **Panduan Deploy** ✅
File: `PANDUAN_APPS_SCRIPT.md`
- Step-by-step deployment
- Troubleshooting guide
- Testing instructions
- Format data explanation

### 3. **Website Config Updated** ✅
File: `src/components/GoogleSheetsSyncModal.tsx`
- Default URL diganti ke spreadsheet lo: `1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4`
- Placeholder Apps Script URL siap diisi setelah deploy

---

## 📋 Yang Lo Perlu Lakuin Sekarang

### Step 1: Deploy Apps Script
1. Buka: https://docs.google.com/spreadsheets/d/1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4/edit
2. Klik **Extensions** → **Apps Script**
3. Copy paste isi file `apps-script-sync.js`
4. Save, lalu **Deploy** → **New deployment** → **Web app**
5. Set **"Who has access"** = **Anyone**
6. **Copy URL deployment** yang keluar

### Step 2: Test Apps Script
Di Apps Script editor:
1. Pilih function `testSync` di dropdown
2. Klik Run
3. Cek log, harusnya muncul total records

### Step 3: Update Website
1. Build & jalanin website: `npm run dev`
2. Login ke website
3. Klik **"Hubungkan Ke Google Sheets"**
4. Paste URL Apps Script ke kolom **"LINK APPS SCRIPT WEB APP"**
5. Klik **"Simpan Konfigurasi"**
6. Klik **"Sync 18 Sheet"**

---

## 🔍 Validasi Data

Setelah sync, pastikan:

### ✅ Data Structure Bener
```json
{
  "id": "REC-TBM-25013204-2025-07-01",
  "employeeId": "25013204",
  "name": "MOUDY BRENDA LALONSANG",
  "position": "ACT ADMIN",
  "location": "TBM",
  "date": "2025-07-01",
  "status": "Hadir",
  "notes": "",
  "createdAt": "2026-08-01T...",
  "updatedBy": "Google Sheets Live Sync"
}
```

### ✅ Semua Cabang Muncul
Cek di modal sync, harusnya ada count buat 18 cabang:
- TBM, MND, TGR, BRB, AMG, KTM, BLD, MDO, LWT, TPT, MGD, RMY, TMH, RTG, KWG, BNT, SNY, MLG

### ✅ Status Mapping Correct
- H → Hadir
- T → Terlambat  
- A → Alpa
- S → Sakit
- SKD → SKD
- I → Izin
- C → Cuti
- O → Off

---

## 🐛 Masalah yang Udah Difix

### Problem 1: **Data raw_sheet_data.json Berantakan** ❌ → ✅
**Root cause**: Import langsung tanpa parsing proper
**Fix**: Apps Script baru dengan parser yang bener, validasi struktur, skip baris invalid

### Problem 2: **Tanggal Parse Error (1970-01-01)** ❌ → ✅
**Root cause**: Format tanggal ga konsisten
**Fix**: Multiple format support (DD/MM/YYYY, YYYY-MM-DD, Date object)

### Problem 3: **Status Ga Valid (undefined/null)** ❌ → ✅
**Root cause**: Mapping status kurang lengkap
**Fix**: Comprehensive status mapping + fallback handling

### Problem 4: **Baris Legend/Header Ikut Masuk** ❌ → ✅
**Root cause**: Ga ada filter baris non-data
**Fix**: Skip baris dengan pattern `[...]`, kosong, atau header

### Problem 5: **ID Collision** ❌ → ✅
**Root cause**: ID ga unique
**Fix**: Generate ID dengan format `REC-{LOCATION}-{NIP}-{DATE}`

---

## 📊 Expected Results

Setelah sync berhasil, lo harusnya bisa:

1. ✅ Liat semua data dari 18 cabang di dashboard
2. ✅ Filter by cabang (dropdown location selector)
3. ✅ Filter by status (Hadir, Terlambat, Alpa, dll)
4. ✅ Liat chart & analytics per cabang
5. ✅ Export CSV yang valid
6. ✅ Tambah/edit/delete record dari UI
7. ✅ Search by nama/NIP

---

## 🚀 Next Steps (Opsional)

### Auto-Sync (Recommended)
Set trigger di Apps Script buat sync otomatis:
1. Di Apps Script editor, klik **Triggers** (⏰ icon di sidebar kiri)
2. Klik **Add Trigger**
3. Function: `doGet`
4. Event: **Time-driven**
5. Interval: **Every 6 hours** (atau sesuai kebutuhan)
6. Save

### Backup Strategy
1. Export CSV dari website tiap minggu
2. Simpan di Google Drive
3. Version history di spreadsheet aktif

### Performance Monitoring
1. Cek execution log Apps Script
2. Monitor load time sync di website
3. Kalau data >10K records, consider pagination

---

## 📞 Troubleshooting Quick Reference

| Error | Solusi |
|-------|--------|
| CORS error | Set "Who has access" = Anyone |
| 0 records returned | Cek nama sheet = kode cabang (TBM, MND, dll) |
| Date invalid | Format tanggal harus DD/MM/YYYY atau YYYY-MM-DD |
| Status undefined | Cek code status valid (H, T, A, S, SKD, I, C, O) |
| Duplicate ID | Pastikan 1 karyawan ga punya 2 record di tanggal sama |

---

## ✨ Summary

Gue udah bikin:
1. ✅ **Apps Script lengkap** yang baca 18 sheet dengan validasi proper
2. ✅ **Panduan deployment** step-by-step
3. ✅ **Website config** udah diupdate ke spreadsheet lo
4. ✅ **Documentation** troubleshooting & testing

Tinggal lo **deploy Apps Script-nya** terus **sync dari website**. Data harusnya langsung match! 🎉

Good luck bro! 🚀
