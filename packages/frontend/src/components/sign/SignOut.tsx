import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenAtom } from 'store';

function SignOut() {
  let location = useLocation();
  localStorage.removeItem('accessToken');
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

  useEffect(() => {
    setAccessToken(undefined);
  });

  return <Navigate to="/signIn" state={{ from: location }} replace />;
}

export { SignOut };
