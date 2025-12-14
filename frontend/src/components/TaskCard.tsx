import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { Calendar, MessageSquare, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import TaskForm from './TaskForm';
import TaskComments from './TaskComments';

interface TaskCardProps {
  task: Task;
  projectId: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, projectId }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-move hover:shadow-lg transition-shadow"
      >
        <div className="flex justify-between items-start mb-2">
          <h4
            className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600"
            onClick={() => setShowDetails(true)}
          >
            {task.title}
          </h4>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
          {task.assigneeEmail && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span className="truncate max-w-[100px]">{task.assigneeEmail}</span>
            </div>
          )}
          {task.dueDate && (
            <div
              className={clsx(
                'flex items-center',
                task.isOverdue && 'text-red-600 dark:text-red-400'
              )}
            >
              {task.isOverdue ? (
                <AlertCircle className="w-3 h-3 mr-1" />
              ) : (
                <Calendar className="w-3 h-3 mr-1" />
              )}
              <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
            </div>
          )}
          {task.commentCount !== undefined && task.commentCount > 0 && (
            <div className="flex items-center">
              <MessageSquare className="w-3 h-3 mr-1" />
              <span>{task.commentCount}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span
            className={clsx(
              'badge',
              task.status === 'DONE' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
              task.status === 'IN_PROGRESS' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
              task.status === 'TODO' && 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
              task.status === 'BLOCKED' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            )}
          >
            {task.status}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(true);
            }}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            Comments
          </button>
        </div>
      </div>

      {showDetails && (
        <TaskForm
          task={task}
          projectId={projectId}
          onClose={() => setShowDetails(false)}
          onUpdate={() => {
            setShowDetails(false);
            window.location.reload();
          }}
        />
      )}

      {showComments && (
        <TaskComments
          taskId={task.id}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
};

export default TaskCard;

