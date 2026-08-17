import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface UnauthorizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  role: 'SUPERUSER' | 'LOCATION_ADMIN';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)] p-5 flex items-center justify-between border-b border-rose-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Akses Ditolak (Unauthorized)</h3>
              <p className="text-xs opacity-80">Hak Akses Tidak Mencukupi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline-variant)] rounded-2xl">
            <p className="text-xs font-bold text-[var(--md-sys-color-error)] mb-1">
              {isLocationAdmin ? `Akun Anda Bukan Admin ${locLabel}` : 'Akun Anda Bukan Superuser'}
            </p>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
              Email <span className="font-mono font-bold text-[var(--md-sys-color-on-surface)]">{email}</span> tidak terdaftar{' '}
              {isLocationAdmin ? (
                <>sebagai admin <span className="font-semibold">{locLabel}</span> dalam sistem.</>
              ) : (
                <>sebagai superuser dalam sistem.</>
              )}
            </p>
          </div>

          <div className="space-y-2 text-xs text-[var(--md-sys-color-on-surface-variant)]">
            <p>
              Hanya akun{' '}
              {isLocationAdmin ? (
                <>admin <strong className="font-semibold text-[var(--md-sys-color-on-surface)]">{locLabel}</strong></>
              ) : (
                <>superuser</>
              )}{' '}
              yang terdaftar yang berhak mengelola data absensi KC SulutgoTengPa.
            </p>
            <p>
              Silakan hubungi administrator sistem untuk pendaftaran hak akses baru.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="m3-btn-filled text-xs py-2.5 px-6"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
