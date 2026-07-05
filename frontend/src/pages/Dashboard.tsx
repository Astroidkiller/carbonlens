import React, { useEffect, useState, useMemo } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardSummary, DashboardCategories, DashboardTrends } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { TrendingDown, TrendingUp, Minus, Activity, Wind, AlertCircle, Lightbulb, Sprout, TreePine, ArrowRight } from 'lucide-react';
import { LiquidCard } from '../components/ui/LiquidCard';
import { insightsService } from '../services/insightsService';
import type { InsightsResponse } from '../services/insightsService';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const getTrendIcon = (direction: string) => {
  if (direction === 'Improving') return <TrendingDown className="h-5 w-5 text-emerald-400" />;
  if (direction === 'Increasing') return <TrendingUp className="h-5 w-5 text-rose-400" />;
  return <Minus className="h-5 w-5 text-[var(--text-muted)]" />;
};

const getTrendColor = (direction: string) => {
  if (direction === 'Improving') return 'text-emerald-400';
  if (direction === 'Increasing') return 'text-rose-400';
  return 'text-[var(--text-muted)]';
};

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categories, setCategories] = useState<DashboardCategories | null>(null);
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [sumRes, catRes, trendRes, insightsRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getCategories(),
          dashboardService.getTrends(),
          insightsService.getInsights().catch(() => null)
        ]);
        setSummary(sumRes);
        setCategories(catRes);
        setTrends(trendRes);
        setInsights(insightsRes);
      } catch (err) {
        setError('Failed to load dashboard data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [retryCount]);

  const pieData = useMemo(() => ({
    labels: ['Transport', 'Food', 'Electricity', 'Shopping', 'Waste'],
    datasets: [
      {
        data: [
          categories?.transport || 0,
          categories?.food || 0,
          categories?.electricity || 0,
          categories?.shopping || 0,
          categories?.waste || 0
        ],
        backgroundColor: [
          '#34d399', // emerald
          '#60a5fa', // blue
          '#a78bfa', // purple
          '#f472b6', // pink
          '#fbbf24', // amber
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }), [categories]);

  const lineData = useMemo(() => ({
    labels: trends?.daily.map(d => d.period) || [],
    datasets: [
      {
        label: 'Daily Emissions (kg CO2)',
        data: trends?.daily.map(d => d.emissions) || [],
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#34d399',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#34d399',
      },
    ],
  }), [trends]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (error || !summary || !categories || !trends) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight">Dashboard Overview</h1>
        <LiquidCard className="p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-rose-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-[var(--text)] mb-1">Failed to Load Dashboard</p>
            <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">{error || 'Unable to load dashboard data. Please check your connection.'}</p>
          </div>
          <button
            onClick={() => setRetryCount(c => c + 1)}
            className="mt-4 px-6 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[var(--text)] text-sm font-medium transition-all border border-[var(--border)]"
          >
            Try Again
          </button>
        </LiquidCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Score Card */}
        <LiquidCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <p className="text-[13px] font-medium text-[var(--text-muted)] mb-2 relative z-10">Carbon Score</p>
          <div className="text-5xl font-semibold text-[var(--text)] mb-1 tracking-tight relative z-10">{summary.carbon_score}</div>
          <p className="text-[11px] text-[var(--text-muted)] opacity-80 relative z-10 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/[0.05]">Target: 100</p>
        </LiquidCard>

        {/* Total Emissions */}
        <LiquidCard className="p-6 flex flex-col justify-between">
          <div className="flex items-center text-[var(--text-muted)] mb-4">
            <Wind className="h-[18px] w-[18px] mr-2 text-[var(--brand)]" />
            <h3 className="text-[13px] font-medium">Total Emissions</h3>
          </div>
          <div>
            <p className="text-3xl font-semibold text-[var(--text)] tracking-tight mb-3">
              {summary.total_emissions.toLocaleString()} <span className="text-sm text-[var(--text-muted)] font-normal ml-1">kg CO₂</span>
            </p>
            <div className="flex items-center text-[13px]">
              {getTrendIcon(summary.trend_direction)}
              <span className={`ml-1.5 font-medium ${getTrendColor(summary.trend_direction)}`}>
                {Math.abs(summary.monthly_change_percent)}% this month
              </span>
            </div>
          </div>
        </LiquidCard>

        {/* Activity Count */}
        <LiquidCard className="p-6 flex flex-col justify-between">
          <div className="flex items-center text-[var(--text-muted)] mb-4">
            <Activity className="h-[18px] w-[18px] mr-2 text-purple-400" />
            <h3 className="text-[13px] font-medium">Logged Activities</h3>
          </div>
          <div>
            <p className="text-3xl font-semibold text-[var(--text)] tracking-tight mb-3">{summary.activity_count}</p>
            <div className="text-[13px] font-medium text-[var(--text-muted)] flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-400/50 mr-2"></span>
              Avg {summary.average_daily_emissions} kg/day
            </div>
          </div>
        </LiquidCard>

        {/* Highest Category */}
        <LiquidCard className="p-6 flex flex-col justify-between">
          <div className="flex items-center text-[var(--text-muted)] mb-4">
            <h3 className="text-[13px] font-medium">Top Contributor</h3>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[var(--text)] capitalize tracking-tight mb-3 truncate">
              {summary.highest_emission_category || 'N/A'}
            </p>
            <div className="text-[13px] font-medium text-[var(--text-muted)] flex items-center">
              <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] opacity-50 mr-2"></span>
              All-time highest
            </div>
          </div>
        </LiquidCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend Chart */}
        <LiquidCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-medium text-[var(--text)] tracking-tight">Emissions Trend</h3>
            <span className="text-xs text-[var(--text-muted)] bg-white/[0.03] px-2 py-1 rounded-md border border-white/[0.05]">Last 14 Days</span>
          </div>
          {trends.daily.length > 0 ? (
            <div className="h-64 w-full">
              <Line 
                data={lineData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(18, 21, 30, 0.9)',
                      titleColor: '#f0f2f5',
                      bodyColor: '#7a8599',
                      borderColor: 'rgba(255,255,255,0.06)',
                      borderWidth: 1,
                      padding: 10,
                      boxPadding: 4,
                      usePointStyle: true,
                    }
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      border: { display: false },
                      grid: { color: 'rgba(255,255,255,0.03)' },
                      ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }
                    },
                    x: {
                      border: { display: false },
                      grid: { display: false },
                      ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 11 } }
                    }
                  },
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                }} 
              />
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-[var(--text-muted)] bg-white/[0.02] rounded-2xl border border-white/[0.03]">
              <Activity className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">No recent activity data</p>
            </div>
          )}
        </LiquidCard>

        {/* Doughnut Chart */}
        <LiquidCard className="p-6">
          <h3 className="text-[15px] font-medium text-[var(--text)] tracking-tight mb-6">Breakdown</h3>
          {summary.total_emissions > 0 ? (
            <div className="h-64 flex justify-center relative">
              <Doughnut 
                data={pieData} 
                options={{ 
                  maintainAspectRatio: false,
                  cutout: '75%',
                  plugins: {
                    legend: { 
                      position: 'bottom',
                      labels: { color: 'rgba(255,255,255,0.6)', usePointStyle: true, padding: 20, font: { size: 11 } } 
                    },
                    tooltip: {
                      backgroundColor: 'rgba(18, 21, 30, 0.9)',
                      borderColor: 'rgba(255,255,255,0.06)',
                      borderWidth: 1,
                    }
                  }
                }} 
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center">
                  <span className="block text-2xl font-semibold text-[var(--text)]">{summary.total_emissions}</span>
                  <span className="block text-[10px] text-[var(--text-muted)]">kg CO₂</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-[var(--text-muted)] bg-white/[0.02] rounded-2xl border border-white/[0.03]">
              <div className="w-16 h-16 rounded-full border-4 border-white/[0.05] border-t-white/[0.1] mb-3"></div>
              <p className="text-sm">No data</p>
            </div>
          )}
        </LiquidCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick Tips */}
        <LiquidCard className="p-6 group">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center text-[var(--text)]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mr-3">
                <Lightbulb className="h-4 w-4 text-amber-400" />
              </div>
              <h3 className="text-[15px] font-medium tracking-tight">AI Recommendation</h3>
            </div>
            <Link to="/insights" className="text-xs font-medium text-[var(--brand)] hover:text-emerald-300 flex items-center transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {insights && insights.recommendations.length > 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl">
              <p className="text-[14px] text-[var(--text)] font-medium leading-relaxed mb-3">{insights.recommendations[0].title}</p>
              <div className="inline-flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                <TrendingDown className="mr-1.5 h-3.5 w-3.5" />
                Saves: {insights.recommendations[0].estimated_savings}
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl text-[13px] text-[var(--text-muted)]">
              Log more activities to generate personalized tips.
            </div>
          )}
        </LiquidCard>

        {/* Tree Impact Preview */}
        <LiquidCard className="p-6 group">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center text-[var(--text)]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3">
                <Sprout className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="text-[15px] font-medium tracking-tight">Real-World Impact</h3>
            </div>
            <Link to="/simulator" className="text-xs font-medium text-[var(--brand)] hover:text-emerald-300 flex items-center transition-colors">
              Simulate <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[13px] text-[var(--text-muted)] mb-1">Your Emissions Equal:</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-semibold text-[var(--text)] tracking-tight">
                  {Math.ceil(summary.total_emissions / 21)}
                </span>
                <span className="text-sm font-medium text-[var(--text-muted)]">Trees Needed</span>
              </div>
            </div>
            <TreePine className="h-12 w-12 text-emerald-500/20" />
          </div>
        </LiquidCard>
      </div>
    </div>
  );
};
