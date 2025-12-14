/**
 * Filter Dropdown component
 */

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { TaskStatus, TaskPriority } from '@/types';
import { STATUS_LABELS, PRIORITY_LABELS } from '@/utils/constants';
import { Button } from './Button';

interface FilterDropdownProps {
  statuses?: TaskStatus[];
  priorities?: TaskPriority[];
  onStatusChange: (statuses: TaskStatus[]) => void;
  onPriorityChange: (priorities: TaskPriority[]) => void;
  onClear: () => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  statuses = [],
  priorities = [],
  onStatusChange,
  onPriorityChange,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = statuses.length > 0 || priorities.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          hasActiveFilters
            ? 'bg-primary-50 dark:bg-primary-900 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="px-2 py-0.5 text-xs bg-primary-600 text-white rounded-full">
            {statuses.length + priorities.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={onClear}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={statuses.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onStatusChange([...statuses, status]);
                          } else {
                            onStatusChange(statuses.filter((s) => s !== status));
                          }
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {STATUS_LABELS[status]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div className="space-y-2">
                  {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((priority) => (
                    <label
                      key={priority}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={priorities.includes(priority)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onPriorityChange([...priorities, priority]);
                          } else {
                            onPriorityChange(priorities.filter((p) => p !== priority));
                          }
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {PRIORITY_LABELS[priority]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

