import { fetcher } from 'helper';
import { atom, selector } from 'recoil';

export const accessTokenAtom = atom({
  key: 'accessTokenAtom',
  default: localStorage.getItem('accessToken') || undefined,
});

export const onSignInSltr = selector({
  key: 'onSignInSltr',
  get: async ({ get }) => {
    try {
      await fetcher.get({ path: '/token', accessToken: get(accessTokenAtom) });
    } catch (e) {
      return false;
    }
    return true;
  },
});
