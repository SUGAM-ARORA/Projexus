/**
 * Task Form component - for creating and editing tasks
 */

import React, { useState, useEffect } from 'react';
import { Task, TaskFormData, ValidationError } from '@/types';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { validateTaskForm, getFieldError } from '@/utils/validation';
import { TASK_STATUSES, STATUS_LABELS, TASK_PRIORITIES, PRIORITY_LABELS } from '@/utils/constants';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    assigneeEmail: task?.assigneeEmail || '',
    dueDate: task?.dueDate || '',
    status: task?.status || 'TODO',
    priority: task?.priority || 'medium',
    tags: task?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors.find(err => err.field === name)) {
      setErrors(prev => prev.filter(err => err.field !== name));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate on blur
    const validationErrors = validateTaskForm(formData);
    const fieldError = validationErrors.find(err => err.field === field);
    if (fieldError) {
      setErrors(prev => {
        const filtered = prev.filter(err => err.field !== field);
        return [...filtered, fieldError];
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateTaskForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // Mark all fields as touched
      setTouched({
        title: true,
        description: true,
        assigneeEmail: true,
        dueDate: true,
      });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        onBlur={() => handleBlur('title')}
        error={touched.title ? getFieldError(errors, 'title') : undefined}
        placeholder="Enter task title"
        required
        autoFocus
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        onBlur={() => handleBlur('description')}
        error={touched.description ? getFieldError(errors, 'description') : undefined}
        placeholder="Enter task description"
        rows={4}
        required
      />

      <Input
        label="Assignee Email"
        name="assigneeEmail"
        type="email"
        value={formData.assigneeEmail}
        onChange={handleChange}
        onBlur={() => handleBlur('assigneeEmail')}
        error={touched.assigneeEmail ? getFieldError(errors, 'assigneeEmail') : undefined}
        placeholder="assignee@example.com"
        required
      />

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input"
        >
          {TASK_STATUSES.map(status => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Due Date (Optional)"
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
        onBlur={() => handleBlur('dueDate')}
        error={touched.dueDate ? getFieldError(errors, 'dueDate') : undefined}
        min={new Date().toISOString().split('T')[0]}
      />

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="input"
        >
          {TASK_PRIORITIES.map(priority => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Tags (Optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    tags: prev.tags?.filter((_, i) => i !== index) || [],
                  }));
                }}
                className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && tagInput.trim()) {
                e.preventDefault();
                if (!formData.tags?.includes(tagInput.trim())) {
                  setFormData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), tagInput.trim()],
                  }));
                }
                setTagInput('');
              }
            }}
            placeholder="Add a tag and press Enter"
            className="input flex-1"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="flex-1"
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

