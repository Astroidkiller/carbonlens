import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, Target, Zap, AlertTriangle, AlertCircle } from 'lucide-react';
import { insightsService } from '../services/insightsService';
import type { InsightsResponse } from '../services/insightsService';
import { LiquidCard } from '../components/ui/LiquidCard';
import { LiquidButton } from '../components/ui/LiquidButton';

export const Insights: React.FC = () => {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const insights = await insightsService.getInsights();
        setData(insights);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load insights:", err);
        setError(err.response?.data?.detail || "Could not load insights. Our AI is currently taking a break!");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[32px] opacity-20 animate-pulse"></div>
          <div className="relative bg-white/[0.03] p-5 rounded-3xl border border-white/[0.05] shadow-xl">
            <Zap className="h-8 w-8 text-emerald-400 animate-bounce" />
          </div>
        </div>
        <h2 className="mt-8 text-xl font-medium text-[var(--text)] tracking-tight">Analyzing patterns...</h2>
        <p className="mt-2 text-[15px] text-[var(--text-muted)]">Generating personalized insights</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="bg-rose-500/10 p-6 rounded-3xl mb-6 border border-rose-500/20">
          <AlertTriangle className="h-12 w-12 text-rose-400" />
        </div>
        <h2 className="text-2xl font-semibold text-[var(--text)] mb-3 tracking-tight">Oops!</h2>
        <p className="text-[15px] text-[var(--text-muted)] max-w-md mb-8 leading-relaxed">{error || "Something went wrong loading your insights."}</p>
        <LiquidButton onClick={() => window.location.reload()} variant="secondary" className="px-8">
          Try Again
        </LiquidButton>
      </div>
    );
  }

  const getPriorityStyles = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return { bg: 'bg-rose-500/[0.03]', border: 'border-rose-500/10', icon: 'text-rose-400', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      case 'medium': return { bg: 'bg-amber-500/[0.03]', border: 'border-amber-500/10', icon: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'low': return { bg: 'bg-emerald-500/[0.03]', border: 'border-emerald-500/10', icon: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      default: return { bg: 'bg-white/[0.02]', border: 'border-white/[0.05]', icon: 'text-gray-400', badge: 'bg-white/[0.05] text-gray-400' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center space-x-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20 shadow-[inset_0_0_15px_rgba(245,158,11,0.1)]">
          <Lightbulb className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight">AI Insights</h1>
          <p className="text-[15px] text-[var(--text-muted)] mt-1 tracking-tight">Personalized intelligence for your sustainability journey</p>
        </div>
      </div>

      <LiquidCard className="overflow-hidden p-8 sm:p-10 relative border-t-0 border-l-0 bg-gradient-to-br from-[var(--surface)] to-emerald-900/10">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[150%] bg-gradient-to-b from-emerald-500/5 to-transparent -rotate-12 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest bg-white/[0.05] border border-white/[0.1] text-emerald-300 mb-6 shadow-sm">
            AI GENERATED SUMMARY
          </div>
          <p className="text-2xl sm:text-3xl font-light leading-relaxed text-[var(--text)] drop-shadow-sm">
            "{data.summary}"
          </p>
        </div>
      </LiquidCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="flex items-center mb-6 pl-1">
            <TrendingUp className="mr-3 h-[18px] w-[18px] text-emerald-400" />
            <h2 className="text-lg font-medium text-[var(--text)] tracking-tight">Key Observations</h2>
          </div>
          <div className="space-y-4">
            {data.insights.map((insight, idx) => {
              const styles = getPriorityStyles(insight.priority);
              return (
                <LiquidCard key={idx} className={`p-6 ${styles.bg} ${styles.border} group transition-all duration-500`} hover={false}>
                  <div className="flex items-start">
                    <AlertCircle className={`h-5 w-5 mt-0.5 mr-4 flex-shrink-0 ${styles.icon}`} />
                    <div>
                      <h3 className="font-medium text-[var(--text)] tracking-tight">{insight.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-muted)]">{insight.description}</p>
                    </div>
                  </div>
                </LiquidCard>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center mb-6 pl-1">
            <Target className="mr-3 h-[18px] w-[18px] text-purple-400" />
            <h2 className="text-lg font-medium text-[var(--text)] tracking-tight">Action Plan</h2>
          </div>
          <div className="space-y-4">
            {data.recommendations.map((rec, idx) => {
              const styles = getPriorityStyles(rec.impact);
              return (
                <LiquidCard key={idx} className="p-6 flex flex-col justify-between min-h-[140px] group transition-all duration-500">
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <h3 className="font-medium text-[var(--text)] tracking-tight leading-snug">{rec.title}</h3>
                      <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${styles.badge}`}>
                        {rec.impact}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center self-start text-[13px] font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    <TrendingDown className="mr-2 h-4 w-4" />
                    Saves ~{rec.estimated_savings}
                  </div>
                </LiquidCard>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 mt-4">
        <LiquidCard className="p-6 sm:p-8 bg-rose-500/[0.02] border-rose-500/10">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center mr-4 border border-rose-500/20">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
            </div>
            <h2 className="text-lg font-medium text-[var(--text)] tracking-tight">Risk Areas</h2>
          </div>
          {data.risk_areas.length > 0 ? (
            <ul className="space-y-4">
              {data.risk_areas.map((risk, idx) => (
                <li key={idx} className="flex items-start text-[14px] text-[var(--text)] font-medium leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                  {risk}
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center border border-dashed border-white/[0.05] rounded-2xl bg-white/[0.01]">
              <p className="text-[14px] text-[var(--text-muted)] italic">No significant risk areas identified.</p>
            </div>
          )}
        </LiquidCard>

        <LiquidCard className="p-6 sm:p-8 bg-emerald-500/[0.02] border-emerald-500/10">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-4 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-medium text-[var(--text)] tracking-tight">Positive Habits</h2>
          </div>
          {data.positive_habits.length > 0 ? (
            <ul className="space-y-4">
              {data.positive_habits.map((habit, idx) => (
                <li key={idx} className="flex items-start text-[14px] text-[var(--text)] font-medium leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-4 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                  {habit}
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center border border-dashed border-white/[0.05] rounded-2xl bg-white/[0.01]">
              <p className="text-[14px] text-[var(--text-muted)] italic">Keep logging activities to build positive habits!</p>
            </div>
          )}
        </LiquidCard>
      </div>
    </div>
  );
};
