import type { LocationCode } from '../types/attendance';

/**
 * Whitelist email superuser yang diizinkan login
 * Tambahkan email baru ke array ini untuk memberikan akses
 */
export const SUPERUSER_WHITELIST: string[] = [
  'flakoro10@gmail.com',
  'ayudyahp21@gmail.com'
  // Tambahkan 2 email superuser lainnya di sini:
  // 'email2@example.com',
  // 'email3@example.com',
];

/**
 * Whitelist admin cabang (LOCATION_ADMIN).
 * Map email -> kode lokasi yang diizinkan.
 */
export const LOCATION_ADMIN_WHITELIST: Record<string, LocationCode> = {
  'pbmbss2026@gmail.com': 'PBM', // PBM - Pasar Bersehati Manado
  // Tambahkan admin cabang lain di sini:
  // 'adminlokal@example.com': 'TBM',
};

/**
 * Cek apakah email diizinkan sebagai superuser
 */
export function isAuthorizedSuperuser(email: string): boolean {
  return SUPERUSER_WHITELIST.includes(email.toLowerCase().trim());
}

/**
 * Cek apakah email diizinkan sebagai admin cabang (LOCATION_ADMIN)
 */
export function isAuthorizedLocationAdmin(email: string, location?: LocationCode): boolean {
  const cleanEmail = email.toLowerCase().trim();
  const authorizedLocation = LOCATION_ADMIN_WHITELIST[cleanEmail];

  if (!authorizedLocation) return false;
  // Jika lokasi disertakan, pastikan cocok dengan lokasi yang didaftarkan
  if (location && authorizedLocation !== location) return false;

  return true;
}

/**
 * Validasi email + role
 * - SUPERUSER: harus ada di whitelist superuser
 * - LOCATION_ADMIN: harus ada di whitelist admin cabang + lokasi cocok
 */
export function validateAuth(
  email: string,
  role: 'SUPERUSER' | 'LOCATION_ADMIN',
  assignedLocation?: LocationCode
): {
  authorized: boolean;
  reason?: string;
} {
  const cleanEmail = email.toLowerCase().trim();

  if (role === 'SUPERUSER') {
    if (!isAuthorizedSuperuser(cleanEmail)) {
      return {
        authorized: false,
        reason: `Email ${email} tidak memiliki akses superuser. Hubungi administrator.`,
      };
    }
  }

  if (role === 'LOCATION_ADMIN') {
    const allowed = isAuthorizedLocationAdmin(cleanEmail, assignedLocation);
    if (!allowed) {
      return {
        authorized: false,
        reason: `Email ${email} tidak terdaftar sebagai admin cabang ${assignedLocation || ''}. Hubungi administrator.`,
      };
    }
  }

  return { authorized: true };
}