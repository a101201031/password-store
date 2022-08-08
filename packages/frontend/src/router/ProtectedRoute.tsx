import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { accessTokenAtom } from 'store';

interface ProtectedRouteProps {
  redirectPath?: string;
}

function ProtectedRoute({ redirectPath = '/signin' }: ProtectedRouteProps) {
  let location = useLocation();
  const accessToken = useRecoilValue(accessTokenAtom);

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to={redirectPath} state={{ from: location }} replace />
  );
}

export { ProtectedRoute };
