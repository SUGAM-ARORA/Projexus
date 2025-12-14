/**
 * Custom hook for managing task comments
 */

import { useState, useEffect, useCallback } from 'react';
import { TaskComment, CommentFormData } from '@/types';
import * as taskService from '@/services/taskService';

interface UseTaskCommentsReturn {
  comments: TaskComment[];
  loading: boolean;
  error: string | null;
  addComment: (data: CommentFormData) => Promise<TaskComment | null>;
  deleteComment: (commentId: string) => Promise<boolean>;
  refreshComments: () => Promise<void>;
}

export const useTaskComments = (taskId: string): UseTaskCommentsReturn => {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      setError(null);
      const loadedComments = await taskService.getTaskComments(taskId);
      setComments(loadedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const addComment = useCallback(async (data: CommentFormData): Promise<TaskComment | null> => {
    try {
      setError(null);
      const newComment = await taskService.addTaskComment(taskId, data);
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      return null;
    }
  }, [taskId]);

  const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
    try {
      setError(null);
      await taskService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      return false;
    }
  }, []);

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    refreshComments: loadComments,
  };
};

