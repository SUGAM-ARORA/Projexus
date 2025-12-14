import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PROJECT, GET_TASKS } from '../graphql/queries';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';
import { ArrowLeft, Plus, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskUpdateKey, setTaskUpdateKey] = useState(0);

  const { data: projectData, loading: projectLoading, error: projectError, refetch: refetchProject } = useQuery(
    GET_PROJECT,
    {
      variables: { id: projectId },
      skip: !projectId,
    }
  );

  const { data: tasksData, loading: tasksLoading, refetch: refetchTasks } = useQuery(GET_TASKS, {
    variables: { projectId },
    skip: !projectId,
    fetchPolicy: 'cache-and-network',
  });

  const handleTaskUpdate = () => {
    setTaskUpdateKey((prev) => prev + 1);
    refetchTasks();
    refetchProject();
  };

  if (projectLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (projectError || !projectData?.project) {
    return (
      <div className="card text-center">
        <p className="text-red-600">Error loading project: {projectError?.message || 'Project not found'}</p>
        <button onClick={() => navigate('/projects')} className="btn btn-primary mt-4">
          Back to Projects
        </button>
      </div>
    );
  }

  const project = projectData.project;
  const tasks = tasksData?.tasks || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowTaskForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.taskCount || 0}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-green-600">{project.completedTaskCount || 0}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
          <p className="text-2xl font-bold text-primary-600">
            {project.completionRate?.toFixed(1) || 0}%
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{project.status}</p>
        </motion.div>
      </div>

      {/* Task Board */}
      {tasksLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <motion.div
          key={taskUpdateKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <TaskBoard
            tasks={tasks}
            projectId={projectId!}
            onTaskUpdate={handleTaskUpdate}
          />
        </motion.div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          projectId={projectId!}
          onClose={() => setShowTaskForm(false)}
          onUpdate={() => {
            setShowTaskForm(false);
            handleTaskUpdate();
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetail;

