import React, { useState, useEffect, useMemo } from 'react';
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
  Printer,
  History,
  CheckSquare,
  Square,
  UserCheck,
} from 'lucide-react';
import type { AttendanceRecord, AttendanceStatus } from '../types/attendance';
import { LOCATION_NAMES } from '../types/attendance';
import { DateField } from './ui/date-field';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEditRecord: (record: AttendanceRecord) => void;
  isEditable: boolean;
  onBulkUpdateStatus?: (recordIds: string[], newStatus: AttendanceStatus) => void;
}

const ALL_STATUSES: AttendanceStatus[] = [
  'Hadir',
  'Izin',
  'Sakit',
  'SKD',
  'Alpa',
  'Cuti',
  'Off',
  'Terlambat',
];

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
    icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-700" />,
  },
  Alpa: {
    bg: 'bg-rose-100 border border-rose-300',
    text: 'text-rose-900 font-bold',
    dot: 'bg-rose-600',
    icon: <AlertCircle className="w-3.5 h-3.5 text-rose-700" />,
  },
  Cuti: {
    bg: 'bg-purple-100 border border-purple-300',
    text: 'text-purple-900 font-bold',
    dot: 'bg-purple-600',
    icon: <Plane className="w-3.5 h-3.5 text-purple-700" />,
  },
  Off: {
    bg: 'bg-slate-100 border border-slate-300',
    text: 'text-slate-900 font-bold',
    dot: 'bg-slate-500',
    icon: <Clock className="w-3.5 h-3.5 text-slate-600" />,
  },
};

