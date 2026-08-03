import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Lock, ChevronDown, Building2, Check } from 'lucide-react';
import { LocationCode, ALL_LOCATIONS, LOCATION_NAMES, UserSession } from '../types/attendance';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface LocationSelectorProps {
  selectedLocation: LocationCode | 'ALL';
  onSelectLocation: (loc: LocationCode | 'ALL') => void;
  session: UserSession;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocation,
  onSelectLocation,
  session,
}) => {
  const isSuperuser = session.role === 'SUPERUSER';
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) {
      setQuery('');
      // Focus search on open
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const displayLabel =
    selectedLocation === 'ALL'
      ? 'Semua Cabang (Gabungan)'
      : `${selectedLocation} - ${LOCATION_NAMES[selectedLocation]}`;

  const filtered = [
    { value: 'ALL' as LocationCode | 'ALL', label: '🌐 Semua Cabang (Gabungan)' },
    ...ALL_LOCATIONS.map((loc) => ({
      value: loc,
      label: `🏢 ${LOCATION_NAMES[loc]}`,
    })),
  ].filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bento-card p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs min-w-0 max-w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Title & Context */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/80 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Lokasi Cabang Operational
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                18 Unit Cabang
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
              Pilih cabang tertentu atau lihat data gabungan
            </p>
          </div>
        </div>

        {/* Dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          {!isSuperuser && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/60 shrink-0">
              <Lock className="w-3.5 h-3.5" />
              <span className="truncate">Akses: {session.assignedLocation}</span>
            </div>
          )}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={!isSuperuser}
                className="relative w-full lg:w-80 flex items-center gap-2 pl-10 pr-10 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all text-left"
              >
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 shrink-0" />
                <span className="truncate">{displayLabel}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-auto shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] max-h-80 p-0 overflow-hidden"
              align="start"
            >
              <div className="p-2 border-b border-slate-100">
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari cabang..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>
              <div className="max-h-64 overflow-y-auto p-1">
                {filtered.length === 0 ? (
                  <div className="px-3 py-6 text-center text-xs text-slate-400">
                    Tidak ada cabang yang cocok
                  </div>
                ) : (
                  filtered.map((opt) => {
                    const active = selectedLocation === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onSelectLocation(opt.value);
                          setOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};