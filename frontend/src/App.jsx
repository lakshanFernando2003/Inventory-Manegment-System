import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/Registration/AuthGuard';
import { useAuthStore } from './components/store/authStore';
import { InventoryProvider } from './context/InventoryProvider';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Auth and Loading
import Authentications from './components/Registration/Authentications.route';
import LoadingSpinner from './components/Registration/shared/LoadingSpinner';
import HomeRedirect from './components/HomeRedirect';

// Pages
import Dashboard from './components/Dashboard/Dashboard';
import TempPage from './components/Pages/TempPage';

import './App.css'

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Check authentication status on app load
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <InventoryProvider>
      <div>
        <Routes>
          {/* Redirect reset password routes to auth module */}
          <Route path="/reset-password/:token" element={<Navigate to={(location) => {
            const token = location.pathname.split('/').pop();
            return `/auth/reset-password/${token}`;
          }} replace />} />

          {/* Authentication routes */}
          <Route path="/auth/*" element={<Authentications />} />

          {/* Protected app routes with main layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Temporary pages for sections under development */}
            <Route path="inventory" element={<TempPage />} />
            <Route path="customers" element={<TempPage />} />
            <Route path="orders" element={<TempPage />} />
            
            {/* Root redirect */}
            <Route index element={<HomeRedirect />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </InventoryProvider>
  )
}

export default App
