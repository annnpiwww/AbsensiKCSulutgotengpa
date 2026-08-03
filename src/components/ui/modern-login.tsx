import React, { useState } from 'react';
import { LogIn, ShieldCheck, UserCheck, Building2, ChevronDown, Lock, ArrowRight } from 'lucide-react';
import type { UserSession, LocationCode } from '../../types/attendance';
import { LOCATION_NAMES } from '../../types/attendance';
import { AppApi } from '../../services/api';
import logoImg from '../../assets/logo.jpeg';

interface ModernLoginProps {
  onLogin: (session: UserSession) => void;
}

export const ModernLogin: React.FC<ModernLoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<'SUPERUSER' | 'LOCATION_ADMIN'>('SUPERUSER');
  const [selectedLocation, setSelectedLocation] = useState<LocationCode>('TBM');
  const [email, setEmail] = useState('admin.pusat@sulutgo.co.id');
  const [name, setName] = useState('Administrator Utama');
  const [isSimulatingGoogle, setIsSimulatingGoogle] = useState(false);

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

              if (res.success) {
                onLogin(res.session);
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
        if (res.success) {
          onLogin(res.session);
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-xl bg-white shadow-2xl shadow-slate-900/10 mb-4 overflow-hidden border border-slate-100">
            <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-2xl p-2" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Monitoring Absensi</h1>
          <p className="text-sm text-slate-500 mt-1">Kantor Cabang SulutGoTengPa</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-200/60 p-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Selamat Datang!</h2>
            <p className="text-sm text-slate-500">
              Masuk dengan akun Google untuk akses Dashboard absensi
            </p>
          </div>

          <form onSubmit={handleGoogleSignIn} className="space-y-5">
            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Pilih Role Akses
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleRoleChange('SUPERUSER')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${
                    role === 'SUPERUSER'
                      ? 'bg-white text-slate-900 shadow-md shadow-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Superuser</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('LOCATION_ADMIN')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-sm transition-all ${
                    role === 'LOCATION_ADMIN'
                      ? 'bg-white text-slate-900 shadow-md shadow-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Admin Cabang</span>
                </button>
              </div>
            </div>

            {/* Location Selector (only for LOCATION_ADMIN) */}
            {role === 'LOCATION_ADMIN' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Pilih Cabang
                </label>
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => handleLocationChange(e.target.value as LocationCode)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium text-slate-900 appearance-none cursor-pointer"
                  >
                    {(Object.keys(LOCATION_NAMES) as LocationCode[]).map((loc) => (
                      <option key={loc} value={loc}>
                        {LOCATION_NAMES[loc]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            {/* User Preview Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                Akun Preview
              </div>
              <div className="text-sm font-bold text-slate-900 mb-0.5">{name}</div>
              <div className="text-xs text-slate-500">{email}</div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="submit"
              disabled={isSimulatingGoogle}
              className="w-full bg-gradient-to-b from-slate-800 to-slate-900 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:from-slate-700 hover:to-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSimulatingGoogle ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Menghubungkan...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <span className="text-sm">Sign in with Google</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </>
              )}
            </button>
          </form>

          {/* Security Footer */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Secured by Google OAuth 2.0</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>Monitoring kehadiran Cabang KC Sulutgotengpa secara realtime</p>
          <p className="text-slate-400">Manado • Gorontalo • Palu • Papua • dan lainnya</p>
        </div>
      </div>
    </div>
  );
};
