# TaskFlow - Task Management & Comments System

A modern, impressive, and feature-rich Task Management application built with React, TypeScript, and TailwindCSS. This application provides a beautiful, intuitive interface for managing tasks with drag-and-drop functionality, real-time comments, and a responsive design.

![TaskFlow](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-38bdf8)

## ✨ Features

### Must Have (70%)
- ✅ **React Components with TypeScript** - Fully typed components with proper interfaces
- ✅ **Clean Code Structure** - Well-organized, maintainable codebase following best practices
- ✅ **Task Board/List Views** - Switch between Kanban board and list views
- ✅ **Add/Edit Tasks** - Create and update tasks with comprehensive forms
- ✅ **Status Updates** - Update task status (TODO, IN_PROGRESS, DONE)
- ✅ **Comment System** - Add, view, and delete comments on tasks
- ✅ **TypeScript Interfaces** - Complete type safety with Task and TaskComment interfaces

### Should Have (20%)
- ✅ **Form Validation** - Comprehensive client-side validation with error messages
- ✅ **Error Handling** - Graceful error handling with user-friendly messages
- ✅ **Responsive UI Design** - Mobile-first design that works on all devices
- ✅ **Loading States** - Visual feedback during async operations

### Nice to Have (10%)
- ✅ **Drag-and-Drop** - Beautiful drag-and-drop for task status changes (react-beautiful-dnd)
- ✅ **Advanced UI Features** - Animations, transitions, and modern UI polish
- ✅ **Accessibility** - ARIA labels, keyboard navigation, focus management
- ✅ **Real-time Ready** - Architecture prepared for WebSocket integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TM
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically open in your default browser

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📁 Project Structure

```
TM/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── tasks/           # Task-related components
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskBoard.tsx
│   │   │   └── TaskList.tsx
│   │   └── comments/        # Comment-related components
│   │       ├── CommentList.tsx
│   │       ├── CommentForm.tsx
│   │       └── TaskCommentsModal.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useTasks.ts
│   │   └── useTaskComments.ts
│   ├── services/            # Business logic and API services
│   │   └── taskService.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── validation.ts
│   │   ├── date.ts
│   │   └── constants.ts
│   ├── styles/              # Global styles
│   │   └── index.css
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # TailwindCSS configuration
├── postcss.config.js        # PostCSS configuration
├── .eslintrc.cjs            # ESLint configuration
├── README.md                # This file
├── ARCHITECTURE.md          # Architecture documentation
├── SECURITY.md              # Security guidelines
└── .gitignore               # Git ignore rules
```

## 🎨 Key Features Explained

### 1. Task Management

- **Board View**: Kanban-style board with drag-and-drop functionality
- **List View**: Traditional list view for detailed task browsing
- **Task Creation**: Comprehensive form with validation
- **Task Editing**: In-place editing with modal forms
- **Status Management**: Three statuses (TODO, IN_PROGRESS, DONE)

### 2. Comment System

- **Add Comments**: Rich comment form with validation
- **View Comments**: Organized comment list with timestamps
- **Delete Comments**: Users can delete their own comments
- **Real-time Ready**: Architecture supports WebSocket integration

### 3. User Experience

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Accessibility**: WCAG-compliant with keyboard navigation
- **Animations**: Smooth transitions and micro-interactions
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

## 🛠️ Technology Stack

- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type safety
- **Vite 5.0.8** - Build tool and dev server
- **TailwindCSS 3.3.6** - Utility-first CSS framework
- **react-beautiful-dnd 13.1.1** - Drag and drop functionality
- **date-fns 2.30.0** - Date manipulation
- **lucide-react 0.294.0** - Icon library
- **clsx 2.0.0** - Conditional class names

## 📝 TypeScript Interfaces

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeEmail: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskComment {
  id: string;
  taskId: string;
  content: string;
  authorEmail: string;
  createdAt: string;
  updatedAt?: string;
}
```

## 🎯 Usage Examples

### Creating a Task

1. Click the "New Task" button in the header
2. Fill in the form:
   - Title (required, 3-100 characters)
   - Description (required, minimum 10 characters)
   - Assignee Email (required, valid email)
   - Status (TODO, IN_PROGRESS, or DONE)
   - Due Date (optional, cannot be in the past)
3. Click "Create Task"

### Updating Task Status (Drag and Drop)

1. In Board view, drag a task card
2. Drop it in the desired status column
3. The task status updates automatically

### Adding Comments

1. Click on any task card
2. Scroll to the comments section
3. Enter your email and comment
4. Click "Post Comment"

## 🧪 Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Code Quality

The project follows:
- ESLint for code linting
- TypeScript strict mode for type safety
- Consistent code formatting
- Component composition patterns
- Custom hooks for state management

## 🔒 Security

See [SECURITY.md](./SECURITY.md) for detailed security guidelines and best practices.

## 🏗️ Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 📄 License

This project is provided as-is for demonstration purposes.

## 🤝 Contributing

1. Follow the existing code style
2. Write TypeScript with proper types
3. Add appropriate error handling
4. Ensure accessibility compliance
5. Test on multiple devices/browsers

## 📞 Support

For issues, questions, or contributions, please refer to the project documentation or create an issue in the repository.

## 🎉 Acknowledgments

Built with modern web technologies and best practices, focusing on:
- Clean architecture
- Type safety
- User experience
- Accessibility
- Performance
- Maintainability

---

**Made with ❤️ by Sugam Arora**

