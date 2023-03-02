import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { accessTokenAtom } from 'store';

interface ProtectedRouteProps {
  to?: string;
}

function ProtectedRoute({ to = '/sign-in' }: ProtectedRouteProps) {
  let location = useLocation();
  const accessToken = useRecoilValue(accessTokenAtom);

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to={to} state={{ from: location }} replace />
  );
}

export { ProtectedRoute };
