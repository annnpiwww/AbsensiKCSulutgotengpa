/**
 * Whitelist email superuser yang diizinkan login
 * Tambahkan email baru ke array ini untuk memberikan akses
 */
export const SUPERUSER_WHITELIST: string[] = [
  'flakoro10@gmail.com',
  // Tambahkan 2 email superuser lainnya di sini:
  // 'email2@example.com',
  // 'email3@example.com',
];

/**
 * Cek apakah email diizinkan sebagai superuser
 */
export function isAuthorizedSuperuser(email: string): boolean {
  return SUPERUSER_WHITELIST.includes(email.toLowerCase().trim());
}

/**
 * Validasi email + role
 * - SUPERUSER: harus ada di whitelist
 * - LOCATION_ADMIN: bebas (atau bisa dibatasi juga kalau mau)
 */
export function validateAuth(email: string, role: 'SUPERUSER' | 'LOCATION_ADMIN'): {
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

  // LOCATION_ADMIN: untuk sekarang bebas, bisa ditambahkan whitelist terpisah
  return { authorized: true };
}
