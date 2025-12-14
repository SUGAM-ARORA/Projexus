/**
 * Comment List component - displays all comments for a task
 */

import React from 'react';
import { Trash2 } from 'lucide-react';
import { TaskComment } from '@/types';
import { formatRelativeTime } from '@/utils/date';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface CommentListProps {
  comments: TaskComment[];
  onDelete: (commentId: string) => void;
  currentUserEmail?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  onDelete,
  currentUserEmail,
  isLoading = false,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <p className="text-sm">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => {
        const canDelete = currentUserEmail === comment.authorEmail;
        
        return (
          <div
            key={comment.id}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {comment.authorEmail}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
              </div>
              
              {canDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this comment?')) {
                      onDelete(comment.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex-shrink-0"
                  aria-label="Delete comment"
                >
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

