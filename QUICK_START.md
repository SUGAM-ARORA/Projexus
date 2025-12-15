# 🚀 Quick Start Guide

## Prerequisites

Before starting, make sure you have installed:
- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 14+** ([Download](https://www.postgresql.org/download/))
- **Git** (optional, for cloning)

**OR**

- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))

---

## Option 1: Docker Setup (Easiest - Recommended) 🐳

### Step 1: Start All Services
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Django backend (port 8000)
- React frontend (port 3000)

### Step 2: Run Database Migrations
```bash
docker-compose exec backend python manage.py migrate
```

### Step 3: Create Superuser (Optional)
```bash
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to create an admin user.

### Step 4: Seed Sample Data (Optional)
```bash
docker-compose exec backend python manage.py shell
```
Then paste the contents of `backend/seed_data.py` or run:
```python
exec(open('seed_data.py').read())
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **GraphQL Playground**: http://localhost:8000/graphql
- **Django Admin**: http://localhost:8000/admin

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Access backend shell
docker-compose exec backend bash

# Access database
docker-compose exec db psql -U postgres -d projectmanagement
```

---

## Option 2: Local Development Setup 💻

### Part A: Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Create Virtual Environment
**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Set Up Environment Variables
```bash
# Copy example file
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux
```

Edit `.env` file and update:
```env
DEBUG=1
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/projectmanagement
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Step 5: Set Up PostgreSQL Database

**Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE projectmanagement;

# Create user (optional)
CREATE USER pms_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE projectmanagement TO pms_user;

# Exit
\q
```

**Update DATABASE_URL in .env:**
```env
DATABASE_URL=postgresql://pms_user:your_password@localhost:5432/projectmanagement
```

#### Step 6: Run Migrations
```bash
python manage.py migrate
```

#### Step 7: Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### Step 8: Seed Sample Data (Optional)
```bash
python manage.py shell
```
Then run:
```python
exec(open('seed_data.py').read())
```

#### Step 9: Start Backend Server
```bash
python manage.py runserver
```

Backend will run on: **http://localhost:8000**

---

### Part B: Frontend Setup

#### Step 1: Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

#### Step 2: Install Dependencies
```bash
npm install --legacy-peer-deps
```

**Note:** We use `--legacy-peer-deps` because `react-scripts@5.0.1` requires TypeScript 4.x, but we're using TypeScript 4.9.5 which is compatible. This flag allows npm to install despite the peer dependency warning.

#### Step 3: Set Up Environment Variables
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GRAPHQL_URL=http://localhost:8000/graphql
REACT_APP_WS_URL=ws://localhost:8000
```

#### Step 4: Start Frontend Development Server
```bash
npm start
```

Frontend will run on: **http://localhost:3000**

The browser should open automatically. If not, navigate to http://localhost:3000

---

## 🎯 First Steps After Setup

### 1. Create an Organization

**Via GraphQL Playground** (http://localhost:8000/graphql):
```graphql
mutation {
  createOrganization(
    name: "My Organization"
    contactEmail: "admin@example.com"
    slug: "my-organization"
  ) {
    organization {
      id
      name
      slug
    }
    success
    message
  }
}
```

**Or via Django Admin** (http://localhost:8000/admin):
- Login with superuser credentials
- Go to Organizations → Add Organization

### 2. Update Frontend Organization Slug

In `frontend/src/pages/ProjectDashboard.tsx`, update:
```typescript
const DEFAULT_ORG_SLUG = 'my-organization'; // Change to your org slug
```

### 3. Create Your First Project

- Click "New Project" button
- Fill in the form
- Submit

### 4. Add Tasks

- Click on a project to view details
- Click "New Task" button
- Drag and drop tasks between columns

---

## 🔧 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
# Windows: Check Services
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Verify connection
psql -U postgres -d projectmanagement
```

**Port Already in Use:**
```bash
# Change port in settings.py or use different port
python manage.py runserver 8001
```

**Migration Errors:**
```bash
# Reset migrations (development only!)
python manage.py migrate --run-syncdb
```

### Frontend Issues

**Port 3000 Already in Use:**
```bash
# Use different port
PORT=3001 npm start
```

**Module Not Found:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**GraphQL Connection Error:**
- Verify backend is running on port 8000
- Check CORS settings in backend/.env
- Verify REACT_APP_GRAPHQL_URL in frontend/.env

### Docker Issues

**Container Won't Start:**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

**Database Connection in Docker:**
```bash
# Verify database is healthy
docker-compose ps

# Check database logs
docker-compose logs db
```

---

## 📝 Development Workflow

### Making Changes

1. **Backend Changes:**
   - Edit Python files
   - Run migrations if model changes: `python manage.py makemigrations && python manage.py migrate`
   - Restart server (auto-reloads in development)

2. **Frontend Changes:**
   - Edit React/TypeScript files
   - Hot reload is automatic
   - Browser refreshes automatically

3. **Database Changes:**
   - Modify models in `backend/*/models.py`
   - Create migration: `python manage.py makemigrations`
   - Apply migration: `python manage.py migrate`

---

## 🎨 Testing the Application

### Test GraphQL API

1. Go to http://localhost:8000/graphql
2. Try this query:
```graphql
query {
  organizations {
    id
    name
    slug
    projectCount
  }
}
```

### Test Frontend

1. Open http://localhost:3000
2. Create an organization (if not exists)
3. Create a project
4. Add tasks
5. Try drag-and-drop
6. Add comments to tasks
7. Test dark mode toggle

---

## 🚀 Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [API.md](./docs/API.md) for GraphQL API reference
- Review [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design
- See [SECURITY.md](./docs/SECURITY.md) for security best practices

---

## 💡 Tips

1. **Use GraphQL Playground** to test API queries and mutations
2. **Check Browser Console** for frontend errors
3. **Check Terminal** for backend errors
4. **Use Django Admin** for quick data management
5. **Enable Dark Mode** for better development experience

---

## ❓ Need Help?

- Check the [README.md](./README.md) for detailed information
- Review [docs/](./docs/) folder for comprehensive documentation
- Check error messages in terminal/browser console
- Verify all environment variables are set correctly

---

