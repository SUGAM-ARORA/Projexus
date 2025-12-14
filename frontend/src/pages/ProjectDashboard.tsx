import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECTS, GET_PROJECT_STATS } from '../graphql/queries';
import { CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from '../graphql/mutations';
import { Project, ProjectFormData } from '../types';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import { Plus, Filter, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const DEFAULT_ORG_SLUG = 'my-company'; // In production, get from auth context

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
      toast.success('Project created successfully!');
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
      toast.success('Project updated successfully!');
      setEditingProject(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      toast.success('Project deleted successfully!');
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center">
        <p className="text-red-600">Error loading projects: {error.message}</p>
      </div>
    );
  }

  const projects = data?.projects || [];
  const stats = statsData?.projectStats;

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalProjects}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeProjects}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalTasks}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-primary-600">
                  {stats.overallCompletionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h2>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="btn btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingProject ? 'Edit Project' : 'Create New Project'}
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
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No projects found. Create your first project!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;

