# 🚀 Projexus — Project Management System

A modern, full-stack project management system built with Django, GraphQL, React, and TypeScript. Projexus provides multi-tenant project and task management with real-time updates, drag-and-drop functionality, and a beautiful, responsive UI.

## ✨ Features

### Core Features
- **Multi-tenant Architecture**: Organization-based data isolation
- **Project Management**: Create, update, and manage projects with status tracking
- **Task Management**: Full CRUD operations with status workflow (TODO → IN_PROGRESS → DONE)
- **Task Comments**: Collaborative commenting system on tasks
- **Project Statistics**: Real-time task counts and completion rates
- **Responsive Design**: Beautiful UI that works on all devices

### Impressive Features
- **Drag-and-Drop**: Intuitive task board with drag-and-drop functionality
- **Real-time Updates**: WebSocket subscriptions for live updates
- **Advanced Filtering**: Filter projects and tasks by status, assignee, date range
- **Search Functionality**: Full-text search across projects and tasks
- **Dark Mode**: Toggle between light and dark themes
- **Smooth Animations**: Polished UI with smooth transitions
- **Route Splitting**: Lazy-loaded routes for faster initial load
- **Prefetching**: Project detail data prefetch on hover for instant navigation
- **Caching**: Apollo cache persisted to localStorage for instant reloads
- **Offline-Ready**: Service Worker caches static assets for offline support
- **Optimistic Updates**: Instant UI feedback with GraphQL optimistic updates
- **Activity Feed**: Track all project and task activities
- **Due Date Reminders**: Visual indicators for upcoming deadlines

## 🏗️ Architecture

```
project-management-system/
├── backend/                 # Django backend
│   ├── config/             # Django settings
│   ├── organizations/      # Organization app
│   ├── projects/           # Project app
│   ├── tasks/              # Task app
│   └── api/                # GraphQL API
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── graphql/        # GraphQL queries/mutations
│   │   └── utils/          # Utilities
│   └── public/
├── docker/                 # Docker configurations
├── docs/                   # Documentation
└── tests/                  # Test files
```

## 🛠️ Tech Stack

### Backend
- **Django 4.2+**: Web framework
- **Graphene-Django**: GraphQL implementation
- **PostgreSQL**: Database
- **Django Channels**: WebSocket support for real-time features
- **Django CORS Headers**: CORS handling
- **Django Filter**: Advanced filtering
- **Celery**: Background tasks (optional)

### Frontend
- **React 18+**: UI library
- **TypeScript**: Type safety
- **Apollo Client**: GraphQL client with persisted cache
- **TailwindCSS**: Styling
- **React DnD**: Drag-and-drop
- **React Query**: Additional data fetching
- **Framer Motion**: Animations

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

## 🚀 Quick Start

> **📖 For detailed step-by-step instructions, see [QUICK_START.md](./QUICK_START.md)**

### Option 1: Docker Compose (Recommended) 🐳

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser (optional)
docker-compose exec backend python manage.py createsuperuser

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# GraphQL Playground: http://localhost:8000/graphql
# Django Admin: http://localhost:8000/admin
```

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend URL

# Start development server
npm start

### Performance Enhancements (Frontend)

- Apollo cache persistence is enabled via `apollo3-cache-persist` for faster reloads and offline reads.
- Service Worker (`public/service-worker.js`) caches static assets in production builds.
- Routes are lazy-loaded to reduce initial bundle size.
- Project details are prefetched on card hover to make detail navigation instant.
```

## 🔐 Authentication

The system uses JWT-based authentication. To get started:

1. Create a superuser: `python manage.py createsuperuser`
2. Login through the GraphQL API or use the admin panel
3. Obtain JWT tokens for API access

## 📚 API Documentation

### GraphQL Endpoint
- **URL**: `http://localhost:8000/graphql`
- **Playground**: `http://localhost:8000/graphql` (in development)

### Key Queries
- `organizations`: List all organizations
- `projects(organizationSlug: String!)`: Get projects for an organization
- `project(id: ID!)`: Get a single project
- `tasks(projectId: ID!)`: Get tasks for a project
- `projectStats(organizationSlug: String!)`: Get project statistics

### Key Mutations
- `createOrganization`: Create a new organization
- `createProject`: Create a new project
- `updateProject`: Update a project
- `createTask`: Create a new task
- `updateTask`: Update a task
- `addTaskComment`: Add a comment to a task
- `updateTaskStatus`: Update task status (with drag-and-drop support)

See [API Documentation](./docs/API.md) for complete schema.

## 🧪 Testing

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test

# Run all tests with coverage
npm run test:coverage
```

## 🐳 Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔒 Security Features

- JWT authentication
- Organization-based data isolation
- Input validation and sanitization
- CORS configuration
- Rate limiting
- SQL injection prevention (Django ORM)
- XSS protection
- CSRF protection
- Environment variable management

See [Security Documentation](./docs/SECURITY.md) for details.

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [Security Documentation](./docs/SECURITY.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🎯 Project Structure

See [Architecture Documentation](./docs/ARCHITECTURE.md) for detailed structure and design decisions.

## 🚧 Future Improvements

- [ ] User management and permissions
- [ ] File attachments for tasks
- [ ] Email notifications
- [ ] Calendar view
- [ ] Gantt charts
- [ ] Time tracking
- [ ] Export/import functionality
- [ ] Mobile app (React Native)

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

See [Contributing Guide](./docs/CONTRIBUTING.md) for guidelines.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Projexus — Built with ❤️ by Sugam Arora**

