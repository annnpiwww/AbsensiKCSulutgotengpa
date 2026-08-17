import React, { useState } from 'react';
import { AlertTriangle, HeartPulse, Clock, CheckCircle } from 'lucide-react';
import { AttendanceRecord } from '../types/attendance';

interface ExceptionTrackersProps {
  records: AttendanceRecord[];
}

export const ExceptionTrackers: React.FC<ExceptionTrackersProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState<'alpa' | 'sakit' | 'izin'>('alpa');

  const alpaRecords = records.filter((r) => r.status === 'Alpa');
  const sakitRecords = records.filter((r) => r.status === 'Sakit');
  const izinRecords = records.filter((r) => r.status === 'Izin');

  const alpaFreqMap = new Map<string, number>();
  alpaRecords.forEach((r) => {
    alpaFreqMap.set(r.employeeId, (alpaFreqMap.get(r.employeeId) || 0) + 1);
  });

  return (
    <div className="bg-[var(--md-sys-color-surface-container-lowest)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs overflow-hidden mb-6 min-w-0 max-w-full">
      {/* Exception Header Tabs M3 */}
      <div className="p-4 sm:p-5 bg-[var(--md-sys-color-surface-container-low)] border-b border-[var(--md-sys-color-outline-variant)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-[var(--md-sys-color-on-surface)] text-sm tracking-tight">
            Rekap Kasus Khusus
          </h3>
          <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
            Rincian karyawan yang alpa, sakit, atau izin
          </p>
        </div>

        {/* M3 Segmented Pill Tabs */}
        <div className="flex items-center gap-1.5 bg-[var(--md-sys-color-surface-container-highest)] p-1 rounded-full border border-[var(--md-sys-color-outline-variant)]">
          <button
            onClick={() => setActiveTab('alpa')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'alpa'
                ? 'bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)] border border-rose-300 shadow-xs'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Alpa ({alpaRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sakit')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sakit'
                ? 'bg-blue-100 text-blue-900 border border-blue-300 shadow-xs'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
            <span>Sakit ({sakitRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('izin')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'izin'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                : 'text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Izin ({izinRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'alpa' && (
        <div className="p-4 sm:p-5">
          {alpaRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] font-semibold border-b border-[var(--md-sys-color-outline-variant)]">
                    <th className="px-4 py-2.5">Nama Karyawan</th>
                    <th className="px-4 py-2.5">NIK</th>
                    <th className="px-4 py-2.5">Kantor Cabang</th>
                    <th className="px-4 py-2.5">Tanggal Alpa</th>
                    <th className="px-4 py-2.5">Frekuensi Alpa</th>
                    <th className="px-4 py-2.5">Tindakan HRD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--md-sys-color-outline-variant)]">
                  {alpaRecords.map((r) => {
                    const freq = alpaFreqMap.get(r.employeeId) || 1;
                    return (
                      <tr key={r.id} className="hover:bg-[var(--md-sys-color-surface-container-low)]">
                        <td className="px-4 py-3 font-bold text-[var(--md-sys-color-on-surface)]">{r.name}</td>
                        <td className="px-4 py-3 font-mono text-[var(--md-sys-color-on-surface-variant)]">{r.employeeId}</td>
                        <td className="px-4 py-3">{r.location}</td>
                        <td className="px-4 py-3 font-mono text-rose-700 font-medium">{r.date}</td>
                        <td className="px-4 py-3 font-bold text-rose-700">
                          {freq}x Alpa
                        </td>
                        <td className="px-4 py-3">
                          {freq >= 3 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--md-sys-color-on-error-container)] bg-[var(--md-sys-color-error-container)] px-2.5 py-1 rounded-full border border-rose-300">
                              <AlertTriangle className="w-3 h-3 text-rose-700" />
                              Peringatan SP-1 HRD
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                              Konfirmasi Absensi
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--md-sys-color-on-surface-variant)] font-medium text-xs">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              Nihil catatan alpa tanpa keterangan pada periode ini.
            </div>
          )}
        </div>
      )}

      {activeTab === 'sakit' && (
        <div className="p-4 sm:p-5">
          {sakitRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] font-semibold border-b border-[var(--md-sys-color-outline-variant)]">
                    <th className="px-4 py-2.5">Nama Karyawan</th>
                    <th className="px-4 py-2.5">NIK</th>
                    <th className="px-4 py-2.5">Kantor Cabang</th>
                    <th className="px-4 py-2.5">Tanggal Izin Sakit</th>
                    <th className="px-4 py-2.5">Catatan / Surat Dokter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--md-sys-color-outline-variant)]">
                  {sakitRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-[var(--md-sys-color-surface-container-low)]">
                      <td className="px-4 py-3 font-bold text-[var(--md-sys-color-on-surface)]">{r.name}</td>
                      <td className="px-4 py-3 font-mono text-[var(--md-sys-color-on-surface-variant)]">{r.employeeId}</td>
                      <td className="px-4 py-3">{r.location}</td>
                      <td className="px-4 py-3 font-mono text-blue-700 font-medium">{r.date}</td>
                      <td className="px-4 py-3 text-[var(--md-sys-color-on-surface-variant)]">{r.notes || 'Sakit berijin'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--md-sys-color-on-surface-variant)] text-xs">
              Tidak ada catatan sakit pada periode ini.
            </div>
          )}
        </div>
      )}

      {activeTab === 'izin' && (
        <div className="p-4 sm:p-5">
          {izinRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] font-semibold border-b border-[var(--md-sys-color-outline-variant)]">
                    <th className="px-4 py-2.5">Nama Karyawan</th>
                    <th className="px-4 py-2.5">NIK</th>
                    <th className="px-4 py-2.5">Kantor Cabang</th>
                    <th className="px-4 py-2.5">Tanggal Izin</th>
                    <th className="px-4 py-2.5">Alasan Permohonan Izin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--md-sys-color-outline-variant)]">
                  {izinRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-[var(--md-sys-color-surface-container-low)]">
                      <td className="px-4 py-3 font-bold text-[var(--md-sys-color-on-surface)]">{r.name}</td>
                      <td className="px-4 py-3 font-mono text-[var(--md-sys-color-on-surface-variant)]">{r.employeeId}</td>
                      <td className="px-4 py-3">{r.location}</td>
                      <td className="px-4 py-3 font-mono text-amber-700 font-medium">{r.date}</td>
                      <td className="px-4 py-3 text-[var(--md-sys-color-on-surface-variant)]">{r.notes || 'Keperluan keluarga / dinas luar'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--md-sys-color-on-surface-variant)] text-xs">
              Tidak ada permohonan izin pada periode ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
