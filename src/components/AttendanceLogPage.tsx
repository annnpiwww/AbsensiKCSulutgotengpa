import React, { useState, useMemo } from 'react';
import type { AttendanceRecord, AttendanceStatus, LocationCode } from '../types/attendance';
import { LOCATION_NAMES } from '../types/attendance';
import {
  Search,
  Filter,
  Clock,
  AlertTriangle,
  UserX,
  Edit2,
  Calendar,
  Building2,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  ChevronDown,
} from 'lucide-react';

interface AttendanceLogPageProps {
  records: AttendanceRecord[];
  onEditRecord: (record: AttendanceRecord) => void;
  isEditable: boolean;
  onOpenAddModal: () => void;
}

export const AttendanceLogPage: React.FC<AttendanceLogPageProps> = ({
  records,
  onEditRecord,
  isEditable,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | 'ALL'>('ALL');

  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
      return matchSearch && matchStatus;
    });
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [records, searchTerm, selectedStatus, sortOrder]);

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'Hadir':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hadir Tepat Waktu
          </span>
        );
      case 'Terlambat':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60 inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Terlambat
          </span>
        );
      case 'Alpa':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200/60 inline-flex items-center gap-1.5">
            <UserX className="w-3.5 h-3.5" />
            Alpa (Tanpa Keterangan)
          </span>
        );
      case 'Sakit':
      case 'SKD':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 inline-flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Sakit ({status})
          </span>
        );
      case 'Izin':
      case 'Cuti':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/60 inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Izin / Cuti
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bento Banner */}
      <div className="bento-hero p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden min-w-0 max-w-full">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-sky-300 font-medium w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Database Log Absen</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Riwayat Absensi Karyawan</h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Daftar lengkap riwayat absen harian karyawan dari 18 cabang KC SulutGo & Tengpa.
          </p>
        </div>

        {isEditable && (
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Input Absen Baru</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar Bento Card */}
      <div className="bento-card p-4 sm:p-5 rounded-2xl space-y-3 min-w-0 max-w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Field */}
          <div className="relative md:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau NIP/NBM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern w-full pl-9 text-xs py-2"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AttendanceStatus | 'ALL')}
              className="input-modern w-full pl-11 pr-11 text-xs py-2 appearance-none cursor-pointer"
            >
              <option value="ALL">Semua Status Absen</option>
              <option value="Hadir">Hadir Tepat Waktu</option>
              <option value="Terlambat">Terlambat</option>
              <option value="Alpa">Alpa</option>
              <option value="Sakit">Sakit</option>
              <option value="Izin">Izin</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status Counter Bar */}
        <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            Menampilkan <strong className="text-slate-900 font-semibold">{filteredRecords.length}</strong> dari{' '}
            <strong className="text-slate-900 font-semibold">{records.length}</strong> total riwayat.
          </span>
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline">Urutkan:</span>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                className="input-modern pl-3 pr-8 py-1.5 sm:py-1 text-[11px] font-medium appearance-none cursor-pointer border-slate-200/80 bg-slate-50 hover:bg-slate-100"
              >
                <option value="desc">Paling Baru</option>
                <option value="asc">Paling Lama</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bento-card rounded-2xl overflow-hidden min-w-0 max-w-full">
        <div className="overflow-x-auto w-full max-w-full min-w-0">
          <table className="w-full text-left border-collapse min-w-[680px] text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Nama Karyawan</th>
                <th className="py-3 px-4">Cabang</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Keterangan / Posisi</th>
                {isEditable && <th className="py-3 px-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <UserX className="w-7 h-7 mx-auto mb-2 opacity-40 text-slate-400" />
                    Data absen yang kamu cari nggak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">{r.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{r.employeeId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap text-xs font-medium">
                      {LOCATION_NAMES[r.location] || r.location}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(r.status)}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate text-[11px]">
                      {r.notes || r.position || '-'}
                    </td>
                    {isEditable && (
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onEditRecord(r)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Presensi"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
