import type { LocationCode, UserSession } from '../types/attendance';

const SESSION_SECRET = 'KC_SULUTGOTENGPA_AUTH_SESSION_SECRET_KEY_v2026';

export interface SignedSessionContainer {
  session: UserSession;
  signature: string;
  issuedAt: number;
}

/**
 * Generates a signature/hash checksum for UserSession object
 */
export function generateSessionSignature(session: UserSession, issuedAt: number): string {
  const payloadStr = `${session.role}:${session.assignedLocation}:${session.email.toLowerCase().trim()}:${session.name}:${issuedAt}:${SESSION_SECRET}`;
  let hash = 0;
  for (let i = 0; i < payloadStr.length; i++) {
    const char = payloadStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sig_${Math.abs(hash).toString(36)}_${payloadStr.length}`;
}

/**
 * Saves signed session data into localStorage with integrity checksum
 */
export function saveSignedSession(session: UserSession): void {
  const issuedAt = Date.now();
  const signature = generateSessionSignature(session, issuedAt);
  const container: SignedSessionContainer = {
    session,
    signature,
    issuedAt,
  };
  try {
    localStorage.setItem('absensi_session', JSON.stringify(container));
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22 ||
        error.code === 1014)
    ) {
      console.warn('[SessionAuth] SafeLocalStorage: QuotaExceededError - Gagal menyimpan session.', error);
    } else {
      console.error('[SessionAuth] SafeLocalStorage: Error setting absensi_session', error);
    }
  }
}

/**
 * Retrieves and verifies session integrity from localStorage.
 * Returns valid UserSession if signature and whitelist check pass, otherwise returns null.
 */
export function getVerifiedSession(): UserSession | null {
  const raw = localStorage.getItem('absensi_session');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      'session' in parsed &&
      'signature' in parsed &&
      'issuedAt' in parsed
    ) {
      const { session, signature, issuedAt } = parsed as SignedSessionContainer;
      if (!session || typeof session !== 'object' || !session.email || !session.role) {
        throw new Error('Invalid session payload structure');
      }

      const expectedSignature = generateSessionSignature(session, issuedAt);
      if (signature !== expectedSignature) {
        console.warn('[SessionAuth] Session Integrity Warning: Signature mismatch! Potential tampered session detected.');
        clearSessionStorage();
        return null;
      }

      // Re-verify whitelist rules
      const authCheck = validateAuth(
        session.email,
        session.role,
        session.assignedLocation !== 'ALL' ? (session.assignedLocation as LocationCode) : undefined
      );

      if (!authCheck.authorized) {
        console.warn('[SessionAuth] Session Integrity Warning: User is not authorized in current whitelist.');
        clearSessionStorage();
        return null;
      }

      return session;
    }

    // Unsigned or tampered session
    console.warn('[SessionAuth] Session Integrity Protection: Unsigned session detected in localStorage. Invalidating session.');
    clearSessionStorage();
    return null;
  } catch (e) {
    console.error('[SessionAuth] Failed to parse or verify stored session', e);
    clearSessionStorage();
    return null;
  }
}

/**
 * Clears session data from localStorage
 */
export function clearSessionStorage(): void {
  try {
    localStorage.removeItem('absensi_session');
    localStorage.removeItem('absensi_auth_token');
  } catch (e) {
    console.error('[SessionAuth] Failed to clear session storage', e);
  }
}

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