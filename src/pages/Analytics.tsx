import { useAnalytics } from '../hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { formatCalories, cn } from '../lib/utils';
import { Target, TrendingUp, Calendar, Trophy } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Analytics() {
  const { dataPoints, weeklyStats } = useAnalytics(7);

  // Format data for Recharts
  const chartData = dataPoints.map(d => ({
    ...d,
    dayLabel: format(parseISO(d.date), 'EEE'), // Mon, Tue, etc
  })).reverse(); // Oldest to newest for charts

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Your last 7 days at a glance</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox icon={Target} label="Goal Completion" value={`${weeklyStats.goal_completion_rate}%`} color="text-emerald-500" />
        <StatBox icon={Calendar} label="Consistency" value={`${weeklyStats.consistency_score}%`} color="text-blue-500" />
        <StatBox icon={TrendingUp} label="Avg Calories" value={formatCalories(weeklyStats.avg_calories)} color="text-amber-500" />
        <StatBox icon={Trophy} label="Best Day" value={weeklyStats.best_day ? format(parseISO(weeklyStats.best_day), 'EEEE') : 'N/A'} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Calories Bar Chart */}
        <div className="card p-5 h-[400px] flex flex-col">
          <h3 className="section-title mb-6">Calories vs Goal</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border opacity-50" />
                <XAxis dataKey="dayLabel" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} />
                <Tooltip 
                  cursor={{ fill: 'currentColor', opacity: 0.05 }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <ReferenceLine y={chartData[0]?.goal_calories} stroke="#10b981" strokeDasharray="3 3" />
                <Bar dataKey="calories" name="Consumed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macros Area Chart */}
        <div className="card p-5 h-[400px] flex flex-col">
          <h3 className="section-title mb-6">Macro Distribution</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border opacity-50" />
                <XAxis dataKey="dayLabel" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} />
                <Tooltip 
                  cursor={{ stroke: 'currentColor', opacity: 0.1, strokeWidth: 2 }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="protein" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="carbs" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="fat" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }: any) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
