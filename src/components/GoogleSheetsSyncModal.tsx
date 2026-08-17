import React, { useState, useRef } from 'react';
import { X, FileSpreadsheet, RefreshCw, Download, Upload, ExternalLink } from 'lucide-react';
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
  records: _records,
  onExportCSV,
  onImportCSV,
}) => {
  const [sheetUrl] = useState(DEFAULT_SPREADSHEET_URL);
  const [scriptUrl] = useState(DEFAULT_APPS_SCRIPT_URL);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

        const importedRecords: AttendanceRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i]);
          if (cols.length < 4) continue;

          const record: AttendanceRecord = {
            id: cols[0] || `rec_${Date.now()}_${i}`,
            date: cols[1] || new Date().toISOString().split('T')[0],
            location: (cols[2] as any) || 'TBM',
            name: cols[3] || 'Karyawan',
            employeeId: cols[4] || `EMP-${i}`,
            status: (cols[5] as any) || 'Hadir',
            timeIn: cols[6] || '08:00',
            timeOut: cols[7] || '17:00',
            position: cols[8] || 'Staff',
            notes: cols[9] || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            updatedBy: cols[10] || 'Import CSV Offline',
          };
          importedRecords.push(record);
        }

        if (importedRecords.length > 0) {
          onImportCSV(importedRecords);
          setSyncStatus(`Berhasil mengimpor ${importedRecords.length} data presensi dari file CSV!`);
        } else {
          setSyncStatus('Format CSV tidak dapat dibaca atau baris data tidak valid.');
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
      <div className="bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[28px] border border-[var(--md-sys-color-outline-variant)] shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[var(--md-sys-color-outline-variant)] flex items-center justify-between">
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
              Daftar Tab Sheet Berdasarkan Kantor Cabang (18 Sheet Cabang Resmi)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
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
