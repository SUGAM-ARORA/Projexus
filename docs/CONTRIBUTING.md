# Contributing Guide

Thank you for your interest in contributing to the Project Management System!

## Development Setup

1. Fork the repository
2. Clone your fork
3. Set up backend and frontend (see README.md)
4. Create a feature branch

## Code Style

### Backend (Python)
- Follow PEP 8
- Use Black for formatting
- Maximum line length: 88 characters
- Type hints where appropriate

```bash
black backend/
isort backend/
flake8 backend/
```

### Frontend (TypeScript/React)
- Use ESLint and Prettier
- Follow React best practices
- Use functional components with hooks
- TypeScript strict mode

```bash
npm run lint
npm run format
```

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

Example:
```
feat: Add drag-and-drop to task board
```

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Submit PR with clear description

## Testing

Run tests before submitting:
```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

## Questions?

Open an issue for discussion before major changes.

