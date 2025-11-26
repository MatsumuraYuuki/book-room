'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface ReadingStatsChartProps {
  totalCount: number;
  unreadCount: number;
  readingCount: number;
  completedCount: number;
}

interface ChartLegendEntry {
  value?: string;
  payload?: {
    strokeDasharray?: string | number;
    value?: number;
  };
}

export default function ReadingStatsChart({
  totalCount,
  unreadCount,
  readingCount,
  completedCount,
}: ReadingStatsChartProps) {
  // グラフ用のデータを準備
  const data = [
    { name: '未読', value: unreadCount, color: '#9CA3AF' },
    { name: '読書中', value: readingCount, color: '#3B82F6' },
    { name: '読了', value: completedCount, color: '#10B981' },
  ].filter(item => item.value > 0); // 0冊のステータスは表示しない

  // データが空の場合
  if (totalCount === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">本棚にデータがありません</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}冊`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value, entry: ChartLegendEntry) => `${value}: ${entry.payload?.value ?? 0}冊`}
        />
        {/* 中央に総冊数を表示 */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-3xl font-bold fill-gray-900"
        >
          {totalCount}
        </text>
        <text
          x="50%"
          y="50%"
          dy={25}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm fill-gray-600"
        >
          冊
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
