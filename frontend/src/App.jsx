import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/Registration/AuthGuard';
import HomeRedirect from './components/HomeRedirect';
import Authentications from './components/Registration/Authentications.route';

import './App.css'

function App() {

  return (
    <div>
      <Routes>
        {/* Redirect reset password routes to auth module */}
        <Route path="/reset-password/:token" element={<Navigate to={(location) => {
          const token = location.pathname.split('/').pop();
          return `/auth/reset-password/${token}`;
        }} replace />} />

        {/* Authentication routes */}
        <Route path="/auth/*" element={<Authentications />} />

        {/* Dashboard - protected route */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {/* Replace this with your actual Dashboard component */}
            <div>Dashboard Page</div>
          </ProtectedRoute>
        } />

        {/* Root redirect */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomeRedirect />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
