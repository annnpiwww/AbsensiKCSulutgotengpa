export type AttendanceStatus =
  | 'Hadir'
  | 'Izin'
  | 'Sakit'
  | 'SKD'
  | 'Alpa'
  | 'Cuti'
  | 'Off'
  | 'Terlambat';

export type LocationCode =
  | 'TBM'
  | 'NBM'
  | 'PBM'
  | 'PKM'
  | 'PPM'
  | 'MPP'
  | 'MGKB'
  | 'MGAM'
  | 'MGMM'
  | 'MGNW'
  | 'MGTO'
  | 'MGGJ'
  | 'MGBP'
  | 'MGLG'
  | 'MGMP'
  | 'MGMK'
  | 'MGJY'
  | 'MGNS';

export const LOCATION_NAMES: Record<LocationCode, string> = {
  TBM: 'TBM - Toko Bintang Manado',
  NBM: 'NBM - New Bendar Manado',
  PBM: 'PBM - Pasar Bersehati Manado',
  PKM: 'PKM - Pasar Kalimas Manado',
  PPM: 'PPM - Pesar Karombasan Manado',
  MPP: 'MPP - Mall Pelayanan Publik ',
  MGKB: 'MGKB - Mie Gacoan Kotamobagu',
  MGAM: 'MGAM - Mie Gacoan AA Maramis',
  MGMM: 'MGMM - Mie Gacoan AirMadidi',
  MGNW: 'MGNW - Mie Gacoan Nani Wartabone',
  MGTO: 'MGTO - Mie Gacoan Tomohon',
  MGGJ: 'MGGJ - Mie Gacoan Gorontalo Jhon',
  MGBP: 'MGBP - Mie Gacoan Bitung Palar',
  MGLG: 'MGLG - Mie Gacoan Limboto GOrontalo',
  MGMP: 'MGMP - Mie Gacoan Mangaraja Palu',
  MGMK: 'MGMK - Mie Gacoan Mimika',
  MGJY: 'MGJY - Mie Gacoan Jayapura',
  MGNS: 'MGNS - Mie Gacoan Sorong',
};

export const ALL_LOCATIONS: LocationCode[] = [
  'TBM',
  'NBM',
  'PBM',
  'PKM',
  'PPM',
  'MPP',
  'MGKB',
  'MGAM',
  'MGMM',
  'MGNW',
  'MGTO',
  'MGGJ',
  'MGBP',
  'MGLG',
  'MGMP',
  'MGMK',
  'MGJY',
  'MGNS',
];

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  position?: string;
  contractStatus?: string;
  location: LocationCode;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
  updatedBy: string;
}

export type UserRole = 'SUPERUSER' | 'LOCATION_ADMIN';

export interface UserSession {
  role: UserRole;
  assignedLocation: LocationCode | 'ALL';
  name: string;
  email: string;
}

export interface LocationStats {
  location: LocationCode;
  locationName: string;
  totalEmployees: number;
  hadir: number;
  izin: number;
  sakit: number;
  skd: number;
  alpa: number;
  attendanceRate: number;
}
