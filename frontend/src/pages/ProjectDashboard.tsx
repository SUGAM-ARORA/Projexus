import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECTS, GET_PROJECT_STATS } from '../graphql/queries';
import { CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from '../graphql/mutations';
import { Project, ProjectFormData } from '../types';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import { Plus, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const DEFAULT_ORG_SLUG = 'my-company'; // In production, get from auth context

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ProjectDashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, loading, error, refetch } = useQuery(GET_PROJECTS, {
    variables: { organizationSlug: DEFAULT_ORG_SLUG, status: statusFilter || null },
    fetchPolicy: 'cache-and-network',
  });

  const { data: statsData } = useQuery(GET_PROJECT_STATS, {
    variables: { organizationSlug: DEFAULT_ORG_SLUG },
  });

  const [createProject] = useMutation(CREATE_PROJECT, {
    onCompleted: () => {
      toast.success('✨ Project created successfully!');
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
      toast.success('✅ Project updated successfully!');
      setEditingProject(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      toast.success('🗑️ Project deleted successfully!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (formData: ProjectFormData) => {
    if (editingProject) {
      updateProject({
        variables: {
          id: editingProject.id,
          ...formData,
          dueDate: formData.dueDate || null,
        },
      });
    } else {
      createProject({
        variables: {
          organizationSlug: DEFAULT_ORG_SLUG,
          ...formData,
          dueDate: formData.dueDate || null,
        },
      });
    }
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject({ variables: { id: projectId } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-gray-50 dark:bg-gray-900 rounded-full"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading your amazing projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-premium text-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-semibold">Error loading projects: {error.message}</p>
      </div>
    );
  }

  const projects = data?.projects || [];
  const stats = statsData?.projectStats;

  // Stat cards with different icons and colors
  const statCards = stats ? [
    { label: 'Total Projects', value: stats.totalProjects, icon: TrendingUp, color: 'from-blue-600 to-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Active Projects', value: stats.activeProjects, icon: Clock, color: 'from-emerald-600 to-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Completed', value: stats.totalTasks, icon: CheckCircle, color: 'from-purple-600 to-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Success Rate', value: `${stats.overallCompletionRate.toFixed(1)}%`, icon: TrendingUp, color: 'from-pink-600 to-pink-400', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      {stats && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                variants={item}
                className="group card-premium cursor-pointer overflow-hidden"
              >
                <div className={`${stat.bgColor} rounded-xl p-4 mb-3 w-fit`}>
                  <Icon className={`w-7 h-7 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">{stat.label}</p>
                <p className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <div className="mt-3 w-full h-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-700 rounded-full group-hover:from-primary-400 transition-all"></div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
            Your Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track all your projects in one place</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="btn-gradient px-6 py-2.5 rounded-lg flex items-center whitespace-nowrap text-white font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </motion.button>
        </div>
      </motion.div>

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="card-premium max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              {editingProject ? '✏️ Edit Project' : '✨ Create New Project'}
            </h3>
            <ProjectForm
              project={editingProject || undefined}
              organizationSlug={DEFAULT_ORG_SLUG}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
            />
          </motion.div>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium text-center py-24"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-semibold mb-4">No projects yet</p>
          <p className="text-gray-500 dark:text-gray-500 mb-8">Create your first project to get started with managing your tasks!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="btn-gradient px-8 py-3 rounded-lg text-white font-semibold inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create First Project
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              variants={item}
              className="h-full"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectDashboard;

