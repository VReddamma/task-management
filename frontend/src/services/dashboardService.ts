import api from './api';

export interface DashboardStats {
  total_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  in_review_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('dashboard/stats');
  return response.data;
};
