// import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import CustomDot from './CustomDot';

interface DailyCount {
  date: string;
  count: number;
}

interface WeeklyLineChartProps {
  title: string;
  data: DailyCount[];
  color: string;
}

export default function WeeklyLineChart({ title, data, color }: WeeklyLineChartProps) {
  return (
    <div className="bg-white p-6 mb-10">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="date"
            minTickGap={10}
            tick={{ fontSize: 12 }}
            label={{ value: '일자', position: 'insideBottom', offset: -5, style: { fill: '#6B7280', fontSize: 12 } }}
            tickFormatter={(value: string) =>
              new Date(value).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
            }
          />          
         <YAxis
            allowDecimals={false}
            label={{ value: '건 수', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            labelFormatter={(label: string) => `날짜: ${label}`}
            formatter={(value: number) => [`${value}건`, title]}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={3}
             dot={<CustomDot stroke={color} />}
            activeDot={{ r: 7 }}
            />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}