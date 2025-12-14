import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TASK, UPDATE_TASK } from '../graphql/mutations';
import { Task, TaskStatus } from '../types';
import toast from 'react-hot-toast';

interface TaskFormProps {
  task?: Task;
  projectId: string;
  onClose: () => void;
  onUpdate: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  assigneeEmail: string;
  dueDate: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, projectId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'TODO',
    assigneeEmail: task?.assigneeEmail || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      toast.success('Task created successfully!');
      onUpdate();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      toast.success('Task updated successfully!');
      onUpdate();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (task) {
        updateTask({
          variables: {
            id: task.id,
            ...formData,
            dueDate: formData.dueDate || null,
          },
        });
      } else {
        createTask({
          variables: {
            projectId,
            ...formData,
            dueDate: formData.dueDate || null,
          },
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={4}
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="input"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <div>
              <label htmlFor="assigneeEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee Email
              </label>
              <input
                type="email"
                id="assigneeEmail"
                value={formData.assigneeEmail}
                onChange={(e) => setFormData({ ...formData, assigneeEmail: e.target.value })}
                className="input"
                placeholder="assignee@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="input"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

