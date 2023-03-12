import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { accessTokenAtom, isCredentialLoadedAtom } from 'store';

interface ProtectedRouteProps {
  to?: string;
}

function ProtectedRoute({ to = '/sign-in' }: ProtectedRouteProps) {
  const location = useLocation();
  const accessToken = useRecoilValue(accessTokenAtom);
  const isCredentialLoaded = useRecoilValue(isCredentialLoadedAtom);

  return isCredentialLoaded ? (
    accessToken ? (
      <Outlet />
    ) : (
      <Navigate to={to} state={{ from: location }} replace />
    )
  ) : (
    <></>
  );
}

export { ProtectedRoute };
