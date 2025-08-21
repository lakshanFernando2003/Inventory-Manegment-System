import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

const HomeRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      // Simple redirection to dashboard - no role needed
      console.log(`Redirecting to dashboard`);
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Simple loading display while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      <p className="ml-3 text-gray-300">Redirecting to dashboard...</p>
    </div>
  );
};

export default HomeRedirect;
