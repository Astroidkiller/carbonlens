import api from './api';
import type { Activity } from '../types';

export interface ActivityCreate {
  activity_date: string;
  category: string;
  activity_type: string;
  description?: string;
  quantity: number;
  unit: string;
}

export const activityService = {
  getAll: async (): Promise<Activity[]> => {
    const response = await api.get('/activities/');
    return response.data;
  },
  
  getById: async (id: string): Promise<Activity> => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  create: async (data: ActivityCreate): Promise<Activity> => {
    const response = await api.post('/activities/', data);
    return response.data;
  },

  extractDiary: async (text: string) => {
    const response = await api.post('/activities/extract', { text });
    return response.data;
  },

  bulkCreate: async (activities: ActivityCreate[]): Promise<Activity[]> => {
    const response = await api.post('/activities/bulk', { activities });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/activities/${id}`);
  }
};
