import React, { useState, useMemo } from 'react';
import type { AttendanceRecord, AttendanceStatus } from '../types/attendance';
import { LOCATION_NAMES } from '../types/attendance';
import {
  Search,
  CheckCircle2,
  Clock,
  HeartPulse,
  AlertTriangle,
  Edit2,
  PlusCircle,
  Stethoscope,
} from 'lucide-react';

interface AttendanceLogPageProps {
  records: AttendanceRecord[];
  onEditRecord: (record: AttendanceRecord) => void;
  isEditable: boolean;
  onOpenAddModal: () => void;
}

const STATUS_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  Hadir: { bg: 'bg-emerald-100 border border-emerald-300', text: 'text-emerald-900 font-bold', label: 'Hadir' },
  Sakit: { bg: 'bg-sky-100 border border-sky-300', text: 'text-sky-900 font-bold', label: 'Sakit' },
  SKD: { bg: 'bg-indigo-100 border border-indigo-300', text: 'text-indigo-900 font-bold', label: 'SKD' },
  Izin: { bg: 'bg-amber-100 border border-amber-300', text: 'text-amber-900 font-bold', label: 'Izin' },
  Terlambat: { bg: 'bg-orange-100 border border-orange-300', text: 'text-orange-900 font-bold', label: 'Terlambat' },
  Alpa: { bg: 'bg-rose-100 border border-rose-300', text: 'text-rose-900 font-bold', label: 'Alpa' },
  Cuti: { bg: 'bg-purple-100 border border-purple-300', text: 'text-purple-900 font-bold', label: 'Cuti' },
  Off: { bg: 'bg-slate-100 border border-slate-300', text: 'text-slate-700 font-bold', label: 'Off' },
};

export const AttendanceLogPage: React.FC<AttendanceLogPageProps> = ({
  records,
  onEditRecord,
  isEditable,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | 'ALL'>('ALL');

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const locName = LOCATION_NAMES[r.location] || r.location;
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, selectedStatus]);

  const statuses: (AttendanceStatus | 'ALL')[] = ['ALL', 'Hadir', 'Izin', 'Sakit', 'Terlambat', 'Alpa', 'Cuti', 'Off'];

  return (
    <div className="space-y-4">
      {/* Header Log Page */}
      <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--md-sys-color-on-surface)] tracking-tight">
            Log Riwayat Absensi Karyawan
          </h2>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
            Merekap seluruh catatan kehadiran karyawan antar lokasi kantor
          </p>
        </div>

        {isEditable && (
          <button
            onClick={onOpenAddModal}
            className="m3-btn-filled text-xs py-2.5 px-5"
          >
            <PlusCircle className="w-4 h-4 text-[var(--md-sys-color-on-primary)]" />
            <span>Tambah Catatan Presensi</span>
          </button>
        )}
      </div>

      {/* Main Table Card */}
      <div className="bg-[var(--md-sys-color-surface-container-lowest)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 bg-[var(--md-sys-color-surface-container-low)] border-b border-[var(--md-sys-color-outline-variant)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant)]" />
            <input
              type="text"
              placeholder="Cari nama, NIK, lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--md-sys-color-surface-container-highest)] text-xs text-[var(--md-sys-color-on-surface)] placeholder-[var(--md-sys-color-on-surface-variant)] pl-9 pr-4 py-2 rounded-full border border-[var(--md-sys-color-outline-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {statuses.map((st) => {
              const active = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] border border-[var(--md-sys-color-primary)] shadow-xs'
                      : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)]'
                  }`}
                >
                  {st === 'ALL' ? 'Semua' : st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] font-semibold border-b border-[var(--md-sys-color-outline-variant)]">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Nama Karyawan</th>
                <th className="py-3 px-4">NIK</th>
                <th className="py-3 px-4">Jabatan</th>
                <th className="py-3 px-4">Kantor Cabang</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Catatan / Keterangan</th>
                {isEditable && <th className="py-3 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--md-sys-color-outline-variant)]">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => {
                  const badge = STATUS_BADGES[r.status] || STATUS_BADGES['Hadir'];
                  return (
                    <tr key={r.id} className="hover:bg-[var(--md-sys-color-surface-container-low)]">
                      <td className="py-3 px-4 font-mono font-medium text-[var(--md-sys-color-on-surface)]">{r.date}</td>
                      <td className="py-3 px-4 font-bold text-[var(--md-sys-color-on-surface)]">{r.name}</td>
                      <td className="py-3 px-4 font-mono text-[var(--md-sys-color-on-surface-variant)]">{r.employeeId}</td>
                      <td className="py-3 px-4 text-[var(--md-sys-color-on-surface-variant)]">{r.position || '-'}</td>
                      <td className="py-3 px-4 font-medium text-[var(--md-sys-color-on-surface)]">{LOCATION_NAMES[r.location] || r.location}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--md-sys-color-on-surface-variant)] max-w-xs truncate">{r.notes || '-'}</td>
                      {isEditable && (
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onEditRecord(r)}
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
                  <td colSpan={isEditable ? 8 : 7} className="py-8 text-center text-[var(--md-sys-color-on-surface-variant)]">
                    Tidak ada catatan presensi yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] text-xs text-[var(--md-sys-color-on-surface-variant)]">
          Menampilkan <strong className="text-[var(--md-sys-color-primary)]">{filteredRecords.length}</strong> entri terkualifikasi
        </div>
      </div>
    </div>
  );
};
