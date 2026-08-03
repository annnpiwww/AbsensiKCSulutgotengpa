import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface UnauthorizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  /** 'SUPERUSER' | 'LOCATION_ADMIN' — menentukan isi pesan */
  role: 'SUPERUSER' | 'LOCATION_ADMIN';
  /** Nama lokasi (utk admin cabang), contoh 'PBM - Pasar Bersehati Manado' */
  locationName?: string;
}

export const UnauthorizedModal: React.FC<UnauthorizedModalProps> = ({
  isOpen,
  onClose,
  email,
  role,
  locationName,
}) => {
  if (!isOpen) return null;

  const isLocationAdmin = role === 'LOCATION_ADMIN';
  const locLabel = locationName || 'Cabang';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-red-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Akses Ditolak</h3>
              <p className="text-xs text-rose-100">Unauthorized Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <p className="text-sm font-semibold text-rose-900 mb-2">
              {isLocationAdmin ? `Akun Anda Bukan Admin ${locLabel}` : 'Akun Anda Bukan Superuser'}
            </p>
            <p className="text-xs text-rose-700 leading-relaxed">
              Email <span className="font-mono font-bold">{email}</span> tidak terdaftar{' '}
              {isLocationAdmin ? (
                <>sebagai admin <span className="font-semibold">{locLabel}</span> dalam sistem.</>
              ) : (
                <>sebagai superuser dalam sistem.</>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700">
              Hanya akun{' '}
              {isLocationAdmin ? (
                <>admin <span className="font-semibold">{locLabel}</span> yang terdaftar</>
              ) : (
                <>superuser yang terdaftar</>
              )}{' '}
              yang dapat mengakses sistem monitoring absensi KC SulutGoTengPa.
            </p>
            <p className="text-xs text-slate-500">
              Hubungi administrator sistem untuk mendaftarkan akun Anda atau gunakan akun yang telah terdaftar.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-slate-900/20"
          >
            Mengerti, Tutup
          </button>
        </div>
      </div>
    </div>
  );
};