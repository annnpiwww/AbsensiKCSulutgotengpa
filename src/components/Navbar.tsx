import React from 'react';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  PlusCircle,
  FileSpreadsheet,
  Download,
  RotateCcw,
} from 'lucide-react';
import type { UserSession } from '../types/attendance';

interface NavbarProps {
  session: UserSession;
  onSwitchSession: (newSession: UserSession) => void;
  onOpenAddModal: () => void;
  onOpenSyncModal: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  onSwitchSession,
  onOpenAddModal,
  onOpenSyncModal,
  onExportCSV,
  onResetData,
}) => {
  const isSuperuser = session.role === 'SUPERUSER';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent">
                  ABSENSI KC SULUTGOPAS
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  v2.4 Live
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Analisis Multi-Cabang & Sync Google Sheets • 18 Cabang
              </p>
            </div>
          </div>

          {/* Right Action Bar & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Google Sheets Sync Indicator Button */}
            <button
              onClick={onOpenSyncModal}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold hover:bg-emerald-100/80 transition-colors cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hubungkan Ke Google Sheets</span>
            </button>

            {/* Role Switcher Toggle Dropdown */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() =>
                  onSwitchSession({
                    role: 'SUPERUSER',
                    assignedLocation: 'ALL',
                    name: 'Pratama (Pusat HRD)',
                    email: 'hrd.pusat@sulutgopas.co.id',
                  })
                }
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSuperuser
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Akses Manajemen Pusat ke semua 18 cabang"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">Akses Pusat (Superuser)</span>
                <span className="md:hidden">Pusat</span>
              </button>

              <button
                onClick={() =>
                  onSwitchSession({
                    role: 'LOCATION_ADMIN',
                    assignedLocation: 'TBM',
                    name: 'Admin Cabang TBM',
                    email: 'admin.tbm@sulutgopas.co.id',
                  })
                }
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isSuperuser
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Akses Admin Terbatas Cabang TBM"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">Admin Cabang (TBM)</span>
                <span className="md:hidden">TBM</span>
              </button>
            </div>

            {/* Add Attendance Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-md cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Absen</span>
            </button>

            {/* Quick Export CSV */}
            <button
              onClick={onExportCSV}
              className="p-2 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200/80 transition-colors cursor-pointer"
              title="Unduh Laporan CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Reset Mock Data */}
            <button
              onClick={onResetData}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors cursor-pointer"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
