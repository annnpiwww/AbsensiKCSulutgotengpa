/**
 * Google Apps Script untuk Sinkronisasi Data Absensi
 * 18 Cabang - KC SulutGo & Tengpa
 * 
 * CARA DEPLOY:
 * 1. Copy SEMUA code ini (Ctrl+A, Ctrl+C)
 * 2. Paste ke Apps Script Editor (hapus semua code lama dulu)
 * 3. Save (Ctrl+S)
 * 4. Deploy → New deployment → Web app
 * 5. Execute as: Me
 * 6. Who has access: Anyone
 * 7. Deploy
 * 
 * Spreadsheet ID: 1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4
 */

// ============================================
// KONFIGURASI 18 CABANG (JANGAN DIUBAH!)
// ============================================
const LOCATIONS = [
  'TBM', 'NBM', 'PBM', 'PKM', 'PPM', 'MPP',
  'MGKB', 'MGAM', 'MGMM', 'MGNW', 'MGTO', 'MGGJ',
  'MGBP', 'MGLG', 'MGMP', 'MGMK', 'MGJY', 'MGNS'
];

const LOCATION_NAMES = {
  'TBM': 'TBM - Toko Bintang Manado',
  'NBM': 'NBM - New Bendar Manado',
  'PBM': 'PBM - Pasar Bersehati Manado',
  'PKM': 'PKM - Pasar Kalimas Manado',
  'PPM': 'PPM - Pesar Karombasan Manado',
  'MPP': 'MPP - Mall Pelayanan Publik',
  'MGKB': 'MGKB - Mie Gacoan Kotamobagu',
  'MGAM': 'MGAM - Mie Gacoan AA Maramis',
  'MGMM': 'MGMM - Mie Gacoan AirMadidi',
  'MGNW': 'MGNW - Mie Gacoan Nani Wartabone',
  'MGTO': 'MGTO - Mie Gacoan Tomohon',
  'MGGJ': 'MGGJ - Mie Gacoan Gorontalo Jhon',
  'MGBP': 'MGBP - Mie Gacoan Bitung Palar',
  'MGLG': 'MGLG - Mie Gacoan Limboto GOrontalo',
  'MGMP': 'MGMP - Mie Gacoan Mangaraja Palu',
  'MGMK': 'MGMK - Mie Gacoan Mimika',
  'MGJY': 'MGJY - Mie Gacoan Jayapura',
  'MGNS': 'MGNS - Mie Gacoan Sorong'
};

const STATUS_MAPPING = {
  'H': 'Hadir',
  'T': 'Terlambat',
  'A': 'Alpa',
  'S': 'Sakit',
  'SKD': 'SKD',
  'I': 'Izin',
  'C': 'Cuti',
  'O': 'Off',
  'L': 'Lembur'
};

// ============================================
// MAIN FUNCTION - DIPANGGIL OLEH WEB APP
// ============================================
/**
 * Entry point untuk Web App
 * URL akan otomatis hit function ini
 */
function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById('1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4');
    const allRecords = [];
    
    Logger.log('=== START SYNC ===');
    
    // Loop semua 18 cabang
    LOCATIONS.forEach(locationCode => {
      try {
        const sheet = spreadsheet.getSheetByName(locationCode);
        
        if (!sheet) {
          Logger.log(`⚠️ Sheet ${locationCode} tidak ditemukan - SKIP`);
          return;
        }
        
        const records = parseSheetData(sheet, locationCode);
        allRecords.push(...records);
        
        Logger.log(`✓ ${locationCode}: ${records.length} records`);
        
      } catch (err) {
        Logger.log(`❌ Error parsing sheet ${locationCode}: ${err.message}`);
      }
    });
    
    Logger.log(`=== TOTAL: ${allRecords.length} records ===`);
    
    // Return JSON response
    return ContentService
      .createTextOutput(JSON.stringify(allRecords))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log(`💥 FATAL ERROR: ${error.message}`);
    Logger.log(error.stack);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// PARSE SHEET DATA
// ============================================
/**
 * Parse data dari satu sheet cabang
 */
