/**
 * Validation utilities for forms and data
 */

import { TaskFormData, CommentFormData, ValidationError } from '@/types';

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates task form data
 */
export const validateTaskForm = (data: TaskFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.title.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (data.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters' });
  } else if (data.title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Title must be less than 100 characters' });
  }

  if (!data.description.trim()) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (data.description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters' });
  }

  if (!data.assigneeEmail.trim()) {
    errors.push({ field: 'assigneeEmail', message: 'Assignee email is required' });
  } else if (!isValidEmail(data.assigneeEmail)) {
    errors.push({ field: 'assigneeEmail', message: 'Please enter a valid email address' });
  }

  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      errors.push({ field: 'dueDate', message: 'Due date cannot be in the past' });
    }
  }

  return errors;
};

/**
 * Validates comment form data
 */
export const validateCommentForm = (data: CommentFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.content.trim()) {
    errors.push({ field: 'content', message: 'Comment cannot be empty' });
  } else if (data.content.trim().length < 1) {
    errors.push({ field: 'content', message: 'Comment must have at least 1 character' });
  } else if (data.content.trim().length > 500) {
    errors.push({ field: 'content', message: 'Comment must be less than 500 characters' });
  }

  if (!data.authorEmail.trim()) {
    errors.push({ field: 'authorEmail', message: 'Author email is required' });
  } else if (!isValidEmail(data.authorEmail)) {
    errors.push({ field: 'authorEmail', message: 'Please enter a valid email address' });
  }

  return errors;
};

/**
 * Gets error message for a specific field
 */
export const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
  return errors.find(error => error.field === field)?.message;
};

