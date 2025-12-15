import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-purple-600' : 'bg-purple-400'
        } animate-float`}></div>
        <div className={`absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${
          isDark ? 'bg-blue-600' : 'bg-blue-400'
        } animate-float`} style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="glass sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white dark:bg-gray-900 rounded-lg p-2">
                  <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                  ProjectHub
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Manage with Precision</p>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400 animate-pulse-glow" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 animate-pulse-glow" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="slide-up">
          {children}
        </div>
      </main>

      {/* Footer accent */}
      <div className="relative z-10 mt-20 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built with <span className="text-red-500">❤️</span> for better project management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Layout;

