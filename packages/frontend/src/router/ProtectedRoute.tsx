import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  redirectPath?: string;
}

function ProtectedRoute({ redirectPath = '/signin' }: ProtectedRouteProps) {
  let location = useLocation();
  if (!localStorage.getItem('accessToken')) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute };
