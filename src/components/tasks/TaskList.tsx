/**
 * Task List component - List view of tasks
 */

import React from 'react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewComments: (task: Task) => void;
  commentCounts: Record<string, number>;
  isLoading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onViewComments,
  commentCounts,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-2">No tasks yet</p>
        <p className="text-gray-400 text-sm">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewComments={onViewComments}
          commentCount={commentCounts[task.id] || 0}
        />
      ))}
    </div>
  );
};

