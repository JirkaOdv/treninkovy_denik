import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Diary from './pages/Diary';
import AddTraining from './pages/AddTraining';
import Settings from './pages/Settings';
import { ThemeProvider } from './components/Layout/ThemeProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/diary" element={<PrivateRoute><Diary /></PrivateRoute>} />
              <Route path="/add-training" element={<PrivateRoute><AddTraining /></PrivateRoute>} />
              <Route path="/edit-training/:id" element={<PrivateRoute><AddTraining /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
