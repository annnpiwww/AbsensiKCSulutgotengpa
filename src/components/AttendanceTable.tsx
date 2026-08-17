import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  HeartPulse,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Stethoscope,
  Plane,
  AlertCircle,
  X,
} from 'lucide-react';
import type { AttendanceRecord, AttendanceStatus } from '../types/attendance';
import { LOCATION_NAMES } from '../types/attendance';
import { DateField } from './ui/date-field';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEditRecord: (record: AttendanceRecord) => void;
  isEditable: boolean;
}

const STATUS_BADGES: Record<AttendanceStatus, { bg: string; text: string; dot: string; icon: React.ReactNode }> = {
  Hadir: {
    bg: 'bg-emerald-100 border border-emerald-300',
    text: 'text-emerald-900 font-bold',
    dot: 'bg-emerald-600',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
  },
  Sakit: {
    bg: 'bg-sky-100 border border-sky-300',
    text: 'text-sky-900 font-bold',
    dot: 'bg-sky-600',
    icon: <HeartPulse className="w-3.5 h-3.5 text-sky-700" />,
  },
  SKD: {
    bg: 'bg-indigo-100 border border-indigo-300',
    text: 'text-indigo-900 font-bold',
    dot: 'bg-indigo-600',
    icon: <Stethoscope className="w-3.5 h-3.5 text-indigo-700" />,
  },
  Izin: {
    bg: 'bg-amber-100 border border-amber-300',
    text: 'text-amber-900 font-bold',
    dot: 'bg-amber-600',
    icon: <Clock className="w-3.5 h-3.5 text-amber-700" />,
  },
  Terlambat: {
    bg: 'bg-orange-100 border border-orange-300',
    text: 'text-orange-900 font-bold',
    dot: 'bg-orange-600',
    icon: <AlertCircle className="w-3.5 h-3.5 text-orange-700" />,
  },
  Alpa: {
    bg: 'bg-rose-100 border border-rose-300',
    text: 'text-rose-900 font-bold',
    dot: 'bg-rose-600',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />,
  },
  Cuti: {
    bg: 'bg-purple-100 border border-purple-300',
    text: 'text-purple-900 font-bold',
    dot: 'bg-purple-600',
    icon: <Plane className="w-3.5 h-3.5 text-purple-700" />,
  },
  Off: {
    bg: 'bg-slate-100 border border-slate-300',
    text: 'text-slate-700 font-bold',
    dot: 'bg-slate-500',
    icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
  },
};

const getPositionColor = (position: string = '') => {
  const posUpper = position.toUpperCase();
  if (posUpper.includes('LEADER')) return 'text-emerald-700 font-semibold';
  if (posUpper.includes('ADMIN')) return 'text-blue-700 font-semibold';
  if (posUpper.includes('SPP') || posUpper.includes('SPL')) return 'text-rose-700 font-semibold';
  return 'text-[var(--md-sys-color-on-surface-variant)]';
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
      const locName = LOCATION_NAMES[r.location] || r.location;
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locName.toLowerCase().includes(searchTerm.toLowerCase());

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

  const statuses: (AttendanceStatus | 'ALL')[] = ['ALL', 'Hadir', 'Izin', 'Sakit', 'Terlambat', 'Alpa', 'Cuti', 'Off'];

  return (
    <div className="bg-[var(--md-sys-color-surface-container-lowest)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs overflow-hidden mb-6 min-w-0 max-w-full">
      {/* M3 Header Controls & Search Bar */}
      <div className="p-4 sm:p-5 border-b border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div>
          <h3 className="font-bold text-[var(--md-sys-color-on-surface)] text-base tracking-tight">
            Detail Log Absen Karyawan
          </h3>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
            Menampilkan <strong className="font-semibold text-[var(--md-sys-color-primary)]">{filteredRecords.length}</strong> entri terkualifikasi
          </p>
        </div>

        {/* Search Input & Date Picker Pill */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant)]" />
            <input
              type="text"
              placeholder="Cari nama, NIK, lokasi..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[var(--md-sys-color-surface-container-highest)] text-xs text-[var(--md-sys-color-on-surface)] placeholder-[var(--md-sys-color-on-surface-variant)] pl-9 pr-8 py-2 rounded-full border border-[var(--md-sys-color-outline-variant)] focus:outline-hidden focus:border-[var(--md-sys-color-primary)] focus:ring-2 focus:ring-[var(--md-sys-color-primary)]/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="w-40">
            <DateField
              value={dateFilter}
              onChange={(val) => {
                setDateFilter(val);
                setCurrentPage(1);
              }}
              placeholder="Filter Tanggal"
            />
          </div>
        </div>
      </div>

      {/* M3 Horizontal Filter Chips (Pill Shapes) */}
      <div className="px-4 py-3 bg-[var(--md-sys-color-surface-container-lowest)] border-b border-[var(--md-sys-color-outline-variant)] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] pr-1">
          Status:
        </span>
        {statuses.map((st) => {
          const isActive = statusFilter === st;
          return (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] font-bold border border-[var(--md-sys-color-primary)] shadow-xs'
                  : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] border border-transparent hover:bg-[var(--md-sys-color-surface-container-highest)] hover:text-[var(--md-sys-color-on-surface)]'
              }`}
            >
              {st === 'ALL' ? 'Semua Status' : st}
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] font-semibold border-b border-[var(--md-sys-color-outline-variant)]">
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Nama & NIK</th>
              <th className="py-3 px-4">Jabatan</th>
              <th className="py-3 px-4">Cabang</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Keterangan</th>
              {isEditable && <th className="py-3 px-4 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--md-sys-color-outline-variant)]">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((r) => {
                const badge = STATUS_BADGES[r.status] || STATUS_BADGES['Hadir'];
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-[var(--md-sys-color-on-surface)] whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[var(--md-sys-color-on-surface)]">{r.name}</div>
                      <div className="text-[10px] text-[var(--md-sys-color-on-surface-variant)] font-mono">{r.employeeId}</div>
                    </td>
                    <td className={`py-3 px-4 ${getPositionColor(r.position)}`}>
                      {r.position || '-'}
                    </td>
                    <td className="py-3 px-4 font-medium text-[var(--md-sys-color-on-surface)]">
                      {LOCATION_NAMES[r.location] || r.location}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${badge.bg} ${badge.text}`}>
                        {badge.icon}
                        <span>{r.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--md-sys-color-on-surface-variant)] max-w-xs truncate">
                      {r.notes || '-'}
                    </td>
                    {isEditable && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onEditRecord(r)}
                          title="Edit Presensi"
                          className="p-1.5 text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] rounded-full transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={isEditable ? 7 : 6}
                  className="py-8 text-center text-[var(--md-sys-color-on-surface-variant)]"
                >
                  <p className="text-sm font-medium">Tidak ada data presensi yang cocok dengan filter.</p>
                  <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* M3 Table Pagination Footer */}
      <div className="p-3.5 border-t border-[var(--md-sys-color-outline-variant)] flex items-center justify-between bg-[var(--md-sys-color-surface-container-low)]">
        <span className="text-xs text-[var(--md-sys-color-on-surface-variant)] font-medium">
          Halaman <strong className="font-bold text-[var(--md-sys-color-primary)]">{currentPage}</strong> dari {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-full border border-[var(--md-sys-color-outline-variant)] text-xs font-medium text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-full border border-[var(--md-sys-color-outline-variant)] text-xs font-medium text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
