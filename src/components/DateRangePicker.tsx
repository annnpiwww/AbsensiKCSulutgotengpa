import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Check, Filter, X, ChevronDown, Clock } from 'lucide-react';

export type DateFilterPreset = 'ALL' | 'MONTHLY_1_25' | 'TODAY' | 'THIS_MONTH' | 'CUSTOM' | 'CUSTOM_SINGLE';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  preset: DateFilterPreset;
  onSelectPreset: (preset: DateFilterPreset) => void;
  onApplyCustomDate: (start: string, end: string) => void;
  onResetDateFilter: () => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  preset,
  onSelectPreset,
  onApplyCustomDate,
  onResetDateFilter,
}) => {
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsModified(false);
  }, [startDate, endDate]);

  const handleStartChange = (val: string) => {
    setTempStartDate(val);
    setIsModified(true);
  };

  const handleEndChange = (val: string) => {
    setTempEndDate(val);
    setIsModified(true);
  };

  const handleConfirmApply = () => {
    onApplyCustomDate(tempStartDate, tempEndDate);
    setIsModified(false);
  };

  const presets: { id: DateFilterPreset; label: string }[] = [
    { id: 'ALL', label: 'Semua Tanggal' },
    { id: 'MONTHLY_1_25', label: 'Tanggal 1 - 25 Perbulan' },
    { id: 'THIS_MONTH', label: 'Bulan Ini' },
    { id: 'TODAY', label: 'Hari Ini' },
    { id: 'CUSTOM_SINGLE', label: 'Kustom: Satu Tanggal' },
    { id: 'CUSTOM', label: 'Kustom: Rentang Tanggal' },
  ];

  return (
    <div className="bento-card p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-3 min-w-0 max-w-full overflow-hidden">
      {/* Header & Mantis Style Select Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100/80">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Filter Periode Waktu
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Live Sync Realtime
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Filter berdasarkan tanggal konfirmasi
            </p>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {preset !== 'ALL' && (
            <button
              onClick={onResetDateFilter}
              className="px-2.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1 transition-colors border border-rose-200/60 shrink-0"
              title="Reset Filter Tanggal"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <div className="relative w-full sm:w-64">
            <Clock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={preset}
              onChange={(e) => onSelectPreset(e.target.value as DateFilterPreset)}
              className="w-full pl-11 pr-11 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer appearance-none transition-all"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Expanded Section for Custom Date Pickers */}
      {(preset === 'CUSTOM' || preset === 'CUSTOM_SINGLE') && (
        <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/70 p-3 rounded-lg border border-slate-200/60 min-w-0 max-w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            {preset === 'CUSTOM_SINGLE' ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-600">Pilih Tanggal:</span>
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => {
                    handleStartChange(e.target.value);
                    setTempEndDate(e.target.value);
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-600">Dari:</span>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => handleStartChange(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-600">Sampai:</span>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => handleEndChange(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            {isModified && (
              <span className="text-[11px] font-bold text-amber-600 animate-pulse">
                • Klik Terapkan dulu
              </span>
            )}
            <button
              onClick={handleConfirmApply}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                isModified
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Terapkan</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Summary Info */}
      <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
        <Filter className="w-3.5 h-3.5 text-blue-600" />
        <span>Status Filter:</span>
        <span className="text-slate-800 font-bold">
          {preset === 'ALL' && 'Semua Log Presensi'}
          {preset === 'MONTHLY_1_25' && 'Rentang Tanggal 1 s/d 25 (Setiap Bulan)'}
          {preset === 'THIS_MONTH' && 'Bulan Ini'}
          {preset === 'TODAY' && 'Hari Ini'}
          {preset === 'CUSTOM_SINGLE' && (startDate ? `Tanggal: ${startDate}` : 'Pilih tanggal & terapkan')}
          {preset === 'CUSTOM' && (startDate && endDate ? `${startDate} s/d ${endDate}` : 'Tentukan tanggal & terapkan')}
        </span>
      </div>
    </div>
  );
};
