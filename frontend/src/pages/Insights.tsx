import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardInsightsData, DashboardTopContributors } from '../types';
import { Lightbulb, Trophy, AlertTriangle, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const Insights: React.FC = () => {
  const [insights, setInsights] = useState<DashboardInsightsData | null>(null);
  const [contributors, setContributors] = useState<DashboardTopContributors | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [insRes, conRes] = await Promise.all([
          dashboardService.getInsightsData(),
          dashboardService.getTopContributors()
        ]);
        setInsights(insRes);
        setContributors(conRes);
      } catch (err) {
        setError('Failed to load insights.');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !insights || !contributors) {
    return (
      <div className="bg-red-50 p-6 rounded-xl flex items-center text-red-600">
        <AlertTriangle className="mr-3 h-6 w-6" />
        {error || 'Unable to load insights data'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Lightbulb className="h-6 w-6 text-emerald-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">AI-Ready Insights</h1>
      </div>
      
      <p className="text-gray-600">
        Review your calculated footprint distributions and top offenders. These insights are extracted from your raw data and are ready to be analyzed by the upcoming AI engine.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Findings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Trophy className="h-5 w-5 text-amber-500 mr-2" />
            Key Findings
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-emerald-500 mr-3"></span>
              <div>
                <p className="text-sm font-medium text-gray-900">Highest Category: <span className="capitalize">{insights.highest_category || 'N/A'}</span></p>
                <p className="text-sm text-gray-500">This makes up {insights.highest_category_percentage}% of your total footprint.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-500 mr-3"></span>
              <div>
                <p className="text-sm font-medium text-gray-900">Largest Single Activity: <span className="capitalize">{insights.largest_activity || 'N/A'}</span></p>
                <p className="text-sm text-gray-500">This specific activity type generates the most concentrated emissions.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-purple-500 mr-3"></span>
              <div>
                <p className="text-sm font-medium text-gray-900">Lowest Category: <span className="capitalize">{insights.lowest_category || 'N/A'}</span></p>
                <p className="text-sm text-gray-500">You are doing great in this area.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className={`flex-shrink-0 h-2 w-2 mt-2 rounded-full mr-3 ${insights.monthly_change_percent <= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  Monthly Change: {Math.abs(insights.monthly_change_percent)}% 
                  {insights.monthly_change_percent <= 0 ? 
                    <ArrowDownRight className="h-4 w-4 ml-1 text-emerald-500" /> : 
                    <ArrowUpRight className="h-4 w-4 ml-1 text-red-500" />
                  }
                </p>
                <p className="text-sm text-gray-500">Comparison of the last 30 days vs the previous 30 days.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Top Activity Offenders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Activity Offenders</h3>
          <div className="space-y-4">
            {contributors.top_activities.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              contributors.top_activities.map((act: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-mono text-sm mr-3">#{idx + 1}</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{act.activity_type}</span>
                  </div>
                  <span className="text-sm font-bold text-red-600">{act.emissions} kg CO₂</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
