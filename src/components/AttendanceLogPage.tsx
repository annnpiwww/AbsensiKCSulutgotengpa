import React, { useState, useMemo } from 'react';
import type { AttendanceRecord, AttendanceStatus } from '../types/attendance';
import {
  Search,
  Clock,
  AlertTriangle,
  UserX,
  Edit2,
  Building2,
  CheckCircle2,
  PlusCircle,
  FileText,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';

interface AttendanceLogPageProps {
  records: AttendanceRecord[];
  onEditRecord: (record: AttendanceRecord) => void;
  isEditable: boolean;
  onOpenAddModal: () => void;
}

const STATUS_BADGES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Hadir: { bg: 'bg-emerald-50 border-emerald-200/70', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Hadir' },
  Terlambat: { bg: 'bg-amber-50 border-amber-200/70', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Terlambat' },
  Alpa: { bg: 'bg-rose-50 border-rose-200/70', text: 'text-rose-700', dot: 'bg-rose-500', label: 'Alpa (Tanpa Keterangan)' },
  Sakit: { bg: 'bg-purple-50 border-purple-200/70', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Sakit' },
  Izin: { bg: 'bg-blue-50 border-blue-200/70', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Izin' },
  SKD: { bg: 'bg-violet-50 border-violet-200/70', text: 'text-violet-700', dot: 'bg-violet-500', label: 'SKD (Dokter)' },
  Cuti: { bg: 'bg-teal-50 border-teal-200/70', text: 'text-teal-700', dot: 'bg-teal-500', label: 'Cuti' },
  Off: { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Off' },
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  Hadir: <CheckCircle2 className="w-3.5 h-3.5" />,
  Terlambat: <Clock className="w-3.5 h-3.5" />,
  Alpa: <UserX className="w-3.5 h-3.5" />,
  Sakit: <HeartPulse className="w-3.5 h-3.5" />,
  Izin: <FileText className="w-3.5 h-3.5" />,
  SKD: <Stethoscope className="w-3.5 h-3.5" />,
  Cuti: <Building2 className="w-3.5 h-3.5" />,
};

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

  const statusOptions = ['ALL', 'Hadir', 'Terlambat', 'Izin', 'Sakit', 'SKD', 'Alpa', 'Cuti', 'Off'];

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-sky-100 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Realtime
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Riwayat Absensi Karyawan</h2>
            <p className="text-sm text-blue-100 mt-1">
              Semua log presensi terupdate realtime, urut berdasarkan tanggal
            </p>
          </div>
          {isEditable && (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm rounded-xl shadow-lg transition-all cursor-pointer self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              Tambah Absensi
            </button>
          )}
        </div>
      </div>

      {/* Log Table Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200/60 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-blue-100/50 flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau NIP/NBM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-blue-100 bg-blue-50/30 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all text-sm text-slate-700 placeholder:text-blue-400/60"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {statusOptions.map((opt) => {
              const isAll = opt === 'ALL';
              const active = selectedStatus === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setSelectedStatus(opt as AttendanceStatus | 'ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-blue-50/50 border border-blue-100 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {isAll ? 'Semua' : opt}
                </button>
              );
            })}
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Urutan</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
              className="px-3 py-1.5 text-xs font-semibold border border-blue-100 bg-blue-50/30 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500/30 outline-none cursor-pointer appearance-none"
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full max-w-full min-w-0">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-100/50 text-blue-700 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="px-4 py-3 w-[180px]">Nama Karyawan</th>
                <th className="px-4 py-3 w-[120px]">Cabang</th>
                <th className="px-4 py-3 w-[110px]">Tanggal</th>
                <th className="px-4 py-3 w-[150px]">Status</th>
                <th className="px-4 py-3">Catatan</th>
                {isEditable && <th className="px-4 py-3 text-right w-[80px]">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/50">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={isEditable ? 6 : 5} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <AlertTriangle className="w-10 h-10 opacity-40" />
                      <p className="text-sm font-medium">Tidak ada data log yang cocok dengan filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const badge = STATUS_BADGES[r.status] || STATUS_BADGES.Hadir;
                  return (
                    <tr key={r.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900 text-xs truncate">{r.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{r.employeeId}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50/60 text-blue-700 font-mono font-medium text-[11px] border border-blue-100">
                          {r.location}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">{r.date}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${badge.bg} ${badge.text}`}>
                          {STATUS_ICONS[r.status] || null}
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 max-w-[200px]">
                        {r.notes ? (
                          <span className="truncate block text-[11px]">{r.notes}</span>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">-</span>
                        )}
                      </td>
                      {isEditable && (
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => onEditRecord(r)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white hover:border-transparent text-[11px] font-medium transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-blue-100/50 flex items-center justify-between bg-gradient-to-r from-blue-50/30 to-transparent">
          <span className="text-[11px] text-slate-600 font-medium">
            Menampilkan <strong className="text-blue-700 font-semibold">{filteredRecords.length}</strong> dari{' '}
            {records.length} log absensi
          </span>
        </div>
      </div>
    </div>
  );
};