import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import type { AttendanceRecord, LocationCode } from '../types/attendance';
import { LOCATION_NAMES } from '../types/attendance';

interface AttendanceChartsProps {
  records: AttendanceRecord[];
}

const STATUS_COLORS: Record<string, string> = {
  Hadir: '#10b981',
  Izin: '#f59e0b',
  Sakit: '#3b82f6',
  SKD: '#0284c7',
  Terlambat: '#f97316',
  Alpa: '#ef4444',
  Cuti: '#a855f7',
  Off: '#94a3b8',
};

export const AttendanceCharts: React.FC<AttendanceChartsProps> = ({ records }) => {
  // Data Pie Chart
  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  // Data Line Chart
  const dateCounts = records.reduce((acc, r) => {
    if (!acc[r.date]) {
      acc[r.date] = { date: r.date, Hadir: 0, TidakHadir: 0 };
    }
    if (r.status === 'Hadir') {
      acc[r.date].Hadir += 1;
    } else {
      acc[r.date].TidakHadir += 1;
    }
    return acc;
  }, {} as Record<string, { date: string; Hadir: number; TidakHadir: number }>);

  const lineData = Object.values(dateCounts).sort((a, b) => (a.date > b.date ? 1 : -1));

  // Data Bar Chart per Lokasi
  const locationCounts = records.reduce((acc, r) => {
    const locCode = r.location || 'TBM';
    const locName = LOCATION_NAMES[locCode] || locCode;
    if (!acc[locName]) {
      acc[locName] = { location: locName, Hadir: 0, Terlambat: 0, Sakit: 0, SKD: 0, Izin: 0, Alpa: 0 };
    }
    if (r.status === 'Hadir') acc[locName].Hadir += 1;
    else if (r.status === 'Terlambat') acc[locName].Terlambat += 1;
    else if (r.status === 'Sakit') acc[locName].Sakit += 1;
    else if (r.status === 'SKD') acc[locName].SKD += 1;
    else if (r.status === 'Izin') acc[locName].Izin += 1;
    else if (r.status === 'Alpa') acc[locName].Alpa += 1;
    return acc;
  }, {} as Record<string, any>);

  const barData = Object.values(locationCounts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Chart 1: Donut Distribution (M3 Surface Container Lowest) */}
      <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs">
        <h3 className="font-bold text-[var(--md-sys-color-on-surface)] text-sm tracking-tight mb-1">
          Ringkasan Status Kehadiran
        </h3>
        <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] mb-4">
          Perbandingan status hadir, izin, sakit, dan alpa
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || '#64748b'}
                    stroke="var(--md-sys-color-surface-container-lowest)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  color: 'var(--md-sys-color-on-surface)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '8px 14px',
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          {pieData.map((d) => (
            <div
              key={d.name}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--md-sys-color-surface-container-low)] border border-[var(--md-sys-color-outline-variant)] text-[11px] font-medium"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[d.name] || '#64748b' }}
              />
              <span className="text-[var(--md-sys-color-on-surface)]">{d.name}: <strong>{d.value}</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Tren Harian Line Chart */}
      <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs lg:col-span-2">
        <h3 className="font-bold text-[var(--md-sys-color-on-surface)] text-sm tracking-tight mb-1">
          Tren Harian Kehadiran Karyawan
        </h3>
        <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] mb-4">
          Perbandingan tren Hadir vs Ketidakhadiran per tanggal
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" opacity={0.5} />
              <XAxis dataKey="date" stroke="var(--md-sys-color-on-surface-variant)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--md-sys-color-on-surface-variant)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  color: 'var(--md-sys-color-on-surface)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '8px 14px',
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Line
                type="monotone"
                dataKey="Hadir"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="TidakHadir"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: '#ef4444' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Perbandingan Per Kantor Cabang Bar Chart */}
      <div className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs lg:col-span-3">
        <h3 className="font-bold text-[var(--md-sys-color-on-surface)] text-sm tracking-tight mb-1">
          Grafik Kehadiran per Kantor Cabang
        </h3>
        <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] mb-4">
          Rincian status absensi di setiap cabang
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" opacity={0.5} />
              <XAxis dataKey="location" stroke="var(--md-sys-color-on-surface-variant)" fontSize={11} tickLine={false} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="var(--md-sys-color-on-surface-variant)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--md-sys-color-surface-container-high)',
                  borderColor: 'var(--md-sys-color-outline-variant)',
                  color: 'var(--md-sys-color-on-surface)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '8px 14px',
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Bar dataKey="Hadir" fill={STATUS_COLORS.Hadir} radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="Terlambat" fill={STATUS_COLORS.Terlambat} radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="Sakit" fill={STATUS_COLORS.Sakit} radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="SKD" fill={STATUS_COLORS.SKD} radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="Izin" fill={STATUS_COLORS.Izin} radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="Alpa" fill={STATUS_COLORS.Alpa} radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
