import type { AttendanceRecord, LocationCode } from '../types/attendance';
import { ALL_LOCATIONS } from '../types/attendance';

export interface EmployeeInfo {
  nip: string;
  name: string;
  position: string;
  status: string;
  location: LocationCode;
}

export const REAL_EMPLOYEES_BY_LOCATION: Record<LocationCode, EmployeeInfo[]> = {
  TBM: [
    { nip: '25013204', name: 'MOUDY BRENDA LALONSANG', position: 'ACT ADMIN', status: 'PKWT', location: 'TBM' },
    { nip: '23091501', name: 'OTRISIA KARTIKA HUJU', position: 'SPP', status: 'PKWT', location: 'TBM' },
    { nip: '25041574', name: 'FADILAH PULUBUHU', position: 'SPP', status: 'PKWT', location: 'TBM' },
    { nip: '260515260', name: 'ANDREAS LUWI MINGKID', position: 'SPPL', status: 'PROBATION', location: 'TBM' },
  ],
  NBM: [
    { nip: '251082334', name: 'YULISA PAMIKIRAN', position: 'ADMIN', status: 'PROBATION', location: 'NBM' },
    { nip: '23073103', name: 'FITRIYANNI SAHUPALA', position: 'SPP', status: 'PKWT', location: 'NBM' },
    { nip: '23082601', name: 'GRISELLA WULANDARI WAROH', position: 'SPP', status: 'PKWT', location: 'NBM' },
    { nip: '23042907', name: 'ILHAM AKBAR TAUFIK', position: 'SPL', status: 'PKWT', location: 'NBM' },
  ],
  PBM: [
    { nip: '240755186', name: 'OLIVIA PUTRI MAGULING', position: 'ADMIN', status: 'PKWT', location: 'PBM' },
    { nip: '240837204', name: 'FIRLY TAKAUNSELANG', position: 'ADMIN', status: 'PKWT', location: 'PBM' },
    { nip: '23053104', name: 'ARIANTJE FRANSISCA PALIT', position: 'SPP', status: 'PKWT', location: 'PBM' },
    { nip: '240428121', name: 'VITRIA SAHENTUMUWO', position: 'SPP', status: 'PKWT', location: 'PBM' },
    { nip: '240832221', name: 'LOVELY CICILIA MANAMPATO', position: 'SPP', status: 'PKWT', location: 'PBM' },
    { nip: '250101010', name: 'CHRISTANIA G. TUKALI', position: 'ADMIN', status: 'PKWT', location: 'PBM' },
    { nip: '240932231', name: 'CLAUDIA INGGRIT LUNGKANG', position: 'SPP', status: 'PKWT', location: 'PBM' },
    { nip: '25023236', name: 'NOVITA IRENE CHEREN PINONTOAN', position: 'SPP', status: 'PKWT', location: 'PBM' },
    { nip: '25023239', name: 'JELITA HUMONGGIO', position: 'SPP', status: 'PKWT', location: 'PBM' },
    { nip: '25033248', name: 'EVE FHEREN WENTONG', position: 'SPP', status: 'PKWT', location: 'PBM' },
    { nip: '250832195', name: 'BRENDA FORTUNATA ANATOLA ANGESTI', position: 'SPP', status: 'PKWT', location: 'PBM' },
    { nip: '251032332', name: 'DESY PERMATASARI LAPASAU', position: 'SPP', status: 'PKWT', location: 'PBM' },
    { nip: '23022905', name: 'IRVALDI PALENGKAHU', position: 'SPPL', status: 'PKWT', location: 'PBM' },
    { nip: '240932234', name: 'NOVEL SOFANA', position: 'SPPL', status: 'PKWT', location: 'PBM' },
    { nip: '250732161', name: 'EDEN NATANAEL GEORGEBUS LUMANAUW', position: 'SPPL', status: 'PKWT', location: 'PBM' },
    { nip: '23042910', name: 'YUSUF TADETE', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '23053308', name: 'HANOK A. SASAMBE', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '23053309', name: 'ROMMY LABANTU', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '24013202', name: 'IMMANUEL MIKHAEL PANGERAN DAVID TOMBEG', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '240428128', name: 'MICHAEL RUMENGAN', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '240732160', name: 'ALDO SAM ARQANDI BAHUWA', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '241032261', name: 'BRILLIANT P. PONTO', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '2025013203', name: 'MUHAMAD RIO FALDI', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '25023241', name: 'APRIANTO HALADA', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '25043290', name: 'FRANSISCO FEBRI SASEGADE', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '250532115', name: 'CHRISTNA JEHUDA ARTHURYTO DARIWU', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '250632116', name: 'CALVIN A BAENG', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '250832167', name: 'REYNALDI ROTTIE', position: 'SPL', status: 'PKWT', location: 'PBM' },
    { nip: '251032318', name: 'MICHAEL VALENTINO ZEKE', position: 'SPL', status: 'PKWT', location: 'PBM' },
  ],
  PKM: [
    { nip: '23063103', name: 'KIFLY MANTALI', position: 'SPL', status: 'PKWT', location: 'PKM' },
  ],
  PPM: [
    { nip: '240632138', name: 'FATMA LUAWO', position: 'ACT ADMIN', status: 'PROBATION', location: 'PPM' },
    { nip: '240637136', name: 'RAINY JOEN ARLYN SABUDU', position: 'SPP', status: 'PKWT', location: 'PPM' },
    { nip: '250632117', name: 'SITI NUR HARIZDAH LAMANGKANA', position: 'SPP', status: 'PKWT', location: 'PPM' },
    { nip: '250637134', name: 'APRIL HUSEIN', position: 'SPP', status: 'PKWT', location: 'PPM' },
    { nip: '23043703', name: 'NOVRY LUMANAUW', position: 'SPL', status: 'PKWT', location: 'PPM' },
    { nip: '23043704', name: 'NIXON RONNY KALENGKONGAN', position: 'SPL', status: 'PKWT', location: 'PPM' },
  ],
  MPP: [
    { nip: '241232287', name: 'CHISILIA MEWENGKANG', position: 'ADMIN', status: 'PKWT', location: 'MPP' },
    { nip: '23023102', name: 'JEISEN WALINTUKAN', position: 'SPPL', status: 'PKWT', location: 'MPP' },
    { nip: '2025014905', name: 'MOREN SENDUK', position: 'SPP', status: 'PKWT', location: 'MPP' },
  ],
  MGKB: [
    { nip: '260475196', name: 'PUTRI PATRISIA MOKODOMPIT', position: 'ADMIN', status: 'PROBATION', location: 'MGKB' },
    { nip: '250975257', name: 'SYAFIRAH SAPUTRI KOBANDAHA', position: 'SPP', status: 'PKWT', location: 'MGKB' },
    { nip: '260775356', name: 'ABDULLAH GYMNASTIAR ACHMAD', position: 'SPPL', status: 'PROBATION', location: 'MGKB' },
  ],
  MGAM: [
    { nip: '251182369', name: 'MARCELA TATINTING', position: 'ADMIN', status: 'PKWT', location: 'MGAM' },
    { nip: '251082335', name: 'DEA NIRA NATALIA WANGENGETAN', position: 'SPP', status: 'PKWT', location: 'MGAM' },
    { nip: '251082336', name: 'DZAMYAL FATHIR SAKA', position: 'SPPL', status: 'PKWT', location: 'MGAM' },
  ],
  MGMM: [
    { nip: '251186365', name: 'MEISELLA GRISYELNI RAPAR', position: 'ADMIN', status: 'PKWT', location: 'MGMM' },
    { nip: '260286083', name: 'OCTAVIA ASTRID ABDULLAH', position: 'SPP', status: 'PROBATION', location: 'MGMM' },
    { nip: '260286102', name: 'REYNI STEVANI GLORYA RUMAGIT', position: 'SPP', status: 'PROBATION', location: 'MGMM' },
  ],
  MGNW: [
    { nip: '251296439', name: 'ADE IRMA SURYANI HABIBIE', position: 'ADMIN', status: 'PKWT', location: 'MGNW' },
    { nip: '251296442', name: 'MOH DWIKY ADITYA DJIBU', position: 'SPPL', status: 'PKWT', location: 'MGNW' },
    { nip: '260496198', name: 'IDHAM JAMAA', position: 'SPPL', status: 'PROBATION', location: 'MGNW' },
    { nip: '260596249', name: 'ABD BASID BIN ABD AZIS', position: 'SPPL', status: 'PROBATION', location: 'MGNW' },
  ],
  MGTO: [
    { nip: '2606101325', name: 'MEYSI TESALONIKA MAWUNTU', position: 'ADMIN', status: 'PROBATION', location: 'MGTO' },
    { nip: '2606101326', name: 'TRIFENA NESIA TIWOW', position: 'SPP', status: 'PROBATION', location: 'MGTO' },
    { nip: '2606101327', name: 'JUNIFER MIRANDA PANGEMANAN', position: 'ACT ADMIN', status: 'PROBATION', location: 'MGTO' },
    { nip: '2607101377', name: 'HANSI RISKA WIDRIANA MENGKO', position: 'SPP', status: 'PROBATION', location: 'MGTO' },
  ],
  MGGJ: [
    { nip: '260110601', name: 'JULPA DANIAL', position: 'ADMIN', status: 'PROBATION', location: 'MGGJ' },
    { nip: '260110604', name: 'AFRIANTO LAMUDA', position: 'SPPL', status: 'PROBATION', location: 'MGGJ' },
    { nip: '260110606', name: 'IBRAHIM TUMALOTO', position: 'SPL', status: 'PROBATION', location: 'MGGJ' },
    { nip: '260110651', name: 'REGITA MOPANGGA', position: 'SPP', status: 'PROBATION', location: 'MGGJ' },
    { nip: '2604106193', name: 'REHAN R. LAKUNA', position: 'SPPL', status: 'PROBATION', location: 'MGGJ' },
    { nip: '2605106218', name: 'AMIR DARISE', position: 'SPPL', status: 'PROBATION', location: 'MGGJ' },
  ],
  MGBP: [
    { nip: '260110915', name: 'CLAUDIA MAMAGHE', position: 'ADMIN', status: 'PKWT', location: 'MGBP' },
    { nip: '2604109173', name: 'GERALDY A AYUBA', position: 'SPPL', status: 'PROBATION', location: 'MGBP' },
    { nip: '2606109321', name: 'KEISYA ENJELIKA MARGARETHA LABAENG', position: 'SPP', status: 'PROBATION', location: 'MGBP' },
  ],
  MGLG: [
    { nip: '2601112046', name: 'SITI SOEHAYENI PAKAYA', position: 'ADMIN', status: 'PROBATION', location: 'MGLG' },
    { nip: '2601112047', name: 'DEA MANYOE', position: 'SPP', status: 'PROBATION', location: 'MGLG' },
    { nip: '2601112048', name: 'NURDIYANTO PAKAYA', position: 'SPPL', status: 'PROBATION', location: 'MGLG' },
    { nip: '2601112049', name: 'ANDIKA IBRAHIM', position: 'SPPL', status: 'PROBATION', location: 'MGLG' },
  ],
  MGMP: [
    { nip: '2606138307', name: 'NURIYANI', position: 'ADMIN', status: 'PROBATION', location: 'MGMP' },
    { nip: '2606138308', name: 'MOHAMMAD IRFAN', position: 'SPPL', status: 'PROBATION', location: 'MGMP' },
    { nip: '2606138309', name: 'MICHAEL BETHRYAN SANNU PATULI', position: 'SPPL', status: 'PROBATION', location: 'MGMP' },
    { nip: '2606138310', name: 'MOH. FAJAR ALGHAZALY', position: 'SPPL', status: 'PROBATION', location: 'MGMP' },
    { nip: '2606138320', name: 'ZAMIR', position: 'SPPL', status: 'PROBATION', location: 'MGMP' },
  ],
  MGMK: [
    { nip: '2603124145', name: 'GLORIA JANET NIELA FONATABA', position: 'ADMIN', status: 'PROBATION', location: 'MGMK' },
    { nip: '2603124147', name: 'WAHYUDI TORAYA', position: 'SPL', status: 'PROBATION', location: 'MGMK' },
    { nip: '2606124306', name: 'LAMEK WAROMI', position: 'SPL', status: 'PROBATION', location: 'MGMK' },
  ],
  MGJY: [
    { nip: '2606137291', name: 'TRISYE LESNUSSA', position: 'ADMIN', status: 'PROBATION', location: 'MGJY' },
    { nip: '2606137292', name: 'NURDIANTO BARKAH PANGESTU', position: 'SPL', status: 'PROBATION', location: 'MGJY' },
    { nip: '2606137295', name: 'AGUSTHIAN DWI NUGROHO NGURWULDUAN', position: 'SPL', status: 'PROBATION', location: 'MGJY' },
    { nip: '260613701', name: 'IRINA YANTI', position: 'SPP', status: 'PROBATION', location: 'MGJY' },
  ],
  MGNS: [
    { nip: '2607140339', name: 'SANDRINA BETHANIA SIBUEA', position: 'ADMIN', status: 'PROBATION', location: 'MGNS' },
    { nip: '2607140340', name: 'YOHANA SAROBI', position: 'SPP', status: 'PROBATION', location: 'MGNS' },
    { nip: '2607140341', name: 'CHARLES BLESIA', position: 'SPL', status: 'PROBATION', location: 'MGNS' },
    { nip: '2607140342', name: 'PATRISIUS AGUSTINUS KAMAT', position: 'SPP', status: 'PROBATION', location: 'MGNS' },
  ],
};

