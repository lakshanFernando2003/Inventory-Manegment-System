import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Protect routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const currentPath = location.pathname;

  console.log("AuthGuard checking path:", currentPath);
  console.log("User state:", user);

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/auth/login" replace />;
  }

  if (user && !user.isVerified) {
    console.log("User not verified, redirecting to verify email");
    return <Navigate to="/auth/verify-email" replace />;
  }

  // User is authenticated and verified - no role checks needed
  console.log("User is fully authenticated");
  return children;
};

// Redirect authenticated users away from auth pages
export const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    // Simple redirect to dashboard for authenticated users
    console.log("Redirecting authenticated user to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


