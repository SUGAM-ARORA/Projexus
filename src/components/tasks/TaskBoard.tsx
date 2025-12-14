/**
 * Task Board component - Kanban-style board with drag and drop
 */

import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { STATUS_LABELS, TASK_STATUSES } from '@/utils/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface TaskBoardProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewComments: (task: Task) => void;
  commentCounts: Record<string, number>;
  isLoading?: boolean;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskStatusChange,
  onEdit,
  onDelete,
  onViewComments,
  commentCounts,
  isLoading = false,
}) => {
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TaskStatus;

    // Don't do anything if dropped in the same column
    const task = tasks.find(t => t.id === draggableId);
    if (task && task.status === newStatus) return;

    await onTaskStatusChange(draggableId, newStatus);
  };

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {TASK_STATUSES.map(status => {
          const statusTasks = getTasksByStatus(status);
          
          return (
            <div key={status} className="flex flex-col">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {STATUS_LABELS[status]}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {statusTasks.length} {statusTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 min-h-[400px] p-4 rounded-lg border-2 border-dashed transition-colors
                      ${snapshot.isDraggingOver 
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700' 
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                      }
                    `}
                  >
                    <div className="space-y-3">
                      {statusTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                ${snapshot.isDragging ? 'opacity-75 rotate-2' : ''}
                                transition-transform
                              `}
                            >
                              <TaskCard
                                task={task}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onViewComments={onViewComments}
                                commentCount={commentCounts[task.id] || 0}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                    
                    {statusTasks.length === 0 && (
                      <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                        <p className="text-sm">No tasks in this column</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