const AttendanceTableComponent: React.FC<AttendanceTableProps> = ({
  records,
  onEditRecord,
  isEditable,
  onBulkUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus>('Hadir');
  const [auditLogRecord, setAuditLogRecord] = useState<AttendanceRecord | null>(null);

  const ITEMS_PER_PAGE = 15;

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (LOCATION_NAMES[r.location] || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchDate = !dateFilter || r.date === dateFilter;

      return matchSearch && matchDate;
    });
  }, [records, searchTerm, dateFilter]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  // Checkbox Selection Logic
  const isAllPageSelected =
    paginatedRecords.length > 0 &&
    paginatedRecords.every((r) => selectedRecordIds.includes(r.id));

  const handleSelectAllPage = () => {
    if (isAllPageSelected) {
      const pageIds = new Set(paginatedRecords.map((r) => r.id));
      setSelectedRecordIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = paginatedRecords.map((r) => r.id);
      setSelectedRecordIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedRecordIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyBulkUpdate = () => {
    if (selectedRecordIds.length === 0) return;
    if (onBulkUpdateStatus) {
      onBulkUpdateStatus(selectedRecordIds, bulkStatus);
    } else {
      // Fallback update via onEditRecord
      selectedRecordIds.forEach((id) => {
        const rec = records.find((r) => r.id === id);
        if (rec) {
          onEditRecord({
            ...rec,
            status: bulkStatus,
            updatedAt: new Date().toISOString(),
          });
        }
      });
    }
    setSelectedRecordIds([]);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="bg-[var(--md-sys-color-surface-container-lowest)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs overflow-hidden print:border-none print:shadow-none">
      {/* Header Controls & Search Bar */}
      <div className="p-4 sm:p-5 border-b border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] flex flex-col md:flex-row md:items-center justify-between gap-4 w-full print:hidden">
        <div>
          <h3 className="font-bold text-[var(--md-sys-color-on-surface)] text-base tracking-tight">
            Detail Log Absen Karyawan
          </h3>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
            Menampilkan <strong className="font-semibold text-[var(--md-sys-color-primary)]">{filteredRecords.length}</strong> entri terkualifikasi
          </p>
        </div>

        {/* Search Input, Date Picker, & Print PDF Action */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] cursor-pointer"
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

          {/* Export PDF / Cetak Button */}
          <button
            onClick={handlePrintPDF}
            className="m3-btn-outlined text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
            title="Cetak atau Export PDF"
          >
            <Printer className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Bulk Status Update Action Bar */}
      {selectedRecordIds.length > 0 && isEditable && (
        <div className="p-3 px-5 bg-blue-50 border-b border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150 print:hidden">
          <div className="flex items-center gap-2 font-medium text-blue-900">
            <UserCheck className="w-4 h-4 text-blue-700" />
            <span>
              Terpilih <strong className="font-bold">{selectedRecordIds.length}</strong> karyawan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-blue-900 font-medium">Ubah Status Ke:</span>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as AttendanceStatus)}
              className="bg-white border border-blue-300 rounded-lg px-2.5 py-1 text-xs font-bold text-blue-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <button
              onClick={handleApplyBulkUpdate}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              Terapkan Bulk Update
            </button>

            <button
              onClick={() => setSelectedRecordIds([])}
              className="text-blue-700 hover:text-blue-900 hover:underline px-2 py-1 cursor-pointer font-medium"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider font-semibold border-b border-[var(--md-sys-color-outline-variant)]">
              {isEditable && (
                <th className="py-3 px-3 w-10 text-center print:hidden">
                  <button
                    onClick={handleSelectAllPage}
                    className="p-1 hover:bg-[var(--md-sys-color-surface-container-highest)] rounded-md transition-colors text-[var(--md-sys-color-primary)] cursor-pointer"
                    title="Pilih Semua di Halaman Ini"
                  >
                    {isAllPageSelected ? (
                      <CheckSquare className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
                    ) : (
                      <Square className="w-4 h-4 opacity-60" />
                    )}
                  </button>
                </th>
              )}
              <th className="py-3 px-4">Nama & NIK</th>
              <th className="py-3 px-4">Cabang</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Jam Kerja</th>
              <th className="py-3 px-4">Catatan</th>
              <th className="py-3 px-4 text-right print:hidden">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--md-sys-color-outline-variant)]">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((r) => {
                const badge = STATUS_BADGES[r.status] || STATUS_BADGES.Hadir;
                const isSelected = selectedRecordIds.includes(r.id);

                return (
                  <tr
                    key={r.id}
                    className={`transition-colors hover:bg-[var(--md-sys-color-surface-container-low)] ${
                      isSelected ? 'bg-blue-50/60' : ''
                    }`}
                  >
                    {isEditable && (
                      <td className="py-3.5 px-3 text-center print:hidden">
                        <button
                          onClick={() => handleToggleSelect(r.id)}
                          className="p-1 hover:bg-[var(--md-sys-color-surface-container-highest)] rounded-md transition-colors text-[var(--md-sys-color-primary)] cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
                          ) : (
                            <Square className="w-4 h-4 opacity-50" />
                          )}
                        </button>
                      </td>
                    )}
                    <td className="py-3.5 px-4 font-medium text-[var(--md-sys-color-on-surface)]">
                      <div className="font-bold text-[var(--md-sys-color-on-surface)]">{r.name}</div>
                      <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] font-mono">
                        {r.employeeId} {r.role ? `• ${r.role}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--md-sys-color-on-surface-variant)] font-medium">
                      <span className="font-bold text-[var(--md-sys-color-on-surface)]">{r.location}</span>
                      <div className="text-[10px] text-[var(--md-sys-color-on-surface-variant)] truncate max-w-[120px]">
                        {LOCATION_NAMES[r.location] || r.location}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-[var(--md-sys-color-on-surface)] whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ${badge.bg} ${badge.text}`}
                      >
                        {badge.icon}
                        <span>{r.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-[var(--md-sys-color-on-surface-variant)] whitespace-nowrap">
                      {r.timeIn || '--:--'} - {r.timeOut || '--:--'}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--md-sys-color-on-surface-variant)] max-w-xs truncate text-[11px]">
                      {r.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right print:hidden">
                      <div className="flex items-center justify-end gap-1">
                        {/* Audit Log / History Button */}
                        <button
                          onClick={() => setAuditLogRecord(r)}
                          className="p-1.5 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)] hover:text-[var(--md-sys-color-primary)] rounded-full transition-colors cursor-pointer"
                          title="Lihat Riwayat Perubahan (Audit Log)"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        {/* Edit Record Button */}
                        {isEditable && (
                          <button
                            onClick={() => onEditRecord(r)}
                            className="p-1.5 text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] rounded-full transition-colors cursor-pointer"
                            title="Edit Absensi"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={isEditable ? 8 : 7}
                  className="py-12 text-center text-[var(--md-sys-color-on-surface-variant)] text-xs"
                >
                  <p className="font-medium">Tidak ada data absensi ditemukan.</p>
                  <p className="text-[11px] mt-1 opacity-70">
                    Coba sesuaikan kata kunci pencarian atau filter tanggal.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs print:hidden">
        <div className="text-[var(--md-sys-color-on-surface-variant)] font-medium">
          Menampilkan baris {(currentPage - 1) * ITEMS_PER_PAGE + 1} hingga{' '}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)} dari{' '}
          <strong className="text-[var(--md-sys-color-on-surface)]">{filteredRecords.length}</strong> entri
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-full border border-[var(--md-sys-color-outline-variant)] text-xs font-medium text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>
          <span className="font-medium px-1 text-[var(--md-sys-color-on-surface)]">
            Halaman <strong className="text-[var(--md-sys-color-primary)]">{currentPage}</strong> dari {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages || filteredRecords.length === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-full border border-[var(--md-sys-color-outline-variant)] text-xs font-medium text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Audit Log Modal Popover M3 */}
      {auditLogRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs print:hidden">
          <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[24px] border border-[var(--md-sys-color-outline-variant)] shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[var(--md-sys-color-outline-variant)] pb-3">
              <div className="flex items-center gap-2.5 font-bold text-base text-[var(--md-sys-color-on-surface)]">
                <History className="w-5 h-5 text-[var(--md-sys-color-primary)]" />
                <span>Riwayat Perubahan (Audit Log)</span>
              </div>
              <button
                onClick={() => setAuditLogRecord(null)}
                className="p-1.5 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[var(--md-sys-color-surface-container-lowest)] rounded-xl border border-[var(--md-sys-color-outline-variant)] space-y-1">
                <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] uppercase font-semibold">
                  Informasi Karyawan
                </div>
                <div className="font-extrabold text-sm text-[var(--md-sys-color-on-surface)]">
                  {auditLogRecord.name}
                </div>
                <div className="text-[var(--md-sys-color-on-surface-variant)] font-mono">
                  NIK: {auditLogRecord.employeeId} | Cabang: {auditLogRecord.location}
                </div>
              </div>

              <div className="p-3 bg-[var(--md-sys-color-surface-container-lowest)] rounded-xl border border-[var(--md-sys-color-outline-variant)] space-y-2">
                <div>
                  <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] uppercase font-semibold">
                    Diperbarui Oleh
                  </div>
                  <div className="font-bold text-[var(--md-sys-color-primary)] text-xs mt-0.5">
                    {auditLogRecord.updatedBy || 'Sistem Central / Google Sheets API'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] uppercase font-semibold">
                    Waktu Perubahan Terakhir
                  </div>
                  <div className="font-mono text-xs text-[var(--md-sys-color-on-surface)] mt-0.5">
                    {auditLogRecord.updatedAt
                      ? new Date(auditLogRecord.updatedAt).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Sinkronisasi Otomatis'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] uppercase font-semibold">
                    Status & Catatan
                  </div>
                  <div className="font-medium text-[var(--md-sys-color-on-surface)] mt-0.5">
                    Status: <strong className="font-bold">{auditLogRecord.status}</strong>
                  </div>
                  {auditLogRecord.notes && (
                    <div className="text-[var(--md-sys-color-on-surface-variant)] italic mt-0.5">
                      "{auditLogRecord.notes}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAuditLogRecord(null)}
                className="m3-btn-filled text-xs py-2 px-5 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AttendanceTable = React.memo(AttendanceTableComponent);
