import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  HeartPulse,
  AlertTriangle,
  Building,
  Sparkles,
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
    <div className="space-y-3">
      {/* Location Filter Indicator Pill */}
      {selectedLocationName && (
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] text-xs font-medium border border-[var(--md-sys-color-outline-variant)]">
            <Building className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
            <span>Filter Lokasi: <strong className="font-semibold">{selectedLocationName}</strong></span>
          </div>
          <span className="text-xs text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 inline" />
            Menampilkan data spesifik lokasi
          </span>
        </div>
      )}

      {/* Grid KPI M3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Presensi (M3 Primary Container Accent) */}
        <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs m3-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
              Total Catatan Absensi
            </span>
            <div className="p-2.5 rounded-2xl bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]">
              <Users className="w-5 h-5 text-[var(--md-sys-color-primary)]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--md-sys-color-on-surface)] tracking-tight">
              {totalLogs}
            </span>
            <span className="text-xs font-medium text-[var(--md-sys-color-on-surface-variant)]">
              Catatan
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-[var(--md-sys-color-surface-container-highest)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--md-sys-color-primary)] rounded-full transition-all duration-500 w-full" />
          </div>
          <p className="mt-2 text-xs text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--md-sys-color-primary)]" />
            Seluruh catatan absensi terkumpul
          </p>
        </div>

        {/* Card 2: Hadir (M3 Tonal Emerald Success) */}
        <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs m3-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
              Total Hadir
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--md-sys-color-on-surface)] tracking-tight">
              {hadir}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {hadirPercentage}%
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-[var(--md-sys-color-surface-container-highest)] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${hadirPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {hadirPercentage >= 80 ? 'Tingkat Kehadiran Tinggi' : 'Tingkat Kehadiran Cukup'}
          </p>
        </div>

        {/* Card 3: Izin & Sakit (M3 Amber Tonal) */}
        <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs m3-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
              Izin & Sakit
            </span>
            <div className="flex gap-1.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                <HeartPulse className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--md-sys-color-on-surface)] tracking-tight">
              {izin + sakit}
            </span>
            <span className="text-xs font-medium text-[var(--md-sys-color-on-surface-variant)]">
              (Izin: {izin}, Sakit: {sakit})
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-[var(--md-sys-color-surface-container-highest)] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${izinPercentage}%` }}
            />
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${sakitPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Ketidakhadiran Berizin Resmi
          </p>
        </div>

        {/* Card 4: Alpa (M3 Error Container Accent) */}
        <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs m3-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--md-sys-color-on-surface-variant)]">
              Tanpa Keterangan (Alpa)
            </span>
            <div className="p-2.5 rounded-2xl bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]">
              <AlertTriangle className="w-5 h-5 text-[var(--md-sys-color-error)]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--md-sys-color-on-surface)] tracking-tight">
              {alpa}
            </span>
            <span className="text-xs font-bold text-[var(--md-sys-color-error)] bg-[var(--md-sys-color-error-container)] px-2 py-0.5 rounded-full">
              {alpaPercentage}%
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-[var(--md-sys-color-surface-container-highest)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--md-sys-color-error)] rounded-full transition-all duration-500"
              style={{ width: `${alpaPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-[var(--md-sys-color-error)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--md-sys-color-error)]" />
            {alpa > 0 ? 'Perlu Follow-up Tim HRD' : 'Nihil Alpa (Disiplin)'}
          </p>
        </div>
      </div>
    </div>
  );
};
