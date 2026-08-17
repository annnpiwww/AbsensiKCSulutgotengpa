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

/* Singkatan resmi nama lokasi (TBM, NBM, PBM, dll) */
export const LOCATION_NAMES: Record<LocationCode, string> = {
  TBM: 'TBM',
  NBM: 'NBM',
  PBM: 'PBM',
  PKM: 'PKM',
  PPM: 'PPM',
  MPP: 'MPP',
  MGKB: 'MGKB',
  MGAM: 'MGAM',
  MGMM: 'MGMM',
  MGNW: 'MGNW',
  MGTO: 'MGTO',
  MGGJ: 'MGGJ',
  MGBP: 'MGBP',
  MGLG: 'MGLG',
  MGMP: 'MGMP',
  MGMK: 'MGMK',
  MGJY: 'MGJY',
  MGNS: 'MGNS',
};

/* Deskripsi lengkap lokasi untuk tooltip/detail */
export const LOCATION_FULL_NAMES: Record<LocationCode, string> = {
  TBM: 'Toko Bintang Manado',
  NBM: 'New Bendar Manado',
  PBM: 'Pasar Bersehati Manado',
  PKM: 'Pasar Kalimas Manado',
  PPM: 'Pesar Karombasan Manado',
  MPP: 'Mall Pelayanan Publik',
  MGKB: 'Mie Gacoan Kotamobagu',
  MGAM: 'Mie Gacoan AA Maramis',
  MGMM: 'Mie Gacoan AirMadidi',
  MGNW: 'Mie Gacoan Nani Wartabone',
  MGTO: 'Mie Gacoan Tomohon',
  MGGJ: 'Mie Gacoan Gorontalo Jhon',
  MGBP: 'Mie Gacoan Bitung Palar',
  MGLG: 'Mie Gacoan Limboto GOrontalo',
  MGMP: 'Mie Gacoan Mangaraja Palu',
  MGMK: 'Mie Gacoan Mimika',
  MGJY: 'Mie Gacoan Jayapura',
  MGNS: 'Mie Gacoan Sorong',
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
