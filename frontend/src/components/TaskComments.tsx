import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASK_COMMENTS } from '../graphql/queries';
import { ADD_TASK_COMMENT } from '../graphql/mutations';
import { TaskComment } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { X, Send } from 'lucide-react';

interface TaskCommentsProps {
  taskId: string;
  onClose: () => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ taskId, onClose }) => {
  const [comment, setComment] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  const { data, loading, refetch } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId },
  });

  const [addComment] = useMutation(ADD_TASK_COMMENT, {
    onCompleted: () => {
      toast.success('Comment added successfully!');
      setComment('');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !authorEmail.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    addComment({
      variables: {
        taskId,
        content: comment,
        authorEmail,
      },
    });
  };

  const comments = data?.taskComments || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Comments</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment: TaskComment) => (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {comment.authorEmail}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="input"
            placeholder="Your email"
            required
          />
          <div className="flex space-x-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input flex-1"
              placeholder="Write a comment..."
              required
            />
            <button type="submit" className="btn btn-primary flex items-center">
              <Send className="w-4 h-4 mr-2" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskComments;

