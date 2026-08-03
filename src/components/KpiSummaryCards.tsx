import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  HeartPulse,
  AlertTriangle,
  TrendingUp,
  Building,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { AttendanceRecord } from '../types/attendance';

interface KpiSummaryCardsProps {
  records: AttendanceRecord[];
  selectedLocationName: string;
}

export const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({
  records,
  selectedLocationName,
}) => {
  const totalLogs = records.length;

  // Calculate distinct employees
  const employeeSet = new Set(records.map((r) => r.employeeId));
  const totalEmployees = employeeSet.size;

  let hadir = 0;
  let izin = 0;
  let sakit = 0;
  let alpa = 0;

  records.forEach((r) => {
    if (r.status === 'Hadir') hadir++;
    else if (r.status === 'Izin') izin++;
    else if (r.status === 'Sakit') sakit++;
    else if (r.status === 'Alpa') alpa++;
  });

  const attendanceRate = totalLogs > 0 ? Math.round((hadir / totalLogs) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. HERO BENTO TILE: Executive Overview (Spans 2 cols on Desktop) */}
      <div className="lg:col-span-2 bento-hero p-6 flex flex-col justify-between relative overflow-hidden group">
        {/* Background Subtle Mesh / Glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-sky-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rangkuman Absen</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <Building className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate max-w-[180px]">{selectedLocationName}</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-slate-400 font-medium">Tingkat Kehadiran</div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {attendanceRate}%
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5" />
                Target Min. 90%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-medium text-slate-300">
              <span>Status Kehadiran ({hadir} / {totalLogs} Log)</span>
              <span>{attendanceRate}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-white">
              <Users className="w-4 h-4 text-sky-300" />
            </div>
            <div>
              <span className="font-semibold text-white">{totalEmployees} Karyawan</span>
              <span className="text-slate-400 ml-1">tercatat di cabang</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-0.5">
            Realtime updates <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 2. STAT BENTO TILE: Hadir (Hadir Tepat Waktu) */}
      <div className="bento-card bento-card-hover p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Hadir Tepat Waktu
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {hadir}
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({totalLogs > 0 ? Math.round((hadir / totalLogs) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Hadir Sesuai Jadwal
          </p>
        </div>
      </div>

      {/* 3. STAT BENTO TILE: Sakit */}
      <div className="bento-card bento-card-hover p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Izin Sakit
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {sakit}
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({totalLogs > 0 ? Math.round((sakit / totalLogs) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-blue-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Ada Surat Dokter / Izin Mandiri
          </p>
        </div>
      </div>

      {/* 4. STAT BENTO TILE: Izin */}
      <div className="bento-card bento-card-hover p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Permohonan Izin
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {izin}
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({totalLogs > 0 ? Math.round((izin / totalLogs) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Ada Tugas Dinas atau Izin Resmi
          </p>
        </div>
      </div>

      {/* 5. STAT BENTO TILE: Alpa (Alert tile) */}
      <div className={`bento-card bento-card-hover p-5 flex flex-col justify-between ${
        alpa > 0 ? 'border-rose-200 bg-rose-50/20' : ''
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
            Ketidakhadiran Alpa
          </span>
          <div className={`p-2 rounded-xl border ${
            alpa > 0
              ? 'bg-rose-100 text-rose-700 border-rose-200'
              : 'bg-slate-50 text-slate-400 border-slate-200/60'
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
              {alpa}
            </span>
            <span className="text-xs font-medium text-rose-600">
              ({totalLogs > 0 ? Math.round((alpa / totalLogs) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1.5 text-[11px] font-medium text-rose-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {alpa > 0 ? 'Butuh Follow-up HRD' : 'Tidak Ada Alpa'}
          </p>
        </div>
      </div>
    </div>
  );
};
