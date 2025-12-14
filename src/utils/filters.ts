/**
 * Filter utilities for tasks
 */

import { Task, TaskFilters, TaskStatus, TaskPriority } from '@/types';

/**
 * Filters tasks based on provided filters
 */
export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  return tasks.filter((task) => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(task.status)) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!task.priority || !filters.priority.includes(task.priority)) {
        return false;
      }
    }

    // Assignee filter
    if (filters.assignee) {
      if (task.assigneeEmail.toLowerCase() !== filters.assignee.toLowerCase()) {
        return false;
      }
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description.toLowerCase().includes(query);
      const matchesAssignee = task.assigneeEmail.toLowerCase().includes(query);
      const matchesTags = task.tags?.some(tag => tag.toLowerCase().includes(query));

      if (!matchesTitle && !matchesDescription && !matchesAssignee && !matchesTags) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Gets task statistics
 */
export const getTaskStats = (tasks: Task[]) => {
  const total = tasks.length;
  const byStatus = {
    TODO: tasks.filter(t => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter(t => t.status === 'DONE').length,
  };
  const byPriority = {
    low: tasks.filter(t => t.priority === 'low').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    high: tasks.filter(t => t.priority === 'high').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
  };
  const overdue = tasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today && t.status !== 'DONE';
  }).length;

  return {
    total,
    byStatus,
    byPriority,
    overdue,
  };
};

