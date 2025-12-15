# Deployment Guide

## Overview

This guide covers deploying the Project Management System to production environments.

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)
- Nginx (recommended for production)
- SSL certificate (for HTTPS)

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DEBUG=0
SECRET_KEY=your-secret-key-here-generate-with-openssl
DATABASE_URL=postgresql://user:password@host:5432/dbname
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
REDIS_URL=redis://localhost:6379
```

Generate a secure secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_GRAPHQL_URL=https://api.yourdomain.com/graphql
REACT_APP_WS_URL=wss://api.yourdomain.com
```

## Docker Deployment (Recommended)

### 1. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - DEBUG=0
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - db
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      - REACT_APP_API_URL=${API_URL}
      - REACT_APP_GRAPHQL_URL=${GRAPHQL_URL}
    restart: always

volumes:
  postgres_data:
```

### 2. Production Dockerfiles

**backend/Dockerfile.prod**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

**frontend/Dockerfile.prod**:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. Deploy with Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

## Manual Deployment

### Backend Deployment

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3.11 python3.11-venv postgresql postgresql-contrib nginx

# Create application user
sudo useradd -m -s /bin/bash pms
sudo su - pms
```

#### 2. Application Setup

```bash
# Clone repository
git clone <repository-url>
cd project-management-system/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Set up environment variables
cp .env.example .env
# Edit .env with production values

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser
```

#### 3. Gunicorn Setup

Create `gunicorn_config.py`:
```python
bind = "127.0.0.1:8000"
workers = 4
worker_class = "sync"
timeout = 120
keepalive = 5
```

Create systemd service `/etc/systemd/system/pms-backend.service`:
```ini
[Unit]
Description=PMS Backend Gunicorn
After=network.target

[Service]
User=pms
Group=pms
WorkingDirectory=/home/pms/project-management-system/backend
Environment="PATH=/home/pms/project-management-system/backend/venv/bin"
ExecStart=/home/pms/project-management-system/backend/venv/bin/gunicorn \
    --config gunicorn_config.py \
    config.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl start pms-backend
sudo systemctl enable pms-backend
```

#### 4. Nginx Configuration

Create `/etc/nginx/sites-available/pms-backend`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /home/pms/project-management-system/backend/staticfiles/;
    }

    location /media/ {
        alias /home/pms/project-management-system/backend/media/;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/pms-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Frontend Deployment

#### 1. Build Application

```bash
cd frontend
npm install
npm run build
```

#### 2. Deploy to Nginx

Copy build files:
```bash
sudo cp -r build/* /var/www/pms-frontend/
```

Nginx configuration `/etc/nginx/sites-available/pms-frontend`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/pms-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## SSL/HTTPS Setup

### Using Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
```

Certbot will automatically update Nginx configuration for HTTPS.

## Database Setup

### PostgreSQL Configuration

```bash
sudo -u postgres psql

CREATE DATABASE projectmanagement;
CREATE USER pms_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE projectmanagement TO pms_user;
\q
```

### Backup Strategy

```bash
# Create backup script
cat > /home/pms/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/pms/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U pms_user projectmanagement > "$BACKUP_DIR/backup_$DATE.sql"
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /home/pms/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/pms/backup.sh
```

## Monitoring & Logging

### Application Logs

```bash
# View backend logs
sudo journalctl -u pms-backend -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Checks

Create health check endpoint in Django:
```python
# config/urls.py
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'healthy'})
```

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd project-management-system
            git pull
            cd backend
            source venv/bin/activate
            pip install -r requirements.txt
            python manage.py migrate
            python manage.py collectstatic --noinput
            sudo systemctl restart pms-backend
```

## Performance Optimization

### Database

- Enable connection pooling (PgBouncer)
- Add database indexes
- Regular VACUUM and ANALYZE

### Application

- Enable caching (Redis)
- Use CDN for static files
- Enable Gzip compression in Nginx

### Monitoring

- Set up application monitoring (Sentry, New Relic)
- Database monitoring
- Server resource monitoring

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**: Check Gunicorn is running
2. **Database Connection Error**: Verify database credentials
3. **Static Files Not Loading**: Check collectstatic and Nginx config
4. **CORS Errors**: Verify CORS_ALLOWED_ORIGINS

### Debug Mode

Never enable DEBUG in production. Use logging instead:
```python
LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': '/var/log/pms/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
        },
    },
}
```

## Rollback Procedure

1. Stop services
2. Restore database backup
3. Revert code to previous version
4. Run migrations if needed
5. Restart services

## Maintenance

- Regular security updates
- Database backups
- Log rotation
- Dependency updates
- Performance monitoring

