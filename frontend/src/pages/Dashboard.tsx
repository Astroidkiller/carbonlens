import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardSummary, DashboardCategories, DashboardTrends } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { TrendingDown, TrendingUp, Minus, Activity, Wind, AlertCircle } from 'lucide-react';
import { LiquidCard } from '../components/ui/LiquidCard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categories, setCategories] = useState<DashboardCategories | null>(null);
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, catRes, trendRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getCategories(),
          dashboardService.getTrends()
        ]);
        setSummary(sumRes);
        setCategories(catRes);
        setTrends(trendRes);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (error || !summary || !categories || !trends) {
    return (
      <LiquidCard className="p-6 flex items-center text-rose-500 bg-rose-50/50">
        <AlertCircle className="mr-3 h-6 w-6" />
        {error || 'Unable to load dashboard data'}
      </LiquidCard>
    );
  }

  const pieData = {
    labels: ['Transport', 'Food', 'Electricity', 'Shopping', 'Waste'],
    datasets: [
      {
        data: [
          categories.transport,
          categories.food,
          categories.electricity,
          categories.shopping,
          categories.waste
        ],
        backgroundColor: [
          '#6366f1', // indigo-500
          '#a855f7', // purple-500
          '#ec4899', // pink-500
          '#14b8a6', // teal-500
          '#f43f5e', // rose-500
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const lineData = {
    labels: trends.daily.map(d => d.period),
    datasets: [
      {
        label: 'Daily Emissions (kg CO2)',
        data: trends.daily.map(d => d.emissions),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const getTrendIcon = (direction: string) => {
    if (direction === 'Improving') return <TrendingDown className="h-5 w-5 text-emerald-500" />;
    if (direction === 'Increasing') return <TrendingUp className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-gray-500" />;
  };

  const getTrendColor = (direction: string) => {
    if (direction === 'Improving') return 'text-emerald-500';
    if (direction === 'Increasing') return 'text-rose-500';
    return 'text-[var(--text-muted)]';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text)] drop-shadow-sm tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Score Card */}
        <LiquidCard className="p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold text-[var(--text-muted)] mb-1">Carbon Score</p>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] to-purple-500 mb-2 drop-shadow-sm tracking-tighter">{summary.carbon_score}</div>
          <p className="text-xs text-[var(--text-muted)] opacity-80">Target: 100</p>
        </LiquidCard>

        {/* Total Emissions */}
        <LiquidCard className="p-6">
          <div className="flex items-center text-[var(--text-muted)] mb-2">
            <Wind className="h-5 w-5 mr-2 text-[var(--brand)]" />
            <h3 className="text-sm font-semibold">Total Emissions</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--text)] tracking-tight">{summary.total_emissions.toLocaleString()} <span className="text-lg text-[var(--text-muted)] font-medium">kg CO₂</span></p>
          <div className="mt-4 flex items-center text-sm">
            {getTrendIcon(summary.trend_direction)}
            <span className={`ml-2 font-bold ${getTrendColor(summary.trend_direction)}`}>
              {Math.abs(summary.monthly_change_percent)}% this month
            </span>
          </div>
        </LiquidCard>

        {/* Activity Count */}
        <LiquidCard className="p-6">
          <div className="flex items-center text-[var(--text-muted)] mb-2">
            <Activity className="h-5 w-5 mr-2 text-purple-400" />
            <h3 className="text-sm font-semibold">Logged Activities</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--text)] tracking-tight">{summary.activity_count}</p>
          <div className="mt-4 text-sm font-medium text-[var(--text-muted)]">
            Average {summary.average_daily_emissions} kg/day
          </div>
        </LiquidCard>

        {/* Highest Category */}
        <LiquidCard className="p-6">
          <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-2">Top Contributor</h3>
          <p className="text-3xl font-bold text-[var(--text)] capitalize tracking-tight">
            {summary.highest_emission_category || 'N/A'}
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-[var(--text-muted)]">
            Based on all-time data
          </div>
        </LiquidCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <LiquidCard className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-[var(--text)] mb-4 tracking-tight">Emissions Trend (Last 14 Days)</h3>
          {trends.daily.length > 0 ? (
            <div className="h-72">
              <Line 
                data={lineData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      grid: { color: 'var(--border)' },
                      ticks: { color: 'var(--text-muted)' }
                    },
                    x: {
                      grid: { color: 'var(--border)' },
                      ticks: { color: 'var(--text-muted)' }
                    }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-[24px]">
              No recent activity data to display trends.
            </div>
          )}
        </LiquidCard>

        {/* Pie Chart */}
        <LiquidCard className="p-6">
          <h3 className="text-lg font-bold text-[var(--text)] mb-4 tracking-tight">Category Breakdown</h3>
          {summary.total_emissions > 0 ? (
            <div className="h-72 flex justify-center">
              <Pie 
                data={pieData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: 'var(--text-muted)' } }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border)] rounded-[24px]">
              No data
            </div>
          )}
        </LiquidCard>
      </div>
    </div>
  );
};
