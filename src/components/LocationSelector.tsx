import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Lock, ChevronDown, Building2, Check } from 'lucide-react';
import { LocationCode, ALL_LOCATIONS, LOCATION_FULL_NAMES, UserSession } from '../types/attendance';
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
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

  const options: Array<{ value: LocationCode | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Semua Lokasi Office (Sulutgo)' },
    ...ALL_LOCATIONS.map((loc) => ({
      value: loc,
      label: `${loc} - ${LOCATION_FULL_NAMES[loc] || loc}`,
    })),
  ];

  const currentLabel =
    selectedLocation === 'ALL'
      ? 'Semua Lokasi Office (Sulutgo)'
      : `${selectedLocation} (${LOCATION_FULL_NAMES[selectedLocation as LocationCode] || selectedLocation})`;

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-4 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]">
            <Building2 className="w-4 h-4 text-[var(--md-sys-color-primary)]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[var(--md-sys-color-on-surface)]">
              Pilih Kantor Cabang
            </h4>
            <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
              {isSuperuser
                ? 'Mode Admin: Semua cabang'
                : `Lokasi saat ini: ${session.assignedLocation || 'Utama'}`}
            </p>
          </div>
        </div>

        {/* Location Dropdown / Lock Badge */}
        <div className="w-full sm:w-72">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={!isSuperuser}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-full bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)] hover:border-[var(--md-sys-color-primary)] text-xs text-[var(--md-sys-color-on-surface)] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-75"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-[var(--md-sys-color-primary)] shrink-0" />
                  <span className="truncate font-semibold">{currentLabel}</span>
                </div>
                {isSuperuser ? (
                  <ChevronDown className="w-4 h-4 text-[var(--md-sys-color-on-surface-variant)] shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-72 p-2 bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-lg z-50"
            >
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari lokasi kantor..."
                className="w-full mb-2 bg-[var(--md-sys-color-surface-container-lowest)] text-xs text-[var(--md-sys-color-on-surface)] placeholder-[var(--md-sys-color-on-surface-variant)] px-3 py-2 rounded-xl border border-[var(--md-sys-color-outline-variant)] focus:border-[var(--md-sys-color-primary)] focus:outline-hidden"
              />

              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredOptions.length === 0 ? (
                  <div className="py-4 text-center text-xs text-[var(--md-sys-color-on-surface-variant)]">
                    Lokasi tidak ditemukan
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const active = selectedLocation === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          onSelectLocation(opt.value);
                          setOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-full text-xs font-medium text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-bold'
                            : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)] hover:text-[var(--md-sys-color-on-surface)]'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)] shrink-0" />}
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
