import React, { useState } from 'react';
import { AlertTriangle, HeartPulse, Clock, PhoneCall, CheckCircle } from 'lucide-react';
import { AttendanceRecord } from '../types/attendance';

interface ExceptionTrackersProps {
  records: AttendanceRecord[];
}

export const ExceptionTrackers: React.FC<ExceptionTrackersProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState<'alpa' | 'sakit' | 'izin'>('alpa');

  const alpaRecords = records.filter((r) => r.status === 'Alpa');
  const sakitRecords = records.filter((r) => r.status === 'Sakit');
  const izinRecords = records.filter((r) => r.status === 'Izin');

  // Count alpa occurrences per employee
  const alpaFreqMap = new Map<string, number>();
  alpaRecords.forEach((r) => {
    alpaFreqMap.set(r.employeeId, (alpaFreqMap.get(r.employeeId) || 0) + 1);
  });

  return (
    <div className="bento-card rounded-2xl overflow-hidden mb-6 min-w-0 max-w-full">
      {/* Exception Header Tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0 max-w-full">
        <div>
          <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Pemantauan Khusus (Alpa / Sakit / Izin)</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-normal mt-0.5">
            Cek karyawan yang sering absen untuk keperluan follow-up HRD.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('alpa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'alpa'
                ? 'bg-rose-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Alpa ({alpaRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sakit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sakit'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Sakit ({sakitRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('izin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'izin'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Izin ({izinRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Alpa Tracker */}
      {activeTab === 'alpa' && (
        <div className="p-4 sm:p-5">
          {alpaRecords.length > 0 ? (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-200/70 rounded-xl flex items-center justify-between text-xs text-rose-800 font-medium">
                <span>⚠️ Warning: Data alpa harus dikonfirmasi langsung oleh Supervisor Cabang.</span>
                <span className="font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md text-[10px]">
                  High Priority
                </span>
              </div>
              <div className="overflow-x-auto w-full max-w-full min-w-0">
                <table className="w-full text-left text-xs min-w-[620px]">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-2.5">Nama Karyawan</th>
                      <th className="px-4 py-2.5">Cabang</th>
                      <th className="px-4 py-2.5">Tanggal Alpa</th>
                      <th className="px-4 py-2.5">Frekuensi Total</th>
                      <th className="px-4 py-2.5">Keterangan</th>
                      <th className="px-4 py-2.5 text-right">Tindakan HR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alpaRecords.slice(0, 8).map((r) => {
                      const freq = alpaFreqMap.get(r.employeeId) || 1;
                      return (
                        <tr key={r.id} className="hover:bg-rose-50/20">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {r.name}
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{r.employeeId}</div>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700">{r.location}</td>
                          <td className="px-4 py-3 font-mono text-rose-600 font-medium">{r.date}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${
                              freq > 1 ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {freq}x Alpa
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 italic text-[11px]">{r.notes || 'Tanpa Keterangan'}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => alert(`Memanggil Kepala Cabang ${r.location} untuk verifikasi ${r.name}...`)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-xs cursor-pointer transition-colors"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>Kontak Cabang</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-emerald-600 font-medium text-xs flex flex-col items-center gap-2">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
              <span>Keren! Nggak ada yang alpa hari ini.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sakit Tracker */}
      {activeTab === 'sakit' && (
        <div className="p-4 sm:p-5">
          {sakitRecords.length > 0 ? (
            <div className="overflow-x-auto w-full max-w-full min-w-0">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Karyawan</th>
                    <th className="px-4 py-2.5">Cabang</th>
                    <th className="px-4 py-2.5">Tanggal Sakit</th>
                    <th className="px-4 py-2.5">Diagnosa / Catatan</th>
                    <th className="px-4 py-2.5">Status Berkas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sakitRecords.slice(0, 8).map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/20">
                      <td className="px-4 py-3 font-semibold text-slate-900">{r.name}</td>
                      <td className="px-4 py-3 text-slate-700">{r.location}</td>
                      <td className="px-4 py-3 font-mono text-blue-600 font-medium">{r.date}</td>
                      <td className="px-4 py-3 text-slate-700 text-[11px]">{r.notes}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Surat Dokter OK</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 font-normal text-xs">
              Tidak ada catatan sakit pada periode waktu ini.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Izin Tracker */}
      {activeTab === 'izin' && (
        <div className="p-4 sm:p-5">
          {izinRecords.length > 0 ? (
            <div className="overflow-x-auto w-full max-w-full min-w-0">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Karyawan</th>
                    <th className="px-4 py-2.5">Cabang</th>
                    <th className="px-4 py-2.5">Tanggal Izin</th>
                    <th className="px-4 py-2.5">Keperluan Izin</th>
                    <th className="px-4 py-2.5">Approval</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {izinRecords.slice(0, 8).map((r) => (
                    <tr key={r.id} className="hover:bg-amber-50/20">
                      <td className="px-4 py-3 font-semibold text-slate-900">{r.name}</td>
                      <td className="px-4 py-3 text-slate-700">{r.location}</td>
                      <td className="px-4 py-3 font-mono text-amber-600 font-medium">{r.date}</td>
                      <td className="px-4 py-3 text-slate-700 text-[11px]">{r.notes}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Izin Disetujui</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 font-normal text-xs">
              Tidak ada permohonan izin pada periode waktu ini.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
