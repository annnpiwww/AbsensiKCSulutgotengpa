import React, { useState, useEffect } from 'react';
import { X, Building, User, FileText } from 'lucide-react';
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

  const [date, setDate] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState<LocationCode>('TBM');
  const [status, setStatus] = useState<AttendanceStatus>('Hadir');
  const [checkInTime, setCheckInTime] = useState('08:00');
  const [checkOutTime, setCheckOutTime] = useState('17:00');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialRecord) {
      setDate(initialRecord.date || '');
      setEmployeeId(initialRecord.employeeId || '');
      setName(initialRecord.name || '');
      setPosition(initialRecord.position || '');
      setLocation(initialRecord.location || 'TBM');
      setStatus(initialRecord.status || 'Hadir');
      setNotes(initialRecord.notes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setEmployeeId('');
      setName('');
      setPosition('');

      if (session.role === 'SUPERUSER') {
        setLocation('TBM');
      } else if (session.assignedLocation && session.assignedLocation !== 'ALL') {
        setLocation(session.assignedLocation as LocationCode);
      } else {
        setLocation('TBM');
      }

      setStatus('Hadir');
      setCheckInTime('08:00');
      setCheckOutTime('17:00');
      setNotes('');
    }
  }, [initialRecord, isOpen, session]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !employeeId) {
      alert('Nama dan NIK wajib diisi!');
      return;
    }

    const fullNotes = status === 'Alpa' || status === 'Off' 
      ? notes 
      : (notes ? `Jam: ${checkInTime}-${checkOutTime} | ${notes}` : `Jam: ${checkInTime}-${checkOutTime}`);

    onSave({
      id: initialRecord?.id,
      date,
      employeeId,
      name,
      position,
      location,
      status,
      notes: fullNotes,
      updatedBy: session.name,
    });

    onClose();
  };

  const isLocationSelectable = session.role === 'SUPERUSER' || session.assignedLocation === 'ALL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[var(--md-sys-color-outline-variant)] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-[var(--md-sys-color-on-surface)]">
              {isEditing ? 'Edit Catatan Presensi' : 'Tambah Presensi Baru'}
            </h2>
            <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
              Isi data absensi karyawan secara rinci & presisi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Tanggal & Lokasi Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Tanggal Presensi
              </label>
              <DateField
                value={date}
                onChange={(val) => setDate(val)}
                placeholder="Pilih Tanggal"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
                <span>Lokasi Kantor</span>
              </label>
              <select
                disabled={!isLocationSelectable}
                value={location}
                onChange={(e) => setLocation(e.target.value as LocationCode)}
                className="w-full bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline)] rounded-xl px-3 py-2 text-xs text-[var(--md-sys-color-on-surface)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden disabled:opacity-60 transition-colors"
              >
                {ALL_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc} - {LOCATION_NAMES[loc]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nama & NIK Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
                <span>Nama Lengkap *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline)] rounded-xl px-3 py-2 text-xs text-[var(--md-sys-color-on-surface)] placeholder-[var(--md-sys-color-on-surface-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                NIK / Nomor Induk *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 10245"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline)] rounded-xl px-3 py-2 text-xs text-[var(--md-sys-color-on-surface)] placeholder-[var(--md-sys-color-on-surface-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Jabatan & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Jabatan / Posisi
              </label>
              <input
                type="text"
                placeholder="Contoh: Staff Admin / Leader"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline)] rounded-xl px-3 py-2 text-xs text-[var(--md-sys-color-on-surface)] placeholder-[var(--md-sys-color-on-surface-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                Status Kehadiran
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                className="w-full bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline)] rounded-xl px-3 py-2 text-xs text-[var(--md-sys-color-on-surface)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden transition-colors font-medium"
              >
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
                <option value="SKD">SKD</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Alpa">Alpa</option>
                <option value="Cuti">Cuti</option>
                <option value="Off">Off</option>
              </select>
            </div>
          </div>

          {/* Jam Masuk & Jam Pulang */}
          {status !== 'Alpa' && status !== 'Off' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Jam Masuk
                </label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline)] rounded-xl px-3 py-2 text-xs text-[var(--md-sys-color-on-surface)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Jam Pulang
                </label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline)] rounded-xl px-3 py-2 text-xs text-[var(--md-sys-color-on-surface)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden transition-colors"
                />
              </div>
            </div>
          )}

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
              <span>Catatan / Keterangan</span>
            </label>
            <textarea
              rows={2}
              placeholder="Catatan tambahan (alasan izin, surat dokter, dll)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[var(--md-sys-color-surface-container-lowest)] border border-[var(--md-sys-color-outline)] rounded-xl p-3 text-xs text-[var(--md-sys-color-on-surface)] placeholder-[var(--md-sys-color-on-surface-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="m3-btn-outlined text-xs py-2 px-5"
            >
              Batal
            </button>
            <button
              type="submit"
              className="m3-btn-filled text-xs py-2 px-6"
            >
              {isEditing ? 'Simpan Perubahan' : 'Simpan Presensi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
