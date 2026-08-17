import React from 'react';
import type { UserSession } from '../types/attendance';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Building2,
  X,
  PlusCircle,
  Download,
  Sparkles,
} from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export type PageView = 'dashboard' | 'logs' | 'analytics';

interface SidebarProps {
  currentPage: PageView;
  onSelectPage: (page: PageView) => void;
  session: UserSession;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenAddModal: () => void;
  onOpenSyncModal: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  session,
  onLogout,
  isOpenMobile,
  onCloseMobile,
  onOpenAddModal,
  onOpenSyncModal,
  onExportCSV,
  onResetData,
}) => {
  const navItems = [
    {
      id: 'dashboard' as PageView,
      label: 'Dashboard Utama',
      icon: LayoutDashboard,
      desc: 'Ringkasan & Statistik',
    },
    {
      id: 'logs' as PageView,
      label: 'Log Presensi Detail',
      icon: ClipboardList,
      desc: 'Tabel Rekap & Filter',
    },
    {
      id: 'analytics' as PageView,
      label: 'Analisis Per Lokasi',
      icon: BarChart3,
      desc: 'Kinerja Kantor Cabang',
    },
  ];

  const sidebarContent = (
    <div className="h-full bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)] flex flex-col border-r border-[var(--md-sys-color-outline-variant)] shadow-sm select-none px-3 py-4">
      {/* Header Brand */}
      <div className="flex items-center justify-between pb-4 px-2 mb-2 border-b border-[var(--md-sys-color-outline-variant)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={logoImg}
              alt="Logo KC Sulutgo"
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[var(--md-sys-color-primary-container)] shadow-xs"
            />
            <div className="absolute -bottom-1 -right-1 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] rounded-full p-0.5">
              <Building2 className="w-2.5 h-2.5" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sm text-[var(--md-sys-color-on-surface)] tracking-tight leading-none">
              KC Sulutgotengpa
            </h1>
            <p className="text-[11px] font-medium text-[var(--md-sys-color-on-surface-variant)] mt-1 flex items-center gap-1">
              <span>Sistem Absensi Office</span>
            </p>
          </div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-2 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* M3 Extended Action FAB / Primary Action */}
      <div className="px-1 mb-4">
        <button
          onClick={() => {
            onOpenAddModal();
            onCloseMobile();
          }}
          className="w-full bg-[var(--md-sys-color-primary-container)] hover:bg-[#d8cffc] active:scale-[0.98] text-[var(--md-sys-color-on-primary-container)] font-medium text-xs py-3 px-4 rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
          <span>Input Presensi Baru</span>
        </button>
      </div>

      {/* Navigation Items - M3 Pill Drawers */}
      <div className="flex-1 space-y-1.5 px-1 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-semibold tracking-wider text-[var(--md-sys-color-primary)] uppercase">
          Menu Navigasi
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectPage(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-semibold shadow-xs'
                  : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] hover:text-[var(--md-sys-color-on-surface)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--md-sys-color-primary)]' : 'opacity-70'}`} />
              <div className="text-left leading-tight">
                <div className="text-xs">{item.label}</div>
                <div className={`text-[10px] opacity-70 ${isActive ? 'text-[var(--md-sys-color-on-secondary-container)]' : ''}`}>
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}

        {/* Quick Tools Header */}
        <div className="pt-4 px-3 py-1 text-[11px] font-semibold tracking-wider text-[var(--md-sys-color-primary)] uppercase">
          Aksi Cepat Data
        </div>

        <button
          onClick={() => {
            onOpenSyncModal();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] hover:text-[var(--md-sys-color-on-surface)] transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Sync Google Sheets</span>
        </button>

        <button
          onClick={() => {
            onExportCSV();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] hover:text-[var(--md-sys-color-on-surface)] transition-all"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Export CSV</span>
        </button>

        <button
          onClick={() => {
            onResetData();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-error-container)] hover:text-[var(--md-sys-color-on-error-container)] transition-all"
        >
          <RefreshCw className="w-4 h-4 text-rose-500" />
          <span>Reset Google Sheets</span>
        </button>
      </div>

      {/* User Session Footer (M3 Elevated Surface Container High) */}
      <div className="pt-3 border-t border-[var(--md-sys-color-outline-variant)]">
        <div className="bg-[var(--md-sys-color-surface-container-high)] p-3 rounded-2xl mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center font-bold text-xs">
                {session.role === 'SUPERUSER' ? 'SU' : 'AD'}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-[var(--md-sys-color-on-surface)]">{session.name}</p>
                <p className="text-[10px] font-medium text-[var(--md-sys-color-on-surface-variant)] capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                  {session.role === 'SUPERUSER' ? 'Superuser Mode' : 'Admin Cabang'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 text-rose-600 hover:bg-[var(--md-sys-color-error-container)] rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Animated Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[80vw] h-full z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
