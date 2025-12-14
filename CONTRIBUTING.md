# Contributing Guidelines

Thank you for your interest in contributing to TaskFlow! This document provides guidelines and best practices for contributing.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone <your-fork-url>
   cd TM
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Style

### TypeScript

- Use TypeScript for all new code
- Follow the existing type patterns
- Avoid `any` types when possible
- Use interfaces for object shapes
- Use type aliases for unions

### React Components

- Use functional components with hooks
- Use TypeScript for component props
- Keep components focused and small
- Extract reusable logic to custom hooks
- Use composition over inheritance

### Naming Conventions

- **Components**: PascalCase (`TaskCard.tsx`)
- **Hooks**: camelCase starting with `use` (`useTasks.ts`)
- **Utilities**: camelCase (`validation.ts`)
- **Types/Interfaces**: PascalCase (`Task`, `TaskComment`)
- **Constants**: UPPER_SNAKE_CASE or camelCase (`TASK_STATUSES`)

### File Organization

- One component per file
- Co-locate related files
- Use index files for clean imports (optional)

## 🎨 Component Guidelines

### Component Structure

```typescript
/**
 * Component description
 */

import React from 'react';
// ... other imports

interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({
  // Destructured props
}) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
};
```

### Props

- Always type props with TypeScript
- Use descriptive prop names
- Provide default values when appropriate
- Document complex props

### State Management

- Use `useState` for local state
- Use custom hooks for shared logic
- Keep state as local as possible
- Lift state up when needed

## 🧪 Testing

### Writing Tests

- Test user interactions
- Test edge cases
- Test error scenarios
- Test accessibility

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });
  
  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## 📦 Dependencies

### Adding Dependencies

- Only add necessary dependencies
- Prefer lightweight alternatives
- Check bundle size impact
- Update `package.json` and run `npm install`

### Updating Dependencies

- Keep dependencies up to date
- Test after updates
- Check for breaking changes

## 🔍 Code Review Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] No linting errors
- [ ] Documentation updated if needed
- [ ] Accessibility checked

### Pull Request

1. **Clear Title**: Descriptive PR title
2. **Description**: Explain what and why
3. **Screenshots**: For UI changes
4. **Testing**: Describe how you tested
5. **Breaking Changes**: Note any breaking changes

### Review Checklist

- Code quality
- Type safety
- Performance
- Accessibility
- Security
- Documentation

## 🐛 Bug Reports

### Reporting Bugs

Include:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, version

### Bug Fix Process

1. Create an issue (if not exists)
2. Create a branch: `fix/issue-description`
3. Fix the bug
4. Add tests if applicable
5. Submit PR with issue reference

## ✨ Feature Requests

### Suggesting Features

Include:
- **Use Case**: Why is this needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other approaches considered
- **Additional Context**: Screenshots, examples

### Implementing Features

1. Discuss in issue first
2. Get approval before implementing
3. Follow architecture patterns
4. Add documentation
5. Add tests

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props
- Explain non-obvious code
- Update README for new features

### Documentation Updates

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for architectural changes
- Update SECURITY.md for security-related changes

## 🎯 Commit Messages

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

### Examples

```
feat(tasks): add drag-and-drop functionality

fix(comments): resolve comment deletion issue

docs(readme): update installation instructions
```

## 🔒 Security

### Security Issues

- **Do NOT** create public issues for security vulnerabilities
- Contact maintainers privately
- Provide detailed information
- Allow time for fix before disclosure

### Security Best Practices

- Validate all inputs
- Sanitize user data
- Use HTTPS in production
- Keep dependencies updated
- Follow security guidelines

## 🚫 What Not to Do

- Don't commit sensitive data
- Don't break existing functionality
- Don't ignore TypeScript errors
- Don't skip tests
- Don't ignore accessibility
- Don't use deprecated APIs

## ✅ Checklist for Contributors

Before submitting:

- [ ] Code follows style guide
- [ ] TypeScript compiles
- [ ] No linting errors
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Accessibility checked
- [ ] Performance considered
- [ ] Security reviewed
- [ ] Commit messages clear

## 🙏 Thank You

Thank you for contributing to TaskFlow! Your contributions make this project better.

---

**Questions?** Open an issue or contact maintainers.