function parseSheetData(sheet, locationCode) {
  const records = [];
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  if (values.length < 7) {
    Logger.log(`Sheet ${locationCode} kosong atau data tidak lengkap`);
    return records;
  }
  
  // Row 5 (index 4) adalah tanggal (contoh: 26, 27, 28, 29)
  const dateHeaderRowStr = values[4]; 
  
  // Asumsi Bulan/Tahun dari judul sheet, karena baris 5 cuma angka tanggal (misal 26, 27)
  // Untuk simplifikasi dan supaya bisa dipake generic, kita akan generate ISO string 
  // menggunakan tahun/bulan saat ini jika bulan ga disediain, atau
  // lebih aman kalau kita bikin dummy aja YYYY-MM-DD sesuai tanggal-tanggalnya.
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // bisa di adjust
  
  // Karena struktur lo ini pakai format shift bulanan (26 Juli - 25 Agustus),
  // kolom data (mulai dari G = index 6)
  const dateStartCol = 6; 
  
  // Parse setiap baris karyawan mulai dari Row 7 (index 6)
  for (let rowIndex = 6; rowIndex < values.length; rowIndex++) {
    const row = values[rowIndex];
    
    // NIP di kolom B (index 1)
    const employeeId = row[1] ? row[1].toString().trim() : '';
    // NAMA di kolom C (index 2)
    const employeeName = row[2] ? row[2].toString().trim() : '';
    // JAB di kolom D (index 3)
    const position = row[3] ? row[3].toString().trim() : '';
    
    // Skip baris kosong / legend
    if (!employeeId || employeeId.startsWith('[') || employeeId === 'NIP') {
      continue;
    }
    
    // Loop semua kolom tanggal yang ada di row 5 (index 4)
    for (let colIndex = dateStartCol; colIndex < row.length; colIndex++) {
      const dateCell = dateHeaderRowStr[colIndex]; 
      const statusCell = row[colIndex];
      
      if (!dateCell || !statusCell) continue;
      
      const dateNum = parseInt(dateCell, 10);
      if (isNaN(dateNum)) continue; // skip nama hari
      
      // Bikin artificial date (YYYY-MM-DD). 
      // Karena periode (26-25), kita set dummy logic aja supaya ga ribet parse "26 Juli - 25 Agustus" 
      const targetMonth = dateNum >= 26 ? currentMonth - 1 : currentMonth;
      const d = new Date(currentYear, targetMonth, dateNum);
      const attendanceDate = formatDate(d);
      
      // Parse status
      const statusCode = statusCell.toString().trim().toUpperCase();
      const attendanceStatus = mapStatus(statusCode);
      
      // Skip kalau nggak match sama status absensi (H, A, T dll)
      if (!attendanceStatus) continue;
      
      const recordId = `REC-${locationCode}-${employeeId}-${attendanceDate}`;
      
      records.push({
        id: recordId,
        employeeId: employeeId,
        name: employeeName,
        position: position,
        location: locationCode,
        date: attendanceDate,
        status: attendanceStatus,
        notes: statusCode !== attendanceStatus ? `Status Sheet: ${statusCode}` : '',
        createdAt: new Date().toISOString(),
        updatedBy: 'Google Sheets Live Sync'
      });
    }
  }
  
  return records;
}

// ============================================
// DATE PARSING
// ============================================
/**
 * Parse tanggal dari berbagai format
 */
function parseDate(dateValue) {
  if (!dateValue) return null;
  
  try {
    // Jika sudah Date object
    if (dateValue instanceof Date) {
      return formatDate(dateValue);
    }
    
    // Jika string
    const str = dateValue.toString().trim();
    
    // Format: DD/MM/YYYY atau DD-MM-YYYY
    const match1 = str.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
    if (match1) {
      const day = parseInt(match1[1]);
      const month = parseInt(match1[2]) - 1;
      const year = parseInt(match1[3]);
      return formatDate(new Date(year, month, day));
    }
    
    // Format: YYYY-MM-DD
    const match2 = str.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (match2) {
      const year = parseInt(match2[1]);
      const month = parseInt(match2[2]) - 1;
      const day = parseInt(match2[3]);
      return formatDate(new Date(year, month, day));
    }
    
    // Coba parse langsung
    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      return formatDate(parsed);
    }
    
  } catch (err) {
    Logger.log(`Error parsing date: ${dateValue} - ${err.message}`);
  }
  
  return null;
}

/**
 * Format date ke YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================
// STATUS MAPPING
// ============================================
/**
 * Map kode status ke status lengkap
 */
