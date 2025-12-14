import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import { client } from './graphql/client';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ProjectDashboard from './pages/ProjectDashboard';
import ProjectDetail from './pages/ProjectDetail';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/projects" replace />} />
              <Route path="/projects" element={<ProjectDashboard />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
            </Routes>
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

