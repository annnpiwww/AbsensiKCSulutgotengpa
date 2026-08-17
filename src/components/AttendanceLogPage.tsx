import React from 'react';
import { PlusCircle } from 'lucide-react';
import type { AttendanceRecord, AttendanceStatus } from '../types/attendance';
import { AttendanceTable } from './AttendanceTable';

interface AttendanceLogPageProps {
  records: AttendanceRecord[];
  onEditRecord: (record: AttendanceRecord) => void;
  isEditable: boolean;
  onOpenAddModal: () => void;
  onBulkUpdateStatus?: (recordIds: string[], newStatus: AttendanceStatus) => void;
}

export const AttendanceLogPage: React.FC<AttendanceLogPageProps> = ({
  records,
  onEditRecord,
  isEditable,
  onOpenAddModal,
  onBulkUpdateStatus,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--md-sys-color-surface-container-lowest)] p-4 sm:p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs print:hidden">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--md-sys-color-on-surface)] tracking-tight">
            Log Presensi Karyawan
          </h2>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
            Kelola dan pantau seluruh catatan absensi karyawan di 18 cabang resmi
          </p>
        </div>

        {isEditable && (
          <button
            onClick={onOpenAddModal}
            className="m3-btn-filled text-xs py-2.5 px-4 shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Input Presensi Baru</span>
          </button>
        )}
      </div>

      {/* Reusable Core Table */}
      <AttendanceTable
        records={records}
        onEditRecord={onEditRecord}
        isEditable={isEditable}
        onBulkUpdateStatus={onBulkUpdateStatus}
      />
    </div>
  );
};
