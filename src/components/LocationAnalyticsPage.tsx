import React, { useMemo } from 'react';
import type { AttendanceRecord, LocationCode } from '../types/attendance';
import { LOCATION_NAMES } from '../types/attendance';
import {
  AlertOctagon,
  Clock,
  Building2,
  Award,
  CheckCircle2,
  Sparkles,
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
  latePercentage: number;
  alpaPercentage: number;
}

export const LocationAnalyticsPage: React.FC<LocationAnalyticsPageProps> = ({ records }) => {
  // Aggregate metrics per branch location
  const branchMetrics = useMemo(() => {
    const map: Record<string, LocationMetric> = {};

    (Object.keys(LOCATION_NAMES) as LocationCode[]).forEach((loc) => {
      map[loc] = {
        code: loc,
        name: LOCATION_NAMES[loc],
        totalRecords: 0,
        hadir: 0,
        terlambat: 0,
        alpa: 0,
        sakit: 0,
        izin: 0,
        hadirPercentage: 0,
        latePercentage: 0,
        alpaPercentage: 0,
      };
    });

    records.forEach((r) => {
      const metric = map[r.location];
      if (metric) {
        metric.totalRecords += 1;
        if (r.status === 'Hadir') metric.hadir += 1;
        else if (r.status === 'Terlambat') metric.terlambat += 1;
        else if (r.status === 'Alpa') metric.alpa += 1;
        else if (r.status === 'Sakit' || r.status === 'SKD') metric.sakit += 1;
        else if (r.status === 'Izin' || r.status === 'Cuti') metric.izin += 1;
      }
    });

    return Object.values(map).map((m) => {
      const total = m.totalRecords || 1;
      return {
        ...m,
        hadirPercentage: Math.round(((m.hadir + m.terlambat) / total) * 100),
        latePercentage: Math.round((m.terlambat / total) * 100),
        alpaPercentage: Math.round((m.alpa / total) * 100),
      };
    });
  }, [records]);

  const topDisciplined = useMemo(() => {
    return [...branchMetrics]
      .filter((b) => b.totalRecords > 0)
      .sort((a, b) => b.hadirPercentage - a.hadirPercentage || a.terlambat - b.terlambat)[0];
  }, [branchMetrics]);

  const topLate = useMemo(() => {
    return [...branchMetrics]
      .filter((b) => b.totalRecords > 0)
      .sort((a, b) => b.terlambat - a.terlambat || b.latePercentage - a.latePercentage)[0];
  }, [branchMetrics]);

  const topAlpa = useMemo(() => {
    return [...branchMetrics]
      .filter((b) => b.totalRecords > 0)
      .sort((a, b) => b.alpa - a.alpa || b.alpaPercentage - a.alpaPercentage)[0];
  }, [branchMetrics]);

  const topPerfectAttendance = useMemo(() => {
    return branchMetrics.filter((b) => b.totalRecords > 0 && b.alpa === 0 && b.terlambat === 0);
  }, [branchMetrics]);

  return (
    <div className="space-y-6">
      {/* Header Bento Hero Banner */}
      <div className="bento-hero p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden min-w-0 max-w-full">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-sky-300 font-medium w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Analytics Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Analisis Kinerja 18 Cabang</h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Pantau tingkat kehadiran, keterlambatan, dan riwayat alpa karyawan di 18 cabang KC SulutGo & Tengpa.
          </p>
        </div>
      </div>

      {/* Top Insights Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0 max-w-full">
        {/* Most Disciplined */}
        <div className="bento-card p-5 border-emerald-200/80 bg-emerald-50/20 relative overflow-hidden min-w-0 max-w-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200/60">
              Cabang Paling Rajin
            </span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900 truncate">
            {topDisciplined ? topDisciplined.name : '-'}
          </h3>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Tingkat Kehadiran: <strong className="text-sm font-extrabold">{topDisciplined ? topDisciplined.hadirPercentage : 0}%</strong>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Hadir: {topDisciplined?.hadir || 0} | Terlambat: {topDisciplined?.terlambat || 0}
          </div>
        </div>

        {/* Most Late */}
        <div className="bento-card p-5 border-amber-200/80 bg-amber-50/20 relative overflow-hidden min-w-0 max-w-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200/60">
              Paling Sering Telat
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900 truncate">{topLate ? topLate.name : '-'}</h3>
          <div className="text-xs text-amber-700 font-medium mt-1">
            Terlambat: <strong className="text-sm font-extrabold">{topLate ? topLate.terlambat : 0} Log</strong>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Rasio Terlambat: {topLate ? topLate.latePercentage : 0}% dari total log.
          </div>
        </div>

        {/* Most Alpa */}
        <div className="bento-card p-5 border-rose-200/80 bg-rose-50/20 relative overflow-hidden min-w-0 max-w-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200/60">
              Alpa Terbanyak
            </span>
            <AlertOctagon className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900 truncate">{topAlpa ? topAlpa.name : '-'}</h3>
          <div className="text-xs text-rose-700 font-medium mt-1">
            Total Alpa: <strong className="text-sm font-extrabold">{topAlpa ? topAlpa.alpa : 0} Kejadian</strong>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Rasio Alpa: {topAlpa ? topAlpa.alpaPercentage : 0}% dari total log.
          </div>
        </div>
      </div>

      {/* Perfect Attendance Banner */}
      {topPerfectAttendance.length > 0 && (
        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/70 flex items-center gap-2.5 min-w-0 max-w-full overflow-hidden text-xs text-blue-900">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="truncate">
            <strong className="font-semibold">Mantap! Bebas Telat & Alpa:</strong>{' '}
            {topPerfectAttendance.map((b) => b.name).join(', ')}
          </div>
        </div>
      )}

      {/* 18 Branches Matrix Table */}
      <div className="bento-card rounded-2xl overflow-hidden min-w-0 max-w-full">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Matriks Kepatuhan 18 Kantor Cabang
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto w-full max-w-full min-w-0">
          <table className="w-full text-left border-collapse min-w-[680px] text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Nama Kantor Cabang</th>
                <th className="py-3 px-4 text-center">Total Log</th>
                <th className="py-3 px-4 text-center">Hadir</th>
                <th className="py-3 px-4 text-center">Terlambat</th>
                <th className="py-3 px-4 text-center">Alpa</th>
                <th className="py-3 px-4 text-center">Sakit</th>
                <th className="py-3 px-4 text-center">Izin</th>
                <th className="py-3 px-4">Tingkat Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branchMetrics.map((b) => (
                <tr key={b.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    {b.name}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-800">
                    {b.totalRecords}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-emerald-600 bg-emerald-50/30">
                    {b.hadir}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-amber-600 bg-amber-50/30">
                    {b.terlambat}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-rose-600 bg-rose-50/30">
                    {b.alpa}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-blue-600">
                    {b.sakit}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-purple-600">
                    {b.izin}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            b.hadirPercentage >= 85
                              ? 'bg-emerald-500'
                              : b.hadirPercentage >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${b.hadirPercentage}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 w-9 text-right">
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
