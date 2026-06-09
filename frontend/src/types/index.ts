export interface User {
  id: string;
  email: string;
  full_name: string;
  current_carbon_score: number;
}

export interface Activity {
  id: string;
  user_id: string;
  activity_date: string;
  category: string;
  activity_type: string;
  description?: string;
  quantity: number;
  unit: string;
  carbon_emission: number;
  calculation_explanation?: string;
  created_at: string;
}

export interface DashboardSummary {
  total_emissions: number;
  current_week: number;
  previous_week: number;
  weekly_change_percent: number;
  current_month: number;
  previous_month: number;
  monthly_change_percent: number;
  activity_count: number;
  average_daily_emissions: number;
  highest_emission_category?: string;
  carbon_score: number;
  trend_direction: string;
}

export interface DashboardCategories {
  transport: number;
  food: number;
  electricity: number;
  shopping: number;
  waste: number;
}

export interface TrendDataPoint {
  period: string;
  emissions: number;
}

export interface DashboardTrends {
  daily: TrendDataPoint[];
  weekly: TrendDataPoint[];
  monthly: TrendDataPoint[];
}

export interface ActivityContributor {
  activity_type: string;
  emissions: number;
}

export interface CategoryContributor {
  category: string;
  emissions: number;
}

export interface DashboardTopContributors {
  top_activities: ActivityContributor[];
  top_categories: CategoryContributor[];
}

export interface DashboardInsightsData {
  highest_category?: string;
  highest_category_percentage: number;
  lowest_category?: string;
  largest_activity?: string;
  monthly_change_percent: number;
}