function mapStatus(code) {
  const upperCode = code.toUpperCase().trim();
  
  // Cek exact match
  if (STATUS_MAPPING[upperCode]) {
    return STATUS_MAPPING[upperCode];
  }
  
  // Cek partial match
  if (upperCode.includes('HADIR') || upperCode === 'H') return 'Hadir';
  if (upperCode.includes('TERLAMBAT') || upperCode === 'T') return 'Terlambat';
  if (upperCode.includes('ALPA') || upperCode === 'A') return 'Alpa';
  if (upperCode.includes('SAKIT') || upperCode === 'S') return 'Sakit';
  if (upperCode.includes('SKD')) return 'SKD';
  if (upperCode.includes('IZIN') || upperCode === 'I') return 'Izin';
  if (upperCode.includes('CUTI') || upperCode === 'C') return 'Cuti';
  if (upperCode.includes('OFF') || upperCode === 'O') return 'Off';
  
  // Default: skip kalau ga recognized
  return null;
}

// ============================================
// TEST & DEBUG FUNCTIONS
// ============================================
/**
 * Test function - untuk debug manual
 * Cara pake: Pilih "testSync" di dropdown, terus Run
 */
function testSync() {
  Logger.log('🧪 TESTING SYNC...\n');
  
  const result = doGet();
  const output = result.getContent();
  const data = JSON.parse(output);
  
  Logger.log(`📊 Total records: ${data.length}`);
  
  if (data.length > 0) {
    Logger.log(`\n📝 Sample record:\n${JSON.stringify(data[0], null, 2)}`);
  }
  
  // Group by location
  const byLocation = {};
  data.forEach(record => {
    if (!byLocation[record.location]) byLocation[record.location] = 0;
    byLocation[record.location]++;
  });
  
  Logger.log('\n📍 Records by location:');
  Object.keys(byLocation).sort().forEach(loc => {
    Logger.log(`   ${loc}: ${byLocation[loc]} records`);
  });
  
  Logger.log('\n✅ TEST SELESAI!');
}

/**
 * Debug function - cek nama sheet
 * Cara pake: Pilih "debugSheets" di dropdown, terus Run
 */
function debugSheets() {
  Logger.log('🔍 CHECKING SHEETS...\n');
  
  const spreadsheet = SpreadsheetApp.openById('1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4');
  const sheets = spreadsheet.getSheets();
  
  Logger.log('=== AVAILABLE SHEETS ===');
  sheets.forEach(sheet => {
    const name = sheet.getName();
    const rows = sheet.getLastRow();
    const cols = sheet.getLastColumn();
    Logger.log(`📄 Sheet: "${name}" | Rows: ${rows} | Cols: ${cols}`);
  });
  
  Logger.log('\n=== CHECKING EXPECTED NAMES ===');
  LOCATIONS.forEach(code => {
    const sheet = spreadsheet.getSheetByName(code);
    if (sheet) {
      Logger.log(`✓ ${code} - FOUND (${sheet.getLastRow()} rows)`);
    } else {
      Logger.log(`✗ ${code} - NOT FOUND ❌`);
    }
  });
  
  Logger.log('\n✅ DEBUG SELESAI!');
}

/**
 * Generate summary report
 */
function generateSummaryReport() {
  Logger.log('📊 GENERATING SUMMARY...\n');
  
  const result = doGet();
  const data = JSON.parse(result.getContent());
  
  const summary = {
    totalRecords: data.length,
    lastSync: new Date().toISOString(),
    byLocation: {},
    byStatus: {},
    dateRange: {
      earliest: null,
      latest: null
    }
  };
  
  data.forEach(record => {
    // Count by location
    if (!summary.byLocation[record.location]) {
      summary.byLocation[record.location] = 0;
    }
    summary.byLocation[record.location]++;
    
    // Count by status
    if (!summary.byStatus[record.status]) {
      summary.byStatus[record.status] = 0;
    }
    summary.byStatus[record.status]++;
    
    // Track date range
    if (!summary.dateRange.earliest || record.date < summary.dateRange.earliest) {
      summary.dateRange.earliest = record.date;
    }
    if (!summary.dateRange.latest || record.date > summary.dateRange.latest) {
      summary.dateRange.latest = record.date;
    }
  });
  
  Logger.log(JSON.stringify(summary, null, 2));
  Logger.log('\n✅ SUMMARY SELESAI!');
  
  return summary;
}
