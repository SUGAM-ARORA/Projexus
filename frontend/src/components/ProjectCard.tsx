import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Project } from '../types';
import { format } from 'date-fns';
import clsx from 'clsx';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-blue-200',
    ON_HOLD: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block card hover:shadow-lg transition-all duration-200 hover:scale-105"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {project.name}
        </h3>
        <span className={clsx('badge', statusColors[project.status])}>
          {project.status}
        </span>
      </div>
      
      {project.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            <span>{project.completedTaskCount || 0}/{project.taskCount || 0} tasks</span>
          </div>
          {project.completionRate !== undefined && (
            <div className="flex items-center">
              <span>{project.completionRate}% complete</span>
            </div>
          )}
        </div>
        
        {project.dueDate && (
          <div className={clsx(
            "flex items-center",
            project.isOverdue && "text-red-600 dark:text-red-400"
          )}>
            {project.isOverdue ? (
              <AlertCircle className="w-4 h-4 mr-1" />
            ) : (
              <Calendar className="w-4 h-4 mr-1" />
            )}
            <span>{format(new Date(project.dueDate), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>
      
      {project.completionRate !== undefined && project.completionRate < 100 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.completionRate}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ProjectCard;

