/**
 * Task Comments Modal - displays task details and comments
 */

import React, { useEffect } from 'react';
import { Task } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { useTaskComments } from '@/hooks/useTaskComments';
import { TaskCard } from '@/components/tasks/TaskCard';

interface TaskCommentsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  commentCount: number;
  currentUserEmail?: string;
  onCommentCountUpdate?: (taskId: string, count: number) => void;
}

export const TaskCommentsModal: React.FC<TaskCommentsModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  commentCount,
  currentUserEmail,
  onCommentCountUpdate,
}) => {
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    addComment,
    deleteComment,
  } = useTaskComments(task?.id || '');

  // Update comment count when comments change
  useEffect(() => {
    if (task && onCommentCountUpdate) {
      onCommentCountUpdate(task.id, comments.length);
    }
  }, [comments.length, task, onCommentCountUpdate]);

  const handleAddComment = async (data: { content: string; authorEmail: string }) => {
    if (!task) return;
    await addComment(data);
  };

  if (!task) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details & Comments"
      size="xl"
    >
      <div className="space-y-6">
        {/* Task Card */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewComments={() => {}}
            commentCount={commentCount}
          />
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Comments ({comments.length})
          </h3>
          
          <div className="space-y-6">
            <CommentList
              comments={comments}
              onDelete={deleteComment}
              currentUserEmail={currentUserEmail}
              isLoading={commentsLoading}
              error={commentsError}
            />

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <CommentForm
                onSubmit={handleAddComment}
                defaultAuthorEmail={currentUserEmail}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

