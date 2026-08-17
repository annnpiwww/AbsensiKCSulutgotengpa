import React, { useState, useRef } from 'react';
import {
  X,
  FileSpreadsheet,
  RefreshCw,
  Download,
  Upload,
  ExternalLink,
  Settings,
  Check,
  RotateCcw,
} from 'lucide-react';
import type { AttendanceRecord } from '../types/attendance';
import { ALL_LOCATIONS, LOCATION_FULL_NAMES } from '../types/attendance';

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
  records: _records,
  onExportCSV,
  onImportCSV,
}) => {
  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    return localStorage.getItem('absensi_custom_sheet_url') || DEFAULT_SPREADSHEET_URL;
  });
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return localStorage.getItem('absensi_custom_script_url') || DEFAULT_APPS_SCRIPT_URL;
  });

  const [inputSheetUrl, setInputSheetUrl] = useState<string>(sheetUrl);
  const [inputScriptUrl, setInputScriptUrl] = useState<string>(scriptUrl);
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [urlSaveStatus, setUrlSaveStatus] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveLink = () => {
    const trimmedSheet = inputSheetUrl.trim() || DEFAULT_SPREADSHEET_URL;
    const trimmedScript = inputScriptUrl.trim() || DEFAULT_APPS_SCRIPT_URL;
    localStorage.setItem('absensi_custom_sheet_url', trimmedSheet);
    localStorage.setItem('absensi_custom_script_url', trimmedScript);
    setSheetUrl(trimmedSheet);
    setScriptUrl(trimmedScript);
    setUrlSaveStatus('Link Spreadsheet & API Apps Script berhasil disimpan!');
    setTimeout(() => setUrlSaveStatus(null), 3500);
    setIsEditingUrl(false);
  };

  const handleResetDefault = () => {
    localStorage.removeItem('absensi_custom_sheet_url');
    localStorage.removeItem('absensi_custom_script_url');
    setInputSheetUrl(DEFAULT_SPREADSHEET_URL);
    setInputScriptUrl(DEFAULT_APPS_SCRIPT_URL);
    setSheetUrl(DEFAULT_SPREADSHEET_URL);
    setScriptUrl(DEFAULT_APPS_SCRIPT_URL);
    setUrlSaveStatus('Link dikembalikan ke konfigurasi default.');
    setTimeout(() => setUrlSaveStatus(null), 3500);
    setIsEditingUrl(false);
  };

  const handleFileImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
        if (lines.length < 2) {
          setSyncStatus('File CSV kosong atau tidak memiliki baris data.');
          return;
        }

        const parseCSVLine = (line: string) => {
          const result: string[] = [];
          let cur = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(cur.trim().replace(/^"|"$/g, ''));
              cur = '';
            } else {
              cur += char;
            }
          }
          result.push(cur.trim().replace(/^"|"$/g, ''));
          return result;
        };

        const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        const dateIdx = headers.findIndex((h) => h.includes('tanggal') || h.includes('date'));
        const nameIdx = headers.findIndex((h) => h.includes('nama') || h.includes('name'));
        const locIdx = headers.findIndex((h) => h.includes('lokasi') || h.includes('location') || h.includes('cabang'));
        const statusIdx = headers.findIndex((h) => h.includes('status'));

        const parsedRecords: AttendanceRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i]);
          if (cols.length <= Math.max(dateIdx, nameIdx, locIdx, statusIdx)) continue;

          parsedRecords.push({
            id: `csv-${Date.now()}-${i}`,
            employeeId: `EMP-${i}`,
            name: cols[nameIdx] || 'Tanpa Nama',
            location: (cols[locIdx] as any) || 'TBM',
            date: cols[dateIdx] || new Date().toISOString().split('T')[0],
            status: (cols[statusIdx] as any) || 'Hadir',
            timeIn: '08:00',
            timeOut: '17:00',
            createdAt: new Date().toISOString(),
            updatedBy: 'CSV Import',
          });
        }

        if (parsedRecords.length > 0) {
          onImportCSV(parsedRecords);
          setSyncStatus(`Berhasil mengimpor ${parsedRecords.length} data dari file CSV!`);
        } else {
          setSyncStatus('Gagal memproses baris data CSV.');
        }
      } catch (err: any) {
        setSyncStatus(`Gagal membaca file CSV: ${err.message}`);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

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
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)] shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-[var(--md-sys-color-outline-variant)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
              <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[var(--md-sys-color-on-surface)]">
                Sync Google Sheets
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

        {/* Content Area */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Card Google Spreadsheet Link & Custom URL Form */}
          <div className="p-4 bg-[var(--md-sys-color-surface-container-lowest)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[var(--md-sys-color-on-surface)] flex items-center gap-2">
                  <span>Spreadsheet Utama KC Sulutgo</span>
                  {sheetUrl !== DEFAULT_SPREADSHEET_URL && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                      Custom Link
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] truncate mt-0.5 font-mono">
                  {sheetUrl}
                </div>
              </div>

              {/* Positioned Action Buttons: Buka Sheet & Ganti Link */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m3-btn-outlined text-xs py-1.5 px-3 flex items-center gap-1.5 rounded-full hover:bg-[var(--md-sys-color-surface-container-highest)] text-blue-700 border-blue-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Sheet</span>
                </a>
                <button
                  onClick={() => setIsEditingUrl(!isEditingUrl)}
                  className="p-2 rounded-full text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors"
                  title="Ganti Link Spreadsheet & API Web App"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form Ganti Link Spreadsheet / API */}
            {isEditingUrl && (
              <div className="pt-3 border-t border-[var(--md-sys-color-outline-variant)] space-y-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                    URL Google Spreadsheet:
                  </label>
                  <input
                    type="url"
                    value={inputSheetUrl}
                    onChange={(e) => setInputSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] focus:outline-none focus:border-[var(--md-sys-color-primary)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--md-sys-color-on-surface-variant)] mb-1">
                    URL Google Apps Script API (Web App Exec):
                  </label>
                  <input
                    type="url"
                    value={inputScriptUrl}
                    onChange={(e) => setInputScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] focus:outline-none focus:border-[var(--md-sys-color-primary)] font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={handleResetDefault}
                    className="m3-btn-tonal text-xs py-1.5 px-3 flex items-center gap-1 text-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                  <button
                    onClick={handleSaveLink}
                    className="m3-btn-filled text-xs py-1.5 px-3.5 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan Link</span>
                  </button>
                </div>
              </div>
            )}

            {urlSaveStatus && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold">
                {urlSaveStatus}
              </div>
            )}
          </div>

          {/* Sync Trigger Action */}
          <div className="p-4 bg-[var(--md-sys-color-surface-container-low)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[var(--md-sys-color-on-surface)]">
                  Tarik Data Terbaru (Sync)
                </h4>
                <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)]">
                  Ambil rekap absensi real-time dari 18 sheet cabang
                </p>
              </div>
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

          {/* Breakdown Sheet Tabs Info (18 Sheet Cabang Resmi dengan Nama Lengkap Lokasi) */}
          <div>
            <h4 className="text-xs font-bold text-[var(--md-sys-color-on-surface)] mb-2">
              Daftar Tab Sheet Berdasarkan Kantor Cabang (18 Sheet Cabang Resmi)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {ALL_LOCATIONS.map((loc) => (
                <div
                  key={loc}
                  className="p-2.5 bg-[var(--md-sys-color-surface-container-lowest)] rounded-xl border border-[var(--md-sys-color-outline-variant)] text-xs font-medium text-[var(--md-sys-color-on-surface)] flex items-center justify-between gap-1.5"
                >
                  <span className="font-bold text-[var(--md-sys-color-primary)] shrink-0">{loc}:</span>
                  <span className="truncate text-right opacity-90">{LOCATION_FULL_NAMES[loc]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fallback CSV */}
          <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant)] flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-[var(--md-sys-color-on-surface-variant)]">
              Backup / Offline Sync (CSV):
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onExportCSV}
                className="m3-btn-outlined text-xs py-1.5 px-3"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileImportChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="m3-btn-tonal text-xs py-1.5 px-3"
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Import CSV File</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
