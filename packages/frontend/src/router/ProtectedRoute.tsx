import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { onSignInSltr } from 'store';

interface ProtectedRouteProps {
  redirectPath?: string;
}

function ProtectedRoute({ redirectPath = '/signin' }: ProtectedRouteProps) {
  let location = useLocation();
  const onSignIn = useRecoilValue(onSignInSltr);
  if (!onSignIn) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute };
