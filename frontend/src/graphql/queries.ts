import { gql } from '@apollo/client';

// Organization queries
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      projectCount
      activeProjectCount
    }
  }
`;

export const GET_ORGANIZATION = gql`
  query GetOrganization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      contactEmail
      projectCount
      activeProjectCount
    }
  }
`;

// Project queries
export const GET_PROJECTS = gql`
  query GetProjects($organizationSlug: String!, $status: String) {
    projects(organizationSlug: $organizationSlug, status: $status) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTaskCount
      completionRate
      isOverdue
      createdAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTaskCount
      completionRate
      isOverdue
      createdAt
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_PROJECT_STATS = gql`
  query GetProjectStats($organizationSlug: String!) {
    projectStats(organizationSlug: $organizationSlug) {
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
      overallCompletionRate
    }
  }
`;

// Task queries
export const GET_TASKS = gql`
  query GetTasks($projectId: ID!, $status: String, $assigneeEmail: String) {
    tasks(projectId: $projectId, status: $status, assigneeEmail: $assigneeEmail) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      commentCount
      isOverdue
      order
      createdAt
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      commentCount
      isOverdue
      order
      createdAt
      project {
        id
        name
      }
    }
  }
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
    }
  }
`;

