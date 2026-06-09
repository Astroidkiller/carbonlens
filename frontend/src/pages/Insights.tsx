import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, ShieldAlert, CheckCircle2, Target, Zap, AlertTriangle, AlertCircle } from 'lucide-react';
import { insightsService } from '../services/insightsService';
import type { InsightsResponse } from '../services/insightsService';

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
          <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl animate-pulse opacity-50"></div>
          <div className="relative bg-white p-4 rounded-full shadow-lg border border-emerald-100">
            <Zap className="h-8 w-8 text-emerald-500 animate-bounce" />
          </div>
        </div>
        <h2 className="mt-6 text-xl font-bold text-gray-900">Analyzing sustainability patterns...</h2>
        <p className="mt-2 text-gray-500">Generating personalized insights based on your recent activity.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
        <p className="text-gray-500 max-w-md">{error || "Something went wrong loading your insights."}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getPriorityColors = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'low': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
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
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Lightbulb className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
          <p className="text-gray-500">Personalized intelligence for your sustainability journey.</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl shadow-xl overflow-hidden text-white p-8 relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Lightbulb className="h-32 w-32" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm mb-4">
            AI GENERATED SUMMARY
          </span>
          <p className="text-2xl sm:text-3xl font-light leading-relaxed">
            "{data.summary}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-gray-400" />
            Key Insights
          </h2>
          <div className="space-y-4">
            {data.insights.map((insight, idx) => (
              <div key={idx} className={`p-5 rounded-xl border ${getPriorityColors(insight.priority)} transition-all hover:shadow-md`}>
                <div className="flex items-start">
                  <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${getPriorityIconColor(insight.priority)}`} />
                  <div>
                    <h3 className="font-semibold">{insight.title}</h3>
                    <p className="mt-1 opacity-90 text-sm leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="mr-2 h-5 w-5 text-gray-400" />
            Actionable Recommendations
          </h2>
          <div className="space-y-4">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className={`p-5 rounded-xl border bg-white border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-emerald-200`}>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColors(rec.impact)} border-none`}>
                    {rec.impact.toUpperCase()} IMPACT
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md">
                  <TrendingDown className="mr-1.5 h-4 w-4" />
                  Saves ~{rec.estimated_savings}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-4">
            <ShieldAlert className="mr-2 h-5 w-5 text-amber-500" />
            Risk Areas
          </h2>
          {data.risk_areas.length > 0 ? (
            <ul className="space-y-3">
              {data.risk_areas.map((risk, idx) => (
                <li key={idx} className="flex items-center p-3 bg-red-50/50 rounded-lg text-red-800 border border-red-100/50">
                  <div className="h-2 w-2 rounded-full bg-red-400 mr-3"></div>
                  {risk}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg">No significant risk areas identified.</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center mb-4">
            <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
            Positive Habits
          </h2>
          {data.positive_habits.length > 0 ? (
            <ul className="space-y-3">
              {data.positive_habits.map((habit, idx) => (
                <li key={idx} className="flex items-center p-3 bg-emerald-50/50 rounded-lg text-emerald-800 border border-emerald-100/50">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 mr-3"></div>
                  {habit}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg">Keep logging activities to build positive habits!</p>
          )}
        </div>
      </div>
    </div>
  );
};
