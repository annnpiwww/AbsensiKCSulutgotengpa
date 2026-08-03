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
import { ALL_LOCATIONS } from '../types/attendance';

interface AttendanceChartsProps {
  records: AttendanceRecord[];
}

const STATUS_COLORS: Record<string, string> = {
  Hadir: '#10B981', // Emerald
  Sakit: '#3B82F6', // Blue
  SKD: '#0EA5E9',   // Sky Blue
  Izin: '#F59E0B',  // Amber
  Terlambat: '#F97316', // Orange
  Alpa: '#F43F5E',  // Rose
  Cuti: '#8B5CF6',  // Purple
  Off: '#94A3B8',   // Slate
};

export const AttendanceCharts: React.FC<AttendanceChartsProps> = ({ records }) => {
  // 1. Donut Chart Data
  const statusCounts: Record<string, number> = {};

  records.forEach((r) => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });

  const pieData = Object.entries(statusCounts)
    .map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name] || '#64748B',
    }))
    .filter((item) => item.value > 0);

  // 2. Trend Line Data (grouped by date)
  const dateMap = new Map<string, Record<string, any>>();
  const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));

  sortedRecords.forEach((r) => {
    if (!dateMap.has(r.date)) {
      dateMap.set(r.date, { date: r.date.slice(5), Hadir: 0, Sakit: 0, SKD: 0, Izin: 0, Alpa: 0 });
    }
    const entry = dateMap.get(r.date)!;
    entry[r.status] = (entry[r.status] || 0) + 1;
  });

  const trendData = Array.from(dateMap.values()).slice(-10);

  // 3. Location Comparison Bar Chart
  const locMap = new Map<LocationCode, Record<string, any>>();
  ALL_LOCATIONS.forEach((location) => {
    locMap.set(location, { location, Hadir: 0, Sakit: 0, SKD: 0, Izin: 0, Alpa: 0, Terlambat: 0 });
  });

  records.forEach((r) => {
    const entry = locMap.get(r.location);
    if (entry) {
      entry[r.status] = (entry[r.status] || 0) + 1;
    }
  });

  const barData = Array.from(locMap.values());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* 1. Donut Chart: Status Distribution */}
      <div className="bento-card p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Porsi Status Absen
            </h3>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">Perbandingan persentase absen</p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-slate-100 rounded-md text-slate-600 border border-slate-200/60">
            {records.length} Logs
          </span>
        </div>

        <div className="h-48 w-full flex items-center justify-center my-1">
          <ResponsiveContainer width="100%" height="100%" key={`pie-${records.length}`}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.15)',
                  border: 'none',
                  fontSize: '11px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-600 truncate">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-900 ml-1">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Line Chart: 10-Day Trend */}
      <div className="bento-card p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Tren Kehadiran Harian
            </h3>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">Pergerakan 10 tanggal terakhir</p>
          </div>
        </div>

        <div className="h-56 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%" key={`trend-${records.length}`}>
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '11px',
                }}
              />
              <Line type="monotone" dataKey="Hadir" stroke={STATUS_COLORS.Hadir} strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Sakit" stroke={STATUS_COLORS.Sakit} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Izin" stroke={STATUS_COLORS.Izin} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="Alpa" stroke={STATUS_COLORS.Alpa} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Bar Chart: Location Comparison */}
      <div className="bento-card p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Komparasi Cabang
            </h3>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">Ringkasan per lokasi cabang</p>
          </div>
        </div>

        <div className="h-56 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%" key={`bar-${records.length}`}>
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="location" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="Hadir" fill={STATUS_COLORS.Hadir} radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="Terlambat" fill={STATUS_COLORS.Terlambat} radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="Sakit" fill={STATUS_COLORS.Sakit} radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="SKD" fill={STATUS_COLORS.SKD} radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="Izin" fill={STATUS_COLORS.Izin} radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="Alpa" fill={STATUS_COLORS.Alpa} radius={[3, 3, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
