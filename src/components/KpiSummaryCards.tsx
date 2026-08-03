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
  selectedLocationName?: string;
}

export const KpiSummaryCards: React.FC<KpiSummaryCardsProps> = ({ records, selectedLocationName }) => {
  const totalLogs = records.length;
  const hadir = records.filter((r) => r.status === 'Hadir').length;
  const izin = records.filter((r) => r.status === 'Izin').length;
  const sakit = records.filter((r) => r.status === 'Sakit').length;
  const alpa = records.filter((r) => r.status === 'Alpa').length;

  const hadirPercentage = totalLogs > 0 ? Math.round((hadir / totalLogs) * 100) : 0;
  const izinPercentage = totalLogs > 0 ? Math.round((izin / totalLogs) * 100) : 0;
  const sakitPercentage = totalLogs > 0 ? Math.round((sakit / totalLogs) * 100) : 0;
  const alpaPercentage = totalLogs > 0 ? Math.round((alpa / totalLogs) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Logs */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 border border-blue-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">100%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-blue-100 mb-1">Total Absensi</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {totalLogs}
            </span>
            <span className="text-sm font-medium text-blue-200 mb-1">records</span>
          </div>
          <p className="mt-2 text-xs font-medium text-blue-100/80 flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            Semua Cabang
          </p>
        </div>
      </div>

      {/* Card 2: Hadir */}
      <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/60 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border border-slate-200/60 hover:border-emerald-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full -mr-16 -mt-16" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">{hadirPercentage}%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Hadir</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {hadir}
            </span>
            <span className="text-sm font-medium text-emerald-600 mb-1">
              ({hadirPercentage}%)
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${hadirPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Kehadiran
          </p>
        </div>
      </div>

      {/* Card 3: Izin + Sakit */}
      <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/60 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 border border-slate-200/60 hover:border-amber-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-transparent rounded-full -mr-16 -mt-16" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">{izinPercentage + sakitPercentage}%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Izin & Sakit</h3>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {izin + sakit}
            </span>
            <span className="text-sm font-medium text-amber-600 mb-1">
              ({izinPercentage + sakitPercentage}%)
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Izin
              </span>
              <span className="font-semibold text-slate-900">{izin} ({izinPercentage}%)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Sakit
              </span>
              <span className="font-semibold text-slate-900">{sakit} ({sakitPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Alpa */}
      <div className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/60 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 border border-slate-200/60 hover:border-rose-200">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-50 to-transparent rounded-full -mr-16 -mt-16" />
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/30 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 border border-rose-200">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span className="text-xs font-semibold text-rose-700">{alpaPercentage}%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Tanpa Keterangan</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              {alpa}
            </span>
            <span className="text-sm font-medium text-rose-600 mb-1">
              ({alpaPercentage}%)
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-500"
              style={{ width: `${alpaPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {alpa > 0 ? 'Butuh Follow-up HRD' : 'Tidak Ada Alpa'}
          </p>
        </div>
      </div>
    </div>
  );
};
