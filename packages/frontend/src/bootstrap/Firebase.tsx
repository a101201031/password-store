import { ENV } from 'constants/ENV';
import { initializeApp } from 'firebase/app';
import { browserSessionPersistence, getAuth, getIdToken } from 'firebase/auth';
import { ReactNode, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  accessTokenAtom,
  firebaseUserAtom,
  isCredentialLoadedAtom,
} from 'store';

interface FirebaseRootProps {
  children: ReactNode;
}

const firebaseApp = initializeApp(ENV.FIREBASE_CONFIG);
const firebaseAuth = getAuth(firebaseApp);
firebaseAuth.setPersistence(browserSessionPersistence);

function FirebaseRoot({ children }: FirebaseRootProps) {
  const setFirebaseUser = useSetRecoilState(firebaseUserAtom);
  const setIsCredentialLoaded = useSetRecoilState(isCredentialLoadedAtom);
  const setAccessToken = useSetRecoilState(accessTokenAtom);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        setFirebaseUser(user);
        const token = await getIdToken(user);
        setAccessToken(token);
        setIsCredentialLoaded(true);
      }
      setIsCredentialLoaded(true);
    });
    return () => unsubscribe();
  }, [setAccessToken, setIsCredentialLoaded, setFirebaseUser]);
  return <>{children}</>;
}

export { FirebaseRoot };
