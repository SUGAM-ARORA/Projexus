import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import { client } from './graphql/client';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import './App.css';
const ProjectDashboard = lazy(() => import('./pages/ProjectDashboard'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <Router>
          <Layout>
            <Suspense fallback={
              <div className="flex justify-center items-center h-96">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 bg-gray-50 dark:bg-gray-900 rounded-full"></div>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Navigate to="/projects" replace />} />
                <Route path="/projects" element={<ProjectDashboard />} />
                <Route path="/projects/:projectId" element={<ProjectDetail />} />
              </Routes>
            </Suspense>
          </Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

