import { gql } from '@apollo/client';

// Organization mutations
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $contactEmail: String!, $slug: String) {
    createOrganization(name: $name, contactEmail: $contactEmail, slug: $slug) {
      organization {
        id
        name
        slug
        contactEmail
      }
      success
      message
    }
  }
`;

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $name: String, $contactEmail: String) {
    updateOrganization(id: $id, name: $name, contactEmail: $contactEmail) {
      organization {
        id
        name
        slug
        contactEmail
      }
      success
      message
    }
  }
`;

// Project mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $organizationSlug: String!
    $name: String!
    $description: String
    $status: String
    $dueDate: Date
  ) {
    createProject(
      organizationSlug: $organizationSlug
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        description
        status
        dueDate
        taskCount
        completionRate
      }
      success
      message
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        description
        status
        dueDate
        taskCount
        completionRate
      }
      success
      message
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
      message
    }
  }
`;

// Task mutations
export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
        order
      }
      success
      message
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
    $order: Int
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
      order: $order
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
        order
      }
      success
      message
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!, $order: Int) {
    updateTaskStatus(id: $id, status: $status, order: $order) {
      task {
        id
        status
        order
      }
      success
      message
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      message
    }
  }
`;

export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    addTaskComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      comment {
        id
        content
        authorEmail
        createdAt
      }
      success
      message
    }
  }
`;

