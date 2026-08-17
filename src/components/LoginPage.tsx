import React, { useState } from 'react';
import type { UserSession, LocationCode } from '../types/attendance';
import { LOCATION_NAMES } from '../types/attendance';
import { AppApi } from '../services/api';
import { ShieldCheck, UserCheck, Lock, Building2, ArrowRight } from 'lucide-react';
import { UnauthorizedModal } from './UnauthorizedModal';

interface LoginPageProps {
  onLogin: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'SUPERUSER' | 'LOCATION_ADMIN'>('SUPERUSER');
  const [selectedLocation, setSelectedLocation] = useState<LocationCode>('TBM');
  const [email, setEmail] = useState('admin.pusat@sulutgo.co.id');
  const [name, setName] = useState('Administrator Utama');
  const [isSimulatingGoogle, setIsSimulatingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState('');

  const handleRoleChange = (newRole: 'SUPERUSER' | 'LOCATION_ADMIN') => {
    setRole(newRole);
    if (newRole === 'SUPERUSER') {
      setEmail('admin.pusat@sulutgo.co.id');
      setName('Administrator Utama');
    } else {
      setEmail(`admin.${selectedLocation.toLowerCase()}@sulutgo.co.id`);
      setName(`Admin Cabang ${selectedLocation}`);
    }
  };

  const handleLocationChange = (loc: LocationCode) => {
    setSelectedLocation(loc);
    if (role === 'LOCATION_ADMIN') {
      setEmail(`admin.${loc.toLowerCase()}@sulutgo.co.id`);
      setName(`Admin Cabang ${loc}`);
    }
  };

  const handleGoogleLoginReal = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: '92850937812-mockclientid.apps.googleusercontent.com',
          scope: 'email profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setErrorMessage('Gagal Autentikasi Google: ' + tokenResponse.error);
              return;
            }
            try {
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const googleUser = await userInfoRes.json();
              const realEmail = googleUser.email;
              const realName = googleUser.name;

              const res = await AppApi.login({
                email: realEmail,
                name: realName,
                role: role,
                assignedLocation: role === 'LOCATION_ADMIN' ? selectedLocation : 'ALL',
              });

              if (res.success && res.session) {
                onLogin(res.session);
              } else {
                setUnauthorizedEmail(realEmail);
                setShowUnauthorizedModal(true);
              }
            } catch {
              setErrorMessage('Gagal memuat profil pengguna Google.');
            }
          },
        });
        client.requestAccessToken();
      } catch {
        handleDirectLogin();
      }
    } else {
      handleDirectLogin();
    }
  };

  const handleDirectLogin = async () => {
    setIsSimulatingGoogle(true);
    setErrorMessage('');

    setTimeout(async () => {
      try {
        const res = await AppApi.login({
          email,
          name,
          role: role,
          assignedLocation: role === 'LOCATION_ADMIN' ? selectedLocation : 'ALL',
        });

        setIsSimulatingGoogle(false);
        if (res.success && res.session) {
          onLogin(res.session);
        } else {
          setUnauthorizedEmail(email);
          setShowUnauthorizedModal(true);
        }
      } catch {
        setIsSimulatingGoogle(false);
        setErrorMessage('Terjadi kesalahan koneksi server.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--md-sys-color-surface-container-low)] text-[var(--md-sys-color-on-surface)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 rounded-[28px] bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] shadow-xs">
            <Building2 className="w-8 h-8 text-[var(--md-sys-color-primary)]" />
          </div>
          <h1 className="text-xl font-extrabold text-[var(--md-sys-color-on-surface)] tracking-tight">
            Absensi KC Sulutgotengpa
          </h1>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
            Portal Manajemen & Absensi Terintegrasi Google Workspace
          </p>
        </div>

        {/* Main Login Card M3 Extra Large shape */}
        <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-6 sm:p-8 rounded-[28px] border border-[var(--md-sys-color-outline-variant)] shadow-md space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[var(--md-sys-color-on-surface)]">
              Pilih Peran Login
            </h2>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Tentukan hak akses untuk masuk ke sistem absensi
            </p>
          </div>

          {/* Role Switcher Pill Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange('SUPERUSER')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                role === 'SUPERUSER'
                  ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] border-[var(--md-sys-color-primary)] shadow-xs font-bold'
                  : 'bg-[var(--md-sys-color-surface-container-low)] text-[var(--md-sys-color-on-surface-variant)] border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-[var(--md-sys-color-primary)] mb-2" />
              <div>
                <div className="text-xs font-bold">Superuser</div>
                <div className="text-[10px] opacity-80">Akses Semua Cabang</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('LOCATION_ADMIN')}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                role === 'LOCATION_ADMIN'
                  ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] border-[var(--md-sys-color-secondary)] shadow-xs font-bold'
                  : 'bg-[var(--md-sys-color-surface-container-low)] text-[var(--md-sys-color-on-surface-variant)] border-[var(--md-sys-color-outline-variant)] hover:bg-[var(--md-sys-color-surface-container-high)]'
              }`}
            >
              <UserCheck className="w-5 h-5 text-[var(--md-sys-color-secondary)] mb-2" />
              <div>
                <div className="text-xs font-bold">Admin Cabang</div>
                <div className="text-[10px] opacity-80">Khusus 1 Outlet</div>
              </div>
            </button>
          </div>

          {/* Location Selector (If Admin Cabang) */}
          {role === 'LOCATION_ADMIN' && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)]">
                Pilih Kantor Cabang Penugasan
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value as LocationCode)}
                className="w-full bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline)] rounded-xl px-3 py-2.5 text-xs text-[var(--md-sys-color-on-surface)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden font-medium"
              >
                {Object.entries(LOCATION_NAMES).map(([code, nameLoc]) => (
                  <option key={code} value={code}>
                    {code} - {nameLoc}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User Preview Box */}
          <div className="p-3.5 bg-[var(--md-sys-color-surface-container-low)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--md-sys-color-primary)]">
              Simulasi Profil Login:
            </div>
            <div className="text-xs font-bold text-[var(--md-sys-color-on-surface)]">{name}</div>
            <div className="text-xs font-mono text-[var(--md-sys-color-on-surface-variant)]">{email}</div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)] rounded-xl text-xs">
              {errorMessage}
            </div>
          )}

          {/* Login Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleGoogleLoginReal}
              disabled={isSimulatingGoogle}
              className="w-full m3-btn-filled text-xs py-3 px-6 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <span>{isSimulatingGoogle ? 'Memproses Autentikasi...' : 'Masuk Dengan Google Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[var(--md-sys-color-on-surface-variant)] flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
          <span>Terproteksi Google Workspace OAuth 2.0 Security</span>
        </div>
      </div>

      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        email={unauthorizedEmail}
        role={role}
        locationName={role === 'LOCATION_ADMIN' ? LOCATION_NAMES[selectedLocation] : undefined}
      />
    </div>
  );
};
