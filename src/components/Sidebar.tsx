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
      label: 'Rangkuman Absen',
      icon: LayoutDashboard,
      desc: 'Ringkasan & KPI Absensi',
    },
    {
      id: 'logs' as PageView,
      label: 'Riwayat Absensi',
      icon: ClipboardList,
      desc: 'Data Absen Realtime',
    },
    {
      id: 'analytics' as PageView,
      label: 'Analisis Cabang',
      icon: BarChart3,
      desc: 'Bandingkan 18 Cabang',
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 border-r border-blue-100/60 text-slate-800 selection:bg-blue-500 selection:text-white">
      <div>
        {/* Brand Header with Logo */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-blue-100/50">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-blue-500/10 flex items-center justify-center overflow-hidden border border-blue-100/50 shrink-0">
              <img src={logoImg} alt="Logo" className="w-full h-full object-cover p-1.5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">KC SulutGoTengPa</h2>
              <p className="text-xs font-semibold text-blue-600 mt-0.5 truncate">Monitoring Kehadiran</p>
            </div>
          </div>
          {/* Mobile Close */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg hover:bg-blue-100/50 text-slate-400 hover:text-slate-600 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="space-y-2 mb-6">
          {(session.role === 'SUPERUSER' || session.role === 'LOCATION_ADMIN') && (
            <button
              onClick={() => {
                onOpenAddModal();
                onCloseMobile();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Tambah Absen Baru</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => {
                onOpenSyncModal();
                onCloseMobile();
              }}
              className="py-2 px-2.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-medium border border-blue-100 transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              Sinkron Database
            </button>
            <button
              onClick={() => {
                onExportCSV();
                onCloseMobile();
              }}
              className="py-2 px-2.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-medium border border-blue-100 transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              Download
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
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
                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-blue-50/50 hover:text-blue-700 font-medium'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <div className="min-w-0">
                  <div className={`text-xs leading-none ${isActive ? 'font-medium' : 'font-medium'}`}>{item.label}</div>
                  <div className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Profile Card & Footer Actions */}
      <div className="space-y-3 pt-4 border-t border-blue-100/50">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100/70">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md bg-blue-600 text-white border-none">
              {session.role === 'SUPERUSER' ? 'Superuser' : 'Admin Cabang'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-xs font-semibold text-slate-900 truncate">{session.name}</p>
          <p className="text-[11px] text-slate-500 truncate">{session.email}</p>
          {session.role === 'LOCATION_ADMIN' && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 pt-1.5 mt-1.5 border-t border-blue-100/60">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate">{session.assignedLocation}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={onLogout}
            className="w-full py-2 px-2.5 rounded-lg hover:bg-rose-50 text-rose-600 font-medium text-xs flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
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
