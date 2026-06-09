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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--brand)] rounded-full blur-xl animate-pulse opacity-50"></div>
          <div className="relative bg-[var(--surface-strong)] p-4 rounded-full shadow-lg border border-[var(--border)]">
            <Zap className="h-8 w-8 text-[var(--brand)] animate-bounce" />
          </div>
        </div>
        <h2 className="mt-6 text-xl font-bold text-[var(--text)]">Analyzing sustainability patterns...</h2>
        <p className="mt-2 text-[var(--text-muted)]">Generating personalized insights based on your recent activity.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-[var(--text)] mb-2">Oops!</h2>
        <p className="text-[var(--text-muted)] max-w-md">{error || "Something went wrong loading your insights."}</p>
        <LiquidButton 
          onClick={() => window.location.reload()} 
          className="mt-6"
        >
          Try Again
        </LiquidButton>
      </div>
    );
  }

  const getPriorityColors = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-rose-500/10 border-rose-500/20 text-rose-500';
      case 'medium': return 'bg-amber-500/10 border-amber-500/20 text-amber-500';
      case 'low': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      default: return 'bg-[var(--surface-strong)] border-[var(--border)] text-[var(--text)]';
    }
  };

  const getPriorityIconColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-emerald-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-[var(--brand)]/10 rounded-lg">
          <Lightbulb className="h-6 w-6 text-[var(--brand)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">AI Insights</h1>
          <p className="text-[var(--text-muted)] tracking-tight">Personalized intelligence for your sustainability journey.</p>
        </div>
      </div>

      <LiquidCard className="overflow-hidden p-8 relative border-t-0 border-l-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/20 to-purple-500/10 pointer-events-none" />
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Lightbulb className="h-32 w-32 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-sm mb-4 border border-white/10 text-white">
            AI GENERATED SUMMARY
          </span>
          <p className="text-2xl sm:text-3xl font-light leading-relaxed text-[var(--text)] drop-shadow-sm">
            "{data.summary}"
          </p>
        </div>
      </LiquidCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[var(--text)] tracking-tight flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-[var(--text-muted)]" />
            Key Insights
          </h2>
          <div className="space-y-4">
            {data.insights.map((insight, idx) => (
              <div key={idx} className={`p-5 rounded-xl border ${getPriorityColors(insight.priority)} transition-all hover:shadow-md`}>
                <div className="flex items-start">
                  <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${getPriorityIconColor(insight.priority)}`} />
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">{insight.title}</h3>
                    <p className="mt-1 opacity-90 text-sm leading-relaxed text-[var(--text-muted)]">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[var(--text)] tracking-tight flex items-center">
            <Target className="mr-2 h-5 w-5 text-[var(--text-muted)]" />
            Actionable Recommendations
          </h2>
          <div className="space-y-4">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className={`p-5 rounded-xl border bg-[var(--surface-strong)] border-[var(--border)] shadow-sm transition-all hover:shadow-md hover:border-[var(--border-light)]`}>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-[var(--text)]">{rec.title}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColors(rec.impact)} border border-[var(--border)]`}>
                    {rec.impact.toUpperCase()} IMPACT
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                  <TrendingDown className="mr-1.5 h-4 w-4" />
                  Saves ~{rec.estimated_savings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[var(--border)]">
        <div>
          <h2 className="text-lg font-bold text-[var(--text)] tracking-tight flex items-center mb-4">
            <ShieldAlert className="mr-2 h-5 w-5 text-amber-500" />
            Risk Areas
          </h2>
          {data.risk_areas.length > 0 ? (
            <ul className="space-y-3">
              {data.risk_areas.map((risk, idx) => (
                <li key={idx} className="flex items-center p-3 bg-rose-500/10 rounded-xl text-[var(--text)] border border-rose-500/20 font-medium">
                  <div className="h-2 w-2 rounded-full bg-rose-500 mr-3"></div>
                  {risk}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)] italic p-4 bg-[var(--surface-strong)] rounded-xl border border-[var(--border)]">No significant risk areas identified.</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-[var(--text)] tracking-tight flex items-center mb-4">
            <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
            Positive Habits
          </h2>
          {data.positive_habits.length > 0 ? (
            <ul className="space-y-3">
              {data.positive_habits.map((habit, idx) => (
                <li key={idx} className="flex items-center p-3 bg-emerald-500/10 rounded-xl text-[var(--text)] border border-emerald-500/20 font-medium">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mr-3"></div>
                  {habit}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--text-muted)] italic p-4 bg-[var(--surface-strong)] rounded-xl border border-[var(--border)]">Keep logging activities to build positive habits!</p>
          )}
        </div>
      </div>
    </div>
  );
};
