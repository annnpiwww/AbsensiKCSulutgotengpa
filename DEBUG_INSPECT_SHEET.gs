/**
 * DEBUG FUNCTION - Inspect struktur sheet TBM
 * Paste ini di Apps Script Editor, terus Run
 */
function inspectTBMStructure() {
  Logger.log('🔍 INSPECTING TBM SHEET STRUCTURE\n');
  
  const spreadsheet = SpreadsheetApp.openById('1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4');
  const sheet = spreadsheet.getSheetByName('TBM');
  
  if (!sheet) {
    Logger.log('❌ Sheet TBM tidak ditemukan!');
    return;
  }
  
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  Logger.log(`📊 Total Rows: ${values.length}`);
  Logger.log(`📊 Total Cols: ${values[0].length}\n`);
  
  // Print 10 baris pertama
  Logger.log('=== FIRST 10 ROWS ===\n');
  for (let i = 0; i < Math.min(10, values.length); i++) {
    Logger.log(`Row ${i + 1}:`);
    const row = values[i];
    
    // Print 10 kolom pertama
    for (let j = 0; j < Math.min(10, row.length); j++) {
      const cell = row[j];
      const cellValue = cell ? cell.toString().substring(0, 30) : '(empty)';
      Logger.log(`  Col ${String.fromCharCode(65 + j)} (index ${j}): "${cellValue}"`);
    }
    Logger.log('---\n');
  }
  
  // Cek kolom B (NIP) di row 3-5
  Logger.log('=== CHECKING EMPLOYEE DATA (Rows 3-5) ===\n');
  for (let i = 2; i < Math.min(5, values.length); i++) {
    const row = values[i];
    Logger.log(`Row ${i + 1}:`);
    Logger.log(`  Col B (index 1) - NIP: "${row[1] || '(empty)'}"`);
    Logger.log(`  Col C (index 2) - Name: "${row[2] || '(empty)'}"`);
    Logger.log(`  Col D (index 3) - Position: "${row[3] || '(empty)'}"`);
    Logger.log(`  Col E (index 4): "${row[4] || '(empty)'}"`);
    Logger.log(`  Col F (index 5): "${row[5] || '(empty)'}"`);
    Logger.log(`  Col G (index 6): "${row[6] || '(empty)'}"`);
    Logger.log('---\n');
  }
  
  // Cek row 2 untuk header tanggal
  Logger.log('=== DATE HEADER (Row 2, Cols F onwards) ===\n');
  if (values.length >= 2) {
    const dateRow = values[1];
    for (let j = 5; j < Math.min(15, dateRow.length); j++) {
      const cell = dateRow[j];
      const cellValue = cell ? cell.toString() : '(empty)';
      Logger.log(`  Col ${String.fromCharCode(65 + j)} (index ${j}): "${cellValue}"`);
    }
  }
  
  Logger.log('\n✅ INSPECTION DONE!');
  Logger.log('\n📋 COPY OUTPUT INI & KASIH KE AI ASSISTANT!');
}
