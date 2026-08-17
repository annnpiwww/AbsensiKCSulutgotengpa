import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModernLogin } from './components/ui/modern-login';
import { Sidebar, PageView } from './components/Sidebar';
import { DateRangePicker, DateFilterPreset } from './components/DateRangePicker';
import { LocationSelector } from './components/LocationSelector';
import { KpiSummaryCards } from './components/KpiSummaryCards';
import { AttendanceCharts } from './components/AttendanceCharts';
import { AttendanceTable } from './components/AttendanceTable';
import { ExceptionTrackers } from './components/ExceptionTrackers';
import { AttendanceLogPage } from './components/AttendanceLogPage';
import { LocationAnalyticsPage } from './components/LocationAnalyticsPage';
import { AddAttendanceModal } from './components/AddAttendanceModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { KpiSkeletonGrid, TableSkeleton, AnalyticsSkeleton } from './components/SkeletonLoader';
import type { AttendanceRecord, LocationCode, UserSession } from './types/attendance';
import { LOCATION_NAMES } from './types/attendance';
import { AttendanceService } from './services/attendanceStore';
import { AppApi } from './services/api';
import { Menu, ShieldCheck, UserCheck } from 'lucide-react';

export function App() {
  // Helper to resolve route path
  const getInitialPageFromUrl = (): PageView => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/logs')) return 'logs';
    if (path.includes('/analytics')) return 'analytics';
    return 'dashboard';
  };

  // Auth state (null if logged out, or UserSession)
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('absensi_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Navigation page state synced with URL
  const [currentPage, setCurrentPage] = useState<PageView>(getInitialPageFromUrl());

  // Mobile sidebar drawer state
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Attendance Records
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Location filter state
  const [selectedLocation, setSelectedLocation] = useState<LocationCode | 'ALL'>('ALL');

  // Date Range Filter State
  const [datePreset, setDatePreset] = useState<DateFilterPreset>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchFreshData = async () => {
    setIsLoadingData(true);
    const defaultUrl = 'https://script.google.com/macros/s/AKfycbwlpJ2BUTKa_BRYqxEaXTVLVyfYl5A46_PrCGZs3CAkqeNCI4VAf9mbvE1vwdy4BOwB/exec';
    const targetUrl = localStorage.getItem('absensi_apps_script_url') || defaultUrl;

    try {
      const res = await fetch(targetUrl);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('absensi_kc_sulutgopas_records_v3', JSON.stringify(data));
        AttendanceService.initialize();
        setRecords(data);
        console.log('Successfully fetched and loaded live data from Google Sheet Web App API');
      } else {
        throw new Error('Data is empty or not an array');
      }
    } catch (e) {
      console.warn('Gagal memuat data dari API Google Sheets, menggunakan data lokal/mock.', e);
      const local = AttendanceService.getRecords();
      setRecords(local);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Initialize records on mount & handle browser popstate
  useEffect(() => {
    const initAndFetch = async () => {
      const saved = localStorage.getItem('absensi_kc_sulutgopas_records_v3');
      if (saved) {
        const local = AttendanceService.getRecords();
        setRecords(local);
        fetchFreshData();
      } else {
        await fetchFreshData();
      }
    };
    initAndFetch();

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/login')) {
        setSession(null);
      } else if (path.includes('/logs')) {
        setCurrentPage('logs');
      } else if (path.includes('/analytics')) {
        setCurrentPage('analytics');
      } else {
        setCurrentPage('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize route URL when page changes
  const navigateToPage = (page: PageView) => {
    setCurrentPage(page);
    const targetPath = `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  // Save session when modified
  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
    if (newSession.role === 'LOCATION_ADMIN') {
      setSelectedLocation(newSession.assignedLocation);
    } else {
      setSelectedLocation('ALL');
    }
    window.history.pushState({}, '', '/dashboard');
  };

  const handleLogout = async () => {
    await AppApi.logout();
    setSession(null);
    window.history.pushState({}, '', '/login');
  };

  // Date Filtering Logic
  const handleSelectDatePreset = (preset: DateFilterPreset) => {
    setDatePreset(preset);
    const todayStr = new Date().toISOString().split('T')[0];

    if (preset === 'MONTHLY_1_25') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'TODAY') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === 'THIS_MONTH') {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
      setStartDate(`${year}-${month}-01`);
      setEndDate(`${year}-${month}-${lastDay}`);
    } else if (preset === 'ALL') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleApplyCustomDate = (start: string, end: string) => {
    setDatePreset(start === end ? 'CUSTOM_SINGLE' : 'CUSTOM');
    setStartDate(start);
    setEndDate(end);
  };

  const handleResetDateFilter = () => {
    setDatePreset('ALL');
    setStartDate('');
    setEndDate('');
  };

  // Filter records by both Location & Date Range
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Location Filter
      if (selectedLocation !== 'ALL' && r.location !== selectedLocation) {
        return false;
      }
      // Date Filter
      if (datePreset === 'MONTHLY_1_25') {
        const parts = r.date.split('-');
        if (parts.length === 3) {
          const day = parseInt(parts[2], 10);
          if (day < 1 || day > 25) return false;
        } else {
          return false;
        }
      } else {
        if (startDate && r.date < startDate) return false;
        if (endDate && r.date > endDate) return false;
      }
      return true;
    });
  }, [records, selectedLocation, startDate, endDate, datePreset]);

  const selectedLocationName =
    selectedLocation === 'ALL'
      ? 'Semua 18 Cabang (Pusat)'
      : LOCATION_NAMES[selectedLocation] || selectedLocation;

  // Handlers
  const handleSaveRecord = async (
    recordData: Omit<AttendanceRecord, 'id' | 'createdAt'> & { id?: string }
  ) => {
    if (recordData.id) {
      await AppApi.updateAttendanceData(recordData.id, recordData);
    } else {
      await AppApi.addAttendanceData(recordData);
    }
    const updated = await AppApi.getAttendanceData();
    setRecords(updated);
    setEditingRecord(null);
  };

  const handleEditRecord = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setIsAddModalOpen(true);
  };

  const handleExportCSV = () => {
    AttendanceService.exportToCSV(filteredRecords);
  };

  const handleResetData = async () => {
    if (confirm('Yakin mau reset data kembali ke data asli dari Google Sheet?')) {
      setIsLoadingData(true);
      const defaultUrl = 'https://script.google.com/macros/s/AKfycbwlpJ2BUTKa_BRYqxEaXTVLVyfYl5A46_PrCGZs3CAkqeNCI4VAf9mbvE1vwdy4BOwB/exec';
      const targetUrl = localStorage.getItem('absensi_apps_script_url') || defaultUrl;
      try {
        const res = await fetch(targetUrl);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem('absensi_kc_sulutgopas_records_v3', JSON.stringify(data));
          AttendanceService.initialize();
          setRecords(data);
          alert('Berhasil memuat ulang data langsung dari Google Sheet!');
          return;
        }
        throw new Error();
      } catch (e) {
        alert('Gagal mengambil data dari Google Sheets. Data direset ke data sampel lokal.');
        const reset = AttendanceService.resetToMockData();
        setRecords(reset);
      } finally {
        setIsLoadingData(false);
      }
    }
  };

  // If not logged in, render ModernLogin
  if (!session || window.location.pathname === '/login') {
    return <ModernLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex max-w-full overflow-x-hidden">
      {/* Sidebar Component */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={navigateToPage}
        session={session}
        onLogout={handleLogout}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onOpenAddModal={() => {
          setEditingRecord(null);
          setIsAddModalOpen(true);
        }}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
      />

      {/* Main Content Area - M3 Surface Canvas */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col min-w-0 max-w-full overflow-x-hidden bg-[var(--md-sys-color-surface-container-low)] text-[var(--md-sys-color-on-surface)]">
        {/* Top Header Bar - M3 Center App Bar 64px */}
        <header className="sticky top-0 z-20 bg-[var(--md-sys-color-surface-container)] border-b border-[var(--md-sys-color-outline-variant)] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs w-full max-w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpenMobile(true)}
              className="md:hidden p-2.5 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] hover:bg-[#d8cffc] transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--md-sys-color-primary)]">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-[var(--md-sys-color-on-surface-variant)] font-bold">
                  {currentPage === 'dashboard' && 'Beranda Utama'}
                  {currentPage === 'logs' && 'Log Absensi Detail'}
                  {currentPage === 'analytics' && 'Bandingkan Cabang'}
                </span>
              </div>
              <h1 className="text-base font-extrabold text-[var(--md-sys-color-on-surface)] tracking-tight leading-tight">
                {currentPage === 'dashboard' && 'Monitoring Kehadiran Realtime'}
                {currentPage === 'logs' && 'Log Riwayat Absensi Karyawan'}
                {currentPage === 'analytics' && 'Analisis & Perbandingan Kantor Cabang'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoadingData && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span>Sinkronisasi Google Sheets...</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--md-sys-color-secondary-container)] border border-[var(--md-sys-color-outline-variant)] text-xs font-bold text-[var(--md-sys-color-on-secondary-container)]">
              {session.role === 'SUPERUSER' ? (
                <ShieldCheck className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
              ) : (
                <UserCheck className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
              )}
              <span>{session.name}</span>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 min-w-0 max-w-full overflow-x-hidden">
          {/* Filter Controls - Gabung dalam 1 container flexibel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Date Range Picker Card */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              preset={datePreset}
              onSelectPreset={handleSelectDatePreset}
              onApplyCustomDate={handleApplyCustomDate}
              onResetDateFilter={handleResetDateFilter}
            />

            {/* Location Selector Card */}
            <LocationSelector
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation}
              session={session}
            />
          </div>

          {/* View Switcher dengan Animasi Fast M3 Motion (160ms) & Skeleton Loading */}
          <AnimatePresence mode="wait">
            {currentPage === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.16, ease: [0.2, 0.0, 0.0, 1.0] }}
                className="space-y-6"
              >
                {isLoadingData && records.length === 0 ? (
                  <div className="space-y-6">
                    <KpiSkeletonGrid />
                    <TableSkeleton rows={6} />
                  </div>
                ) : (
                  <>
                    <KpiSummaryCards
                      records={filteredRecords}
                      selectedLocationName={selectedLocationName}
                    />
                    <AttendanceCharts records={filteredRecords} />
                    <AttendanceTable
                      records={filteredRecords}
                      onEditRecord={handleEditRecord}
                      isEditable={session.role === 'SUPERUSER' || session.role === 'LOCATION_ADMIN'}
                    />
                    <ExceptionTrackers records={filteredRecords} />
                  </>
                )}
              </motion.div>
            )}

            {currentPage === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.16, ease: [0.2, 0.0, 0.0, 1.0] }}
              >
                {isLoadingData && records.length === 0 ? (
                  <TableSkeleton rows={8} />
                ) : (
                  <AttendanceLogPage
                    records={filteredRecords}
                    onEditRecord={handleEditRecord}
                    isEditable={session.role === 'SUPERUSER' || session.role === 'LOCATION_ADMIN'}
                    onOpenAddModal={() => {
                      setEditingRecord(null);
                      setIsAddModalOpen(true);
                    }}
                  />
                )}
              </motion.div>
            )}

            {currentPage === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.16, ease: [0.2, 0.0, 0.0, 1.0] }}
              >
                {isLoadingData && records.length === 0 ? (
                  <AnalyticsSkeleton />
                ) : (
                  <LocationAnalyticsPage records={filteredRecords} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <AddAttendanceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        initialRecord={editingRecord}
        session={session}
      />

      <GoogleSheetsSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        records={records}
        onExportCSV={handleExportCSV}
        onImportCSV={(imported) => setRecords(imported)}
      />
    </div>
  );
}

export default App;
