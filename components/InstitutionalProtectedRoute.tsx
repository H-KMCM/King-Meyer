
import React from 'react';
import { Navigate } from 'react-router-dom';

interface InstitutionalProtectedRouteProps {
  children: React.ReactNode;
}

const InstitutionalProtectedRoute: React.FC<InstitutionalProtectedRouteProps> = ({ children }) => {
  const isInstitutional = sessionStorage.getItem('km-institutional-auth') === 'true';
  const isAdmin = sessionStorage.getItem('km-auth') === 'true';

  if (!isInstitutional && !isAdmin) {
    return <Navigate to="/institutional-login" replace />;
  }

  return <>{children}</>;
};

export default InstitutionalProtectedRoute;
