import type { Task, TaskCreate, TaskListResponse } from '../types/task';
import api from './api';

export interface TaskQueryParams {
  assignee_id?: string;
  search?: string;
  status?: string;
  priority?: string;
  sort_by?: 'title' | 'due_date';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Get all tasks
export const getAllTasks = async (
  params?: TaskQueryParams,
  signal?: AbortSignal,
): Promise<TaskListResponse> => {
  const response = await api.get<TaskListResponse>('/tasks', {
    params,
    signal,
  });
  return response.data;
};

// Get Single task
export const getTaskById = async (taskId: string): Promise<Task> => {
  const response = await api.get<Task>(`/tasks/${taskId}`);
  return response.data;
};

// Create task
export const createTask = async (data: TaskCreate): Promise<Task> => {
  const response = await api.post<Task>('/tasks', data);
  return response.data;
};

// Update task
export const updateTask = async (
  taskId: string,
  data: TaskCreate,
): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${taskId}`, data);
  return response.data;
};

// Delete Task
export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};
