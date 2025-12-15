#!/bin/bash

# Project Management System Setup Script

echo "🚀 Setting up Project Management System..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. You'll need it for the database."
fi

echo "✅ Prerequisites check passed!"

# Backend setup
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials"
fi

echo "✅ Backend setup complete!"
deactivate
cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

echo "Installing Node dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
fi

echo "✅ Frontend setup complete!"
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database"
echo "2. Update backend/.env with database credentials"
echo "3. Run migrations: cd backend && source venv/bin/activate && python manage.py migrate"
echo "4. Create superuser: python manage.py createsuperuser"
echo "5. Start backend: python manage.py runserver"
echo "6. Start frontend: cd frontend && npm start"
echo ""
echo "Or use Docker: docker-compose up"

