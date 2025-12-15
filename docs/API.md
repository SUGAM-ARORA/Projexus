# API Documentation

## GraphQL Endpoint

- **URL**: `http://localhost:8000/graphql`
- **Playground**: Available at the same URL in development mode

## Authentication

Currently, the API uses organization-based isolation. In production, JWT authentication should be implemented.

### Headers

```
X-Organization-Slug: your-organization-slug
```

## Queries

### Organizations

#### Get All Organizations
```graphql
query {
  organizations {
    id
    name
    slug
    contactEmail
    projectCount
    activeProjectCount
  }
}
```

#### Get Single Organization
```graphql
query {
  organization(slug: "demo-organization") {
    id
    name
    slug
    contactEmail
    projectCount
    activeProjectCount
  }
}
```

### Projects

#### Get Projects for Organization
```graphql
query {
  projects(organizationSlug: "demo-organization", status: "ACTIVE") {
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
```

#### Get Single Project
```graphql
query {
  project(id: "1") {
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
```

#### Get Project Statistics
```graphql
query {
  projectStats(organizationSlug: "demo-organization") {
    totalProjects
    activeProjects
    completedProjects
    totalTasks
    completedTasks
    overallCompletionRate
  }
}
```

### Tasks

#### Get Tasks for Project
```graphql
query {
  tasks(projectId: "1", status: "TODO", assigneeEmail: "user@example.com") {
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
```

#### Get Single Task
```graphql
query {
  task(id: "1") {
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
```

#### Get Task Comments
```graphql
query {
  taskComments(taskId: "1") {
    id
    content
    authorEmail
    createdAt
  }
}
```

## Mutations

### Organizations

#### Create Organization
```graphql
mutation {
  createOrganization(
    name: "New Organization"
    contactEmail: "contact@example.com"
    slug: "new-organization"
  ) {
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
```

#### Update Organization
```graphql
mutation {
  updateOrganization(
    id: "1"
    name: "Updated Name"
    contactEmail: "new@example.com"
  ) {
    organization {
      id
      name
      contactEmail
    }
    success
    message
  }
}
```

### Projects

#### Create Project
```graphql
mutation {
  createProject(
    organizationSlug: "demo-organization"
    name: "New Project"
    description: "Project description"
    status: "ACTIVE"
    dueDate: "2024-12-31"
  ) {
    project {
      id
      name
      description
      status
      dueDate
    }
    success
    message
  }
}
```

#### Update Project
```graphql
mutation {
  updateProject(
    id: "1"
    name: "Updated Project Name"
    status: "COMPLETED"
  ) {
    project {
      id
      name
      status
    }
    success
    message
  }
}
```

#### Delete Project
```graphql
mutation {
  deleteProject(id: "1") {
    success
    message
  }
}
```

### Tasks

#### Create Task
```graphql
mutation {
  createTask(
    projectId: "1"
    title: "New Task"
    description: "Task description"
    status: "TODO"
    assigneeEmail: "user@example.com"
    dueDate: "2024-12-31T23:59:59Z"
  ) {
    task {
      id
      title
      status
      assigneeEmail
    }
    success
    message
  }
}
```

#### Update Task
```graphql
mutation {
  updateTask(
    id: "1"
    title: "Updated Task"
    status: "IN_PROGRESS"
    assigneeEmail: "newuser@example.com"
  ) {
    task {
      id
      title
      status
      assigneeEmail
    }
    success
    message
  }
}
```

#### Update Task Status (for drag-and-drop)
```graphql
mutation {
  updateTaskStatus(
    id: "1"
    status: "DONE"
    order: 5
  ) {
    task {
      id
      status
      order
    }
    success
    message
  }
}
```

#### Delete Task
```graphql
mutation {
  deleteTask(id: "1") {
    success
    message
  }
}
```

#### Add Task Comment
```graphql
mutation {
  addTaskComment(
    taskId: "1"
    content: "This is a comment"
    authorEmail: "user@example.com"
  ) {
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
```

## Error Handling

All mutations return a `success` boolean and a `message` string. In case of errors, GraphQL will return error objects with detailed messages.

Example error response:
```json
{
  "errors": [
    {
      "message": "Project with id '999' not found",
      "locations": [{"line": 2, "column": 3}],
      "path": ["project"]
    }
  ],
  "data": {
    "project": null
  }
}
```

## Status Values

### Project Status
- `ACTIVE` - Project is currently active
- `COMPLETED` - Project has been completed
- `ON_HOLD` - Project is on hold
- `CANCELLED` - Project has been cancelled

### Task Status
- `TODO` - Task is to be done
- `IN_PROGRESS` - Task is in progress
- `DONE` - Task is completed
- `BLOCKED` - Task is blocked

## WebSocket Subscriptions

WebSocket endpoint for real-time task updates:
- **URL**: `ws://localhost:8000/ws/tasks/<project_id>/`

Example connection:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/tasks/1/');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Task update:', data);
};
```

