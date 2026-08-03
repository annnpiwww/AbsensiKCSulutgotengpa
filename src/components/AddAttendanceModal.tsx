import React, { useState, useEffect } from 'react';
import { X, Building, User, FileText, ChevronDown } from 'lucide-react';
import { DateField } from './ui/date-field';
import type {
  AttendanceRecord,
  AttendanceStatus,
  LocationCode,
  UserSession,
} from '../types/attendance';
import { ALL_LOCATIONS, LOCATION_NAMES } from '../types/attendance';

interface AddAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<AttendanceRecord, 'id' | 'createdAt'> & { id?: string }) => void;
  initialRecord?: AttendanceRecord | null;
  session: UserSession;
}

export const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRecord,
  session,
}) => {
  const isEditing = !!initialRecord;

  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState<LocationCode>('TBM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AttendanceStatus>('Hadir');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialRecord) {
      setEmployeeId(initialRecord.employeeId);
      setName(initialRecord.name);
      setLocation(initialRecord.location);
      setDate(initialRecord.date);
      setStatus(initialRecord.status);
      setNotes(initialRecord.notes || '');
    } else {
      setEmployeeId(`EMP-${session.assignedLocation === 'ALL' ? 'TBM' : session.assignedLocation}-${Math.floor(100 + Math.random() * 900)}`);
      setName('');
      setLocation(session.assignedLocation === 'ALL' ? 'TBM' : session.assignedLocation);
      setDate(new Date().toISOString().split('T')[0]);
      setStatus('Hadir');
      setNotes('');
    }
  }, [initialRecord, isOpen, session]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(initialRecord ? { id: initialRecord.id } : {}),
      employeeId,
      name,
      location,
      date,
      status,
      notes,
      updatedBy: session.name,
    });
    onClose();
  };

  const AVAILABLE_STATUSES: AttendanceStatus[] = [
    'Hadir',
    'Izin',
    'Sakit',
    'SKD',
    'Alpa',
    'Terlambat',
    'Cuti',
    'Off',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bento-card max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              {isEditing ? 'Edit Absensi Karyawan' : 'Input Absen Baru'}
            </h3>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">
              Data otomatis sinkron ke database cabang
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium">
          {/* Employee ID & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">NBM / NIP</label>
              <input
                type="text"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="input-modern w-full font-mono text-xs font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">Nama Lengkap</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="misal: Maya Kusuma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-modern w-full pl-8 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">Kantor Cabang</label>
              <div className="relative">
                <Building className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  disabled={session.role !== 'SUPERUSER'}
                  value={location}
                  onChange={(e) => setLocation(e.target.value as LocationCode)}
                  className="input-modern w-full pl-11 pr-11 text-xs font-medium cursor-pointer disabled:opacity-70 appearance-none"
                >
                  {ALL_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {LOCATION_NAMES[loc]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1 text-[11px]">Tanggal Presensi</label>
              <DateField
                value={date}
                onChange={setDate}
                placeholder="Pilih tanggal"
              />
            </div>
          </div>

          {/* Status Chips */}
          <div>
            <label className="block text-slate-600 font-medium mb-1.5 text-[11px]">Status Kehadiran</label>
            <div className="grid grid-cols-4 gap-1.5">
              {AVAILABLE_STATUSES.map((st) => {
                const isSelected = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? st === 'Hadir'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : st === 'Sakit' || st === 'SKD'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : st === 'Izin' || st === 'Terlambat'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-600 font-medium mb-1 text-[11px]">Catatan / Keterangan</label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                placeholder="Ada catatan tambahan? (opsional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-modern w-full pl-8 text-xs font-normal"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              {isEditing ? 'Simpan Perubahan' : 'Simpan Presensi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
