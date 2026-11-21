export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'In Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  estimated_hours?: number | null;
  due_date: string;
  assignee_id: string;
}
export interface TaskListResponse {
  items: Task[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
export interface TaskCreate {
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'In Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  estimated_hours?: number | null;
  due_date: string;
  assignee_id: string;
}
