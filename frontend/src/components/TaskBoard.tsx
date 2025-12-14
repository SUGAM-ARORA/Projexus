import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK_STATUS } from '../graphql/mutations';
import toast from 'react-hot-toast';

interface TaskBoardProps {
  tasks: Task[];
  projectId: string;
  onTaskUpdate: () => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, projectId, onTaskUpdate }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Find the task
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      await updateTaskStatus({
        variables: {
          id: taskId,
          status: newStatus,
        },
        optimisticResponse: {
          updateTaskStatus: {
            task: {
              ...task,
              status: newStatus,
            },
            success: true,
            message: 'Task status updated',
          },
        },
      });
      toast.success('Task moved successfully!');
      onTaskUpdate();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const getColumnTitle = (status: TaskStatus) => {
    const titles: Record<TaskStatus, string> = {
      TODO: 'To Do',
      IN_PROGRESS: 'In Progress',
      DONE: 'Done',
      BLOCKED: 'Blocked',
    };
    return titles[status];
  };

  const getColumnColor = (status: TaskStatus) => {
    const colors: Record<TaskStatus, string> = {
      TODO: 'bg-gray-100 dark:bg-gray-800',
      IN_PROGRESS: 'bg-blue-100 dark:bg-blue-900',
      DONE: 'bg-green-100 dark:bg-green-900',
      BLOCKED: 'bg-red-100 dark:bg-red-900',
    };
    return colors[status];
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((status) => {
          const columnTasks = getTasksByStatus(status);
          return (
            <div
              key={status}
              className={`${getColumnColor(status)} rounded-lg p-4 min-h-[400px]`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {getColumnTitle(status)}
                </h3>
                <span className="badge bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {columnTasks.length}
                </span>
              </div>
              <SortableContext
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} projectId={projectId} />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="opacity-50">
            <TaskCard
              task={tasks.find((t) => t.id === activeId)!}
              projectId={projectId}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;

