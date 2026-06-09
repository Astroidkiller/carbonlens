import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardSummary, DashboardCategories, DashboardTrends } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { TrendingDown, TrendingUp, Minus, Activity, Wind, AlertCircle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

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
      <GlassCard className="p-6 flex items-center text-red-400">
        <AlertCircle className="mr-3 h-6 w-6" />
        {error || 'Unable to load dashboard data'}
      </GlassCard>
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
          '#10b981', // emerald-500
          '#f59e0b', // amber-500
          '#3b82f6', // blue-500
          '#8b5cf6', // violet-500
          '#ef4444', // red-500
        ],
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
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
    if (direction === 'Improving') return 'text-[#c0c5d7]';
    if (direction === 'Increasing') return 'text-red-400';
    return 'text-[#aab1c6]';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#f5f5f7] drop-shadow-md tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Score Card */}
        <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-[#aab1c6] mb-1">Carbon Score</p>
          <div className="text-5xl font-black text-[#c0c5d7] mb-2 drop-shadow-md tracking-tighter">{summary.carbon_score}</div>
          <p className="text-xs text-[#aab1c6]/70">Target: 100</p>
        </GlassCard>

        {/* Total Emissions */}
        <GlassCard className="p-6">
          <div className="flex items-center text-[#aab1c6] mb-2">
            <Wind className="h-5 w-5 mr-2" />
            <h3 className="text-sm font-medium">Total Emissions</h3>
          </div>
          <p className="text-3xl font-bold text-[#f5f5f7] tracking-tight">{summary.total_emissions.toLocaleString()} <span className="text-lg text-[#aab1c6] font-normal">kg CO₂</span></p>
          <div className="mt-4 flex items-center text-sm">
            {getTrendIcon(summary.trend_direction)}
            <span className={`ml-2 font-medium ${getTrendColor(summary.trend_direction)}`}>
              {Math.abs(summary.monthly_change_percent)}% this month
            </span>
          </div>
        </GlassCard>

        {/* Activity Count */}
        <GlassCard className="p-6">
          <div className="flex items-center text-[#aab1c6] mb-2">
            <Activity className="h-5 w-5 mr-2" />
            <h3 className="text-sm font-medium">Logged Activities</h3>
          </div>
          <p className="text-3xl font-bold text-[#f5f5f7] tracking-tight">{summary.activity_count}</p>
          <div className="mt-4 text-sm text-[#aab1c6]">
            Average {summary.average_daily_emissions} kg/day
          </div>
        </GlassCard>

        {/* Highest Category */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-medium text-[#aab1c6] mb-2">Top Contributor</h3>
          <p className="text-3xl font-bold text-[#f5f5f7] capitalize tracking-tight">
            {summary.highest_emission_category || 'N/A'}
          </p>
          <div className="mt-4 flex items-center text-sm text-[#aab1c6]">
            Based on all-time data
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-[#f5f5f7] mb-4 tracking-tight">Emissions Trend (Last 14 Days)</h3>
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
                      grid: { color: 'rgba(192, 197, 215, 0.05)' },
                      ticks: { color: 'rgba(170, 177, 198, 0.7)' }
                    },
                    x: {
                      grid: { color: 'rgba(192, 197, 215, 0.05)' },
                      ticks: { color: 'rgba(170, 177, 198, 0.7)' }
                    }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-[#aab1c6] border-2 border-dashed border-[#c0c5d7]/10 rounded-[24px]">
              No recent activity data to display trends.
            </div>
          )}
        </GlassCard>

        {/* Pie Chart */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-[#f5f5f7] mb-4 tracking-tight">Category Breakdown</h3>
          {summary.total_emissions > 0 ? (
            <div className="h-72 flex justify-center">
              <Pie 
                data={pieData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: 'rgba(245, 245, 247, 0.8)' } }
                  }
                }} 
              />
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-[#aab1c6] border-2 border-dashed border-[#c0c5d7]/10 rounded-[24px]">
              No data
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
