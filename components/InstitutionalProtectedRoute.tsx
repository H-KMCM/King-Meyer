
import React from 'react';
import { Navigate } from 'react-router-dom';

interface InstitutionalProtectedRouteProps {
  children: React.ReactNode;
}

const InstitutionalProtectedRoute: React.FC<InstitutionalProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('km-institutional-auth') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/institutional-login" replace />;
  }

  return <>{children}</>;
};

export default InstitutionalProtectedRoute;
