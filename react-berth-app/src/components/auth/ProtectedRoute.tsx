import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'planner' | 'viewer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { state } = useAuth();

  // Show loading while checking authentication
  if (state.loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Check authentication
  if (!state.isAuthenticated || !state.user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRequiredRole(state.user.role, requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Helper function for role checking
const hasRequiredRole = (userRole: string, requiredRole: string): boolean => {
  // Admin can access everything
  if (userRole === 'admin') return true;
  
  // Check specific role requirements
  return userRole === requiredRole;
};

export default ProtectedRoute;