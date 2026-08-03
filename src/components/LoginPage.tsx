import React, { useState } from 'react';
import type { UserSession, LocationCode } from '../types/attendance';
import { LOCATION_NAMES } from '../types/attendance';
import { AppApi } from '../services/api';
import { ShieldCheck, UserCheck, Lock, Building2, CheckCircle2, ArrowRight, ChevronDown } from 'lucide-react';
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
      setEmail('superuser@sulutgo.co.id');
      setName('Administrator Utama');
    } else {
      setEmail(`admin.${selectedLocation.toLowerCase()}@sulutgo.co.id`);
      setName(`Admin Cabang - ${LOCATION_NAMES[selectedLocation]}`);
    }
  };

  const handleLocationChange = (loc: LocationCode) => {
    setSelectedLocation(loc);
    if (role === 'LOCATION_ADMIN') {
      setEmail(`admin.${loc.toLowerCase()}@sulutgo.co.id`);
      setName(`Admin Cabang - ${LOCATION_NAMES[loc]}`);
    }
  };

  const handleGoogleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulatingGoogle(true);

    if (typeof window !== 'undefined' && (window as any).google) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: '675808950936-qu09192s0m0jk248b1gj1ftg6boe9es2.apps.googleusercontent.com',
          scope: 'email profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              console.error('Google Auth Error:', tokenResponse);
              setIsSimulatingGoogle(false);
              return;
            }

            try {
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const userInfo = await userInfoRes.json();

              const res = await AppApi.login({
                email: userInfo.email,
                role,
                assignedLocation: role === 'LOCATION_ADMIN' ? selectedLocation : 'ALL',
                name: userInfo.name,
              });

              if (res.success && res.session) {
                onLogin(res.session);
              } else {
                setUnauthorizedEmail(userInfo.email);
                setShowUnauthorizedModal(true);
                setErrorMessage(res.error || 'Login gagal');
                setIsSimulatingGoogle(false);
              }
            } catch (err) {
              console.error('Failed to fetch Google User Info', err);
              setIsSimulatingGoogle(false);
            }
          },
          error_callback: (err: any) => {
            console.error('OAuth flow error', err);
            setIsSimulatingGoogle(false);
          }
        });

        client.requestAccessToken();
      } catch (err) {
        console.error('GIS init error:', err);
        setIsSimulatingGoogle(false);
      }
    } else {
      setTimeout(async () => {
        const res = await AppApi.login({
          email,
          role,
          assignedLocation: role === 'LOCATION_ADMIN' ? selectedLocation : 'ALL',
          name,
        });
        if (res.success && res.session) {
          onLogin(res.session);
        } else {
          setUnauthorizedEmail(email);
          setShowUnauthorizedModal(true);
          setErrorMessage(res.error || 'Login gagal');
          setIsSimulatingGoogle(false);
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bento-card rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Brand Banner */}
        <div className="md:w-1/2 bento-hero p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white">Monitoring Absensi</h1>
                <p className="text-[11px] text-slate-300">KC Sulutgotengpa</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold leading-tight text-white tracking-tight">
                Pantau Absensi 18 Cabang Secara Realtime
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kelola riwayat absen, cek yang telat atau alpa, dan pantau kedisiplinan tiap cabang secara langsung.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Login Google OAuth 2.0 (SSO)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Akses Superuser Pusat & Admin Cabang</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Analisis Kedisiplinan 18 Cabang</span>
            </div>
          </div>
        </div>

        {/* Right Side: Sign-In Form */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Yuk, Masuk!</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Masuk pakai akun Google terdaftar untuk akses statistik absensi.
              </p>
            </div>

            {/* Role Segmented Tabs */}
            <div className="segmented-control flex gap-1 mb-5">
              <button
                type="button"
                onClick={() => handleRoleChange('SUPERUSER')}
                className={`flex-1 py-2 px-3 segmented-control-item flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'SUPERUSER' ? 'segmented-control-item-active' : 'text-slate-600'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Superuser</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('LOCATION_ADMIN')}
                className={`flex-1 py-2 px-3 segmented-control-item flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'LOCATION_ADMIN' ? 'segmented-control-item-active' : 'text-slate-600'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Admin Cabang</span>
              </button>
            </div>

            <form onSubmit={handleGoogleSignIn} className="space-y-4">
              {role === 'LOCATION_ADMIN' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Pilih Cabangmu:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => handleLocationChange(e.target.value as LocationCode)}
                      className="input-modern w-full pr-11 text-xs font-semibold cursor-pointer appearance-none"
                    >
                      {(Object.keys(LOCATION_NAMES) as LocationCode[]).map((loc) => (
                        <option key={loc} value={loc}>
                          {LOCATION_NAMES[loc]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* User Identity Preview Pill */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-0.5">
                <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                  Info Akun Login
                </div>
                <div className="text-xs font-bold text-slate-900">{name}</div>
                <div className="text-[11px] text-slate-500">{email}</div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                  <p className="text-xs text-rose-700 font-medium">{errorMessage}</p>
                </div>
              )}

              {/* Google Button */}
              <button
                type="submit"
                disabled={isSimulatingGoogle}
                className="w-full py-2.5 px-4 btn-secondary flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                {isSimulatingGoogle ? (
                  <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
                    <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Menghubungkan ke Akun Google...
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-slate-800">
                      Sign in with Google
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Terproteksi Google Workspace OAuth 2.0</span>
          </div>
        </div>
      </div>

      {/* Unauthorized Modal */}
      <UnauthorizedModal
        isOpen={showUnauthorizedModal}
        onClose={() => setShowUnauthorizedModal(false)}
        email={unauthorizedEmail}
      />
    </div>
  );
};
