import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HeartPulse,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  FileText,
  Stethoscope,
  Plane,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import type { AttendanceRecord, AttendanceStatus } from '../types/attendance';
import { DateField } from './ui/date-field';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEditRecord: (record: AttendanceRecord) => void;
  isEditable: boolean;
}

const STATUS_BADGES: Record<AttendanceStatus, { bg: string; text: string; dot: string; icon: React.ReactNode }> = {
  Hadir: {
    bg: 'bg-emerald-50 border-emerald-200/70',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
  },
  Sakit: {
    bg: 'bg-blue-50 border-blue-200/70',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    icon: <HeartPulse className="w-3.5 h-3.5 text-blue-600" />,
  },
  SKD: {
    bg: 'bg-sky-50 border-sky-200/70',
    text: 'text-sky-700',
    dot: 'bg-sky-500',
    icon: <Stethoscope className="w-3.5 h-3.5 text-sky-600" />,
  },
  Izin: {
    bg: 'bg-amber-50 border-amber-200/70',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
  },
  Terlambat: {
    bg: 'bg-orange-50 border-orange-200/70',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    icon: <AlertCircle className="w-3.5 h-3.5 text-orange-600" />,
  },
  Alpa: {
    bg: 'bg-rose-50 border-rose-200/70',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
  },
  Cuti: {
    bg: 'bg-purple-50 border-purple-200/70',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
    icon: <Plane className="w-3.5 h-3.5 text-purple-600" />,
  },
  Off: {
    bg: 'bg-slate-100 border-slate-200',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
  },
};

// Position color helper
const getPositionColor = (position: string = '') => {
  const posUpper = position.toUpperCase();
  if (posUpper.includes('LEADER')) return 'text-emerald-600 font-semibold';
  if (posUpper.includes('ADMIN')) return 'text-blue-600 font-semibold';
  if (posUpper.includes('SPP') || posUpper.includes('SPL')) return 'text-rose-600 font-semibold';
  return 'text-slate-400';
};

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  onEditRecord,
  isEditable,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const matchesDate = !dateFilter || r.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [records, searchTerm, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200/60 overflow-hidden mb-6 min-w-0 max-w-full">
      {/* Header Controls */}
      <div className="p-4 sm:p-5 border-b border-blue-100/50 bg-gradient-to-r from-blue-50/30 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-3 w-full min-w-0 max-w-full">
        <div>
          <h3 className="font-bold text-slate-900 text-base tracking-tight">
            Detail Absen Karyawan
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Menampilkan {filteredRecords.length} dari {records.length} data absen
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search Field */}
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau NIP/NBM..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 text-xs py-1.5 w-full sm:w-48 border border-blue-100 bg-blue-50/30 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all text-slate-700 placeholder:text-blue-400/60"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto pl-11 pr-11 py-1.5 text-xs appearance-none cursor-pointer border border-blue-100 bg-blue-50/30 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all text-slate-700"
            >
              <option value="ALL">Semua Status Absen</option>
              <option value="Hadir">Hadir</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="SKD">SKD (Dokter)</option>
              <option value="Terlambat">Terlambat</option>
              <option value="Alpa">Alpa</option>
              <option value="Cuti">Cuti</option>
              <option value="Off">Off</option>
            </select>
            <ChevronDown className="w-4 h-4 text-blue-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <DateField
              value={dateFilter}
              onChange={(v) => {
                setDateFilter(v);
                setCurrentPage(1);
              }}
              placeholder="Filter Tanggal"
              className="w-40 h-8 text-xs rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Responsive Isolated Scroll Table Container */}
      <div className="overflow-x-auto w-full max-w-full min-w-0">
        <table className="w-full text-left text-xs min-w-[680px]">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-100/50 text-blue-700 uppercase tracking-wider text-[10px] font-semibold sticky top-0">
            <tr>
              <th className="px-4 py-3 w-[180px]">Nama Karyawan</th>
              <th className="px-4 py-3 w-[100px]">Cabang</th>
              <th className="px-4 py-3 w-[100px]">Tanggal</th>
              <th className="px-4 py-3 w-[120px]">Status</th>
              <th className="px-4 py-3 w-[200px]">Catatan / Alasan</th>
              <th className="px-4 py-3 text-right w-[100px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50/50">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((r) => {
                const badge = STATUS_BADGES[r.status] || STATUS_BADGES.Hadir;

                return (
                  <tr key={r.id} className="hover:bg-blue-50/30 transition-colors">
                    {/* Employee */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 text-xs truncate">{r.name}</div>
                      <div className={`text-[11px] font-mono mt-0.5 truncate ${getPositionColor(r.position)}`}>
                        {r.employeeId} {r.position ? `• ${r.position}` : ''}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-medium text-[11px] border border-slate-200/50">
                        {r.location}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {r.date}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${badge.bg} ${badge.text}`}
                      >
                        {badge.icon}
                        <span>{r.status}</span>
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">
                      {r.notes ? (
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{r.notes}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic text-[11px]">-</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      {isEditable ? (
                        <button
                          onClick={() => onEditRecord(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-[11px] font-medium transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[10px] font-mono">ReadOnly</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400 font-normal">
                  Nggak ada riwayat absen yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-3.5 border-t border-blue-100/50 flex items-center justify-between bg-gradient-to-r from-blue-50/30 to-transparent">
        <span className="text-[11px] text-slate-600 font-medium">
          Halaman <span className="font-semibold text-blue-700">{currentPage}</span> dari {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-blue-100 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-blue-100 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
