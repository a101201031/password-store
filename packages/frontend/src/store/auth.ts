import type { UserCredential } from 'firebase/auth';
import { atom } from 'recoil';

export const accessTokenAtom = atom<string | undefined>({
  key: 'accessTokenAtom',
  default: undefined,
});

export const firebaseUserAtom = atom<UserCredential['user']>({
  key: 'firebaseUserAtom',
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const isCredentialLoadedAtom = atom<boolean>({
  key: 'isCredentialLoadedAtom',
  default: false,
});
