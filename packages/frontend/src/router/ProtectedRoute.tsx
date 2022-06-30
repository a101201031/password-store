import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { accessTokenAtom } from 'store';

interface ProtectedRouteProps {
  redirectPath?: string;
}

function ProtectedRoute({ redirectPath = '/signin' }: ProtectedRouteProps) {
  let location = useLocation();
  const accessToken = useRecoilValue(accessTokenAtom);
  if (!accessToken) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute };
