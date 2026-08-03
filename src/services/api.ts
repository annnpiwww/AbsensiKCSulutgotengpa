import type { AttendanceRecord, UserSession, LocationCode } from '../types/attendance';
import { AttendanceService } from './attendanceStore';

/**
 * Endpoints API Service Abstraction
 * Memberikan antarmuka API terpadu untuk /login, /logout, /data, dll.
 */
export class AppApi {
  // POST /api/login
  public static async login(credentials: {
    email: string;
    role: 'SUPERUSER' | 'LOCATION_ADMIN';
    assignedLocation?: LocationCode | 'ALL';
    name?: string;
  }): Promise<{ success: boolean; session: UserSession; token: string }> {
    // Simulated auth logic
    const session: UserSession = {
      role: credentials.role,
      assignedLocation: credentials.role === 'LOCATION_ADMIN' ? (credentials.assignedLocation || 'TBM') : 'ALL',
      name: credentials.name || (credentials.role === 'SUPERUSER' ? 'Superuser (STM)' : 'Admin Cabang'),
      email: credentials.email,
    };

    localStorage.setItem('absensi_session', JSON.stringify(session));
    const token = `token_google_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem('absensi_auth_token', token);

    return {
      success: true,
      session,
      token,
    };
  }

  // POST /api/logout
  public static async logout(): Promise<{ success: boolean }> {
    localStorage.removeItem('absensi_session');
    localStorage.removeItem('absensi_auth_token');
    return { success: true };
  }

  // GET /api/data
  public static async getAttendanceData(): Promise<AttendanceRecord[]> {
    return AttendanceService.getRecords();
  }

  // POST /api/data
  public static async addAttendanceData(
    record: Omit<AttendanceRecord, 'id' | 'createdAt'>
  ): Promise<AttendanceRecord> {
    return AttendanceService.addRecord(record);
  }

  // PUT /api/data/:id
  public static async updateAttendanceData(
    id: string,
    updates: Partial<AttendanceRecord>
  ): Promise<AttendanceRecord | null> {
    return AttendanceService.updateRecord(id, updates);
  }

  // DELETE /api/data/:id
  public static async deleteAttendanceData(id: string): Promise<boolean> {
    return AttendanceService.deleteRecord(id);
  }
}
