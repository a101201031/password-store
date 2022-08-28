import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { accessTokenAtom } from 'store';

function SignOut() {
  const location = useLocation();
  localStorage.removeItem('accessToken');
  const setAccessToken = useSetRecoilState(accessTokenAtom);

  useEffect(() => {
    setAccessToken(undefined);
  });

  return <Navigate to="/signIn" state={{ from: location }} replace />;
}

export { SignOut };
