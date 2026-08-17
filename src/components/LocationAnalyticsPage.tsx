import React, { useMemo } from 'react';
import type { AttendanceRecord, LocationCode } from '../types/attendance';
import { LOCATION_NAMES, LOCATION_FULL_NAMES } from '../types/attendance';
import {
  AlertOctagon,
  Award,
  BarChart3,
} from 'lucide-react';

interface LocationAnalyticsPageProps {
  records: AttendanceRecord[];
}

interface LocationMetric {
  code: LocationCode;
  name: string;
  totalRecords: number;
  hadir: number;
  terlambat: number;
  alpa: number;
  sakit: number;
  izin: number;
  hadirPercentage: number;
}

export const LocationAnalyticsPage: React.FC<LocationAnalyticsPageProps> = ({ records }) => {
  const locationMetrics: LocationMetric[] = useMemo(() => {
    const map = new Map<string, { total: number; hadir: number; terlambat: number; alpa: number; sakit: number; izin: number }>();

    records.forEach((r) => {
      const code = (r.location || 'TBM') as LocationCode;
      if (!map.has(code)) {
        map.set(code, { total: 0, hadir: 0, terlambat: 0, alpa: 0, sakit: 0, izin: 0 });
      }
      const data = map.get(code)!;
      data.total += 1;
      if (r.status === 'Hadir') data.hadir += 1;
      else if (r.status === 'Terlambat') data.terlambat += 1;
      else if (r.status === 'Alpa') data.alpa += 1;
      else if (r.status === 'Sakit' || r.status === 'SKD') data.sakit += 1;
      else if (r.status === 'Izin') data.izin += 1;
    });

    return Array.from(map.entries()).map(([codeStr, data]) => {
      const code = codeStr as LocationCode;
      const hadirPercentage = data.total > 0 ? Math.round((data.hadir / data.total) * 100) : 0;

      return {
        code,
        name: code, // Singkatan lokasi langsung (contoh: MGBP, TBM)
        totalRecords: data.total,
        hadir: data.hadir,
        terlambat: data.terlambat,
        alpa: data.alpa,
        sakit: data.sakit,
        izin: data.izin,
        hadirPercentage,
      };
    }).sort((a, b) => b.hadirPercentage - a.hadirPercentage);
  }, [records]);

  const highestBranch = locationMetrics[0];
  const lowestBranch = locationMetrics[locationMetrics.length - 1];

  const getBarColor = (pct: number) => {
    if (pct >= 85) return 'from-blue-600 to-indigo-600';
    if (pct >= 70) return 'from-amber-500 to-amber-600';
    return 'from-rose-500 to-rose-600';
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 m3-card-hover">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--md-sys-color-on-surface)] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--md-sys-color-primary)]" />
            <span>Analisis Kinerja Kehadiran Per Kantor Cabang</span>
          </h2>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
            Komparasi statistik disiplin presensi seluruh outlet KC Sulutgotengpa
          </p>
        </div>
      </div>

      {/* Highlights M3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Branch Disciplined Card */}
        {highestBranch && (
          <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs flex items-center gap-4 m3-card-hover">
            <div className="p-3 rounded-2xl bg-blue-100 text-blue-900 shrink-0">
              <Award className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Cabang Kedisiplinan Tertinggi
              </span>
              <h3 className="text-lg font-extrabold text-[var(--md-sys-color-on-surface)] mt-1">
                {highestBranch.code} <span className="text-xs text-[var(--md-sys-color-on-surface-variant)] font-normal">({LOCATION_FULL_NAMES[highestBranch.code] || highestBranch.code})</span>
              </h3>
              <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
                Tingkat Kehadiran: <strong className="text-blue-700 font-bold">{highestBranch.hadirPercentage}%</strong> ({highestBranch.hadir} dari {highestBranch.totalRecords} presensi)
              </p>
            </div>
          </div>
        )}

        {/* Branch Needs Follow Up */}
        {lowestBranch && (
          <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs flex items-center gap-4 m3-card-hover">
            <div className="p-3 rounded-2xl bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)] shrink-0">
              <AlertOctagon className="w-6 h-6 text-[var(--md-sys-color-error)]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--md-sys-color-error)] bg-[var(--md-sys-color-error-container)] px-2.5 py-0.5 rounded-full border border-rose-200">
                Perlu Perhatian HRD
              </span>
              <h3 className="text-lg font-extrabold text-[var(--md-sys-color-on-surface)] mt-1">
                {lowestBranch.code} <span className="text-xs text-[var(--md-sys-color-on-surface-variant)] font-normal">({LOCATION_FULL_NAMES[lowestBranch.code] || lowestBranch.code})</span>
              </h3>
              <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
                Alpa: <strong className="text-[var(--md-sys-color-error)] font-bold">{lowestBranch.alpa} kasus</strong> | Hadir: {lowestBranch.hadirPercentage}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Comparison Table */}
      <div className="bg-[var(--md-sys-color-surface-container-lowest)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs overflow-hidden m3-card-hover">
        <div className="p-4 bg-[var(--md-sys-color-surface-container-low)] border-b border-[var(--md-sys-color-outline-variant)]">
          <h3 className="font-bold text-sm text-[var(--md-sys-color-on-surface)]">
            Peringkat Kehadiran & Rekapitulasi Seluruh Outlet (Singkatan Kode Lokasi)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] font-semibold border-b border-[var(--md-sys-color-outline-variant)]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Kode Lokasi</th>
                <th className="py-3 px-4 text-center">Total Entri</th>
                <th className="py-3 px-4 text-center">Hadir</th>
                <th className="py-3 px-4 text-center">Terlambat</th>
                <th className="py-3 px-4 text-center">Izin / Sakit</th>
                <th className="py-3 px-4 text-center">Alpa</th>
                <th className="py-3 px-4">Persentase Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--md-sys-color-outline-variant)]">
              {locationMetrics.map((b, idx) => (
                <tr key={b.code} className="hover:bg-[var(--md-sys-color-surface-container-low)] transition-colors">
                  <td className="py-3 px-4 font-bold text-[var(--md-sys-color-on-surface-variant)]">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-sm text-[var(--md-sys-color-primary)] px-2.5 py-1 rounded-full bg-[var(--md-sys-color-primary-container)] border border-blue-200 inline-block">
                      {b.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-[var(--md-sys-color-on-surface)]">{b.totalRecords}</td>
                  <td className="py-3 px-4 text-center text-blue-700 font-bold">{b.hadir}</td>
                  <td className="py-3 px-4 text-center text-orange-700 font-bold">{b.terlambat}</td>
                  <td className="py-3 px-4 text-center text-amber-700 font-bold">{b.izin + b.sakit}</td>
                  <td className="py-3 px-4 text-center text-rose-700 font-bold">{b.alpa}</td>
                  <td className="py-3 px-4 min-w-48">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 rounded-full bg-[var(--md-sys-color-surface-container-highest)] overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getBarColor(b.hadirPercentage)} transition-all duration-700`}
                          style={{ width: `${b.hadirPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-extrabold text-[var(--md-sys-color-on-surface)] w-10 text-right">
                        {b.hadirPercentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