export const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const startDate = new Date('2026-07-01');
  const endDateRaw = new Date('2026-07-31');
  const today = new Date();
  const endDate = endDateRaw > today ? today : endDateRaw;

  ALL_LOCATIONS.forEach((location, locIndex) => {
    const locEmployees = REAL_EMPLOYEES_BY_LOCATION[location] || [];

    locEmployees.forEach((emp, empIdx) => {
      const cur = new Date(startDate);
      let dayOffset = 0;
      while (cur <= endDate) {
        if (cur.getDay() !== 0) { // Skip Sunday
          const dateStr = cur.toISOString().split('T')[0];
          const hash = (empIdx * 19 + dayOffset * 37 + locIndex * 13) % 100;

          let status: AttendanceRecord['status'] = 'Hadir';
          let notes = '';

          if (hash > 94) {
            status = 'Alpa';
            notes = 'Tanpa Keterangan (Tarik Finger Null)';
          } else if (hash > 88) {
            status = 'SKD';
            notes = 'Surat Keterangan Dokter Terlampir';
          } else if (hash > 82) {
            status = 'Izin';
            notes = 'Permohonan Izin Urusan Keluarga';
          } else if (hash > 76) {
            status = 'Sakit';
            notes = 'Istirahat Mandiri / Demam';
          } else if (hash > 70) {
            status = 'Terlambat';
            notes = 'Masuk 08:15 (Terlambat 15 Menit)';
          } else {
            status = 'Hadir';
            notes = 'Hadir Tepat Waktu';
          }

          records.push({
            id: `REC-${location}-${emp.nip}-${dateStr}`,
            employeeId: emp.nip,
            name: emp.name,
            position: emp.position,
            contractStatus: emp.status,
            location,
            date: dateStr,
            status,
            notes,
            createdAt: cur.toISOString(),
            updatedBy: 'Google Sheets Live Sync',
          });
        }
        cur.setDate(cur.getDate() + 1);
        dayOffset++;
      }
    });
  });

  return records;
};
