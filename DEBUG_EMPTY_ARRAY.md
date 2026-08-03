# 🐛 Debug: Apps Script Return Empty Array

## ❌ Problem
Apps Script URL: `https://script.google.com/macros/s/AKfycbwlpJ2BUTKa_BRYqxEaXTVLVyfYl5A46_PrCGZs3CAkqeNCI4VAf9mbvE1vwdy4BOwB/exec`

Response: `[]` (empty array)

## 🔍 Kemungkinan Penyebab:

### 1. **Nama Sheet Ga Sesuai Kode Lokasi** ⚠️
Apps Script cari sheet dengan nama exact:
```
TBM, NBM, PBM, PKM, PPM, MPP, MGKB, MGAM, MGMM, MGNW, MGTO, MGGJ, MGBP, MGLG, MGMP, MGMK, MGJY, MGNS
```

**Cek di Spreadsheet:**
- Tab sheet-nya harus nama persis kayak di atas
- Case sensitive (huruf besar semua)
- Ga boleh ada spasi

### 2. **Data di Sheet Belum Ada / Format Salah** ⚠️
Apps Script expect struktur:
```
Row 1: | NO | NIP | NAMA | JAB | TGL MASUK | <tanggal headers>
Row 2: | 1  | 123 | Name | Pos | 01/01/25  | 01/07 | 02/07 | ...
Row 3: | 2  | 456 | Name | Pos | 02/01/25  | H     | T     | ...
```

**Minimum requirement:**
- Ada minimal 3 baris (header + 1 data)
- Kolom B (index 1) = NIP
- Kolom C (index 2) = Nama
- Kolom D (index 3) = Jabatan
- Kolom F dst (index 5+) = Status absensi

### 3. **Execution Log Error** ⚠️
Script mungkin error tapi ga keliatan.

**Cara Cek:**
1. Buka Apps Script Editor
2. Klik **Executions** (⏱️ icon di sidebar kiri)
3. Cek execution terakhir, ada error ga?

---

## ✅ Solusi Step-by-Step:

### Step 1: Cek Nama Sheet
1. Buka: https://docs.google.com/spreadsheets/d/1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4/edit
2. Liat tab di bawah, namanya apa?
3. Harus exact match: `TBM`, `NBM`, `PBM`, dll
4. Kalau nama sheet beda (misal: "Sheet1", "TBM - Tomohon", dll), rename jadi code aja: `TBM`

### Step 2: Test Manual di Apps Script Editor
1. Di Apps Script Editor, pilih function **`testSync`** di dropdown
2. Klik **Run** ▶️
3. Cek **Execution log** di bawah
4. Harusnya muncul:
   ```
   Total records: XXX
   Sample record: {...}
   Records by location:
     TBM: XX records
     NBM: XX records
     ...
   ```

### Step 3: Cek Format Data
Pastiin di setiap sheet:
- **Row 1-2**: Header (bisa skip)
- **Row 3 dst**: Data karyawan
- **Kolom B**: NIP (jangan kosong)
- **Kolom C**: Nama (jangan kosong)
- **Kolom F dst**: Status (H, T, A, S, SKD, I, C, O)

### Step 4: Cek Authorization
Kadang authorization gagal silent:
1. Di Apps Script Editor, klik **Run** `testSync`
2. Kalau muncul popup "Authorization required", klik **Review permissions**
3. Pilih akun lo → **Allow**
4. Run lagi

---

## 🔧 Quick Fix Script

Kalau lo mau cek manual, gue bikinin script debug:

```javascript
// Paste ini di Apps Script Editor, run buat debug
function debugSheets() {
  const spreadsheet = SpreadsheetApp.openById('1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4');
  const sheets = spreadsheet.getSheets();
  
  Logger.log('=== AVAILABLE SHEETS ===');
  sheets.forEach(sheet => {
    const name = sheet.getName();
    const rows = sheet.getLastRow();
    const cols = sheet.getLastColumn();
    Logger.log(`Sheet: "${name}" | Rows: ${rows} | Cols: ${cols}`);
  });
  
  Logger.log('\n=== EXPECTED SHEET NAMES ===');
  const expected = [
    'TBM', 'NBM', 'PBM', 'PKM', 'PPM', 'MPP',
    'MGKB', 'MGAM', 'MGMM', 'MGNW', 'MGTO', 'MGGJ',
    'MGBP', 'MGLG', 'MGMP', 'MGMK', 'MGJY', 'MGNS'
  ];
  expected.forEach(code => {
    const sheet = spreadsheet.getSheetByName(code);
    if (sheet) {
      Logger.log(`✓ ${code} - FOUND`);
    } else {
      Logger.log(`✗ ${code} - NOT FOUND`);
    }
  });
}
```

---

## 📋 Checklist Debugging:

- [ ] Nama sheet di spreadsheet exact match dengan kode lokasi
- [ ] Ada minimal 1 sheet yang match (misal: `TBM`)
- [ ] Sheet punya minimal 3 baris data
- [ ] Kolom B (NIP) ga kosong
- [ ] Kolom C (Nama) ga kosong
- [ ] Run `testSync()` di Apps Script Editor berhasil
- [ ] Execution log ga ada error
- [ ] Authorization udah di-allow

---

## 💬 Next Step:

Bro, coba:
1. **Cek nama tab sheet** di spreadsheet lo, screenshot atau kasih tau nama-namanya
2. **Run `debugSheets()`** di Apps Script Editor, paste hasil log-nya ke gue
3. Atau **run `testSync()`**, kasih tau output-nya

Dari situ gue bisa kasih tau exact problem-nya dimana! 🔍
