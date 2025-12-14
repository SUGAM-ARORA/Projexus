/**
 * Main App component - orchestrates the entire application
 */

import React, { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, List, Plus, RefreshCw, BarChart3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Task, TaskFormData, ViewMode, TaskFilters, TaskStatus, TaskPriority } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskCommentsModal } from '@/components/comments/TaskCommentsModal';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { StatsCard } from '@/components/ui/StatsCard';
import { filterTasks, getTaskStats } from '@/utils/filters';
import * as taskService from '@/services/taskService';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isTaskFormLoading, setIsTaskFormLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showStats, setShowStats] = useState<boolean>(true);

  const { theme } = useTheme();
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  } = useTasks();

  // Initialize sample data on mount
  useEffect(() => {
    taskService.initializeSampleData();
    refreshTasks();
    
    // Get current user email from localStorage or prompt
    const savedEmail = localStorage.getItem('currentUserEmail');
    if (savedEmail) {
      setCurrentUserEmail(savedEmail);
    } else {
      const email = prompt('Please enter your email address:') || '';
      if (email) {
        setCurrentUserEmail(email);
        localStorage.setItem('currentUserEmail', email);
      }
    }
  }, [refreshTasks]);

  // Calculate comment counts for each task
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, {
      ...filters,
      searchQuery,
    });
  }, [tasks, filters, searchQuery]);

  // Get task statistics
  const stats = useMemo(() => getTaskStats(tasks), [tasks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
      }
      // Ctrl/Cmd + N to create new task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setEditingTask(undefined);
        setIsTaskFormOpen(true);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        if (isTaskFormOpen) {
          setIsTaskFormOpen(false);
          setEditingTask(undefined);
        }
        if (isCommentsModalOpen) {
          setIsCommentsModalOpen(false);
          setSelectedTask(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTaskFormOpen, isCommentsModalOpen]);

  const handleCreateTask = async (data: TaskFormData) => {
    setIsTaskFormLoading(true);
    try {
      await createTask(data);
      setIsTaskFormOpen(false);
      setEditingTask(undefined);
    } finally {
      setIsTaskFormLoading(false);
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return;
    
    setIsTaskFormLoading(true);
    try {
      await updateTask(editingTask.id, data);
      setIsTaskFormOpen(false);
      setEditingTask(undefined);
    } finally {
      setIsTaskFormLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    if (selectedTask?.id === taskId) {
      setIsCommentsModalOpen(false);
      setSelectedTask(null);
    }
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handleViewComments = (task: Task) => {
    setSelectedTask(task);
    setIsCommentsModalOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                v1.0.0
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('board')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'board'
                      ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  aria-label="Board view"
                  title="Board view"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  aria-label="List view"
                  title="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Refresh Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshTasks}
                disabled={tasksLoading}
                aria-label="Refresh tasks"
              >
                <RefreshCw className={`w-4 h-4 ${tasksLoading ? 'animate-spin' : ''}`} />
              </Button>

              {/* Create Task Button */}
              <Button
                variant="primary"
                onClick={() => {
                  setEditingTask(undefined);
                  setIsTaskFormOpen(true);
                }}
                className="flex items-center gap-2"
                title="Create new task (Ctrl/Cmd + N)"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Task</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tasks... (Ctrl/Cmd + K)"
              />
            </div>
            <div className="flex items-center gap-3">
              <FilterDropdown
                statuses={filters.status}
                priorities={filters.priority}
                onStatusChange={(statuses) => setFilters(prev => ({ ...prev, status: statuses.length > 0 ? statuses : undefined }))}
                onPriorityChange={(priorities) => setFilters(prev => ({ ...prev, priority: priorities.length > 0 ? priorities : undefined }))}
                onClear={() => setFilters({})}
              />
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle statistics"
                title="Toggle statistics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <StatsCard
                label="Total Tasks"
                value={stats.total}
                icon="📊"
                color="primary"
              />
              <StatsCard
                label="To Do"
                value={stats.byStatus.TODO}
                icon="📋"
                color="blue"
              />
              <StatsCard
                label="In Progress"
                value={stats.byStatus.IN_PROGRESS}
                icon="⚙️"
                color="orange"
              />
              <StatsCard
                label="Done"
                value={stats.byStatus.DONE}
                icon="✅"
                color="green"
              />
              <StatsCard
                label="Overdue"
                value={stats.overdue}
                icon="⚠️"
                color="orange"
              />
              <StatsCard
                label="Urgent"
                value={stats.byPriority.urgent}
                icon="🔥"
                color="orange"
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {tasksError && (
          <div className="mb-6">
            <ErrorMessage message={tasksError} />
          </div>
        )}

        {/* Results Count */}
        {filteredTasks.length !== tasks.length && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        )}

        {/* Loading State */}
        {tasksLoading && tasks.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Task View */}
            {viewMode === 'board' ? (
              <TaskBoard
                tasks={filteredTasks}
                onTaskStatusChange={handleTaskStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onViewComments={handleViewComments}
                commentCounts={commentCounts}
                isLoading={tasksLoading}
              />
            ) : (
              <TaskList
                tasks={filteredTasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onViewComments={handleViewComments}
                commentCounts={commentCounts}
                isLoading={tasksLoading}
              />
            )}
          </>
        )}

        {/* Empty State */}
        {!tasksLoading && filteredTasks.length === 0 && tasks.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No tasks match your filters</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {!tasksLoading && tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No tasks yet
              </h2>
              <p className="text-gray-500 mb-6">
                Get started by creating your first task. Organize your work and stay productive!
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingTask(undefined);
                  setIsTaskFormOpen(true);
                }}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Your First Task
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      <Modal
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseTaskForm}
          isLoading={isTaskFormLoading}
        />
      </Modal>

      {/* Task Comments Modal */}
      <TaskCommentsModal
        task={selectedTask}
        isOpen={isCommentsModalOpen}
        onClose={() => {
          setIsCommentsModalOpen(false);
          setSelectedTask(null);
        }}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        commentCount={commentCounts[selectedTask?.id || ''] || 0}
        currentUserEmail={currentUserEmail}
        onCommentCountUpdate={(taskId, count) => {
          setCommentCounts(prev => ({ ...prev, [taskId]: count }));
        }}
      />
    </div>
  );
}

export default App;

