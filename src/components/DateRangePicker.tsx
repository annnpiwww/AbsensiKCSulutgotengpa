import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Check, Filter, X, ChevronDown } from 'lucide-react';
import { DateField } from './ui/date-field';

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
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  const presets: { key: DateFilterPreset; label: string }[] = [
    { key: 'ALL', label: 'Semua Data' },
    { key: 'MONTHLY_1_25', label: 'Tanggal 1 - 25' },
    { key: 'TODAY', label: 'Hari Ini' },
    { key: 'THIS_MONTH', label: 'Bulan Ini' },
    { key: 'CUSTOM_SINGLE', label: 'Pilih Tanggal' },
    { key: 'CUSTOM', label: 'Atur Tanggal Sendiri' },
  ];

  const handleApplyCustom = () => {
    if (preset === 'CUSTOM_SINGLE' && !tempStartDate) {
      alert('Pilih tanggal terlebih dahulu!');
      return;
    }
    if (preset === 'CUSTOM' && (!tempStartDate || !tempEndDate)) {
      alert('Pilih tanggal awal dan akhir!');
      return;
    }
    onApplyCustomDate(tempStartDate, tempEndDate);
    setShowCustomPicker(false);
  };

  return (
    <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-4 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]">
            <CalendarIcon className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--md-sys-color-on-surface)]">
              Filter Tanggal Absensi
            </h4>
            <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
              Pilih tanggal atau rentang waktu yang ingin ditampilkan
            </p>
          </div>
        </div>

        {preset !== 'ALL' && (
          <button
            onClick={onResetDateFilter}
            className="text-xs text-[var(--md-sys-color-error)] hover:bg-[var(--md-sys-color-error-container)] px-3 py-1 rounded-full border border-rose-200 transition-colors flex items-center gap-1 font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>

      {/* M3 Preset Filter Chips (Pill Buttons) */}
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((p) => {
          const isActive = preset === p.key;
          return (
            <button
              key={p.key}
              onClick={() => {
                onSelectPreset(p.key);
                if (p.key === 'CUSTOM' || p.key === 'CUSTOM_SINGLE') {
                  setShowCustomPicker(true);
                } else {
                  setShowCustomPicker(false);
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] font-bold border border-[var(--md-sys-color-primary)] shadow-xs'
                  : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] border border-transparent hover:bg-[var(--md-sys-color-surface-container-highest)] hover:text-[var(--md-sys-color-on-surface)]'
              }`}
            >
              <span>{p.label}</span>
              {(p.key === 'CUSTOM' || p.key === 'CUSTOM_SINGLE') && (
                <ChevronDown className="w-3 h-3 opacity-70" />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Date Input Form Panel */}
      {showCustomPicker && (
        <div className="p-4 bg-[var(--md-sys-color-surface-container-low)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                {preset === 'CUSTOM_SINGLE' ? 'Pilih Tanggal Presensi' : 'Tanggal Awal Mula'}
              </label>
              <DateField
                value={tempStartDate}
                onChange={(val) => setTempStartDate(val)}
                placeholder="Pilih Tanggal"
              />
            </div>
            {preset === 'CUSTOM' && (
              <div>
                <label className="block text-[11px] font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                  Tanggal Akhir Sampai
                </label>
                <DateField
                  value={tempEndDate}
                  onChange={(val) => setTempEndDate(val)}
                  placeholder="Pilih Tanggal Akhir"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setShowCustomPicker(false)}
              className="m3-btn-outlined text-xs py-1.5 px-4"
            >
              Batal
            </button>
            <button
              onClick={handleApplyCustom}
              className="m3-btn-filled text-xs py-1.5 px-5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Terapkan Tanggal</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Info Footer */}
      <div className="text-xs font-medium text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-1.5 pt-2 border-t border-[var(--md-sys-color-outline-variant)]">
        <Filter className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
        <span>Status Filter:</span>
        <span className="text-[var(--md-sys-color-on-surface)] font-bold">
          {preset === 'ALL' && 'Semua Data'}
          {preset === 'MONTHLY_1_25' && 'Periode Tanggal 1 s/d 25 Bulanan'}
          {preset === 'THIS_MONTH' && 'Bulan Berjalan Ini'}
          {preset === 'TODAY' && 'Hari Ini'}
          {preset === 'CUSTOM_SINGLE' && (startDate ? `Tanggal Khusus: ${startDate}` : 'Pilih tanggal & terapkan')}
          {preset === 'CUSTOM' && (startDate && endDate ? `${startDate} s/d ${endDate}` : 'Tentukan rentang & terapkan')}
        </span>
      </div>
    </div>
  );
};
