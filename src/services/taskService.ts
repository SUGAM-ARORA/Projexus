/**
 * Task Service - Handles task data operations
 * In a real application, this would interact with an API
 */

import { Task, TaskFormData, TaskComment, CommentFormData } from '@/types';

// Simulated storage (in real app, this would be API calls)
let tasksStorage: Task[] = [];
let commentsStorage: TaskComment[] = [];

/**
 * Generates a unique ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Simulates API delay
 */
const delay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Gets all tasks
 */
export const getTasks = async (): Promise<Task[]> => {
  await delay(300);
  return [...tasksStorage];
};

/**
 * Gets a task by ID
 */
export const getTaskById = async (id: string): Promise<Task | null> => {
  await delay(200);
  return tasksStorage.find(task => task.id === id) || null;
};

/**
 * Creates a new task
 */
export const createTask = async (data: TaskFormData): Promise<Task> => {
  await delay(500);
  
  const now = new Date().toISOString();
  const newTask: Task = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  
  tasksStorage.push(newTask);
  return newTask;
};

/**
 * Updates an existing task
 */
export const updateTask = async (id: string, data: Partial<TaskFormData>): Promise<Task> => {
  await delay(500);
  
  const taskIndex = tasksStorage.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const updatedTask: Task = {
    ...tasksStorage[taskIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  tasksStorage[taskIndex] = updatedTask;
  return updatedTask;
};

/**
 * Deletes a task
 */
export const deleteTask = async (id: string): Promise<void> => {
  await delay(300);
  tasksStorage = tasksStorage.filter(task => task.id !== id);
  // Also delete associated comments
  commentsStorage = commentsStorage.filter(comment => comment.taskId !== id);
};

/**
 * Gets comments for a task
 */
export const getTaskComments = async (taskId: string): Promise<TaskComment[]> => {
  await delay(200);
  return commentsStorage
    .filter(comment => comment.taskId === taskId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

/**
 * Adds a comment to a task
 */
export const addTaskComment = async (taskId: string, data: CommentFormData): Promise<TaskComment> => {
  await delay(400);
  
  const now = new Date().toISOString();
  const newComment: TaskComment = {
    id: generateId(),
    taskId,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  
  commentsStorage.push(newComment);
  return newComment;
};

/**
 * Deletes a comment
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  await delay(200);
  commentsStorage = commentsStorage.filter(comment => comment.id !== commentId);
};

/**
 * Initializes with sample data (for demo purposes)
 */
export const initializeSampleData = (): void => {
  const now = new Date().toISOString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  tasksStorage = [
    {
      id: '1',
      title: 'Design user interface mockups',
      description: 'Create high-fidelity mockups for the dashboard and task management views. Include responsive designs for mobile and tablet.',
      status: 'IN_PROGRESS',
      assigneeEmail: 'designer@example.com',
      dueDate: tomorrow.toISOString().split('T')[0],
      priority: 'high',
      tags: ['design', 'ui', 'mockups'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '2',
      title: 'Implement authentication system',
      description: 'Set up JWT-based authentication with refresh tokens. Include login, logout, and password reset functionality.',
      status: 'TODO',
      assigneeEmail: 'developer@example.com',
      dueDate: nextWeek.toISOString().split('T')[0],
      priority: 'urgent',
      tags: ['backend', 'security'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all REST API endpoints with request/response examples, error codes, and authentication requirements.',
      status: 'DONE',
      assigneeEmail: 'tech-writer@example.com',
      priority: 'medium',
      tags: ['documentation'],
      createdAt: now,
      updatedAt: now,
    },
  ];
  
  commentsStorage = [
    {
      id: 'c1',
      taskId: '1',
      content: 'Great progress on the mockups! The color scheme looks professional.',
      authorEmail: 'pm@example.com',
      createdAt: now,
    },
    {
      id: 'c2',
      taskId: '1',
      content: 'Can we add dark mode support to the designs?',
      authorEmail: 'developer@example.com',
      createdAt: now,
    },
  ];
};

