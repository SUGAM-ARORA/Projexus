/**
 * Task Card component - displays individual task information
 */

import React from 'react';
import { Edit2, Trash2, MessageSquare, Calendar, User } from 'lucide-react';
import { Task } from '@/types';
import { STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, PRIORITY_ICONS } from '@/utils/constants';
import { getDueDateLabel, isOverdue, formatRelativeTime } from '@/utils/date';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewComments: (task: Task) => void;
  commentCount?: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onViewComments,
  commentCount = 0,
}) => {
  const dueDateLabel = getDueDateLabel(task.dueDate);
  const overdue = isOverdue(task.dueDate);

  return (
    <div
      className="card p-4 hover:shadow-lg transition-all duration-200 group cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      onClick={() => onViewComments(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewComments(task);
        }
      }}
      aria-label={`Task: ${task.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={clsx(
                'badge border',
                STATUS_COLORS[task.status]
              )}
            >
              {STATUS_LABELS[task.status]}
            </span>
            {task.priority && (
              <span
                className={clsx(
                  'badge border text-xs',
                  PRIORITY_COLORS[task.priority]
                )}
                title={`Priority: ${PRIORITY_LABELS[task.priority]}`}
              >
                {PRIORITY_ICONS[task.priority]} {PRIORITY_LABELS[task.priority]}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Edit task: ${task.title}`}
          >
            <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDelete(task.id);
              }
            }}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            aria-label={`Delete task: ${task.title}`}
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
        {task.description}
      </p>

      {/* Metadata */}
      <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <User className="w-3.5 h-3.5" />
          <span className="truncate">{task.assigneeEmail}</span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-2 text-xs">
            <Calendar className={clsx(
              'w-3.5 h-3.5',
              overdue ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            )} />
            <span className={clsx(
              overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'
            )}>
              {dueDateLabel}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>Updated {formatRelativeTime(task.updatedAt)}</span>
          {commentCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewComments(task);
              }}
              className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{commentCount}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

