import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
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
    <div className="bento-card rounded-2xl overflow-hidden mb-6 min-w-0 max-w-full">
      {/* Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 w-full min-w-0 max-w-full">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">
            Detail Absen Karyawan
          </h3>
          <p className="text-[11px] text-slate-500 font-normal mt-0.5">
            Menampilkan {filteredRecords.length} dari {records.length} data absen
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search Field */}
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau NIP/NBM..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="input-modern pl-8 text-xs py-1.5 w-full sm:w-48"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="input-modern w-full sm:w-auto pl-11 pr-11 py-1.5 text-xs appearance-none cursor-pointer"
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
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="text-[11px] text-rose-500 font-medium ml-1 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Isolated Scroll Table Container */}
      <div className="overflow-x-auto w-full max-w-full min-w-0">
        <table className="w-full text-left text-xs min-w-[680px]">
          <thead className="bg-slate-50/90 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[10px] font-semibold sticky top-0">
            <tr>
              <th className="px-5 py-3">Nama Karyawan</th>
              <th className="px-4 py-3">Cabang</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Catatan / Alasan</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((r) => {
                const badge = STATUS_BADGES[r.status] || STATUS_BADGES.Hadir;

                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 text-xs">{r.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
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
      <div className="p-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <span className="text-[11px] text-slate-500 font-medium">
          Halaman <span className="font-semibold text-slate-900">{currentPage}</span> dari {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
