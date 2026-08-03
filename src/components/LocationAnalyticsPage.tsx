import React, { useMemo } from 'react';
import type { AttendanceRecord, LocationCode } from '../types/attendance';
import { LOCATION_NAMES } from '../types/attendance';
import {
  AlertOctagon,
  Clock,
  Building2,
  Award,
  ShieldCheck,
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

  const cleanBranches = useMemo(() => {
    return branchMetrics.filter((b) => b.totalRecords > 0 && b.alpa === 0 && b.terlambat === 0);
  }, [branchMetrics]);

  // Render highlight stat cards
  const getBarColor = (p: number) => {
    if (p >= 85) return 'from-emerald-500 to-emerald-600';
    if (p >= 70) return 'from-blue-500 to-blue-600';
    if (p >= 50) return 'from-amber-500 to-amber-600';
    return 'from-rose-500 to-rose-600';
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-sky-100 mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              Analisis 18 Cabang
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Perbandingan Kinerja Cabang</h2>
            <p className="text-sm text-blue-100 mt-1">
              Bandingkan tingkat kedisiplinan, keterlambatan, dan alpa setiap unit cabang
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-center px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-xl font-bold leading-tight">{branchMetrics.filter((b) => b.totalRecords > 0).length}</div>
              <div className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Cabang Aktif</div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Top Disciplined */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/60 border border-slate-200/60 hover:shadow-xl transition-all duration-300">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-emerald-50 blur-2xl" />
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shadow-lg shadow-emerald-500/20`}>
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 truncate">Cabang Paling Disiplin</h3>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 truncate mb-1">{topDisciplined ? topDisciplined.name : '-'}</h2>
          <div className="text-sm text-emerald-600 font-semibold mb-2">
            Tingkat Kehadiran: <span className="font-extrabold">{topDisciplined ? topDisciplined.hadirPercentage : 0}%</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Hadir: {topDisciplined?.hadir || 0} &nbsp;|&nbsp; Terlambat: {topDisciplined?.terlambat || 0}
          </div>
        </div>

        {/* Top Late */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/60 border border-slate-200/60 hover:shadow-xl transition-all duration-300">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-amber-50 blur-2xl" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shadow-lg shadow-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 truncate">Rata Terlambat Terbanyak</h3>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 truncate mb-1">{topLate ? topLate.name : '-'}</h2>
          <div className="text-sm text-amber-600 font-semibold mb-2">
            Terlambat: <span className="font-extrabold">{topLate ? topLate.terlambat : 0} Log</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Rasio Terlambat: {topLate ? topLate.latePercentage : 0}% dari total log.
          </div>
        </div>

        {/* Top Alpa */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/60 border border-slate-200/60 hover:shadow-xl transition-all duration-300">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-rose-50 blur-2xl" />
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shadow-lg shadow-rose-500/20">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 truncate">Alpa Terbanyak</h3>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 truncate mb-1">{topAlpa ? topAlpa.name : '-'}</h2>
          <div className="text-sm text-rose-600 font-semibold mb-2">
            Total Alpa: <span className="font-extrabold">{topAlpa ? topAlpa.alpa : 0} Kejadian</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Rasio Alpa: {topAlpa ? topAlpa.alpaPercentage : 0}% dari total log.
          </div>
        </div>
      </div>

      {/* Clean branches info band */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/60 flex items-center gap-2.5 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>
          <strong className="font-bold">{cleanBranches.length}</strong> cabang mencatat <strong className="font-bold">nol absensi bermasalah</strong>
          {' '}(tanpa alpa &amp; keterlambatan).
        </span>
      </div>

      {/* 18 Branches Matrix Table */}
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200/60 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-blue-100/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Matriks Kinerja 18 Cabang</h3>
              <p className="text-[11px] text-slate-500">Perbandingan kehadiran per unit cabang</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto w-full max-w-full min-w-0">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-100/50 text-blue-700 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="px-4 py-3 w-[60px]">Rank</th>
                <th className="px-4 py-3">Cabang</th>
                <th className="px-4 py-3 text-center w-[80px]">Total</th>
                <th className="px-4 py-3 text-center w-[80px]">Hadir</th>
                <th className="px-4 py-3 text-center w-[80px]">Terlambat</th>
                <th className="px-4 py-3 text-center w-[80px]">Alpa</th>
                <th className="px-4 py-3 w-[180px]">Tingkat Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/50">
              {branchMetrics.map((b, idx) => (
                <tr key={b.code} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-[11px] font-bold ${
                      idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-100 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50/50 text-slate-500'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 text-xs truncate max-w-[220px]">{b.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{b.code}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 tabular-nums">{b.totalRecords || '-'}</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-semibold tabular-nums">{b.hadir}</td>
                  <td className="py-3 px-4 text-center text-amber-600 font-semibold tabular-nums">{b.terlambat}</td>
                  <td className="py-3 px-4 text-center text-rose-600 font-semibold tabular-nums">{b.alpa}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getBarColor(b.hadirPercentage)} transition-all duration-500`}
                          style={{ width: `${b.hadirPercentage}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 w-9 text-right tabular-nums">
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