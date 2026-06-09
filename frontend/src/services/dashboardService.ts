import api from './api';
import type { 
  DashboardSummary, 
  DashboardCategories, 
  DashboardTrends, 
  DashboardTopContributors, 
  DashboardInsightsData 
} from '../types';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
  getCategories: async (): Promise<DashboardCategories> => {
    const response = await api.get('/dashboard/categories');
    return response.data;
  },
  getTrends: async (): Promise<DashboardTrends> => {
    const response = await api.get('/dashboard/trends');
    return response.data;
  },
  getTopContributors: async (): Promise<DashboardTopContributors> => {
    const response = await api.get('/dashboard/top-contributors');
    return response.data;
  },
  getInsightsData: async (): Promise<DashboardInsightsData> => {
    const response = await api.get('/dashboard/insights-data');
    return response.data;
  }
};
