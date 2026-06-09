import api from './api';

export interface InsightItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RecommendationItem {
  title: string;
  impact: 'high' | 'medium' | 'low';
  estimated_savings: string;
}

export interface InsightsResponse {
  summary: string;
  insights: InsightItem[];
  recommendations: RecommendationItem[];
  risk_areas: string[];
  positive_habits: string[];
}

export const insightsService = {
  getInsights: async (): Promise<InsightsResponse> => {
    const response = await api.get('/dashboard/ai-insights');
    return response.data;
  },
};
