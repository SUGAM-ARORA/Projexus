/**
 * Core TypeScript interfaces for Task Management System
 */

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeEmail: string;
  dueDate?: string;
  priority?: TaskPriority;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  content: string;
  authorEmail: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  assigneeEmail: string;
  dueDate?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
}

export interface CommentFormData {
  content: string;
  authorEmail: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}

export type ViewMode = 'board' | 'list';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string;
  searchQuery?: string;
}

