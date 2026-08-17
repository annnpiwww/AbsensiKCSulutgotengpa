import React, { useState } from 'react';
import { X, FileSpreadsheet, RefreshCw, Download, ExternalLink } from 'lucide-react';
import type { AttendanceRecord } from '../types/attendance';
import { ALL_LOCATIONS, LOCATION_NAMES } from '../types/attendance';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: AttendanceRecord[];
  onExportCSV: () => void;
  onImportCSV: (records: AttendanceRecord[]) => void;
}

export const DEFAULT_SPREADSHEET_URL =
  'https://docs.google.com/spreadsheets/d/1lC9vVHEXiCgCyaTJ509bIdiost4mrhs5vuRJPBGawJ4/edit?gid=0#gid=0';

export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwlpJ2BUTKa_BRYqxEaXTVLVyfYl5A46_PrCGZs3CAkqeNCI4VAf9mbvE1vwdy4BOwB/exec';

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  records,
  onExportCSV,
  onImportCSV,
}) => {
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_SPREADSHEET_URL);
  const [scriptUrl, setScriptUrl] = useState(DEFAULT_APPS_SCRIPT_URL);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchFromSheet = async () => {
    setIsSyncing(true);
    setSyncStatus('Sedang menarik data dari Google Sheets...');

    try {
      const res = await fetch(`${scriptUrl}?action=getData`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        onImportCSV(data);
        setSyncStatus(`Berhasil menarik ${data.length} data presensi dari Google Sheets!`);
      } else {
        throw new Error('Data format tidak valid');
      }
    } catch (e: any) {
      setSyncStatus(`Gagal melakukan sync: ${e.message || e}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)] shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[var(--md-sys-color-outline-variant)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
              <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[var(--md-sys-color-on-surface)]">
                Integrasi Realtime Google Sheets
              </h2>
              <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-0.5">
                Sinkronisasi database absensi dengan Spreadsheet KC Sulutgo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* External Link Card */}
          <div className="p-4 bg-[var(--md-sys-color-surface-container-lowest)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-[var(--md-sys-color-on-surface)]">
                Spreadsheet Utama KC Sulutgo
              </div>
              <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] truncate max-w-md">
                {sheetUrl}
              </div>
            </div>
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="m3-btn-tonal text-xs py-1.5 px-3.5 shrink-0"
            >
              <span>Buka Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Sync Trigger Action */}
          <div className="p-4 bg-[var(--md-sys-color-surface-container-low)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[var(--md-sys-color-on-surface)]">
                Tarik Data Terbaru (Sync)
              </h4>
              <button
                onClick={handleFetchFromSheet}
                disabled={isSyncing}
                className="m3-btn-filled text-xs py-2 px-5 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Proses Sync...' : 'Sync Sekarang'}</span>
              </button>
            </div>

            {syncStatus && (
              <div className="p-3 bg-[var(--md-sys-color-surface-container-lowest)] rounded-xl border border-[var(--md-sys-color-outline-variant)] text-xs text-[var(--md-sys-color-on-surface)]">
                {syncStatus}
              </div>
            )}
          </div>

          {/* Breakdown Sheet Tabs Info */}
          <div>
            <h4 className="text-xs font-bold text-[var(--md-sys-color-on-surface)] mb-2">
              Daftar Tab Sheet Berdasarkan Kantor Cabang (13 Sheet)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_LOCATIONS.map((loc) => (
                <div
                  key={loc}
                  className="p-2.5 bg-[var(--md-sys-color-surface-container-lowest)] rounded-xl border border-[var(--md-sys-color-outline-variant)] text-xs font-medium text-[var(--md-sys-color-on-surface)]"
                >
                  <span className="font-bold text-[var(--md-sys-color-primary)]">{loc}</span>: {LOCATION_NAMES[loc]}
                </div>
              ))}
            </div>
          </div>

          {/* Fallback CSV */}
          <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant)] flex items-center justify-between">
            <span className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Backup / Offline Export Data:
            </span>
            <button
              onClick={onExportCSV}
              className="m3-btn-outlined text-xs py-1.5 px-4"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
