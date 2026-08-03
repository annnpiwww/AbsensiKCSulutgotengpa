import React from 'react';
import { MapPin, Lock, ChevronDown, Building2 } from 'lucide-react';
import { LocationCode, ALL_LOCATIONS, LOCATION_NAMES, UserSession } from '../types/attendance';

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

  return (
    <div className="bento-card p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Context */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/80">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Lokasi Cabang Operational
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                18 Unit Cabang
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Pilih cabang tertentu atau lihat data gabungan
            </p>
          </div>
        </div>

        {/* Mantis Style Compact Select Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isSuperuser && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
              <Lock className="w-3.5 h-3.5" />
              <span>Hanya Akses Cabang: {session.assignedLocation}</span>
            </div>
          )}

          <div className="relative w-full sm:w-72">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              disabled={!isSuperuser}
              value={selectedLocation}
              onChange={(e) => onSelectLocation(e.target.value as LocationCode | 'ALL')}
              className="w-full pl-11 pr-11 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed appearance-none transition-all"
            >
              <option value="ALL">🌐 Semua 18 Cabang (Gabungan)</option>
              {ALL_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  🏢 {loc} - {LOCATION_NAMES[loc]}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
