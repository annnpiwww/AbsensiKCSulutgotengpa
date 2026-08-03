import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
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
  Hadir: '#10B981',
  Terlambat: '#F59E0B',
  Izin: '#3B82F6',
  Sakit: '#EF4444',
  SKD: '#8B5CF6',
  Alpa: '#DC2626',
};

export const AttendanceCharts: React.FC<AttendanceChartsProps> = ({ records }) => {
  // Pie Chart Data
  const statusCounts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Bar Chart Data - Group by Location
  const locationData = (Object.keys(LOCATION_NAMES) as LocationCode[])
    .map((location) => {
      const locationRecords = records.filter((r) => r.location === location);
      const counts = locationRecords.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        location: location, // Gunakan kode singkat (TBM, MGAM, dll)
        Hadir: counts['Hadir'] || 0,
        Terlambat: counts['Terlambat'] || 0,
        Sakit: counts['Sakit'] || 0,
        SKD: counts['SKD'] || 0,
        Izin: counts['Izin'] || 0,
        Alpa: counts['Alpa'] || 0,
      };
    })
    .filter((d) => Object.values(d).some((v) => typeof v === 'number' && v > 0))
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/60 border border-slate-200/60 hover:shadow-xl transition-all duration-300">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-1">Distribusi Status Kehadiran</h3>
          <p className="text-sm text-slate-500">Persentase tiap kategori absensi</p>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius={85}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={2}
                stroke="#fff"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.name] || '#94a3b8'} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '8px 12px',
                }}
                itemStyle={{
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                formatter={(value, entry: any) => (
                  <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 500 }}>
                    {value}: {entry.payload.value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/60 border border-slate-200/60 hover:shadow-xl transition-all duration-300">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 mb-1">Perbandingan Per Cabang</h3>
          <p className="text-sm text-slate-500">Grafik kehadiran 10 Cabang teratas</p>
        </div>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart
              data={locationData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="location" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#cbd5e1"
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }}
                stroke="#cbd5e1"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '8px 12px',
                }}
                itemStyle={{
                  fontSize: '12px',
                  fontWeight: 600,
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
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
