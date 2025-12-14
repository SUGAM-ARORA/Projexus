export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  projectCount?: number;
  activeProjectCount?: number;
}

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate?: string;
  taskCount?: number;
  completedTaskCount?: number;
  completionRate?: number;
  isOverdue?: boolean;
  createdAt: string;
  organization?: Organization;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeEmail: string;
  dueDate?: string;
  commentCount?: number;
  isOverdue?: boolean;
  order?: number;
  createdAt: string;
  project?: Project;
}

export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overallCompletionRate: number;
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
}

