# Quick Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

### 3. First Time Setup

When you first open the application:
- You'll be prompted to enter your email address
- This email will be saved in localStorage for future sessions
- You can use this email to add comments to tasks

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎯 Features to Try

1. **Create a Task**
   - Click "New Task" button
   - Fill in the form
   - Submit to create

2. **Drag and Drop** (Board View)
   - Switch to Board view
   - Drag tasks between columns
   - Watch status update automatically

3. **Add Comments**
   - Click on any task card
   - Scroll to comments section
   - Add a comment

4. **Edit/Delete Tasks**
   - Hover over a task card
   - Click edit/delete icons
   - Make changes

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:
- The dev server will automatically try the next available port
- Check the terminal output for the actual port

### TypeScript Errors

If you see TypeScript errors:
```bash
npm run type-check
```

### Build Issues

Clear cache and rebuild:
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for architecture details
- Review [SECURITY.md](./SECURITY.md) for security guidelines

---


