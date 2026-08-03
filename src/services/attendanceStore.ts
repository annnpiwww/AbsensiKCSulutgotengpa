import type {
  AttendanceRecord,
  LocationCode,
  LocationStats,
} from '../types/attendance';
import { LOCATION_NAMES, ALL_LOCATIONS } from '../types/attendance';
import { generateMockAttendance } from '../data/mockData';

const STORAGE_KEY = 'absensi_kc_sulutgopas_records_v3';

export class AttendanceService {
  private static records: AttendanceRecord[] = [];

  public static initialize(): AttendanceRecord[] {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.records = JSON.parse(saved);
        return this.records;
      } catch (e) {
        console.error('Failed to parse stored records', e);
      }
    }
    this.records = generateMockAttendance();
    this.save();
    return this.records;
  }

  public static getRecords(): AttendanceRecord[] {
    if (this.records.length === 0) {
      return this.initialize();
    }
    return this.records;
  }

  public static save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
  }

  public static addRecord(record: Omit<AttendanceRecord, 'id' | 'createdAt'>): AttendanceRecord {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `REC-${record.location}-${record.employeeId}-${record.date}-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    this.records.unshift(newRecord);
    this.save();
    return newRecord;
  }

  public static updateRecord(id: string, updates: Partial<AttendanceRecord>): AttendanceRecord | null {
    const idx = this.records.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.records[idx] = { ...this.records[idx], ...updates };
      this.save();
      return this.records[idx];
    }
    return null;
  }

  public static deleteRecord(id: string): boolean {
    const initialLen = this.records.length;
    this.records = this.records.filter((r) => r.id !== id);
    this.save();
    return this.records.length < initialLen;
  }

  public static resetToMockData(): AttendanceRecord[] {
    this.records = generateMockAttendance();
    this.save();
    return this.records;
  }

  public static getLocationStats(
    records: AttendanceRecord[],
    selectedLocation: LocationCode | 'ALL'
  ): LocationStats[] {
    const targetLocations =
      selectedLocation === 'ALL' ? ALL_LOCATIONS : [selectedLocation];

    return targetLocations.map((loc) => {
      const locRecords = records.filter((r) => r.location === loc);
      
      const empLatestStatusMap = new Map<string, string>();
      locRecords.forEach((r) => {
        if (!empLatestStatusMap.has(r.employeeId)) {
          empLatestStatusMap.set(r.employeeId, r.status);
        }
      });

      let hadir = 0;
      let izin = 0;
      let sakit = 0;
      let skd = 0;
      let alpa = 0;

      locRecords.forEach((r) => {
        if (r.status === 'Hadir') hadir++;
        else if (r.status === 'Izin') izin++;
        else if (r.status === 'Sakit') sakit++;
        else if (r.status === 'SKD') skd++;
        else if (r.status === 'Alpa') alpa++;
      });

      const total = locRecords.length || 1;
      const attendanceRate = Math.round((hadir / total) * 100);

      return {
        location: loc,
        locationName: LOCATION_NAMES[loc],
        totalEmployees: empLatestStatusMap.size || Math.round(total / 12),
        hadir,
        izin,
        sakit,
        skd,
        alpa,
        attendanceRate,
      };
    });
  }

  public static exportToCSV(records: AttendanceRecord[]) {
    const headers = ['ID', 'Employee NIP', 'Name', 'Position', 'Location', 'Date', 'Status', 'Notes', 'Updated By'];
    const rows = records.map((r) => [
      r.id,
      r.employeeId,
      `"${r.name}"`,
      `"${r.position || ''}"`,
      r.location,
      r.date,
      r.status,
      `"${r.notes || ''}"`,
      `"${r.updatedBy}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_KCSulutgopas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const INITIAL_SUPERUSER_SESSION = {
  role: 'SUPERUSER' as const,
  assignedLocation: 'ALL' as const,
  name: 'Superuser BSS Recruitment',
  email: 'bssrecruitmentmanado@gmail.com',
};

export const INITIAL_ADMIN_CABANG_SESSION = {
  role: 'LOCATION_ADMIN' as const,
  assignedLocation: 'TBM' as LocationCode,
  name: 'Admin Cabang TBM',
  email: 'admin.tbm@sulutgopas.co.id',
};
