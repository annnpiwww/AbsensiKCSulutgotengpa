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

const getSpreadsheetId = (url: string) => {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return url;
};

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  records,
  onExportCSV,
  onImportCSV,
}) => {
  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem('absensi_sheet_url') || DEFAULT_SPREADSHEET_URL;
  });
  const [inputUrl, setInputUrl] = useState(sheetUrl);

  const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
    return localStorage.getItem('absensi_apps_script_url') || DEFAULT_APPS_SCRIPT_URL;
  });
  const [inputAppsScriptUrl, setInputAppsScriptUrl] = useState(appsScriptUrl);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Sekarang');

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const url = localStorage.getItem('absensi_apps_script_url') || DEFAULT_APPS_SCRIPT_URL;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        onImportCSV(data);
        setLastSyncedTime(new Date().toLocaleTimeString('id-ID'));
        alert('Sinkronisasi sukses! Data berhasil diimpor dari Google Sheet.');
      } else {
        throw new Error('Data format tidak valid (harus JSON Array)');
      }
    } catch (e: any) {
      console.error(e);
      alert(`Sinkronisasi gagal: ${e.message || 'Koneksi gagal/CORS Block'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveUrl = () => {
    const trimmedSheet = inputUrl.trim();
    const trimmedScript = inputAppsScriptUrl.trim();
    
    if (trimmedSheet) {
      localStorage.setItem('absensi_sheet_url', trimmedSheet);
      setSheetUrl(trimmedSheet);
    }
    if (trimmedScript) {
      localStorage.setItem('absensi_apps_script_url', trimmedScript);
      setAppsScriptUrl(trimmedScript);
    }
    alert('Konfigurasi link berhasil disimpan!');
  };

  const sheetId = getSpreadsheetId(sheetUrl);
  const displayId = sheetId.length > 20 ? `${sheetId.substring(0, 13)}...` : sheetId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bento-card max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200/60">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Integrasi Google Sheets (18 Cabang)
              </h3>
              <p className="text-[11px] text-slate-500 font-normal">
                Target Sheet: <span className="font-mono text-emerald-700">{displayId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs font-medium">
          {/* Active Status Info Bar */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <div className="font-semibold text-emerald-900 text-xs">
                  Sync Google Sheets Aktif
                </div>
                <div className="text-[11px] text-emerald-700 font-normal mt-0.5">
                  Terakhir sinkron: <span className="font-semibold">{lastSyncedTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Sheet</span>
              </a>

              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Loading...' : 'Sync 18 Sheet'}</span>
              </button>
            </div>
          </div>

          {/* Form Input Link Baru */}
          <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3">
            <h4 className="font-semibold text-slate-700 text-[10px] uppercase tracking-wider">
              Konfigurasi Integrasi Google Sheets
            </h4>
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500">
                  LINK GOOGLE SHEET
                </label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-normal focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500">
                  LINK APPS SCRIPT WEB APP (API DEPLOYMENT)
                </label>
                <input
                  type="text"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={inputAppsScriptUrl}
                  onChange={(e) => setInputAppsScriptUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-normal focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveUrl}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Simpan Konfigurasi
                </button>
              </div>
            </div>
          </div>

          {/* 18 Sheets List Grid */}
          <div>
            <h4 className="font-semibold text-slate-700 uppercase tracking-wider text-[10px] mb-2">
              Status Tab Sheet Tiap Cabang (18 Sheet Aktif)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
              {ALL_LOCATIONS.map((loc) => {
                const count = records.filter((r) => r.location === loc).length;
                return (
                  <div
                    key={loc}
                    className="p-2.5 rounded-lg border border-slate-200/70 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-semibold text-slate-900 block text-xs">{loc}</span>
                      <span className="text-[10px] text-slate-500 truncate block max-w-[110px]">
                        {LOCATION_NAMES[loc]}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 block">{count}</span>
                      <span className="text-[9px] text-slate-400 uppercase">Logs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fallback CSV Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-slate-500 font-normal text-[11px]">
              Offline / Backup Export:
            </div>
            <button
              onClick={onExportCSV}
              className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Master CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
