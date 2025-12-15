import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { format } from 'date-fns';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useApolloClient } from '@apollo/client';
import { GET_PROJECT } from '../graphql/queries';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusConfig = {
    ACTIVE: {
      bgColor: 'from-emerald-500/20 to-teal-500/20',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      icon: '⚡',
    },
    COMPLETED: {
      bgColor: 'from-blue-500/20 to-cyan-500/20',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/50',
      badgeText: 'text-blue-700 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800',
      icon: '✅',
    },
    ON_HOLD: {
      bgColor: 'from-amber-500/20 to-orange-500/20',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/50',
      badgeText: 'text-amber-700 dark:text-amber-300',
      borderColor: 'border-amber-200 dark:border-amber-800',
      icon: '⏸️',
    },
    CANCELLED: {
      bgColor: 'from-red-500/20 to-pink-500/20',
      badgeBg: 'bg-red-100 dark:bg-red-900/50',
      badgeText: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: '❌',
    },
  };

  const config = statusConfig[project.status];
  const apolloClient = useApolloClient();

  const prefetchProject = () => {
    apolloClient.query({
      query: GET_PROJECT,
      variables: { id: project.id },
      fetchPolicy: 'cache-first',
    }).catch(() => {});
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full"
    >
      <Link to={`/projects/${project.id}`} className="block h-full group" onMouseEnter={prefetchProject}>
        <div className={`relative h-full card-premium overflow-hidden border-2 ${config.borderColor} bg-gradient-to-br ${config.bgColor} backdrop-blur-sm cursor-pointer`}>
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary-400/20 to-transparent rounded-bl-3xl"></div>

          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <span className={`${config.badgeBg} ${config.badgeText} px-3 py-1.5 rounded-full text-sm font-semibold flex items-center space-x-1 backdrop-blur-sm`}>
              <span>{config.icon}</span>
              <span>{project.status}</span>
            </span>
            <motion.div
              whileHover={{ x: 4 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ArrowRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </motion.div>
          </div>

          {/* Project Title */}
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {project.name}
          </h3>

          {/* Project Description */}
          {project.description && (
            <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-2 text-sm leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Stats Section */}
          <div className="space-y-4 mb-6">
            {/* Progress Bar */}
            {project.completionRate !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {project.completionRate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden backdrop-blur">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.completionRate}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg shadow-emerald-500/50"
                  />
                </div>
              </div>
            )}

            {/* Task Count */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100/50 dark:bg-primary-900/30 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {project.completedTaskCount || 0} of {project.taskCount || 0} tasks completed
              </span>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            {project.dueDate ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={clsx(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all',
                  project.isOverdue
                    ? 'bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    : 'bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-400'
                )}
              >
                {project.isOverdue ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">
                  {format(new Date(project.dueDate), 'MMM dd')}
                </span>
              </motion.div>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-500">No due date</span>
            )}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-2xl group-hover:scale-125 transition-transform"
            >
              {config.icon}
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;

