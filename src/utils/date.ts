/**
 * Date utility functions
 */

import { format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO } from 'date-fns';

/**
 * Formats a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

/**
 * Formats a date string to a relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
};

/**
 * Gets a user-friendly due date label
 */
export const getDueDateLabel = (dueDate?: string): string | null => {
  if (!dueDate) return null;

  try {
    const date = parseISO(dueDate);
    
    if (isPast(date) && !isToday(date)) {
      return 'Overdue';
    }
    if (isToday(date)) {
      return 'Due today';
    }
    if (isTomorrow(date)) {
      return 'Due tomorrow';
    }
    
    return formatDate(dueDate);
  } catch {
    return null;
  }
};

/**
 * Checks if a date is overdue
 */
export const isOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  
  try {
    const date = parseISO(dueDate);
    return isPast(date) && !isToday(date);
  } catch {
    return false;
  }
};

